# Session Changelog — 2026-06-15

## 1. Mobile UI Bug Fixes

**Branch:** `claude/user-navigation-workflow-r4fmgr` → merged to `main`

Four mobile bugs fixed based on screenshot review:

### Logo truncation
- `src/components/Navbar.tsx` — replaced single text node with two `<span>` elements: `logoFull` (full name, desktop) and `logoShort` ("MH.", mobile)
- `src/components/layout.module.css` — removed `max-width: 9ch` / `text-overflow: ellipsis` constraint that clipped "Malik Hashir" to "Malik Has..." at mobile widths; added responsive swap via `display: none/inline`

### IsometricBoard pattern bleed on mobile
- `src/components/PortfolioShell.tsx` — added `{isMobile !== true && <Scene />}` guard so the Three.js 40×40 cube grid canvas (which was bleeding through as a maze-like pattern on small screens) no longer mounts on mobile (≤768px)

### Inspect System button contrast
- `src/components/audit-toggle.module.css` — replaced `var(--border-focus)` (#4a3e28, near-invisible on dark bg) with `rgba(201,169,110,0.45)` amber border; added drop shadow for depth

### Footer overlap
- `src/components/layout.module.css` — added `padding-bottom: 80px` to `.footer` inside the `@media (max-width: 640px)` breakpoint so the fixed "Inspect System" button never sits on top of copyright/location text

---

## 2. .gitignore Update

Added `.claude/worktrees/` to `.gitignore` to stop the stop-hook from flagging temporary agent worktree directories as untracked files.

---

## 3. Full Portfolio Redesign — Asymmetric Editorial Layout

**Replaced:** Multi-page marketing site (7 routes, glassmorphism, warm cream palette, soft shadows, rounded pills, multi-step navigation)

**With:** Single-pane asymmetric editorial layout inspired by high-end design studio aesthetics

### New files
- `src/app/page.tsx` — complete rewrite (417 lines)
- `src/app/new-page.module.css` — all page CSS (716 lines)
- `src/components/PortfolioFrame.tsx` — fixed 1px viewport border frame
- `src/data/portfolioData.ts` — consolidated data layer

### Design system
| Element | Old | New |
|---------|-----|-----|
| Background | Dark `#080706` + amber glows | Cream `#F4F0EA` left / Obsidian `#0B0B0C` right |
| Cards | Glassmorphism + soft shadows | Flat, 1px borders, no shadows |
| Badges | Rounded pill components | Plain `[BRACKETED TEXT]` |
| Stack labels | Pill tags | `TypeScript // JSX Runtime // Hooks` |
| Navigation | Navbar with 4 route links | Minimal floating header: `M.H.` + GitHub/LinkedIn/Download CV |
| Routing | 7 pages: `/`, `/work`, `/about`, `/contact`, `/hr`, `/client`, `/work/[slug]` | Single scrollable page with anchor sections |
| Project detail | Full-page modal overlay | Inline accordion row (no modal) |

### Page sections
1. **Hero** — 2/3 cream left with bold H1 headline, availability status, CV download CTA; 1/3 obsidian right with live system telemetry cards (REACTOR.FRAMEWORK, OPSFLOW.SYS, MINA.REALTIME)
2. **Systems `#systems`** — white `#FFFFFF` background, 3-column flat project grid with filename notation (`Reactor.framework`, `OpsFlow.sys`, `FinanceSmith.infra`), click to expand inline detail panel
3. **About `#about`** — warm `#F0ECE5`, bio + availability from `site.ts`, 2-column capabilities list
4. **Contact `#contact`** — obsidian, plain text contact rows with arrows, status bar at bottom

### PortfolioShell bypass
- `src/components/PortfolioShell.tsx` — added `if (pathname === "/") return <>{children}</>` so the new home page renders without any navbar, footer, scene, or audit toggle

---

## 4. Data Layer Consolidation

Created `src/data/portfolioData.ts` as the single import point for `page.tsx`:
- Re-exports `site` from `site.ts` and `projects` from `projects.ts`
- Exports `getFilename(slug)` — maps project slugs to display filenames
- Exports `getBadgeLabel(status, githubUrl)` — derives `[MIT LICENSE]` / `[PRODUCTION]` / `[PRIVATE]`
- Exports `TELEMETRY` — hero right-panel system cards (static, curated)
- Exports `CAPABILITIES` — about section capabilities list

---

## 5. Legacy Branch + Main Cleanup

### Legacy branch
- Created `legacy` branch from `main` at this point — full old codebase preserved intact

### Main cleanup — 69 files deleted, 12,325 lines removed

**Deleted routes:**
- `src/app/about/`
- `src/app/contact/`
- `src/app/work/` (including `[slug]` dynamic route)
- `src/app/hr/`
- `src/app/client/`

**Deleted components (27 components + all CSS modules):**
Navbar, Footer, PortfolioShell, AuditToggle, Scene, IsometricBoard, LandingPage, MobileLandingPage, ProjectModal, ProjectCard, ProjectBriefCard, ProjectConsole, FeaturedProjectCard, CVModal, CodePreview, WorkflowDemo, SignalTicker, SystemFeed, SectionMinimap, SectionHeader, Timeline, ScrollReveal, PageTransition, ScrambleText, ThemeToggle, ExplodedProjectView, ProjectSystemBackdrop

**Deleted UI kit:**
CustomCursor, Magnetic, NoiseOverlay, Icons, button, canvas, canvas-hero

**Deleted lib:**
store.ts (Zustand), useMobileExperience.ts, systemMaps.ts, utils.ts

**Deleted data:**
landingPages.ts

**Simplified:**
- `src/app/layout.tsx` — removed PortfolioShell wrapper, removed Space Grotesk font, bare HTML shell only

### Final file count: 9 files
```
src/
  app/
    favicon.ico
    globals.css
    layout.tsx
    new-page.module.css
    page.tsx
  components/
    PortfolioFrame.tsx
  data/
    portfolioData.ts
    projects.ts
    site.ts
```

---

## Branches
| Branch | State |
|--------|-------|
| `main` | New single-page editorial design, fully cleaned |
| `legacy` | Full original multi-page portfolio preserved |
| `claude/user-navigation-workflow-r4fmgr` | Feature branch used during mobile bug fixes, merged |
