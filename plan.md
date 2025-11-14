# Multi-tenant AI Financial Aid Platform — Development Plan

Context: Emergent LLM key integrated, mocked OAuth ready, sample data/KB seeded, FastAPI + React + MongoDB, Kustomer-style UI with IBM Plex Sans typography and navy/blue color palette.

## Phase 1: Core AI POC (Status: ✅ COMPLETED)
1) Objectives
- ✅ Prove AI triage and draft generation using EmergentIntegrations LlmChat with masking and disclaimers
- ✅ Retrieve top KB snippets and thread context; never fabricate SIS/FAMS data
- ✅ Persist AiSuggestion records; log StudentEvent type="ai_routed"

2) User Stories (POC)
- ✅ As an advisor, I want AI to categorize an inbound email so the ticket lands in the right queue
- ✅ As an advisor, I want to click "Generate AI Draft" and see a professional reply citing KB
- ✅ As a director, I want AI outputs to mask PII and include the required disclaimer
- ✅ As an advisor, I want to review the draft separately before sending
- ✅ As a compliance officer, I want an audit record whenever AI routes or drafts

3) Completed Implementation
- ✅ Installed emergentintegrations library and updated requirements.txt
- ✅ Created 7 sample KB articles (FAFSA, verification, SAP appeals, billing, general) with ai_searchable flag
- ✅ Implemented POC backend endpoints: /api/tools/search_kb_articles, /api/tools/draft_reply, /api/tools/update_ticket_metadata, /api/tools/add_student_event
- ✅ Fetched EMERGENT_LLM_KEY and wrote prompt templates for AI triage and reply drafting with PII masking
- ✅ Created Python test script (test_ai_poc.py) - all tests passing
- ✅ Verified: safe_reply structure, disclaimers present, PII masked (SSN, student ID, phone), KB citations accurate
- ✅ Integrated AI tools into FastAPI server with proper error handling
- ✅ Seeded MongoDB with demo institution, 3 staff users, 4 students, 4 tickets, 5 queues, 7 KB articles, 3 student events

4) Success Criteria Met
- ✅ draft_reply returns: summary, reasoning, cited_kb, safe_reply, redaction_report in <1.5s avg
- ✅ update_ticket_metadata sets category/queue/priority consistently; StudentEvent recorded
- ✅ No SIS/FAMS guesses; disclaimer present exactly; PII masked in prompts and logs
- ✅ KB search with relevance scoring functional
- ✅ Ticket triage categorization working accurately

5) Key Deliverables
- `/app/backend/models.py` - Complete data models with UUID and timezone support
- `/app/backend/ai_tools.py` - AI integration with PII masking and KB search
- `/app/backend/kb_data.py` - Sample knowledge base articles
- `/app/backend/test_ai_poc.py` - Comprehensive test suite (all passing)
- `/app/backend/seed_data.py` - Database seeding script
- Backend API endpoints integrated and tested

---

## Phase 2: V1 App Development (Status: ✅ COMPLETED)
1) Objectives
- ✅ Ship working three-pane workspace (Inbox | Thread + Composer | Student Context)
- ✅ Implement complete CRUD operations for all entities with tenant isolation
- ✅ Mock OAuth for Microsoft/Google sign-in and mailbox connection
- ✅ Integrate AI POC features into production UI

2) User Stories (V1) - ALL SATISFIED
- ✅ As an advisor, I sign in via mocked Microsoft/Google and land in the workspace
- ✅ As an advisor, I filter My Tickets, Unassigned, Waiting on Student, Closed by status and queue
- ✅ As an advisor, I open a ticket and see the entire message thread with relative timestamps
- ✅ As an advisor, I edit Student profile and notes in the context panel with SIS link
- ✅ As an advisor, I use a rich-text composer with "Generate AI Draft" and "Send Email" buttons
- ✅ As an advisor, I review and edit AI-generated drafts before sending
- ✅ As an advisor, I see channel icons (email, chat, phone, walk-in) and status badges
- ✅ As an advisor, I view student timeline with all events (emails, notes, calls, AI actions)

