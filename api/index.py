from fastapi import FastAPI, APIRouter, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
import os
from typing import Optional
import uuid
from datetime import datetime, timezone
import logging
from mangum import Mangum

# Import shared modules
# Use relative imports for Vercel compatibility
from ._shared.db import get_db
from ._shared.auth import get_current_user, sessions
from ._shared.models import (
    SearchKBRequest, SearchKBResponse,
    DraftReplyRequest, DraftReplyResponse,
    UpdateTicketMetadataRequest,
    AddStudentEventRequest,
    StudentEvent, AiSuggestion
)
from ._shared.ai_tools import search_kb_articles, draft_reply_with_ai, triage_ticket_with_ai

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Create the main app
app = FastAPI(title="AidHub Pro - AI Financial Aid Platform")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============================================================
# AUTH ENDPOINTS (MOCK OAUTH)
# ============================================================

@api_router.post("/auth/login")
async def mock_oauth_login(provider: str, email: str):
    """
    Mock OAuth login for Microsoft/Google.
    In production, this would handle real OAuth flows.
    """
    db = get_db()
    # Find user by email
    user_doc = await db.users.find_one({"email": email}, {"_id": 0})
    if not user_doc:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Create session token
    token = str(uuid.uuid4())
    sessions[token] = {"user": user_doc, "created_at": datetime.now(timezone.utc)}
    
    return {
        "token": token,
        "user": user_doc
    }


