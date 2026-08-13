# ATS CV Builder — Design & Architecture

> **Design System Version:** Obsidian & Brass v4.0
> **Last Updated:** August 2026
> **Theme Codename:** Obsidian & Brass (Premium Cyber/GRC)

---

## Overview

ATS CV Builder is a modern, single-page application (SPA) built with React and Vite. It helps users create Applicant Tracking System (ATS) optimized resumes that parser bots can easily read. The UI follows the **Obsidian & Brass** design language — a deep, warm dark base with sharp brass and gold accents, solid flat surfaces, and bento grid layouts inspired by premium cybersecurity and GRC SaaS products.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Core | React 18, Vite |
| Styling | Tailwind CSS v4, Custom CSS Variables (`index.css`) |
| State | Zustand (`cvStore.js`) with `persist` middleware |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod validation |
| Icons | Lucide React |
| PDF Generation | `@react-pdf/renderer` |
| Animations | Framer Motion |
| Fonts (UI) | **Geist** (headings, body) + **Geist Mono** (numbers, data) via `@fontsource` |
| Fonts (PDF) | Times-Roman, Helvetica, Courier (ATS-safe, embedded) |

> **Note:** UI Fonts are loaded via `@fontsource/geist-sans` and `@fontsource/geist-mono` in `main.jsx`.

---

## Design System — Obsidian & Brass

### Color Palette

| Role | Variable | Value | Notes |
|---|---|---|---|
| Base | `--color-bg-base` | `#000000` | True void |
| Canvas | `--color-bg-primary` | `#0A0A0A` | Deep obsidian page background |
| Surface | `--color-bg-surface` | `#111111` | Flat cards and panels |
| Surface-2 | `--color-bg-surface-2` | `#1A1A1A` | Nested inputs and wells |
| Hover | `--color-bg-hover` | `#222222` | Hover state |
| Border | `--color-border` | `#333333` | Solid gray border |
| Border Focus | `--color-border-focus` | `#555555` | Active/focus border |
| Border Accent | `--color-border-accent` | `rgba(201, 162, 39, 0.4)` | Subtle brass border |
| **Accent (Brass)** | `--color-accent` | `#C9A227` | Primary CTA — Brass / Gold |
| Accent Hover | `--color-accent-hover` | `#E5BE45` | Lighter on hover |
| Accent Dim | `--color-accent-dim` | `rgba(201, 162, 39, 0.1)` | Tinted backgrounds |
| Text Primary | `--color-text-primary` | `#F5F5F5` | Off-white |
| Text Secondary | `--color-text-secondary` | `#A3A3A3` | Neutral gray |
| Text Muted | `--color-text-muted` | `#737373` | Faint labels |
| Success | `--color-success` | `#10B981` | ATS score ≥ 80 |
| Warning | `--color-warning` | `#F59E0B` | ATS score 50–79 |
| Danger | `--color-danger` | `#EF4444` | ATS score < 50 |

### Typography

- **Headings & Body:** `Geist Sans` — Regular (400), Semibold (600)
- **Data & Numbers:** `Geist Mono` — Used for ATS scores and data visualization
- **Scale:** 16px base, fluid from `text-xs` (0.65rem) to `text-8xl` (6rem)

### Border Radii (4pt system)

| Token | Value |
|---|---|
| `--radius-sm` | 6px |
| `--radius-md` | 10px |
| `--radius-lg` | 14px |
| `--radius-xl` | 18px |
| `--radius-2xl` | 24px |
| `--radius-full` | 9999px |

### Core Component Classes

| Class | Description |
|---|---|
| `.bento-card` | Premium flat dark card with subtle solid border |
| `.surface` | Base surface component with solid flat styles |
| `.btn-gradient` | Solid brass/gold fill button (kept class name for compatibility) |
| `.badge-blue` | Replaces glow badges, uses flat colored backgrounds |
| `.section-heading` | 0.65rem uppercase bold label with bottom border divider |

### Animation Keyframes

| Keyframe | Duration | Use |
|---|---|---|
| `fade-in` | 400ms spring | Page loads, panel appearances |
| `scale-in` | 300ms spring | Toast, modal scale-in |
| `spin-slow` | 8s linear | Decorative spinner |

---

## Application Layout

### Shell (`AppShell.jsx`)
- Root `div` with `flex h-screen overflow-hidden`
- `Sidebar` + content column (`Topbar` + `<main>`)

### Sidebar (`Sidebar.jsx`)
- **Collapsible:** `64px` icon-only at rest → `220px` on `mouseEnter` (inline style transition, no JS state)
- **Logo:** Solid Brass badge with flat border
- **Nav items:** Pill with left brass border on active
- **Bottom CTA:** "Boost Score" flat card linking to `/ats-guide`

### Topbar (`Topbar.jsx`)
- **Solid background:** `background: var(--color-bg-surface)`
- **Left:** CV title + Draft badge
- **Center:** Live ATS score pill — color changes dynamically (green/amber/red)
- **Right:** Ghost `.TXT` / `.DOCX` icon-text chips + solid `Export PDF` button

