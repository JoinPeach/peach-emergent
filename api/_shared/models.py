from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Literal
from datetime import datetime, timezone
import uuid


# Data Models with strict tenant isolation via institution_id

class Institution(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    slug: str  # for chatbot URL: /school/{slug}/chat
    domain: str  # e.g., "university.edu"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution_id: str
    email: str
    name: str
    role: Literal["staff", "admin"] = "staff"
    oauth_provider: Literal["microsoft", "google"]
    oauth_token: Optional[str] = None  # mocked for now
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class ConnectedMailbox(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution_id: str
    user_id: str
    email: str  # e.g., "finaid@school.edu" or personal staff email
    mailbox_type: Literal["personal", "shared"]
    provider: Literal["microsoft", "google"]
    oauth_token: Optional[str] = None  # mocked for now
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Student(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution_id: str
    email: str
    name: str
    student_id: Optional[str] = None
    phone: Optional[str] = None
    notes: Optional[str] = None
    sis_url: Optional[str] = None  # Configurable "View in SIS/FAMS" link
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Queue(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution_id: str
    name: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Ticket(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution_id: str
    student_id: str
    subject: str
    status: Literal["open", "in_progress", "closed"] = "open"
    priority: Literal["low", "medium", "high", "urgent"] = "medium"
    category: Literal["fafsa", "verification", "sap_appeal", "billing", "general"] = "general"
    queue_id: Optional[str] = None
    assignee_id: Optional[str] = None
    channel: Literal["email", "chat", "phone", "walk_in"] = "email"
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class Message(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution_id: str
    ticket_id: str
    sender_email: str
    recipient_email: str
    subject: str
    body: str
    direction: Literal["inbound", "outbound"]
    thread_id: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StudentEvent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution_id: str
    student_id: str
    ticket_id: Optional[str] = None
    event_type: Literal["note", "phone_call", "walk_in", "ai_routed", "sent_email", "received_email"]
    content: str
    created_by: Optional[str] = None  # user_id
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class KnowledgeBaseArticle(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution_id: str
    title: str
    content: str  # markdown
    category: Literal["fafsa", "verification", "sap_appeal", "billing", "general", "deadlines"]
    ai_searchable: bool = True
    tags: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class AiSuggestion(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    institution_id: str
    ticket_id: str
    suggestion_type: Literal["triage", "draft_reply"]
    input_context: dict
    output: dict
    accepted: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


# API Request/Response Models

class SearchKBRequest(BaseModel):
    institution_id: str
    query: str
    category: Optional[Literal["fafsa", "verification", "sap_appeal", "billing", "general", "deadlines"]] = None
    limit: int = 5


class SearchKBResponse(BaseModel):
    articles: List[dict]


class DraftReplyRequest(BaseModel):
    institution_id: str
    ticket_id: str
    student_email: str
    student_name: str
    latest_message: str
    thread_context: Optional[List[dict]] = []
    student_notes: Optional[str] = None


class DraftReplyResponse(BaseModel):
    summary: str
    reasoning: str
    cited_kb: List[dict]
    safe_reply: str
    redaction_report: dict
    disclaimer: str


class UpdateTicketMetadataRequest(BaseModel):
    institution_id: str
    ticket_id: str
    category: Optional[Literal["fafsa", "verification", "sap_appeal", "billing", "general"]] = None
    queue_id: Optional[str] = None
    priority: Optional[Literal["low", "medium", "high", "urgent"]] = None
    assignee_id: Optional[str] = None


class AddStudentEventRequest(BaseModel):
    institution_id: str
    student_id: str
    ticket_id: Optional[str] = None
    event_type: Literal["note", "phone_call", "walk_in", "ai_routed", "sent_email", "received_email"]
    content: str
    created_by: Optional[str] = None

