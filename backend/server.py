from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from typing import List
import uuid
from datetime import datetime, timezone

# Import models and AI tools
from models import (
    SearchKBRequest, SearchKBResponse,
    DraftReplyRequest, DraftReplyResponse,
    UpdateTicketMetadataRequest,
    AddStudentEventRequest,
    StudentEvent, AiSuggestion, Ticket
)
from ai_tools import search_kb_articles, draft_reply_with_ai, triage_ticket_with_ai


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI(title="AidHub Pro - AI Financial Aid Platform")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ============================================================
# AI TOOL ENDPOINTS (POC Phase 1)
# ============================================================

@api_router.post("/tools/search_kb_articles", response_model=SearchKBResponse)
async def api_search_kb_articles(request: SearchKBRequest):
    """Search knowledge base articles by query and category"""
    try:
        result = await search_kb_articles(db, request)
        return result
    except Exception as e:
        logging.error(f"KB search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/tools/draft_reply", response_model=DraftReplyResponse)
async def api_draft_reply(request: DraftReplyRequest):
    """Generate AI draft reply for a ticket with PII masking and disclaimers"""
    try:
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
        logging.error(f"Draft reply failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/tools/update_ticket_metadata")
async def api_update_ticket_metadata(request: UpdateTicketMetadataRequest):
    """Update ticket category, queue, priority, assignee (for AI triage)"""
    try:
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
        logging.error(f"Update ticket metadata failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@api_router.post("/tools/add_student_event")
async def api_add_student_event(request: AddStudentEventRequest):
    """Add a student event (note, call, walk-in, ai_routed, etc.) to timeline"""
    try:
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
        logging.error(f"Add student event failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))


# ============================================================
# HEALTH CHECK ENDPOINT
# ============================================================

@api_router.get("/")
async def root():
    return {
        "message": "AidHub Pro API",
        "version": "1.0.0-POC",
        "status": "operational"
    }

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()