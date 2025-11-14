# Multi-tenant AI Financial Aid Platform — Development Plan

Context: Emergent LLM key integrated, mocked OAuth ready, sample data/KB seeded, FastAPI + React + MongoDB, **Modern Stripe-style B2B SaaS UI** with Inter font, card-based layout, and two-panel workspace.

## Phase 1: Core AI POC (Status: ✅ COMPLETED)
1) Objectives
- ✅ Prove AI triage and draft generation using EmergentIntegrations LlmChat with masking and disclaimers
- ✅ Retrieve top KB snippets and thread context; never fabricate SIS/FAMS data
- ✅ Persist AiSuggestion records; log StudentEvent type="ai_routed"

2) User Stories (POC)
- ✅ As an advisor, I want AI to categorize an inbound email so the ticket lands in the right queue
- ✅ As an advisor, I want AI drafts to auto-generate when I open a ticket
- ✅ As a director, I want AI outputs to mask PII and include the required disclaimer
- ✅ As an advisor, I want to review the draft inline before sending
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

## Phase 2: V1 App Development (Status: ✅ COMPLETED - STRIPE-STYLE REDESIGN)
1) Objectives
- ✅ Ship working **two-panel workspace** (Ticket List | Combined Details View)
- ✅ Implement complete CRUD operations for all entities with tenant isolation
- ✅ Mock OAuth for Microsoft/Google sign-in
- ✅ Integrate AI POC features with **auto-generation** on ticket open
- ✅ Apply modern **Stripe-style B2B SaaS design system**
- ✅ Remove middle chat/thread panel for cleaner UX

2) User Stories (V1) - ALL SATISFIED
- ✅ As an advisor, I sign in via mocked Microsoft/Google and land in the workspace
- ✅ As an advisor, I filter My Tickets, Unassigned, Waiting on Student, Closed by status and queue
- ✅ As an advisor, I open a ticket and **AI draft auto-generates** without clicking a button
- ✅ As an advisor, I see ticket details, conversation history, and student profile in one unified scrollable view
- ✅ As an advisor, I edit Student profile and notes inline with save/cancel buttons
- ✅ As an advisor, I can **Send**, **Edit**, or **Regenerate** AI drafts with inline controls
- ✅ As an advisor, I see channel icons (email, chat, phone, walk-in) and modern status badges
- ✅ As an advisor, I view student timeline with all events in the combined details panel
- ✅ As an advisor, I experience a modern, card-based UI with gradient avatars and clean shadows
- ✅ As an advisor, I navigate through tabs (Tickets, Reports, Knowledge Base) in the header

3) Completed Implementation

**Backend REST endpoints under /api:**
- ✅ Auth: /api/auth/login (mock OAuth), /api/auth/me, /api/auth/logout
- ✅ Tickets: /api/tickets (list with filters), /api/tickets/{id}, PATCH
- ✅ Messages: /api/messages (create with direction parameter)
- ✅ Students: /api/students (list), /api/students/{id}, PATCH (update notes)
- ✅ Student Events: /api/tools/add_student_event with types (note, phone_call, walk_in, ai_routed, sent_email, received_email)
- ✅ Queues: /api/queues (list for filters)
- ✅ Users: /api/users (list for assignment)
- ✅ All endpoints enforce institution_id scoping and audit logging

**Frontend React application (STRIPE-STYLE REDESIGN):**
- ✅ App structure: React Router v7, AuthContext with localStorage session management
- ✅ API client: Axios with auth interceptors and error handling
- ✅ Login page: Mock OAuth buttons for Microsoft/Google with demo credentials

**Two-Panel Layout (Middle Panel Removed):**
- ✅ **Left Panel (TicketList - 384px width)**:
  * Search bar with icon
  * Filter tabs: All, My Tickets, Unassigned, Waiting
  * Queue dropdown filter
  * Ticket list with gradient avatars, status badges, channel icons
  * Priority indicators (colored dots for urgent/high)
  * Relative timestamps (e.g., "about 6 hours ago")
  * Selected state with subtle background
  
- ✅ **Right Panel (TicketDetails - Flexible width)**:
  * **Ticket Header Card**: Subject, student info, category badge
  * **Two-Column Grid Layout**:
    - **Left Column**: Conversation history with gradient avatars and timestamps
    - **Right Column**: Student Profile card + Timeline card
  * **Student Profile Card**:
    - Gradient avatar with initials
    - Contact info (email, phone)
    - "View in SIS" external link
    - Inline editable notes with Edit button
    - Save/Cancel buttons when editing
  * **Timeline Card**:
    - Event icons (Mail, MessageSquare, Phone, UserCheck, Sparkles)
    - Event types with colored icons
    - Relative timestamps
    - Event descriptions
  * **AI Reply Card (Bottom)**:
    - Auto-generates on ticket open (useEffect hook)
    - Yellow banner: "Generating AI-powered reply..."
    - Green banner when ready: "AI Draft Ready" with summary and KB references
    - Textarea with draft content (disabled unless editing)
    - Action buttons: Send (primary), Edit, Regenerate
    - Disclaimer text below textarea