---

## Pages

### Landing (`/`)
- Full-viewport centered layout over deep obsidian
- Flat, non-glassmorphism `.glass-panel` equivalents with sharp, high-contrast borders
- **Hero headline:** "Beat the **ATS.**" + "Land the **Job.**" with brass/gold highlights
- Three `.bento-card` feature tiles (ATS Scoring, Instant Export, Smart Templates)

### Dashboard (`/dashboard`)
- Solid banner at top with brass top-border
- Quick Stats summary row (Total CVs, Avg Score, Last Edited) utilizing `Geist Mono`
- Quick action chips: New CV, Analyze Score, Browse Templates
- Resume grid using flat `.bento-card` cards with spring hover

### Builder (`/builder`)
- Split-pane: left column (ATS Score Card + Section Accordion), right column (live preview)
- **Preview panel:** Rounded (20px), solid white background, flat borders
- **Section Accordion:** Flat design, active border accents

### ATS Score (`/ats-score`)
- Bento grid (2-col on mobile, 5-col on large screens)
- **Left:** Dark inset Textarea for job description + analyze button
- **Right — Overall card:** Large solid score number
- **Right — Breakdown card:** Three sections with flat progress bars (Framer Motion animated on mount)
- Missing keywords displayed as tinted pill tags

### Settings (`/settings`)
- Data management: reset CV fields, clear localStorage
- Privacy info card (local-only assurance)

---

## ATS Optimization Strategy

- **Standard fonts in PDF:** Times-Roman / Helvetica / Courier — embedded, no glyph issues with ATS parsers
- **Single-column PDF layout:** No multi-column grids; prevents parser column-reading failures
- **Semantic section labels:** Experience, Education, Skills — clearly demarcated for ATS categorization
- **Keyword extraction:** `atsScoring.js` uses regex with `.` preservation to correctly match terms like `Node.js` and `React.js`
- **Score function:** `calculateATSScore(cvState, jobDescriptionOverride)` uses `cvState.targetJobDescription` internally, so it works from both the Builder score card and the full ATS Score page
- **Real-time feedback:** Score updates on every state change in the Builder view; the standalone ATS Score page runs on-demand analysis

---

## PDF Export

| Template | Font | Style |
|---|---|---|
| Classic | Times-Roman | Traditional serif |
| Modern | Helvetica | Clean sans-serif |
| Compact | Courier | Monospace / technical |

- File named from `personalInfo.fullName` → `john-doe-resume.pdf`
- Also supports `.docx` (via `docx` library) and `.txt` (plain text serialization)
- Toast notification (success/error) auto-dismisses after 3s

---

## State Management

All CV data lives in a single **Zustand store** (`cvStore.js`) with `persist` middleware:

```
cvStore
├── personalInfo        { fullName, email, phone, location, linkedin, portfolio }
├── summary             string
├── experience[]        { id, title, company, location, start, end, current, bullets[] }
├── education[]         { id, degree, school, year, gpa }
├── skills              { technical[], soft[] }
├── projects[]          { id, name, description, url, bullets[] }
├── certifications[]    { id, name, issuer, year }
├── atsScore            { total, breakdown: { completeness, bullets, keywords }, missingKeywords[] }
├── targetJobDescription string
└── selectedTemplate    'classic' | 'modern' | 'compact'
```

---

## Clearscan PDF Editor (Module)

The application includes a fully standalone, client-side PDF Editor designed for privacy-first, in-browser resume adjustments without touching a server.

### Core Capabilities
- **Visual Overlays:** Users can add new Text, Whiteout Rectangles (to mask old data), and Images (signatures/logos).
- **True Inline Editing:** Leveraging `pdfjs-dist` text layer extraction, users can click existing text in the PDF to seamlessly replace it.
- **Undo / Redo History:** Full state tracking for all drag/drop and editing interactions.
- **Password Support:** Handles encrypted PDFs by prompting for decryption inline.

### Architecture
- **Rendering (Visuals):** Uses `pdfjs-dist` (via a Web Worker) to paint the PDF bytes to an HTML5 `<canvas>`.
- **Interaction (State):** React tracks all added elements as absolute-positioned DOM nodes sitting strictly above the canvas (`z-index: 20`).
- **Rebuilding (Export):** Uses `pdf-lib` to execute the actual PDF byte modifications.
  - Custom `domToPdfCoords` utility precisely maps CSS pixels (top-left origin) to PDF Points (bottom-left origin, accounting for scale).
  - Existing text edits are processed via **Visual Masking**: `pdf-lib` draws an opaque background-colored rectangle precisely over the old text's bounding box to "erase" it from the visual stream, then draws the new text directly on top, avoiding content stream corruption risks.

---

## Deployment

- **Build:** `npm run build` (Vite, zero errors)
- **Persistence:** Zustand `persist` → `localStorage` (key: `ats-cv-store`)
- **No backend dependency:** 100% client-side
- **Responsiveness:** Mobile-friendly; preview panel hidden below `lg` breakpoint
