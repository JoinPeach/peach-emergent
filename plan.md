# Multi-tenant AI Financial Aid Platform — Development Plan

Context: Emergent LLM key, mocked OAuth, sample data/KB, FastAPI + React + MongoDB, Kustomer-style UI. POC required before full build.

## Phase 1: Core AI POC (Status: In Progress)
1) Objectives
- Prove AI triage and draft generation using EmergentIntegrations LlmChat with masking and disclaimers
- Retrieve top KB snippets and thread context; never fabricate SIS/FAMS data
- Persist AiSuggestion records; log StudentEvent type="ai_routed"

2) User Stories (POC)
- As an advisor, I want AI to categorize an inbound email so the ticket lands in the right queue
- As an advisor, I want to click "Generate AI Draft" and see a professional reply citing KB
- As a director, I want AI outputs to mask PII and include the required disclaimer
- As an advisor, I want to review the draft separately before sending
- As a compliance officer, I want an audit record whenever AI routes or drafts

3) Implementation Steps
- Backend POC endpoints: /api/tools/search_kb_articles, /api/tools/draft_reply, /api/tools/update_ticket_metadata (mock ticket store), /api/tools/add_student_event
- Install emergentintegrations (LLM chat) and update backend/requirements via pip freeze; store session_id per request
- Create sample KB (fafsa, verification, sap_appeal, billing, general) with ai_searchable=true and institution_id
- Write prompt templates: triage (category/queue/priority/assignee) and reply drafting with policy citation and disclaimer
- Python test script to call draft_reply with sample email + KB; verify structure, disclaimers, PII masking
- Web search checkpoint: refine prompt patterns for summarization + citation formatting (brief)

4) Next Actions
- Implement minimal POC models (in-memory or Mongo) and run test script end-to-end
- Call testing_agent_v3 for POC endpoints and prompt safety checks
- Iterate until outputs are deterministic, safe, and useful

5) Success Criteria
- draft_reply returns: summary, reasoning, cited_kb, safe_reply, redaction_report in <1.5s avg with Emergent LLM
- update_ticket_metadata sets category/queue/priority consistently on sample inputs; StudentEvent recorded
- No SIS/FAMS guesses; disclaimer present exactly; PII masked in prompt and logs

---

## Phase 2: V1 App Development (Status: Not Started)
1) Objectives
- Ship working three-pane workspace (Inbox | Thread + Composer | Student Context)
- Implement core schema with tenant isolation (institution_id UUID) and CRUD
- Mock OAuth for Microsoft/Google sign-in and mailbox connection

2) User Stories (V1)
- As an advisor, I sign in via mocked Microsoft/Google and land in the workspace
- As an advisor, I filter My Tickets, Unassigned, Waiting on Student, Closed
- As an advisor, I open a ticket and see the entire message thread
- As an advisor, I edit Student profile and notes in the context panel
- As an advisor, I use a rich-text composer with Generate AI Draft and Send Email (mock send)

3) Implementation Steps
- Backend: Define models (UUIDs, tz-aware) Institution, User, ConnectedMailbox, Student, Ticket, Message, StudentEvent, KnowledgeBaseArticle, AiSuggestion, Queue
- REST endpoints under /api with strict institution scoping and audit logs; bind 0.0.0.0:8001
- Mock OAuth endpoints and session handling; mock connect mailbox; store tokens placeholders
- Frontend: React + shadcn components; three-column layout, filters, ticket list, thread view, context panel, composer
- Integrate POC tools: Generate AI Draft button → /api/tools/draft_reply; save AiSuggestion; display/edit before send
- Seed demo institution, staff, students, tickets, KB; use REACT_APP_BACKEND_URL for all calls

4) Next Actions
- Wire UI to backend; ensure data-testid on interactive elements; implement loading/empty/error states
- Run esbuild bundle check and call testing_agent_v3 for end-to-end flows
- Fix issues found, then mark Phase 2 completed

5) Success Criteria
- Advisors can triage, draft, and send mocked emails fully in the 3-pane UI
- Filters work; tenant isolation enforced on all queries; audit logs created on ticket access
- No console or backend errors in standard flows; basic accessibility passes

---

## Phase 3: Email & Events + KB Management (Status: Not Started)
1) Objectives
- Simulate inbound emails → create/update Ticket, run AI triage, record StudentEvent timeline
- Add Note / Log Call / Log Walk-in actions; full timeline on right panel
- CRUD KB with markdown editor; ai_searchable flag respected by AI tools