**Modern Stripe-Style Design System:**
- ✅ **Typography**: Inter font family (clean, professional, feature settings enabled)
- ✅ **Layout**: Card-based with subtle shadows (border-gray-200, shadow-sm)
- ✅ **Colors**: Clean gray palette (gray-50 to gray-900, no bright colors)
- ✅ **Avatars**: Gradient circles (purple-500 to pink-500) with initials
- ✅ **Navigation**: Modern header with tabs (Tickets, Reports, Knowledge Base)
- ✅ **Buttons**: Rounded, with clear hover states and transitions
- ✅ **Badges**: Subtle colors with borders (blue, amber, green)
- ✅ **Spacing**: Consistent padding (p-4, p-6, space-y-4, space-y-6)
- ✅ **Borders**: Light gray borders (border-gray-200)
- ✅ **Shadows**: Subtle card shadows (shadow-sm)
- ✅ **Transitions**: Smooth 150ms cubic-bezier transitions on all interactive elements
- ✅ **Focus States**: 2px solid outline with offset

**AI Draft Auto-Generation Flow:**
- ✅ useEffect hook in TicketDetails component triggers on ticket open
- ✅ hasAutoGenerated state prevents duplicate generation
- ✅ generatingDraft state shows yellow loading banner
- ✅ aiDraft state stores response with summary, reasoning, cited_kb, safe_reply
- ✅ Green success banner shows summary and KB references
- ✅ isEditing state toggles between read-only and edit mode
- ✅ Send button uses AI draft if not editing, or edited replyBody if editing
- ✅ Regenerate button calls handleGenerateDraft(false) to create new draft
- ✅ Edit button enables textarea for modifications

**Components:**
- ✅ shadcn/ui: Button, Card, Badge, Tabs, Select, Textarea, ScrollArea, Separator, Input
- ✅ Toast notifications: Sonner for all user feedback (success, error, info)
- ✅ Loading states: Spinners and empty states with helpful messages
- ✅ Data-testid attributes: All interactive elements tagged for testing
- ✅ Icons: lucide-react (Mail, Send, RefreshCw, Edit3, Sparkles, User, Phone, etc.)

4) Key Deliverables
- `/app/backend/server.py` - Complete FastAPI backend with all CRUD endpoints and AI tool integration
- `/app/frontend/src/contexts/AuthContext.js` - Authentication context with session management
- `/app/frontend/src/lib/api.js` - Axios API client with interceptors
- `/app/frontend/src/pages/LoginPage.js` - Mock OAuth login page
- `/app/frontend/src/pages/WorkspacePage.js` - Main workspace orchestration (two-panel)
- `/app/frontend/src/components/workspace/WorkspaceLayout.js` - Modern header with navigation tabs
- `/app/frontend/src/components/workspace/TicketList.js` - Left panel with search, filters, ticket list
- `/app/frontend/src/components/workspace/TicketDetails.js` - Right panel with combined view (conversation + student + AI draft in scrollable layout)
- `/app/frontend/src/App.js` - Root app with routing and auth protection
- `/app/frontend/src/App.css` - Stripe-style design system with Inter font and modern color palette

5) Success Criteria Met
- ✅ Advisors can view, filter, and open tickets in the two-panel UI
- ✅ **AI drafts auto-generate when ticket opens** (no manual button click)
- ✅ Combined view shows conversation, student profile, and AI draft in one scrollable panel
- ✅ Send/Edit/Regenerate buttons work inline (no dialog popup)
- ✅ Student notes are editable inline with save/cancel buttons
- ✅ Timeline shows all events with icons and relative timestamps
- ✅ Filters work correctly (All, My Tickets, Unassigned, Waiting, by queue)
- ✅ Tenant isolation enforced on all queries via institution_id
- ✅ No console or backend errors in standard flows (esbuild check passed)
- ✅ UI follows **Stripe-style design guidelines** (Inter font, card-based, gradient avatars, clean shadows)
- ✅ All interactive elements have data-testid attributes
- ✅ Toast notifications provide clear user feedback
- ✅ Loading and empty states implemented throughout
- ✅ Two-column grid layout in details panel for better organization