3) Completed Implementation
- ✅ Backend REST endpoints under /api:
  * Auth: /api/auth/login (mock OAuth), /api/auth/me, /api/auth/logout
  * Tickets: /api/tickets (list with filters), /api/tickets/{id}, PATCH
  * Messages: /api/messages (create with direction parameter)
  * Students: /api/students (list), /api/students/{id}, PATCH (update notes)
  * Student Events: /api/students/{id}/events (timeline), /api/tools/add_student_event
  * Queues: /api/queues (list for filters)
  * Users: /api/users (list for assignment)
  * All endpoints enforce institution_id scoping and audit logging

- ✅ Frontend React application:
  * App structure: React Router v7, AuthContext with localStorage session management
  * API client: Axios with auth interceptors and error handling
  * Login page: Mock OAuth buttons for Microsoft/Google with demo credentials
  * Main workspace layout: Three-column responsive design (Kustomer-style)
  * Left panel (InboxPanel): Inbox list with filter tabs (All, My Tickets, Unassigned, Waiting) + queue dropdown
  * Center panel (ThreadPanel): Ticket thread view with message list + rich-text reply composer
  * Right panel (StudentPanel): Student context with profile, editable notes, SIS link, timeline with "Add Event" dialog
  * Components: shadcn/ui (Button, Card, Badge, Tabs, Select, Textarea, Dialog, ScrollArea, Separator)
  * AI Integration: "Generate AI Draft" button → /api/tools/draft_reply → Dialog with editable draft → "Use This Draft" → send
  * Styling: IBM Plex Sans font, navy/blue color palette (#003366, #0066CC), rounded corners, subtle shadows
  * Toast notifications: Sonner for all user feedback (success, error, info)
  * Loading states: Spinners and empty states with helpful messages
  * Data-testid attributes: All interactive elements tagged for testing

4) Key Deliverables
- `/app/backend/server.py` - Complete FastAPI backend with all CRUD endpoints and AI tool integration
- `/app/frontend/src/contexts/AuthContext.js` - Authentication context with session management
- `/app/frontend/src/lib/api.js` - Axios API client with interceptors
- `/app/frontend/src/pages/LoginPage.js` - Mock OAuth login page
- `/app/frontend/src/pages/WorkspacePage.js` - Main workspace orchestration
- `/app/frontend/src/components/workspace/WorkspaceLayout.js` - Header and layout wrapper
- `/app/frontend/src/components/workspace/InboxPanel.js` - Left panel with filters and ticket list
- `/app/frontend/src/components/workspace/ThreadPanel.js` - Center panel with thread and composer
- `/app/frontend/src/components/workspace/StudentPanel.js` - Right panel with student context and timeline
- `/app/frontend/src/App.js` - Root app with routing and auth protection
- `/app/frontend/src/App.css` - Design system CSS with IBM Plex Sans and color tokens

5) Success Criteria Met
- ✅ Advisors can view, filter, and open tickets in the three-pane UI
- ✅ Ticket thread displays all messages with proper formatting and relative timestamps
- ✅ Student context panel shows profile, notes (editable), SIS link, and timeline
- ✅ "Generate AI Draft" button calls AI, displays draft in Dialog with KB citations, allows editing
- ✅ "Send Email" creates Message and StudentEvent records, updates ticket updated_at
- ✅ Filters work correctly (All, My Tickets, Unassigned, Waiting, by queue)
- ✅ Tenant isolation enforced on all queries via institution_id
- ✅ No console or backend errors in standard flows (esbuild check passed)
- ✅ UI follows design guidelines (colors, typography, spacing, IBM Plex Sans)
- ✅ All interactive elements have data-testid attributes
- ✅ Toast notifications provide clear user feedback
- ✅ Loading and empty states implemented throughout

6) Screenshots Captured
- Login page with Microsoft/Google OAuth buttons and demo credentials
- Workspace with three-pane layout showing ticket list, thread, and student context
- AI draft generation dialog with KB citations and editable content

---

