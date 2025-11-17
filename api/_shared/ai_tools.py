import os
import re
from typing import List, Dict, Optional
from emergentintegrations.llm.chat import LlmChat, UserMessage
from _shared.models import (
    SearchKBRequest, SearchKBResponse,
    DraftReplyRequest, DraftReplyResponse,
    KnowledgeBaseArticle
)
import logging

logger = logging.getLogger(__name__)

# Get Emergent LLM key from environment
EMERGENT_LLM_KEY = os.getenv("EMERGENT_LLM_KEY", "sk-emergent-c150a2a7f7f397a8aD")


def mask_pii(text: str) -> tuple[str, dict]:
    """
    Mask PII in text before sending to AI.
    Returns: (masked_text, redaction_report)
    """
    redacted = {}
    masked_text = text
    
    # Mask SSN patterns
    ssn_pattern = r'\b\d{3}-\d{2}-\d{4}\b|\b\d{9}\b'
    ssns = re.findall(ssn_pattern, masked_text)
    if ssns:
        masked_text = re.sub(ssn_pattern, '[SSN REDACTED]', masked_text)
        redacted['ssn_count'] = len(ssns)
    
    # Mask student ID patterns (7-9 digit numbers that appear standalone or after "student ID")
    student_id_pattern = r'(?i)(?:student\s*(?:id|#|number)?\s*(?:is)?\s*:?\s*)?(\d{7,9})(?=\s|$|\b)'
    student_ids = re.findall(student_id_pattern, masked_text)
    if student_ids:
        masked_text = re.sub(student_id_pattern, lambda m: '[STUDENT_ID REDACTED]' if m.group(1) else m.group(0), masked_text, flags=re.IGNORECASE)
        redacted['student_id_count'] = len([s for s in student_ids if s])
    
    # Mask phone numbers
    phone_pattern = r'\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b'
    phones = re.findall(phone_pattern, masked_text)
    if phones:
        masked_text = re.sub(phone_pattern, '[PHONE REDACTED]', masked_text)
        redacted['phone_count'] = len(phones)
    
    # Mask dates of birth
    dob_pattern = r'\b(?:0?[1-9]|1[0-2])[/-](?:0?[1-9]|[12]\d|3[01])[/-](?:19|20)\d{2}\b'
    dobs = re.findall(dob_pattern, masked_text)
    if dobs:
        masked_text = re.sub(dob_pattern, '[DATE REDACTED]', masked_text)
        redacted['dob_count'] = len(dobs)
    
    return masked_text, redacted


async def search_kb_articles(
    db,
    request: SearchKBRequest
) -> SearchKBResponse:
    """
    Search knowledge base articles by query and category.
    Only returns ai_searchable articles for the given institution.
    """
    query_filter = {
        "institution_id": request.institution_id,
        "ai_searchable": True
    }
    
    if request.category:
        query_filter["category"] = request.category
    
    # Simple search: look for query terms in title or content
    # For production, use MongoDB text search or vector embeddings
    query_terms = request.query.lower().split()
    
    all_articles = await db.knowledge_base.find(query_filter, {"_id": 0}).to_list(100)
    
    # Score articles by query term matches
    scored_articles = []
    for article in all_articles:
        score = 0
        text = f"{article['title']} {article['content']}".lower()
        for term in query_terms:
            score += text.count(term)
        if score > 0:
            scored_articles.append({"score": score, "article": article})
    
    # Sort by score and return top results
    scored_articles.sort(key=lambda x: x["score"], reverse=True)
    top_articles = [item["article"] for item in scored_articles[:request.limit]]
    
    return SearchKBResponse(articles=top_articles)