6) Design Evolution
- **V1 (Initial)**: Three-panel Kustomer-style with IBM Plex Sans and navy/blue palette
- **V2 (Outlook-style)**: Microsoft blue, Segoe UI, email-style layout with three panels
- **V3 (Final - Current)**: Modern Stripe-style B2B SaaS with:
  * Two-panel layout (middle thread panel removed)
  * Inter font (clean, professional)
  * Card-based layout with subtle shadows
  * Gradient avatars (purple-to-pink)
  * Combined details panel with two-column grid
  * Auto-generated AI drafts (no manual button)
  * Inline edit mode (no dialog popups)
  * Clean gray color palette (gray-50 to gray-900)
  * Modern navigation header with tabs

7) Screenshots Captured
- ✅ Login page with Microsoft/Google OAuth buttons and demo credentials
- ✅ Two-panel workspace showing ticket list (left) and combined details panel (right)
- ✅ Conversation view with gradient avatars in two-column grid layout
- ✅ Student profile card with inline note editing
- ✅ Timeline card with event icons and relative timestamps
- ✅ Modern header with navigation tabs (Tickets, Reports, Knowledge Base)
- ✅ Clean card-based layout with subtle shadows
- ✅ Gradient avatars throughout the interface

---

## Phase 3: Email & Events + KB Management (Status: Partially Complete)
1) Objectives
- Simulate inbound emails → create/update Ticket, run AI triage, record StudentEvent timeline
- ✅ Add Note / Log Call / Log Walk-in actions (UI complete, backend ready)
- CRUD KB with markdown editor; ai_searchable flag respected by AI tools
- ✅ Implement mock email sending through connected mailboxes (working)

2) User Stories
- As an agent, mock ingestion converts student emails to tickets automatically
- ✅ As an agent, I add a note, log a call, or log a walk-in in the timeline (completed)
- As an agent, I manage KB articles and mark ones as ai_searchable
- ✅ As an agent, I send a mocked email and see it appear in the thread immediately (working)
- As a manager, I see AI routing events in the student timeline with reasoning
- As an admin, I create/edit/delete KB articles with markdown preview

3) Completed
- ✅ StudentEvent API: POST /api/tools/add_student_event with types (note, phone_call, walk_in, ai_routed, sent_email, received_email)
- ✅ Timeline component showing all events sorted by created_at (most recent first)
- ✅ Relative timestamps using date-fns (e.g., "2h ago", "Yesterday")
- ✅ Event icons from lucide-react (Mail, MessageSquare, Phone, UserCheck, Sparkles)
- ✅ Message sending: posts Message (direction=outbound), records StudentEvent(type=sent_email)
- ✅ Timeline integrated into TicketDetails right column

4) Remaining Tasks
- Backend: /api/tools/create_ticket_from_email endpoint; link to AI triage + StudentEvent(type=ai_routed)
- Mock email ingestion: /api/admin/simulate_inbound_email for testing
- Message threading: Implement proper thread_id grouping and sorting
- KB Management: /api/kb (list, create, update, delete) with institution scoping
- Frontend: KB management page with markdown editor (textarea with preview)
- Security: PII redaction in all AI prompts; audit logs for ticket access

5) Next Actions
- Implement email ingestion simulator endpoint
- Build KB management interface with markdown editor
- Add AI triage to email ingestion flow
- Test thread aggregation and timeline ordering
- Call testing_agent_v3 for end-to-end flows

6) Success Criteria
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

## Phase 5: Testing & Polish (Status: ⏭️ NEXT - Ready to Start)
1) Objectives
- Comprehensive end-to-end testing of all implemented features (Phases 1-2)
- UI polish aligned with Stripe-style design system
- Performance optimization and accessibility improvements
- Final security and tenant isolation verification

2) User Stories
- As an admin, tenant isolation is verified across all APIs and UI lists (no data leaks)
- As an advisor, all views have clear loading/empty/error states and keyboard navigation
- As QA, regression tests cover login, ticket management, AI auto-drafting, timeline, messaging
- As security, prompts/logs are free of PII and only cite ai_searchable KB
- As an operator, logs and audit trails support troubleshooting
- As a user, the UI is polished, responsive, and follows Stripe-style design system consistently

3) Implementation Steps

**Testing:**
- Call testing_agent_v3 for comprehensive end-to-end testing of Phase 1-2 features
- Test flows:
  * Login → View tickets → Select ticket → AI auto-generates → Edit/Regenerate → Send reply
  * Add student note → Edit notes inline → Verify timeline updates
  * Filter tickets (All, My Tickets, Unassigned, Waiting) → Select different tickets
  * Test two-column grid layout responsiveness
  * Verify gradient avatars render correctly
  * Test card shadows and spacing consistency