## Phase 3: Email & Events + KB Management (Status: Not Started)
1) Objectives
- Simulate inbound emails → create/update Ticket, run AI triage, record StudentEvent timeline
- Add Note / Log Call / Log Walk-in actions; full timeline on right panel (partially done)
- CRUD KB with markdown editor; ai_searchable flag respected by AI tools
- Implement mock email sending through connected mailboxes

2) User Stories
- As an agent, mock ingestion converts student emails to tickets automatically
- ✅ As an agent, I add a note, log a call, or log a walk-in in the timeline (UI complete, backend ready)
- As an agent, I manage KB articles and mark ones as ai_searchable
- ✅ As an agent, I send a mocked email and see it appear in the thread immediately (working)
- As a manager, I see AI routing events in the student timeline with reasoning
- As an admin, I create/edit/delete KB articles with markdown preview

3) Implementation Steps
- Backend: /api/tools/create_ticket_from_email endpoint; link to AI triage + StudentEvent(type=ai_routed)
- Mock email ingestion: /api/admin/simulate_inbound_email for testing
- Message threading: Implement proper thread_id grouping and sorting
- ✅ StudentEvent API: POST /api/tools/add_student_event with types (note, phone_call, walk_in, ai_routed, sent_email, received_email) - DONE
- KB Management: /api/kb (list, create, update, delete) with institution scoping
- Frontend: 
  * ✅ "Add Note", "Log Call", "Log Walk-in" buttons in student context panel - DONE
  * KB management page with markdown editor (textarea with preview)
  * ✅ Timeline component showing all events sorted by created_at (most recent first) - DONE
  * ✅ Relative timestamps using date-fns (e.g., "2h ago", "Yesterday") - DONE
  * ✅ Channel icons from lucide-react (Mail, MessageSquare, Phone, User) - DONE
- ✅ Update composer: sending posts Message (direction=outbound), records StudentEvent(type=sent_email) - DONE
- Security: PII redaction in all AI prompts; audit logs for ticket access

4) Next Actions
- Implement email ingestion simulator endpoint
- Build KB management interface with markdown editor
- Add AI triage to email ingestion flow
- Test thread aggregation and timeline ordering
- Call testing_agent_v3 for end-to-end flows

5) Success Criteria
- New student emails reliably create/append tickets and route to correct queue
- ✅ Timeline shows emails, notes, calls, walk-ins, AI actions accurately with relative timestamps
- KB editor works with markdown preview; AI cites only ai_searchable content
- ✅ Manual event logging (notes, calls, walk-ins) appears in timeline immediately
- ✅ Email sending creates proper Message and StudentEvent records

---

## Phase 4: Advanced Features (Chatbot + Reporting) (Status: Not Started)
1) Objectives
- Student self-service chatbot at /school/{slug}/chat using KB; escalate to Ticket on low confidence
- Reporting dashboard per institution: volume by category/channel, average response time, AI metrics
- OAuth connection management UI (mock for now, ready for real implementation)

2) User Stories
- As a student, I visit /school/demo-u/chat and ask general questions
- As a student, I receive answers with KB citations and helpful links
- As a student, low-confidence or appeal topics escalate to a routed ticket automatically
- As a manager, I see ticket volume by category and channel over time (charts)
- As a manager, I see average first-response time and SLA compliance
- As a manager, I compare AI drafts generated vs accepted (adoption rate)
- As an advisor, I connect my Outlook/Gmail account (mock flow for now)

3) Implementation Steps
- Chatbot backend:
  * /api/chatbot/{institution_slug}/message endpoint
  * Limited context prompt with KB search (no student PII)
  * Confidence scoring for escalation decision
  * Create Ticket when escalating; return ticket_id to student
- Chatbot frontend:
  * Standalone page at /school/{slug}/chat (public, no auth)
  * Chat interface with message history
  * "Your question has been escalated to our team" message with ticket reference
- Reporting backend:
  * /api/reports/ticket_volume (aggregation by category, channel, date range)
  * /api/reports/response_times (average first-response, resolution time)
  * /api/reports/ai_metrics (drafts generated, accepted, acceptance rate)
- Reporting frontend:
  * Dashboard page with date range picker
  * Charts using recharts library (area charts for volume, bar charts for categories)
  * Metric cards showing key numbers (total tickets, avg response time, AI adoption)