2) User Stories
- As an agent, mock ingestion converts student emails to tickets automatically
- As an agent, I add a note, log a call, or log a walk-in in the timeline
- As an agent, I manage KB articles and mark ones as ai_searchable
- As an agent, I send a mocked email and see it appear in the thread
- As a manager, I see AI routing events in the student timeline

3) Implementation Steps
- Backend: create_ticket_from_email and ingestion simulator endpoint; link to triage + StudentEvent(type=ai_routed)
- Message model: inbound/outbound, threading metadata, relative timestamps via date-fns in UI
- StudentEvent API + audit logging; right panel timeline sorted by time
- KB CRUD endpoints + markdown storage; lightweight editor in React; citation preview helpers
- Update composer: sending posts Message (mock provider), records StudentEvent(type=sent_email)
- Security: enforce institution_id everywhere; redact PII from prompts; HTTPS-only assumption

4) Next Actions
- Seed sample inbound emails; verify thread aggregation and timeline correctness
- testing_agent_v3: ingest → ticket → triage → reply → timeline
- Fix regressions, then mark Phase 3 completed

5) Success Criteria
- New student emails reliably create/append tickets and route to correct queue
- Timeline shows email, notes, calls, walk-ins, AI actions accurately
- KB editor works; AI cites only ai_searchable content

---

## Phase 4: Advanced Features (Chatbot + Reporting) (Status: Not Started)
1) Objectives
- Student chatbot at /school/{slug}/chat using KB; escalate to Ticket on low confidence or sensitive topics
- Reporting dashboard per institution: volume by category/channel, ART/first-response, SLA, AI drafts generated vs accepted

2) User Stories
- As a student, I ask general questions and get answers with KB citations
- As a student, low-confidence or appeal topics escalate to a routed ticket
- As a manager, I see ticket volume by category and channel over time
- As a manager, I see average first-response and SLA compliance
- As a manager, I compare AI drafts generated vs accepted

3) Implementation Steps
- Chatbot backend: limited context prompt with KB search; record conversations minimally; no SIS data
- Escalation path: create Ticket + first Message; queue by category via triage tool
- Reporting: aggregation pipelines on Mongo per institution; simple charts in React (e.g., area/bar)
- UI polish: subtle channel icons (email/chat/phone/walk-in), relative timestamps, badges for statuses
- Access control: chatbot scoped by institution slug; rate limit basics

4) Next Actions
- Populate charts with seeded data; validate chatbot responses and escalation behavior
- testing_agent_v3: chatbot Q&A and escalation; dashboard queries
- Fix gaps then mark Phase 4 completed

5) Success Criteria
- Chatbot answers safely; escalations create routable tickets
- Dashboards load quickly with correct aggregations and filters

---

## Phase 5: Testing & Polish (Status: Not Started)
1) Objectives
- Hardening: tenant isolation, audit logging, accessibility, performance, loading states
- Comprehensive automated testing and final UI polish aligned with design system

2) User Stories
- As an admin, tenant isolation is verified across all APIs and UI lists
- As an advisor, all views have clear loading/empty/error states and keyboard navigation
- As QA, regression tests cover triage, drafting, sending, timeline, KB, chatbot, reporting
- As security, prompts/logs are free of PII and only cite ai_searchable KB
- As an operator, logs and audit trails support troubleshooting

3) Implementation Steps
- Unit/integration tests for critical APIs; Playwright flows for core UX; call testing_agent_v3
- Performance: index key fields; paginate lists; avoid N+1 patterns
- A11y: focus rings, ARIA, color contrast; add data-testid across UI
- Review logs and error handling; finalize toasts and feedback

4) Next Actions
- Run full test suite; address all issues; rerun until green
- Freeze dependencies; re-verify with esbuild and supervisor logs
- Prepare handoff notes and backlog for real OAuth/email integration

5) Success Criteria
- No known high/medium issues; end-to-end flows pass reliably
- UI meets design guidelines (colors, typography, spacing, motion rules)
- Ready to swap mocked OAuth/email with real provider credentials

---

## Global Non-Functional Requirements
- All API routes prefixed with /api; backend bound to 0.0.0.0:8001; use UUIDs and timezone.utc
- Strict tenant scoping via institution_id; audit logs for ticket access and AI actions
- PII masked in prompts/logs; disclaimers mandatory; HTTPS-only assumption
- Frontend uses shadcn components and data-testid attributes; use REACT_APP_BACKEND_URL for calls

## Immediate Next Actions (Today)
- Implement Phase 1 POC endpoints + sample KB; add Python test script and run it
- If stable, scaffold Phase 2 models/endpoints and the three-pane UI skeleton
- Trigger testing_agent_v3 for POC, then iterate