@api_router.get("/auth/me")
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current authenticated user info"""
    return current_user


@api_router.post("/auth/logout")
async def logout(authorization: Optional[str] = Header(None)):
    """Logout and invalidate session"""
    if authorization and authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
        sessions.pop(token, None)
    return {"success": True}


# ============================================================
# TICKET ENDPOINTS
# ============================================================

@api_router.get("/tickets")
async def list_tickets(
    status: Optional[str] = None,
    assignee_id: Optional[str] = None,
    queue_id: Optional[str] = None,
    category: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    """List tickets with filters (tenant-scoped)"""
    db = get_db()
    institution_id = current_user["institution_id"]
    
    query = {"institution_id": institution_id}
    if status:
        if status == "my":
            query["assignee_id"] = current_user["id"]
        elif status == "unassigned":
            query["assignee_id"] = None
        else:
            query["status"] = status
    
    if assignee_id:
        query["assignee_id"] = assignee_id
    if queue_id:
        query["queue_id"] = queue_id
    if category:
        query["category"] = category
    
    tickets = await db.tickets.find(query, {"_id": 0}).sort("updated_at", -1).to_list(100)
    
    # Enrich with student info
    for ticket in tickets:
        student = await db.students.find_one({"id": ticket["student_id"]}, {"_id": 0})
        if student:
            ticket["student"] = student
    
    return {"tickets": tickets}


@api_router.get("/tickets/{ticket_id}")
async def get_ticket(ticket_id: str, current_user: dict = Depends(get_current_user)):
    """Get single ticket with messages and student info"""
    db = get_db()
    institution_id = current_user["institution_id"]
    
    ticket = await db.tickets.find_one(
        {"id": ticket_id, "institution_id": institution_id},
        {"_id": 0}
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    # Get messages
    messages = await db.messages.find(
        {"ticket_id": ticket_id},
        {"_id": 0}
    ).sort("created_at", 1).to_list(100)
    
    # Get student
    student = await db.students.find_one({"id": ticket["student_id"]}, {"_id": 0})
    
    # Log access for audit
    await db.audit_logs.insert_one({
        "user_id": current_user["id"],
        "action": "view_ticket",
        "ticket_id": ticket_id,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })
    
    return {
        "ticket": ticket,
        "messages": messages,
        "student": student
    }


@api_router.patch("/tickets/{ticket_id}")
async def update_ticket(
    ticket_id: str,
    update_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update ticket fields"""
    db = get_db()
    institution_id = current_user["institution_id"]
    
    # Add updated_at timestamp
    update_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    
    result = await db.tickets.update_one(
        {"id": ticket_id, "institution_id": institution_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    return {"success": True}


# ============================================================
# MESSAGE ENDPOINTS
# ============================================================

@api_router.post("/messages")
async def create_message(
    ticket_id: str,
    body: str,
    direction: str = "outbound",
    current_user: dict = Depends(get_current_user)
):
    """Create a new message (send reply)"""
    db = get_db()
    institution_id = current_user["institution_id"]
    
    # Get ticket and student
    ticket = await db.tickets.find_one(
        {"id": ticket_id, "institution_id": institution_id},
        {"_id": 0}
    )
    if not ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")
    
    student = await db.students.find_one({"id": ticket["student_id"]}, {"_id": 0})
    
    # Create message
    message = {
        "id": str(uuid.uuid4()),
        "institution_id": institution_id,
        "ticket_id": ticket_id,
        "sender_email": "finaid@demou.edu" if direction == "outbound" else student["email"],
        "recipient_email": student["email"] if direction == "outbound" else "finaid@demou.edu",
        "subject": f"Re: {ticket['subject']}",
        "body": body,
        "direction": direction,
        "thread_id": None,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    
    await db.messages.insert_one(message)
    
    # Create student event
    event = {
        "id": str(uuid.uuid4()),
        "institution_id": institution_id,
        "student_id": ticket["student_id"],
        "ticket_id": ticket_id,
        "event_type": "sent_email" if direction == "outbound" else "received_email",
        "content": f"Sent email reply: {ticket['subject']}",
        "created_by": current_user["id"],
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.student_events.insert_one(event)
    
    # Update ticket updated_at
    await db.tickets.update_one(
        {"id": ticket_id},
        {"$set": {"updated_at": datetime.now(timezone.utc).isoformat()}}
    )
    
    return {"success": True, "message": message}


# ============================================================
# STUDENT ENDPOINTS
# ============================================================

@api_router.get("/students")
async def list_students(current_user: dict = Depends(get_current_user)):
    """List students (tenant-scoped)"""
    db = get_db()
    institution_id = current_user["institution_id"]
    students = await db.students.find(
        {"institution_id": institution_id},
        {"_id": 0}
    ).to_list(100)
    return {"students": students}


@api_router.get("/students/{student_id}")
async def get_student(student_id: str, current_user: dict = Depends(get_current_user)):
    """Get student with timeline of events"""
    db = get_db()
    institution_id = current_user["institution_id"]
    
    student = await db.students.find_one(
        {"id": student_id, "institution_id": institution_id},
        {"_id": 0}
    )
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    
    # Get timeline events
    events = await db.student_events.find(
        {"student_id": student_id},
        {"_id": 0}
    ).sort("created_at", -1).to_list(100)
    
    return {
        "student": student,
        "timeline": events
    }


@api_router.patch("/students/{student_id}")
async def update_student(
    student_id: str,
    update_data: dict,
    current_user: dict = Depends(get_current_user)
):
    """Update student info (e.g., notes)"""
    db = get_db()
    institution_id = current_user["institution_id"]
    
    result = await db.students.update_one(
        {"id": student_id, "institution_id": institution_id},
        {"$set": update_data}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {"success": True}


# ============================================================
# QUEUE & USER ENDPOINTS
# ============================================================

@api_router.get("/queues")
async def list_queues(current_user: dict = Depends(get_current_user)):
    """List queues (tenant-scoped)"""
    db = get_db()
    institution_id = current_user["institution_id"]
    queues = await db.queues.find(
        {"institution_id": institution_id},
        {"_id": 0}
    ).to_list(100)
    return {"queues": queues}


@api_router.get("/users")
async def list_users(current_user: dict = Depends(get_current_user)):
    """List users (tenant-scoped, for assignment)"""
    db = get_db()
    institution_id = current_user["institution_id"]
    users = await db.users.find(
        {"institution_id": institution_id},
        {"_id": 0}
    ).to_list(100)
    return {"users": users}


# ============================================================
# AI TOOL ENDPOINTS (POC Phase 1)
# ============================================================

@api_router.post("/tools/search_kb_articles", response_model=SearchKBResponse)
async def api_search_kb_articles(request: SearchKBRequest):
    """Search knowledge base articles by query and category"""
    try:
        db = get_db()
        result = await search_kb_articles(db, request)
        return result
    except Exception as e:
        logger.error(f"KB search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/tools/draft_reply", response_model=DraftReplyResponse)
async def api_draft_reply(request: DraftReplyRequest):
    """Generate AI draft reply for a ticket with PII masking and disclaimers"""
    try:
        db = get_db()
        result = await draft_reply_with_ai(db, request)
        
        # Save AiSuggestion to database
        suggestion = AiSuggestion(
            institution_id=request.institution_id,
            ticket_id=request.ticket_id,
            suggestion_type="draft_reply",
            input_context=request.model_dump(),
            output=result.model_dump(),
            accepted=False
        )
        
        doc = suggestion.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.ai_suggestions.insert_one(doc)
        
        return result
    except Exception as e:
        logger.error(f"Draft reply failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/tools/update_ticket_metadata")
async def api_update_ticket_metadata(request: UpdateTicketMetadataRequest):
    """Update ticket category, queue, priority, assignee (for AI triage)"""
    try:
        db = get_db()
        update_fields = {}
        if request.category:
            update_fields["category"] = request.category
        if request.queue_id:
            update_fields["queue_id"] = request.queue_id
        if request.priority:
            update_fields["priority"] = request.priority
        if request.assignee_id:
            update_fields["assignee_id"] = request.assignee_id
        
        update_fields["updated_at"] = datetime.now(timezone.utc).isoformat()
        
        result = await db.tickets.update_one(
            {"id": request.ticket_id, "institution_id": request.institution_id},
            {"$set": update_fields}
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Ticket not found")
        
        return {"success": True, "updated_fields": update_fields}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Update ticket metadata failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/tools/add_student_event")
async def api_add_student_event(request: AddStudentEventRequest):
    """Add a student event (note, call, walk-in, ai_routed, etc.) to timeline"""
    try:
        db = get_db()
        event = StudentEvent(
            institution_id=request.institution_id,
            student_id=request.student_id,
            ticket_id=request.ticket_id,
            event_type=request.event_type,
            content=request.content,
            created_by=request.created_by
        )
        
        doc = event.model_dump()
        doc['created_at'] = doc['created_at'].isoformat()
        await db.student_events.insert_one(doc)
        
        return {"success": True, "event_id": event.id}
    except Exception as e:
        logger.error(f"Add student event failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# HEALTH CHECK ENDPOINT
# ============================================================

@api_router.get("/")
async def root():
    return {
        "message": "AidHub Pro API",
        "version": "1.0.0",
        "status": "operational"
    }


# Include the router in the main app
app.include_router(api_router)

# Vercel serverless handler
handler = Mangum(app, lifespan="off")