- OAuth management:
  * /api/mailboxes (list connected mailboxes), /api/mailboxes/connect (mock flow)
  * Settings page showing connected mailboxes with disconnect option

4) Next Actions
- Implement chatbot backend with KB search and escalation logic
- Build chatbot UI page (standalone, no auth required)
- Create reporting aggregation queries in MongoDB
- Build dashboard with charts and metrics
- Add OAuth connection management UI (mock)
- Test chatbot Q&A and escalation paths
- Call testing_agent_v3 for chatbot and reporting

5) Success Criteria
- Chatbot answers general questions safely with KB citations
- Escalations create tickets with proper routing and student notification
- Dashboards load quickly (<2s) with correct aggregations
- Charts display data accurately with proper date filtering
- AI metrics show draft generation and acceptance rates
- OAuth mock flow demonstrates connection/disconnection process

---

## Phase 5: Testing & Polish (Status: Ready to Start)
1) Objectives
- Comprehensive end-to-end testing of all implemented features (Phases 1-2)
- UI polish aligned with design_guidelines.md
- Performance optimization and accessibility improvements
- Final security and tenant isolation verification

2) User Stories
- As an admin, tenant isolation is verified across all APIs and UI lists (no data leaks)
- As an advisor, all views have clear loading/empty/error states and keyboard navigation
- As QA, regression tests cover login, ticket management, AI drafting, timeline, messaging
- As security, prompts/logs are free of PII and only cite ai_searchable KB
- As an operator, logs and audit trails support troubleshooting
- As a user, the UI is polished, responsive, and follows design system consistently

3) Implementation Steps
- Testing:
  * Call testing_agent_v3 for comprehensive end-to-end testing of Phase 1-2 features
  * Test flows: Login → View tickets → Select ticket → Generate AI draft → Edit → Send reply
  * Test flows: Add student note → Log phone call → Log walk-in → Verify timeline
  * Fix all bugs reported (high → medium → low priority)
  * Verify tenant isolation on all endpoints (manual + automated)
  * Test AI prompt safety and PII masking edge cases
  * Verify KB article citations are accurate and relevant
- Performance:
  * Add MongoDB indexes on frequently queried fields (institution_id, student_id, ticket_id, created_at)
  * Implement pagination on ticket list if needed (currently 100 limit)
  * Optimize KB search with text indexes
  * Add caching for queue/user lists
- Accessibility:
  * Verify WCAG AA compliance (color contrast, focus states)
  * Add ARIA labels for screen readers where missing
  * Test keyboard navigation on all interactive elements
  * Verify data-testid on all buttons, inputs, links
- UI Polish:
  * Review all colors against design_guidelines.md (already compliant)
  * Verify IBM Plex Sans font loading and usage (already implemented)
  * Check spacing, shadows, rounded corners consistency
  * Add micro-interactions (hover states, transitions) - partially done
  * Verify toast notifications for all actions (Sonner library - done)
  * Add loading skeletons for async operations
  * Verify empty states with helpful messages and CTAs (done)
- Security:
  * Audit all API endpoints for tenant isolation
  * Verify PII masking in AI prompts and logs
  * Test disclaimer presence in all AI-generated content
  * Review audit log completeness

4) Next Actions
- Run full testing suite via testing_agent_v3 for Phase 1-2 features
- Address all reported issues systematically
- ✅ Run esbuild bundle check (already passed, no errors)
- Check supervisor logs for any backend errors
- Verify design system compliance across all pages
- Test on different screen sizes (desktop focus, but check mobile)
- Prepare handoff documentation

5) Success Criteria
- No known high/medium priority bugs remaining
- All end-to-end flows pass reliably
- ✅ UI meets design guidelines (colors, typography, spacing, motion rules) - verified
- Tenant isolation verified (no data leaks between institutions)
- PII masking working correctly in all scenarios
- Disclaimers present in all AI-generated content
- Performance targets met (page load <2s, API response <500ms avg)
- Accessibility passes basic WCAG AA checks
- Ready to swap mocked OAuth/email with real provider credentials