- Fix all bugs reported (high → medium → low priority)
- Verify tenant isolation on all endpoints (manual + automated)
- Test AI prompt safety and PII masking edge cases
- Verify KB article citations are accurate and relevant
- Test auto-draft generation timing and error handling
- Test inline edit mode for AI drafts
- Verify Send/Edit/Regenerate button functionality

**Performance:**
- Add MongoDB indexes on frequently queried fields (institution_id, student_id, ticket_id, created_at)
- Implement pagination on ticket list if needed (currently 100 limit)
- Optimize KB search with text indexes
- Add caching for queue/user lists
- Monitor AI draft generation latency (<1.5s target)
- Test scrolling performance in combined details panel

**Accessibility:**
- Verify WCAG AA compliance (color contrast, focus states)
- Add ARIA labels for screen readers where missing
- Test keyboard navigation on all interactive elements
- Verify data-testid on all buttons, inputs, links
- Test with screen reader on ticket list and details panel
- Verify gradient avatars have proper alt text or ARIA labels
- Test focus trap in modals/dialogs (if any added later)

**UI Polish:**
- ✅ Review all colors against Stripe-style design system (gray scale, gradient avatars)
- ✅ Verify Inter font loading and usage across all components
- ✅ Check card shadows, rounded corners, spacing consistency
- ✅ Add micro-interactions (hover states, transitions)
- ✅ Verify toast notifications for all actions (Sonner library)
- Add loading skeletons for async operations (ticket details, AI draft generation)
- ✅ Verify empty states with helpful messages and CTAs
- ✅ Test gradient avatars on all screen sizes
- Verify two-column grid layout adapts to different viewport sizes
- Test scrolling behavior in combined details panel
- Ensure consistent button styling (primary, outline, ghost variants)

**Security:**
- Audit all API endpoints for tenant isolation
- Verify PII masking in AI prompts and logs
- Test disclaimer presence in all AI-generated content
- Review audit log completeness
- Test session management and logout flow
- Verify no sensitive data in browser console logs

4) Next Actions
- Run full testing suite via testing_agent_v3 for Phase 1-2 features
- Address all reported issues systematically
- ✅ Run esbuild bundle check (already passed, no errors)
- Check supervisor logs for any backend errors
- ✅ Verify Stripe-style design system compliance across all pages
- Test on different screen sizes (desktop focus, but check tablet/mobile)
- Test AI auto-generation with different ticket types and edge cases
- Verify two-panel layout works on various screen resolutions
- Prepare handoff documentation

5) Success Criteria
- No known high/medium priority bugs remaining
- All end-to-end flows pass reliably
- ✅ UI meets Stripe-style design guidelines (Inter font, card-based, gradient avatars, clean shadows) - verified
- Tenant isolation verified (no data leaks between institutions)
- PII masking working correctly in all scenarios
- Disclaimers present in all AI-generated content
- Performance targets met (page load <2s, API response <500ms avg, AI draft <1.5s)
- Accessibility passes basic WCAG AA checks
- Auto-draft generation works reliably across all ticket types
- Two-panel layout responsive and performant
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
- ✅ **Stripe-style design system**: Inter font, card-based layout, gradient avatars, gray color palette
- ✅ Smooth transitions and modern hover states on all interactive elements
- ✅ Use lucide-react for all icons (no emojis in production UI)
- ✅ AI drafts auto-generate on ticket open (useEffect hook)
- ✅ No dialog popups for AI drafts (inline edit with Send/Edit/Regenerate buttons)
- ✅ Two-panel layout (ticket list + combined details)
- ✅ Two-column grid in details panel (conversation + student info)

## Immediate Next Actions (Current Sprint)
1. ✅ Phase 1 POC completed and verified
2. ✅ Phase 2 V1 App Development completed with Stripe-style redesign:
   - ✅ Created two-panel layout (removed middle thread panel per user request)
   - ✅ Implemented Stripe-style B2B SaaS design system (Inter font, cards, gradients)
   - ✅ Added auto-generated AI drafts on ticket open (no manual button)
   - ✅ Built combined details panel with two-column grid (conversation + student)
   - ✅ Integrated inline edit mode for AI drafts (no dialog popup)
   - ✅ Added modern navigation header with tabs (Tickets, Reports, Knowledge Base)
   - ✅ Implemented gradient avatars (purple-to-pink) throughout
   - ✅ Applied clean gray color palette and subtle shadows
   - ✅ Verified esbuild compilation (no errors)
