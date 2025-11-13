# University Financial Aid Platform - Design System Guidelines

## Executive Summary

This design system creates a professional, trustworthy, and efficient three-pane workspace interface for university financial aid staff. Inspired by Kustomer's clean, modern approach, this system prioritizes clarity, data density, and desktop-optimized workflows while maintaining accessibility and visual hierarchy.

---

## GRADIENT RESTRICTION RULE

**CRITICAL: Read and follow these gradient rules strictly**

- NEVER use dark/saturated gradient combos (e.g., purple/pink, blue-500 to purple-600) on any UI element
- NEVER let gradients cover more than 20% of the viewport
- NEVER apply gradients to text-heavy content or reading areas
- NEVER use gradients on small UI elements (<100px width)
- NEVER stack multiple gradient layers in the same viewport

**ENFORCEMENT RULE:**
IF gradient area exceeds 20% of viewport OR impacts readability
THEN fallback to solid colors or simple, two-color gradients

**ALLOWED GRADIENT USAGE:**
- Hero/landing sections (background only, ensure text readability)
- Section backgrounds (not content blocks)
- Large CTA buttons / major interactive elements (light/simple gradients only)
- Decorative overlays and accent visuals

---

## Design Personality & Brand Attributes

**Core Attributes:**
- **Professional**: Clean, organized, enterprise-grade interface
- **Trustworthy**: Stable colors, clear hierarchy, secure feeling
- **Efficient**: Optimized for speed, minimal clicks, keyboard shortcuts
- **Accessible**: WCAG AA compliant, high contrast, clear focus states
- **Modern**: Contemporary design patterns without being trendy

**Visual Tone:**
- Clean and uncluttered
- Data-dense but scannable
- Subtle depth through shadows and borders
- Professional without being sterile
- Warm neutrals to soften the technical interface

---

## Color System

### Primary Palette

```css
/* Primary - Trust & Stability */
--primary-navy: #003366;        /* Main brand color, headers, primary actions */
--primary-blue: #0066CC;        /* Interactive elements, links, focus states */
--primary-blue-light: #3399FF;  /* Hover states, active selections */
--primary-blue-pale: #E6F2FF;   /* Backgrounds, subtle highlights */

/* Secondary - Professional Accents */
--secondary-slate: #475569;     /* Secondary text, icons */
--secondary-gray: #64748B;      /* Tertiary text, disabled states */
--secondary-gray-light: #94A3B8; /* Borders, dividers */

/* Neutral - Backgrounds & Surfaces */
--neutral-white: #FFFFFF;       /* Card backgrounds, main surfaces */
--neutral-gray-50: #F8FAFC;     /* Page background */
--neutral-gray-100: #F1F5F9;    /* Hover backgrounds, secondary surfaces */
--neutral-gray-200: #E2E8F0;    /* Borders, dividers */
--neutral-gray-300: #CBD5E1;    /* Disabled backgrounds */

/* Semantic Colors */
--success-green: #10B981;       /* Success states, positive actions */
--success-green-light: #D1FAE5; /* Success backgrounds */
--warning-amber: #F59E0B;       /* Warnings, pending states */
--warning-amber-light: #FEF3C7; /* Warning backgrounds */
--error-red: #EF4444;           /* Errors, destructive actions */
--error-red-light: #FEE2E2;     /* Error backgrounds */
--info-blue: #3B82F6;           /* Info messages, tips */
--info-blue-light: #DBEAFE;     /* Info backgrounds */

/* Status Colors for Tickets */
--status-open: #3B82F6;         /* Open tickets */
--status-waiting: #F59E0B;      /* Waiting on student */
--status-closed: #10B981;       /* Closed tickets */
--status-unassigned: #6B7280;   /* Unassigned tickets */

/* Channel Colors (Subtle) */
--channel-email: #0066CC;       /* Email icon */
--channel-chat: #10B981;        /* Chat icon */
--channel-phone: #8B5CF6;       /* Phone icon */
--channel-walkin: #F59E0B;      /* Walk-in icon */
```

### Color Usage Guidelines