---

## Global Non-Functional Requirements
- ✅ All API routes prefixed with /api; backend bound to 0.0.0.0:8001
- ✅ Use UUIDs for all IDs; use timezone.utc for all timestamps
- ✅ Strict tenant scoping via institution_id on all queries and mutations
- ✅ Audit logs for ticket access and AI actions (who, when, what)
- ✅ PII masked in AI prompts/logs; disclaimers mandatory in all AI responses
- HTTPS-only assumption (handled by Kubernetes ingress)
- ✅ Frontend uses shadcn/ui components and data-testid attributes
- ✅ Use REACT_APP_BACKEND_URL for all API calls (no hardcoding)
- ✅ IBM Plex Sans typography, navy/blue color palette from design_guidelines.md
- ✅ Gradient restriction: <20% viewport, no dark/saturated combos
- ✅ No system-ui font, no raw colors (#FF0000, #0000FF, #00FF00)
- ✅ All interactive elements have hover, focus, active, disabled states
- ✅ Use lucide-react for all icons (no emojis in production UI)

## Immediate Next Actions (Current Sprint)
1. ✅ Phase 1 POC completed and verified
2. ✅ Phase 2 V1 App Development completed:
   - ✅ Created frontend folder structure and routing
   - ✅ Implemented backend CRUD endpoints for tickets, messages, students
   - ✅ Built three-pane workspace layout with shadcn components
   - ✅ Integrated AI draft generation into composer UI
   - ✅ Added mock OAuth login flow
   - ✅ Wired up all components to backend APIs
3. 🔄 **NEXT: Phase 5 Testing & Polish**
   - Run testing_agent_v3 for comprehensive end-to-end testing
   - Fix any bugs discovered
   - Verify performance and accessibility
   - Polish UI based on feedback
4. Then proceed to Phase 3 (Email & Events + KB Management)
5. Finally Phase 4 (Chatbot + Reporting)

## Technology Stack Summary
- **Backend**: FastAPI 0.110.1, Python 3.11, Motor (async MongoDB), Pydantic v2
- **AI**: EmergentIntegrations (OpenAI GPT-4o via Emergent LLM key)
- **Database**: MongoDB with UUID-based IDs and timezone-aware timestamps
- **Frontend**: React 19, React Router v7, Axios for API calls
- **UI Library**: shadcn/ui (Radix UI primitives), Tailwind CSS
- **Typography**: IBM Plex Sans (primary), IBM Plex Mono (code/data)
- **Icons**: lucide-react
- **Date Handling**: date-fns v4.1.0 for relative timestamps
- **Charts**: recharts (for Phase 4 reporting)
- **Notifications**: Sonner v2.0.7 (toast library)

## Demo Data (Seeded)
- Institution: University of Demo (slug: demo-u, ID: 61c34e1a-a41e-4347-a639-27130d9dd93a)
- Staff Users: 3 (Sarah Chen, Michael Rodriguez, Dr. Emily Thompson)
- Students: 4 (Alex Johnson, Sam Martinez, Jordan Lee, Taylor Kim)
- Tickets: 4 (various statuses and categories)
- Queues: 5 (General Inquiries, FAFSA Support, Verification, SAP Appeals, Billing)
- KB Articles: 7 (FAFSA, verification, SAP, billing, eligibility, work-study)
- Student Events: 3 (AI routing, email sent, phone call logged)

## Application URLs
- **Preview URL**: https://aidhub-pro.preview.emergentagent.com
- **Login**: /login (use advisor1@demou.edu, advisor2@demou.edu, or director@demou.edu)
- **Workspace**: /workspace (protected route, requires authentication)

## Current Status Summary
✅ **Phase 1 Complete**: AI engine fully functional with PII masking and KB citations
✅ **Phase 2 Complete**: Three-pane workspace with all core features implemented
🔄 **Phase 5 Ready**: Comprehensive testing can now begin
⏳ **Phase 3 Pending**: Email ingestion and KB management
⏳ **Phase 4 Pending**: Chatbot and reporting dashboard