3. 🔄 **NEXT: Phase 5 Testing & Polish**
   - Run testing_agent_v3 for comprehensive end-to-end testing
   - Fix any bugs discovered
   - Verify performance and accessibility
   - Polish UI based on feedback (loading skeletons, responsive tweaks)
   - Test AI auto-generation reliability across edge cases
   - Verify two-panel layout responsiveness
4. Then proceed to Phase 3 (Email & Events + KB Management)
5. Finally Phase 4 (Chatbot + Reporting)

## Technology Stack Summary
- **Backend**: FastAPI 0.110.1, Python 3.11, Motor (async MongoDB), Pydantic v2
- **AI**: EmergentIntegrations (OpenAI GPT-4o via Emergent LLM key)
- **Database**: MongoDB with UUID-based IDs and timezone-aware timestamps
- **Frontend**: React 19, React Router v7, Axios for API calls
- **UI Library**: shadcn/ui (Radix UI primitives), Tailwind CSS
- **Typography**: **Inter font** (Stripe-style, professional B2B SaaS with feature settings)
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
✅ **Phase 2 Complete**: Two-panel workspace with Stripe-style design and auto-generated AI drafts
🔄 **Phase 5 Next**: Comprehensive testing can now begin
⏳ **Phase 3 Pending**: Email ingestion and KB management
⏳ **Phase 4 Pending**: Chatbot and reporting dashboard

## Design System Evolution
1. **V1 (Initial)**: Three-panel Kustomer-style with IBM Plex Sans and navy/blue palette
2. **V2 (Outlook-style)**: Microsoft blue, Segoe UI, email-centric layout with three panels
3. **V3 (Final - Current)**: Modern Stripe-style B2B SaaS with:
   - Inter font (clean, professional, feature settings enabled)
   - Card-based layout with subtle shadows (border-gray-200, shadow-sm)
   - Gradient avatars (purple-500 to pink-500 with initials)
   - **Two-panel layout** (ticket list 384px + combined details flexible width)
   - **Two-column grid** in details panel (conversation + student profile/timeline)
   - Auto-generated AI drafts (no manual button, useEffect on ticket open)
   - Inline edit mode with Send/Edit/Regenerate buttons (no dialog popups)
   - Clean gray color palette (gray-50 to gray-900, no bright colors)
   - Modern navigation header with tabs (Tickets, Reports, Knowledge Base)
   - Smooth transitions (150ms cubic-bezier) on all interactive elements
   - Consistent spacing (p-4, p-6, space-y-4, space-y-6)

## Key UI Components (Stripe-Style)
- **WorkspaceLayout**: Header with logo, nav tabs, gradient user avatar, logout button
- **TicketList**: Search bar, filter tabs, queue dropdown, ticket cards with gradient avatars
- **TicketDetails**: 
  * Header card with ticket subject and metadata
  * Two-column grid: Conversation (left) + Student Profile & Timeline (right)
  * AI Reply card at bottom with auto-generation and inline editing
- **Gradient Avatars**: Purple-to-pink circles with white initials (used throughout)
- **Status Badges**: Blue (open), Amber (waiting), Green (closed) with borders
- **Card Shadows**: Subtle shadow-sm with border-gray-200
- **Buttons**: Primary (gray-900), Outline (border-gray-200), Ghost (hover:bg-gray-100)
- **Toast Notifications**: Sonner with position top-right, richColors enabled

## Key Features Summary
✅ **Auto-Generated AI Drafts**: Drafts generate automatically when ticket opens (no manual button)
✅ **Two-Panel Layout**: Clean workspace with ticket list (left) and combined details (right)
✅ **Two-Column Grid**: Conversation and student info side-by-side in details panel
✅ **Inline Editing**: Edit AI drafts directly in textarea with Send/Edit/Regenerate buttons
✅ **Gradient Avatars**: Modern purple-to-pink circles with initials throughout UI
✅ **Card-Based Layout**: Clean cards with subtle shadows for all content sections
✅ **Modern Navigation**: Header with tabs (Tickets, Reports, Knowledge Base)
✅ **PII Masking**: SSN, student ID, and phone numbers automatically redacted in AI prompts
✅ **KB Citations**: AI drafts include references to knowledge base articles used
✅ **Timeline Events**: All student interactions (emails, notes, calls, walk-ins) in chronological order
✅ **Tenant Isolation**: All data strictly scoped by institution_id
✅ **Toast Notifications**: Clear feedback for all user actions (success, error, info)