**Background Hierarchy:**
1. Page background: `--neutral-gray-50` (#F8FAFC)
2. Card/Panel background: `--neutral-white` (#FFFFFF)
3. Hover states: `--neutral-gray-100` (#F1F5F9)
4. Selected states: `--primary-blue-pale` (#E6F2FF)

**Text Hierarchy:**
1. Primary text: `--primary-navy` (#003366)
2. Secondary text: `--secondary-slate` (#475569)
3. Tertiary text: `--secondary-gray` (#64748B)
4. Disabled text: `--secondary-gray-light` (#94A3B8)

**Interactive Elements:**
- Default: `--primary-blue` (#0066CC)
- Hover: `--primary-blue-light` (#3399FF)
- Active/Pressed: `--primary-navy` (#003366)
- Focus ring: `--primary-blue` with 3px offset

**Contrast Requirements:**
- All text must meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- Interactive elements must have 3:1 contrast with adjacent colors
- Focus indicators must have 3:1 contrast with background

---

## Typography System

### Font Families

```css
/* Primary Font - IBM Plex Sans (Professional, Corporate) */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&display=swap');

/* Secondary Font - IBM Plex Mono (Code, Data) */
@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&display=swap');

--font-primary: 'IBM Plex Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
--font-mono: 'IBM Plex Mono', 'Courier New', monospace;
```

**Why IBM Plex Sans:**
- Designed for enterprise applications
- Excellent readability at all sizes
- Professional without being cold
- Great for data-dense interfaces
- Strong number rendering for financial data

### Typography Scale

```css
/* Font Sizes */
--text-xs: 0.75rem;      /* 12px - Timestamps, metadata */
--text-sm: 0.875rem;     /* 14px - Secondary text, labels */
--text-base: 1rem;       /* 16px - Body text, default */
--text-lg: 1.125rem;     /* 18px - Emphasized text */
--text-xl: 1.25rem;      /* 20px - Section headers */
--text-2xl: 1.5rem;      /* 24px - Page titles */
--text-3xl: 1.875rem;    /* 30px - Main headings */
--text-4xl: 2.25rem;     /* 36px - Hero text (rare) */

/* Line Heights */
--leading-tight: 1.25;   /* Headings */
--leading-snug: 1.375;   /* Subheadings */
--leading-normal: 1.5;   /* Body text */
--leading-relaxed: 1.625; /* Long-form content */

/* Font Weights */
--font-normal: 400;      /* Body text */
--font-medium: 500;      /* Emphasized text */
--font-semibold: 600;    /* Subheadings */
--font-bold: 700;        /* Headings */

/* Letter Spacing */
--tracking-tight: -0.025em;  /* Large headings */
--tracking-normal: 0;        /* Body text */
--tracking-wide: 0.025em;    /* Labels, buttons */
```

### Typography Usage

**Headings:**
```css
/* H1 - Page Title */
.h1 {
  font-size: var(--text-2xl);      /* 24px */
  font-weight: var(--font-bold);   /* 700 */
  line-height: var(--leading-tight);
  color: var(--primary-navy);
  letter-spacing: var(--tracking-tight);
}

/* H2 - Section Header */
.h2 {
  font-size: var(--text-xl);       /* 20px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-snug);
  color: var(--primary-navy);
}

/* H3 - Subsection Header */
.h3 {
  font-size: var(--text-lg);       /* 18px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-snug);
  color: var(--secondary-slate);
}

/* H4 - Card Header */
.h4 {
  font-size: var(--text-base);     /* 16px */
  font-weight: var(--font-semibold); /* 600 */
  line-height: var(--leading-normal);
  color: var(--secondary-slate);
}
```

**Body Text:**
```css
/* Body - Default */
.body {
  font-size: var(--text-base);     /* 16px */
  font-weight: var(--font-normal); /* 400 */
  line-height: var(--leading-normal);
  color: var(--secondary-slate);
}

/* Body Small - Secondary */
.body-sm {
  font-size: var(--text-sm);       /* 14px */
  font-weight: var(--font-normal); /* 400 */
  line-height: var(--leading-normal);
  color: var(--secondary-gray);
}

/* Caption - Metadata */
.caption {
  font-size: var(--text-xs);       /* 12px */
  font-weight: var(--font-normal); /* 400 */
  line-height: var(--leading-normal);
  color: var(--secondary-gray);
}
```

**Special Text:**
```css
/* Label - Form Labels, Tags */
.label {
  font-size: var(--text-sm);       /* 14px */
  font-weight: var(--font-medium); /* 500 */
  line-height: var(--leading-normal);
  color: var(--secondary-slate);
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

/* Code - IDs, Technical Data */
.code {
  font-family: var(--font-mono);
  font-size: var(--text-sm);       /* 14px */
  font-weight: var(--font-normal); /* 400 */
  color: var(--secondary-slate);
  background: var(--neutral-gray-100);
  padding: 0.125rem 0.375rem;
  border-radius: 0.25rem;
}
```

---

## Spacing System

### Spacing Scale

```css
/* Spacing tokens based on 4px base unit */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */
```

### Spacing Usage

**Component Spacing:**
- Tight spacing (within components): `--space-2` to `--space-3` (8-12px)
- Default spacing (between elements): `--space-4` (16px)
- Section spacing (between sections): `--space-6` to `--space-8` (24-32px)
- Page spacing (major sections): `--space-12` to `--space-16` (48-64px)

**Layout Spacing:**
- Inbox list item padding: `--space-3` `--space-4` (12px 16px)
- Card padding: `--space-6` (24px)
- Panel padding: `--space-6` (24px)
- Page margins: `--space-6` (24px)

---

## Border Radius System

```css
/* Border Radius */
--radius-none: 0;
--radius-sm: 0.25rem;    /* 4px - Small elements */
--radius-md: 0.375rem;   /* 6px - Default, buttons, inputs */
--radius-lg: 0.5rem;     /* 8px - Cards, panels */
--radius-xl: 0.75rem;    /* 12px - Large cards */
--radius-2xl: 1rem;      /* 16px - Modals */
--radius-full: 9999px;   /* Circular - Avatars, pills */
```

**Usage:**
- Buttons, inputs, badges: `--radius-md` (6px)
- Cards, panels: `--radius-lg` (8px)
- Modals, dialogs: `--radius-xl` (12px)
- Avatars: `--radius-full`

---

## Shadow System

```css
/* Shadows for depth and elevation */
--shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
--shadow-2xl: 0 25px 50px -12px rgba(0, 0, 0, 0.25);

/* Focus shadow */
--shadow-focus: 0 0 0 3px rgba(0, 102, 204, 0.2);
```

**Usage:**
- Cards: `--shadow-sm`
- Dropdowns, popovers: `--shadow-md`
- Modals: `--shadow-xl`
- Focus states: `--shadow-focus`

---

## Component Library

### Shadcn/UI Components to Use

**Primary Components (from `/app/frontend/src/components/ui/`):**

1. **Layout Components:**
   - `resizable.jsx` - For three-pane layout with adjustable widths
   - `scroll-area.jsx` - For scrollable inbox and ticket lists
   - `separator.jsx` - For dividing sections
   - `sheet.jsx` - For mobile drawer navigation

2. **Data Display:**
   - `card.jsx` - For ticket cards, student profile sections
   - `badge.jsx` - For status indicators, tags
   - `avatar.jsx` - For user profiles, student photos
   - `table.jsx` - For data tables in reporting
   - `tooltip.jsx` - For additional context on hover

3. **Form Components:**
   - `input.jsx` - For search, filters, form fields
   - `textarea.jsx` - For reply composer
   - `select.jsx` - For dropdowns (queue selection, filters)
   - `checkbox.jsx` - For multi-select filters
   - `radio-group.jsx` - For single-choice options
   - `switch.jsx` - For toggle settings
   - `calendar.jsx` - For date pickers
   - `label.jsx` - For form labels

4. **Navigation:**
   - `dropdown-menu.jsx` - For user menu, actions menu
   - `tabs.jsx` - For switching between views
   - `breadcrumb.jsx` - For navigation hierarchy
   - `command.jsx` - For command palette (Cmd+K)

5. **Feedback:**
   - `alert.jsx` - For system messages
   - `alert-dialog.jsx` - For confirmations
   - `dialog.jsx` - For modals
   - `sonner.jsx` - For toast notifications
   - `progress.jsx` - For loading states
   - `skeleton.jsx` - For loading placeholders

6. **Interactive:**
   - `button.jsx` - For all actions
   - `hover-card.jsx` - For preview on hover
   - `popover.jsx` - For contextual menus
   - `context-menu.jsx` - For right-click menus

### Additional Component Libraries

**Recharts (for Reporting Dashboard):**
```bash
npm install recharts
```

Components to use:
- `LineChart` - For trend analysis
- `BarChart` - For ticket volume by queue
- `PieChart` - For ticket status distribution
- `AreaChart` - For cumulative metrics

**React Email Editor (for Rich Text Composer):**
```bash
npm install react-quill
```

Use for the reply composer with formatting options.

**Date-fns (for Relative Timestamps):**
```bash
npm install date-fns
```

For formatting timestamps like "2h ago", "Yesterday", etc.

---

## Layout Patterns

### Three-Pane Workspace Layout

**Structure:**
```
┌─────────────────────────────────────────────────────────┐
│  Header (Fixed, 64px height)                            │
├──────────┬──────────────────────┬───────────────────────┤
│          │                      │                       │
│  Left    │   Center Pane        │   Right Pane          │
│  Pane    │   (Ticket Thread)    │   (Student Context)   │
│  (Inbox) │                      │                       │
│          │                      │                       │
│  280px   │   Flexible           │   360px               │
│  min     │   (grows)            │   min                 │
│          │                      │                       │
└──────────┴──────────────────────┴───────────────────────┘
```

**Implementation:**
- Use `resizable.jsx` from shadcn for adjustable pane widths
- Left pane: 280px min, 400px max, 320px default
- Center pane: Flexible, grows to fill space
- Right pane: 360px min, 480px max, 400px default
- All panes have independent scroll areas

**Responsive Behavior:**
- Desktop (>1280px): Show all three panes
- Tablet (768px-1280px): Show left + center, right pane as overlay
- Mobile (<768px): Stack vertically, use sheet for navigation

### Header Layout

```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  [Search Bar]           [Notifications] [User]  │
└─────────────────────────────────────────────────────────┘
```

**Specifications:**
- Height: 64px
- Background: `--neutral-white`
- Border bottom: 1px solid `--neutral-gray-200`
- Shadow: `--shadow-sm`
- Padding: `--space-4` `--space-6`

### Left Pane (Inbox)

**Structure:**
```
┌──────────────────┐
│  Filters         │
│  ┌────────────┐  │
│  │ My Tickets │  │
│  │ Unassigned │  │
│  │ Waiting    │  │
│  │ Closed     │  │
│  └────────────┘  │
│                  │
│  Queues          │
│  ┌────────────┐  │
│  │ General    │  │
│  │ Appeals    │  │
│  │ Loans      │  │
│  └────────────┘  │
│                  │
│  Ticket List     │
│  ┌────────────┐  │
│  │ [Ticket 1] │  │
│  │ [Ticket 2] │  │
│  │ [Ticket 3] │  │
│  └────────────┘  │
└──────────────────┘
```

**Ticket List Item:**
```jsx
<div className="ticket-item" data-testid="ticket-item-{id}">
  <div className="flex items-start gap-3 p-3 hover:bg-neutral-gray-100 cursor-pointer rounded-md">
    <Avatar size="sm" />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-sm truncate">Student Name</span>
        <Badge variant="status">{status}</Badge>
      </div>
      <p className="text-sm text-secondary-gray truncate mb-1">Subject line...</p>
      <div className="flex items-center gap-2 text-xs text-secondary-gray">
        <Icon name={channel} size={12} />
        <span>2h ago</span>
      </div>
    </div>
  </div>
</div>
```

### Center Pane (Ticket Thread)

**Structure:**
```
┌────────────────────────────────┐
│  Ticket Header                 │
│  [Subject] [Status] [Actions]  │
├────────────────────────────────┤
│                                │
│  Message Thread                │
│  ┌──────────────────────────┐  │
│  │ [Message 1]              │  │
│  │ [Message 2]              │  │
│  │ [Message 3]              │  │
│  └──────────────────────────┘  │
│                                │
├────────────────────────────────┤
│  Reply Composer                │
│  [Rich Text Editor]            │
│  [Send] [Attach] [Template]    │
└────────────────────────────────┘
```

**Message Bubble:**
```jsx
<div className="message" data-testid="message-{id}">
  <div className="flex gap-3 mb-4">
    <Avatar size="md" />
    <div className="flex-1">
      <div className="flex items-center gap-2 mb-1">
        <span className="font-semibold text-sm">Sender Name</span>
        <span className="text-xs text-secondary-gray">2 hours ago</span>
      </div>
      <div className="bg-neutral-white border border-neutral-gray-200 rounded-lg p-4">
        <p className="text-base text-secondary-slate">Message content...</p>
      </div>
    </div>
  </div>
</div>
```

### Right Pane (Student Context)

**Structure:**
```
┌────────────────────┐
│  Student Profile   │
│  [Photo]           │
│  [Name]            │
│  [ID] [Email]      │
├────────────────────┤
│  Quick Facts       │
│  • Year: Junior    │
│  • GPA: 3.5        │
│  • EFC: $5,000     │
├────────────────────┤
│  Notes             │
│  [Editable Notes]  │
├────────────────────┤
│  Timeline          │
│  • Event 1         │
│  • Event 2         │
│  • Event 3         │
└────────────────────┘
```

---

## Button System

### Button Variants

**Primary Button (Main Actions):**
```jsx
<button 
  className="btn-primary"
  data-testid="primary-action-button"
>
  Send Reply
</button>
```

```css
.btn-primary {
  background: var(--primary-blue);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: none;
  cursor: pointer;
  transition: background 0.2s, transform 0.1s;
}

.btn-primary:hover {
  background: var(--primary-blue-light);
}

.btn-primary:active {
  transform: scale(0.98);
}

.btn-primary:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

**Secondary Button (Alternative Actions):**
```css
.btn-secondary {
  background: var(--neutral-white);
  color: var(--primary-blue);
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: 1px solid var(--neutral-gray-200);
  cursor: pointer;
  transition: background 0.2s, border-color 0.2s;
}

.btn-secondary:hover {
  background: var(--neutral-gray-100);
  border-color: var(--neutral-gray-300);
}
```

**Ghost Button (Tertiary Actions):**
```css
.btn-ghost {
  background: transparent;
  color: var(--secondary-slate);
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-ghost:hover {
  background: var(--neutral-gray-100);
}
```

**Destructive Button (Delete, Close):**
```css
.btn-destructive {
  background: var(--error-red);
  color: white;
  padding: 0.625rem 1.25rem;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  border: none;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-destructive:hover {
  background: #DC2626;
}
```

**Button Sizes:**
```css
.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: var(--text-xs);
}

.btn-md {
  padding: 0.625rem 1.25rem;
  font-size: var(--text-sm);
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: var(--text-base);
}
```

---

## Badge System

### Badge Variants

**Status Badges:**
```jsx
<Badge variant="open" data-testid="status-badge">Open</Badge>
<Badge variant="waiting" data-testid="status-badge">Waiting</Badge>
<Badge variant="closed" data-testid="status-badge">Closed</Badge>
```

```css
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.625rem;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  line-height: 1;
}

.badge-open {
  background: var(--info-blue-light);
  color: var(--status-open);
}

.badge-waiting {
  background: var(--warning-amber-light);
  color: #D97706;
}

.badge-closed {
  background: var(--success-green-light);
  color: #059669;
}

.badge-unassigned {
  background: var(--neutral-gray-100);
  color: var(--status-unassigned);
}
```

**Priority Badges:**
```css
.badge-high {
  background: var(--error-red-light);
  color: var(--error-red);
}

.badge-medium {
  background: var(--warning-amber-light);
  color: #D97706;
}

.badge-low {
  background: var(--neutral-gray-100);
  color: var(--secondary-gray);
}
```

---

## Form Components

### Input Fields

```jsx
<div className="form-field">
  <label htmlFor="student-id" className="form-label">
    Student ID
  </label>
  <input
    id="student-id"
    type="text"
    className="form-input"
    placeholder="Enter student ID"
    data-testid="student-id-input"
  />
</div>
```

```css
.form-field {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  color: var(--secondary-slate);
  margin-bottom: var(--space-2);
}

.form-input {
  width: 100%;
  padding: 0.625rem 0.875rem;
  font-size: var(--text-sm);
  color: var(--secondary-slate);
  background: var(--neutral-white);
  border: 1px solid var(--neutral-gray-200);
  border-radius: var(--radius-md);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-input:hover {
  border-color: var(--neutral-gray-300);
}

.form-input:focus {
  outline: none;
  border-color: var(--primary-blue);
  box-shadow: var(--shadow-focus);
}

.form-input::placeholder {
  color: var(--secondary-gray-light);
}

.form-input:disabled {
  background: var(--neutral-gray-100);
  color: var(--secondary-gray-light);
  cursor: not-allowed;
}
```

### Search Input

```jsx
<div className="search-input" data-testid="search-input">
  <Icon name="search" className="search-icon" />
  <input
    type="search"
    placeholder="Search tickets..."
    className="search-field"
  />
  <kbd className="search-kbd">⌘K</kbd>
</div>
```

```css
.search-input {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 0.875rem;
  color: var(--secondary-gray);
  pointer-events: none;
}

.search-field {
  width: 100%;
  padding: 0.625rem 3rem 0.625rem 2.5rem;
  font-size: var(--text-sm);
  color: var(--secondary-slate);
  background: var(--neutral-gray-50);
  border: 1px solid var(--neutral-gray-200);
  border-radius: var(--radius-md);
  transition: background 0.2s, border-color 0.2s;
}

.search-field:focus {
  outline: none;
  background: var(--neutral-white);
  border-color: var(--primary-blue);
  box-shadow: var(--shadow-focus);
}

.search-kbd {
  position: absolute;
  right: 0.875rem;
  padding: 0.125rem 0.375rem;
  font-size: var(--text-xs);
  font-family: var(--font-mono);
  color: var(--secondary-gray);
  background: var(--neutral-white);
  border: 1px solid var(--neutral-gray-200);
  border-radius: var(--radius-sm);
}
```

---

## Icon System

### Icon Library

**Use Lucide React (already installed):**
```bash
npm install lucide-react
```

**Common Icons:**
```jsx
import {
  Mail,           // Email channel
  MessageSquare,  // Chat channel
  Phone,          // Phone channel
  User,           // Walk-in channel
  Search,         // Search
  Filter,         // Filters
  MoreVertical,   // Actions menu
  Send,           // Send reply
  Paperclip,      // Attachments
  Clock,          // Timestamp
  CheckCircle,    // Success
  AlertCircle,    // Warning
  XCircle,        // Error
  Info,           // Info
  ChevronDown,    // Dropdown
  ChevronRight,   // Expand
  Plus,           // Add
  X,              // Close
  Settings,       // Settings
  Bell,           // Notifications
  LogOut,         // Sign out
} from 'lucide-react';
```

**Icon Sizes:**
```css
.icon-xs { width: 12px; height: 12px; }
.icon-sm { width: 16px; height: 16px; }
.icon-md { width: 20px; height: 20px; }
.icon-lg { width: 24px; height: 24px; }
.icon-xl { width: 32px; height: 32px; }
```

**Channel Icons with Colors:**
```jsx
<Mail className="icon-sm" style={{ color: 'var(--channel-email)' }} />
<MessageSquare className="icon-sm" style={{ color: 'var(--channel-chat)' }} />
<Phone className="icon-sm" style={{ color: 'var(--channel-phone)' }} />
<User className="icon-sm" style={{ color: 'var(--channel-walkin)' }} />
```

---

## Motion & Animation

### Transition Tokens

```css
/* Transition durations */
--duration-fast: 150ms;
--duration-normal: 200ms;
--duration-slow: 300ms;

/* Transition timing functions */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
```

### Animation Guidelines

**DO:**
- Use transitions for hover states (background, border, color)
- Animate opacity for fade in/out
- Use transform for scale, translate effects
- Keep animations under 300ms for responsiveness

**DON'T:**
- Use `transition: all` (breaks transforms)
- Animate layout properties (width, height, margin)
- Use animations longer than 500ms
- Add animations to every element

**Common Transitions:**
```css
/* Button hover */
.btn {
  transition: background var(--duration-normal) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}

/* Card hover */
.card {
  transition: box-shadow var(--duration-normal) var(--ease-out);
}

/* Dropdown open */
.dropdown {
  transition: opacity var(--duration-fast) var(--ease-out),
              transform var(--duration-fast) var(--ease-out);
}
```

### Micro-interactions

**Button Press:**
```css
.btn:active {
  transform: scale(0.98);
}
```

**Card Hover:**
```css
.card:hover {
  box-shadow: var(--shadow-md);
}
```

**List Item Selection:**
```css
.list-item {
  transition: background var(--duration-fast) var(--ease-out);
}

.list-item:hover {
  background: var(--neutral-gray-100);
}

.list-item.selected {
  background: var(--primary-blue-pale);
  border-left: 3px solid var(--primary-blue);
}
```

---

## Accessibility Guidelines

### Focus States

**All interactive elements MUST have visible focus states:**
```css
*:focus-visible {
  outline: 2px solid var(--primary-blue);
  outline-offset: 2px;
}

/* Alternative focus style for buttons */
.btn:focus-visible {
  outline: none;
  box-shadow: var(--shadow-focus);
}
```

### Keyboard Navigation

**Required keyboard shortcuts:**
- `Cmd/Ctrl + K`: Open command palette
- `Cmd/Ctrl + /`: Focus search
- `Escape`: Close modals/dropdowns
- `Tab`: Navigate between elements
- `Enter`: Activate buttons/links
- `Space`: Toggle checkboxes/switches
- `Arrow keys`: Navigate lists

### Screen Reader Support

**All interactive elements must have:**
- Proper ARIA labels
- Role attributes
- State indicators (aria-expanded, aria-selected)

```jsx
<button
  aria-label="Send reply"
  aria-describedby="send-help-text"
  data-testid="send-button"
>
  Send
</button>
```

### Color Contrast

**Minimum contrast ratios (WCAG AA):**
- Normal text: 4.5:1
- Large text (18px+): 3:1
- UI components: 3:1

**Test all color combinations:**
- Primary text on white: ✓ Pass
- Secondary text on white: ✓ Pass
- Links on white: ✓ Pass
- Buttons: ✓ Pass

---

## Data Testid Conventions

### Naming Convention

Use kebab-case that describes the element's role:

```jsx
// Good
data-testid="login-form-submit-button"
data-testid="ticket-list-item-123"
data-testid="student-profile-name"

// Bad
data-testid="blueButton"
data-testid="div1"
data-testid="component"
```

### Required Testids

**Navigation:**
- `data-testid="main-nav"`
- `data-testid="user-menu"`
- `data-testid="notifications-button"`

**Inbox:**
- `data-testid="inbox-filter-{filter-name}"`
- `data-testid="ticket-list"`
- `data-testid="ticket-item-{id}"`

**Ticket Thread:**
- `data-testid="ticket-header"`
- `data-testid="message-{id}"`
- `data-testid="reply-composer"`
- `data-testid="send-button"`

**Student Context:**
- `data-testid="student-profile"`
- `data-testid="student-notes"`
- `data-testid="student-timeline"`

**Forms:**
- `data-testid="{field-name}-input"`
- `data-testid="{form-name}-submit"`
- `data-testid="{field-name}-error"`

---

## Image Assets

### Image URLs by Category

**Hero/Landing Section:**
- Students studying: `https://images.unsplash.com/photo-1543295523-78c9bbdba65c`
- Professional workspace: `https://images.unsplash.com/photo-1674471361339-2e1e1dbd3e73`

**Testimonials/About:**
- Students collaborating: `https://images.unsplash.com/photo-1565598487929-b6aad2be0bc5`
- Support agent: `https://images.unsplash.com/photo-7709208`

**Background/Decorative:**
- University campus: `https://images.pexels.com/photos/15438553`
- Modern office: `https://images.pexels.com/photos/15438544`

**Usage Guidelines:**
- Use images sparingly in the main workspace
- Optimize all images (WebP format, lazy loading)
- Provide alt text for accessibility
- Use placeholder avatars for student profiles

---

## Reporting Dashboard

### Chart Components (Recharts)

**Line Chart - Ticket Volume Over Time:**
```jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

<LineChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-gray-200)" />
  <XAxis dataKey="date" stroke="var(--secondary-gray)" />
  <YAxis stroke="var(--secondary-gray)" />
  <Tooltip />
  <Legend />
  <Line 
    type="monotone" 
    dataKey="tickets" 
    stroke="var(--primary-blue)" 
    strokeWidth={2}
  />
</LineChart>
```

**Bar Chart - Tickets by Queue:**
```jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

<BarChart width={600} height={300} data={data}>
  <CartesianGrid strokeDasharray="3 3" stroke="var(--neutral-gray-200)" />
  <XAxis dataKey="queue" stroke="var(--secondary-gray)" />
  <YAxis stroke="var(--secondary-gray)" />
  <Tooltip />
  <Bar dataKey="count" fill="var(--primary-blue)" radius={[4, 4, 0, 0]} />
</BarChart>
```

**Pie Chart - Status Distribution:**
```jsx
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = [
  'var(--status-open)',
  'var(--status-waiting)',
  'var(--status-closed)',
];

<PieChart width={400} height={400}>
  <Pie
    data={data}
    cx={200}
    cy={200}
    labelLine={false}
    outerRadius={120}
    fill="#8884d8"
    dataKey="value"
  >
    {data.map((entry, index) => (
      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
    ))}
  </Pie>
  <Tooltip />
  <Legend />
</PieChart>
```

---

## OAuth Sign-In Page

### Design Specifications

**Layout:**
```
┌─────────────────────────────────┐
│                                 │
│         [University Logo]       │
│                                 │
│    Financial Aid Platform       │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Sign in with Microsoft   │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │  Sign in with Google      │  │
│  └───────────────────────────┘  │
│                                 │
│  Need help? Contact support     │
│                                 │
└─────────────────────────────────┘
```

**Styling:**
- Centered card on neutral background
- Card: 400px max-width, `--shadow-xl`, `--radius-xl`
- Logo: 80px height
- Heading: `--text-2xl`, `--font-bold`
- OAuth buttons: Full width, `--space-4` gap
- Background: Subtle gradient from `--neutral-gray-50` to `--neutral-gray-100`

---

## Knowledge Base Editor

### Rich Text Editor

**Use React Quill:**
```jsx
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link', 'image'],
    ['clean']
  ],
};

<ReactQuill
  theme="snow"
  modules={modules}
  placeholder="Write article content..."
  data-testid="kb-editor"
/>
```

**Custom Styling:**
```css
.ql-container {
  font-family: var(--font-primary);
  font-size: var(--text-base);
  border: 1px solid var(--neutral-gray-200);
  border-radius: 0 0 var(--radius-md) var(--radius-md);
}

.ql-toolbar {
  border: 1px solid var(--neutral-gray-200);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  background: var(--neutral-gray-50);
}
```

---

## Student Self-Service Chatbot

### Chatbot Embed

**Design:**
- Fixed position bottom-right
- Circular button: 56px diameter, `--primary-blue` background
- Chat window: 360px width, 600px height
- Rounded corners: `--radius-xl`
- Shadow: `--shadow-2xl`

**Message Bubbles:**
```css
.bot-message {
  background: var(--neutral-gray-100);
  color: var(--secondary-slate);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-lg) var(--radius-sm);
  max-width: 80%;
  align-self: flex-start;
}

.user-message {
  background: var(--primary-blue);
  color: white;
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg) var(--radius-lg) var(--radius-sm) var(--radius-lg);
  max-width: 80%;
  align-self: flex-end;
}
```

---

## Relative Timestamps

### Implementation with date-fns

```jsx
import { formatDistanceToNow } from 'date-fns';

const formatTimestamp = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  
  // Less than 1 minute
  if (diff < 60000) return 'Just now';
  
  // Less than 1 hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000);
    return `${minutes}m ago`;
  }
  
  // Less than 24 hours
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000);
    return `${hours}h ago`;
  }
  
  // Yesterday
  if (diff < 172800000) return 'Yesterday';
  
  // Less than 7 days
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000);
    return `${days}d ago`;
  }
  
  // Older - show date
  return new Date(date).toLocaleDateString();
};
```

---

## Mailbox Connection Setup

### Setup Flow

**Steps:**
1. Select email provider (Microsoft 365, Google Workspace)
2. OAuth authentication
3. Select mailbox/folder
4. Configure sync settings
5. Test connection
6. Confirm setup

**UI Components:**
- Stepper component (use shadcn `tabs` or custom)
- Provider cards with logos
- Success/error states
- Loading indicators

---

## Common Mistakes to Avoid

### DON'T:
- ❌ Use dark gradients (purple/pink, blue/purple)
- ❌ Apply gradients to reading areas or small elements
- ❌ Use `transition: all` (breaks transforms)
- ❌ Center-align all text (disrupts reading flow)
- ❌ Use emoji icons (use Lucide React instead)
- ❌ Forget data-testid attributes
- ❌ Skip focus states
- ❌ Use inconsistent spacing

### DO:
- ✅ Use solid colors for content areas
- ✅ Keep gradients under 20% of viewport
- ✅ Add specific transitions (background, border, opacity)
- ✅ Left-align body text
- ✅ Use Lucide React icons
- ✅ Add data-testid to all interactive elements
- ✅ Ensure visible focus states
- ✅ Follow spacing system consistently

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Set up design tokens in CSS variables
- [ ] Import Google Fonts (IBM Plex Sans, IBM Plex Mono)
- [ ] Configure Tailwind with custom colors
- [ ] Install required packages (recharts, react-quill, date-fns, lucide-react)

### Phase 2: Layout
- [ ] Create three-pane layout with resizable panels
- [ ] Build header with search and user menu
- [ ] Implement left pane (inbox) with filters
- [ ] Build center pane (ticket thread)
- [ ] Create right pane (student context)

### Phase 3: Components
- [ ] Style all shadcn components to match design system
- [ ] Create custom button variants
- [ ] Build badge system for statuses
- [ ] Implement form components
- [ ] Add icon system with Lucide React

### Phase 4: Features
- [ ] Build OAuth sign-in page
- [ ] Create mailbox connection setup flow
- [ ] Implement rich text editor for replies
- [ ] Build knowledge base editor
- [ ] Create reporting dashboard with charts
- [ ] Add chatbot embed for students

### Phase 5: Polish
- [ ] Add micro-interactions and transitions
- [ ] Implement keyboard shortcuts
- [ ] Test accessibility (focus states, screen readers)
- [ ] Add data-testid attributes
- [ ] Optimize performance
- [ ] Test responsive behavior

---

## Instructions to Main Agent

### Critical Implementation Notes

1. **Three-Pane Layout:**
   - Use `resizable.jsx` from shadcn for adjustable pane widths
   - Implement independent scroll areas for each pane
   - Ensure responsive behavior (stack on mobile)

2. **Color System:**
   - Define all CSS variables in `:root`
   - Use semantic color names (--primary-blue, not --color-1)
   - Test contrast ratios for accessibility

3. **Typography:**
   - Import IBM Plex Sans and IBM Plex Mono from Google Fonts
   - Use consistent font sizes from the scale
   - Maintain proper line heights for readability

4. **Components:**
   - Prioritize shadcn components from `/app/frontend/src/components/ui/`
   - Customize with design tokens, not inline styles
   - Add data-testid to all interactive elements

5. **Spacing:**
   - Use spacing tokens consistently
   - Avoid magic numbers
   - Maintain visual rhythm

6. **Accessibility:**
   - Ensure all interactive elements have focus states
   - Add ARIA labels where needed
   - Test keyboard navigation
   - Maintain color contrast

7. **Performance:**
   - Lazy load images
   - Use React.memo for expensive components
   - Implement virtualization for long lists
   - Optimize bundle size

8. **Testing:**
   - Add data-testid to all key elements
   - Use kebab-case naming convention
   - Test all user flows

---

## General UI/UX Design Guidelines

### Universal Transition Rule
- You must **not** apply universal transition. Eg: `transition: all`. This results in breaking transforms. Always add transitions for specific interactive elements like button, input excluding transforms

### Text Alignment
- You must **not** center align the app container, ie do not add `.App { text-align: center; }` in the css file. This disrupts the human natural reading flow of text

### Icon Usage
- NEVER: use AI assistant Emoji characters like `🤖🧠💭💡🔮🎯📚🎭🎬🎪🎉🎊🎁🎀🎂🍰🎈🎨🎰💰💵💳🏦💎🪙💸🤑📊📈📉💹🔢🏆🥇` etc for icons
- Always use **Lucide React** library (already installed in package.json)

### Gradient Usage
- NEVER use dark/saturated gradient combos (e.g., purple/pink) on any UI element
- Prohibited gradients: blue-500 to purple-600, purple-500 to pink-500, green-500 to blue-500, red to pink etc
- NEVER use dark gradients for logo, testimonial, footer etc
- NEVER let gradients cover more than 20% of the viewport
- NEVER apply gradients to text-heavy content or reading areas
- NEVER use gradients on small UI elements (<100px width)
- NEVER stack multiple gradient layers in the same viewport

### Enforcement Rule
- If gradient area exceeds 20% of viewport OR affects readability, **THEN** use solid colors

### How and Where to Use Gradients
- Section backgrounds (not content backgrounds)
- Hero section header content (dark to light to dark color)
- Decorative overlays and accent elements only
- Hero section with 2-3 mild colors
- Gradients can be horizontal, vertical, or diagonal

### Micro-Animations
- Every interaction needs micro-animations - hover states, transitions, and entrance animations
- Static = dead

### Spacing
- Use 2-3x more spacing than feels comfortable
- Cramped designs look cheap

### Polish
- Subtle grain textures, noise overlays, custom cursors, selection states, and loading animations separate good from extraordinary

### Design Tokens
- Before generating UI, infer the visual style from the problem statement (palette, contrast, mood, motion)
- Immediately instantiate it by setting global design tokens (primary, secondary/accent, background, foreground, ring, state colors)
- Don't rely on library defaults
- Don't make the background dark as a default step, always understand problem first and define colors accordingly

### Component Reuse
- Prioritize using pre-existing components from `src/components/ui` when applicable
- Create new components that match the style and conventions of existing components when needed
- Examine existing components to understand the project's component patterns before creating new ones

### Component Library
- Do not use HTML based components like dropdown, calendar, toast etc
- You **MUST** always use `/app/frontend/src/components/ui/` only as primary components as these are modern and stylish

### Best Practices
- Use Shadcn/UI as the primary component library for consistency and accessibility
- Import path: `./components/[component-name]`

### Export Conventions
- Components MUST use named exports (`export const ComponentName = ...`)
- Pages MUST use default exports (`export default function PageName() {...}`)

### Toasts
- Use `sonner` for toasts
- Sonner component is located in `/app/src/components/ui/sonner.tsx`

### Visual Depth
- Use 2–4 color gradients, subtle textures/noise overlays, or CSS-based noise to avoid flat visuals

### Data Testid Attributes
- All interactive and key informational elements **MUST** include a `data-testid` attribute to facilitate robust automated testing
- This applies to buttons, links, form inputs, menus, and any element that a user interacts with or that displays critical information
- Use kebab-case convention that defines the element's role, not its appearance (e.g., `data-testid="login-form-submit-button"`)
- This creates a stable, decoupled interface for tests, preventing them from breaking due to stylistic refactors or changes in DOM structure

---

## Final Notes

This design system creates a professional, trustworthy, and efficient workspace for university financial aid staff. The clean, modern interface prioritizes clarity, data density, and desktop-optimized workflows while maintaining accessibility and visual hierarchy.

Key differentiators:
- **Professional color palette** with navy and blue tones for trust
- **IBM Plex Sans** typography for enterprise readability
- **Three-pane layout** optimized for desktop workflows
- **Comprehensive component library** with shadcn/ui
- **Accessibility-first** approach with WCAG AA compliance
- **Data-testid attributes** for robust testing

The system balances sophistication with usability, creating an interface that feels modern and trustworthy while remaining efficient for daily use by financial aid advisors handling sensitive student information.