async def draft_reply_with_ai(
    db,
    request: DraftReplyRequest
) -> DraftReplyResponse:
    """
    Generate AI draft reply for a ticket using KB context and thread history.
    Implements PII masking and required disclaimers.
    """
    # Step 1: Search KB for relevant articles
    kb_request = SearchKBRequest(
        institution_id=request.institution_id,
        query=request.latest_message,
        limit=3
    )
    kb_response = await search_kb_articles(db, kb_request)
    
    # Step 2: Mask PII in input
    masked_message, redaction_report = mask_pii(request.latest_message)
    
    # Step 3: Build context for AI
    kb_context = ""
    for i, article in enumerate(kb_response.articles, 1):
        kb_context += f"\n\n[KB Article {i}: {article['title']}]\n{article['content'][:800]}...\n"
    
    thread_summary = ""
    if request.thread_context:
        thread_summary = "\n\nPrevious conversation:\n"
        for msg in request.thread_context[-3:]:
            thread_summary += f"- {msg.get('sender', 'Unknown')}: {msg.get('body', '')[:200]}...\n"
    
    notes_context = ""
    if request.student_notes:
        notes_context = f"\n\nStudent notes: {request.student_notes}"
    
    # Step 4: Create AI prompt
    system_message = """You are a professional financial aid advisor AI assistant. Your role is to help draft empathetic, accurate responses to student inquiries.

IMPORTANT RULES:
1. NEVER fabricate or guess financial aid amounts, award statuses, or SIS/FAMS data
2. If the answer requires checking official records, instruct the student that a counselor will review their account
3. Always cite Knowledge Base articles when providing policy information
4. Use a warm, professional, empathetic tone
5. Keep responses clear and concise
6. Always end with the required disclaimer

RESPONSE FORMAT:
Provide your response in this exact JSON structure:
{
  "summary": "Brief summary of the student's question",
  "reasoning": "Your analysis of the question and what information is needed",
  "reply": "The draft email response"
}
"""
    
    user_prompt = f"""Student: {request.student_name} ({request.student_email})

Latest student message:
{masked_message}
{thread_summary}{notes_context}

Relevant Knowledge Base articles:{kb_context}

Draft a professional, empathetic reply that:
1. Acknowledges the student's question
2. Provides relevant information from the Knowledge Base (cite article titles)
3. Requests any missing information needed
4. If the question requires checking official records, states that a counselor will review their account
5. Ends with contact information for follow-up

Remember: DO NOT make up award amounts, balances, or account details.
"""
    
    # Step 5: Call AI
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"draft_{request.ticket_id}",
            system_message=system_message
        ).with_model("openai", "gpt-4o")
        
        user_message = UserMessage(text=user_prompt)
        ai_response = await chat.send_message(user_message)
        
        # Parse AI response (strip markdown code blocks if present)
        import json
        ai_text = ai_response.strip()
        if ai_text.startswith("```json"):
            ai_text = ai_text[7:]
        if ai_text.startswith("```"):
            ai_text = ai_text[3:]
        if ai_text.endswith("```"):
            ai_text = ai_text[:-3]
        ai_text = ai_text.strip()
        
        try:
            response_data = json.loads(ai_text)
        except json.JSONDecodeError:
            # If AI didn't return valid JSON, extract what we can
            response_data = {
                "summary": "Unable to parse AI response",
                "reasoning": "AI returned non-JSON response",
                "reply": ai_response
            }
        
        # Step 6: Add mandatory disclaimer
        disclaimer = "\n\n---\n\n*This response is informational only and based on general financial aid policies. Final financial aid decisions depend on official records in our student systems. If you have specific questions about your account, please schedule an appointment with a financial aid counselor.*"
        
        safe_reply = response_data.get("reply", "") + disclaimer
        
        # Step 7: Prepare cited KB articles
        cited_kb = [
            {
                "title": article["title"],
                "category": article["category"],
                "excerpt": article["content"][:200] + "..."
            }
            for article in kb_response.articles
        ]
        
        return DraftReplyResponse(
            summary=response_data.get("summary", "Student inquiry"),
            reasoning=response_data.get("reasoning", "N/A"),
            cited_kb=cited_kb,
            safe_reply=safe_reply,
            redaction_report=redaction_report,
            disclaimer=disclaimer
        )
        
    except Exception as e:
        logger.error(f"AI draft generation failed: {e}")
        raise


async def triage_ticket_with_ai(
    db,
    email_body: str,
    institution_id: str
) -> dict:
    """
    Use AI to automatically categorize and route a ticket.
    Returns: {category, priority, suggested_queue, reasoning}
    """
    # Mask PII first
    masked_body, _ = mask_pii(email_body)
    
    system_message = """You are an AI triage assistant for a university financial aid office. Your job is to analyze incoming student emails and categorize them.

Categories:
- fafsa: Questions about FAFSA application, deadlines, completion
- verification: Questions about verification process, required documents
- sap_appeal: Satisfactory Academic Progress issues, appeals
- billing: Questions about bills, charges, payment plans
- general: General questions, eligibility, other topics

Priority levels:
- urgent: Deadline in <7 days, account hold, disbursement issue
- high: Deadline in 7-14 days, verification needed
- medium: General questions, no immediate deadline
- low: Informational requests

Provide your response in this exact JSON format:
{
  "category": "one of: fafsa, verification, sap_appeal, billing, general",
  "priority": "one of: low, medium, high, urgent",
  "reasoning": "Brief explanation of your categorization"
}
"""
    
    user_prompt = f"Categorize this student email:\n\n{masked_body}"
    
    try:
        chat = LlmChat(
            api_key=EMERGENT_LLM_KEY,
            session_id=f"triage_{institution_id}",
            system_message=system_message
        ).with_model("openai", "gpt-4o")
        
        user_message = UserMessage(text=user_prompt)
        ai_response = await chat.send_message(user_message)
        
        import json
        # Strip markdown code blocks if present
        ai_text = ai_response.strip()
        if ai_text.startswith("```json"):
            ai_text = ai_text[7:]
        if ai_text.startswith("```"):
            ai_text = ai_text[3:]
        if ai_text.endswith("```"):
            ai_text = ai_text[:-3]
        ai_text = ai_text.strip()
        
        triage_data = json.loads(ai_text)
        
        return triage_data
        
    except Exception as e:
        logger.error(f"AI triage failed: {e}")
        # Fallback to general/medium if AI fails
        return {
            "category": "general",
            "priority": "medium",
            "reasoning": f"AI triage unavailable: {str(e)}"
        }

