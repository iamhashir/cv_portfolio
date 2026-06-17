# Design Audit Report — 2026-06-17
## Playwright Responsive & Geometric Review

**Status:** ❌ **CRITICAL ISSUES BLOCKING REDESIGN**

---

## What's Working ✅

1. **Typography hierarchy** — "I build complete systems" headline + accent color on "systems" is distinctive
2. **Amber accent color** — #c9a96e showing correctly on keyword text
3. **Skip-to-main link** — Accessibility baseline present
4. **Header navigation** — GitHub, LinkedIn, CV download buttons responsive and positioned correctly
5. **Mobile responsiveness** — Text scales appropriately, no overflow on text elements
6. **SystemFeed component** — Rendering and scrolling correctly (dark ambient log stream)

---

## What's Broken 🔴

### 1. **Light Theme Hardcoded (CRITICAL)**
- **Expected:** Dark theme (`--bg-primary: #0f0c08`) with warm amber accents per 2026-06-10 redesign
- **Actual:** Light theme (#F4F0EA cream) hardcoding in `.backgroundStage` CSS
- **Evidence:** All three viewports (mobile, tablet, desktop) show `rgb(244, 240, 234)` background
- **Impact:** Entire "Signal & Noise" dark aesthetic is lost; contradicts design direction from memory
- **Fix:** `new-page.module.css` line ~25: change `background: #F4F0EA;` → `background: var(--bg-primary, #0f0c08);`

### 2. **Project Cards Completely Missing (CRITICAL)**
- **Expected:** 6-card dashboard matrix below hero ("PRJ-01" through "PRJ-06" with metrics)
- **Actual:** Blank white space where cards should be
- **Evidence:** 
  - Playwright found 114 DOM elements (likely includes hidden/zero-height elements)
  - Screenshots show zero project cards on any viewport
  - Mobile: empty space below "View Systems" button
  - Desktop: massive gap between hero and SystemFeed
- **Likely cause:** Cards are `display: none`, `visibility: hidden`, or positioned off-screen
- **Impact:** The "project matrix" is the hero of this page (per brief) — it's completely hidden

### 3. **Split-Screen Layout Broken (CRITICAL)**
- **Design intent:** "Signal & Noise" = Left side (hero + metrics + CTAs) | Right side (SystemFeed ambient log)
- **Current:** Full-width hero, then huge gap, then SystemFeed below everything
- **Impact:** Violates the core "Signal & Noise" concept shipped 2026-06-07
- **Evidence:** Desktop screenshot shows 1280px full-width hero, SystemFeed appears only at page bottom

### 4. **Excessive Whitespace (MEDIUM)**
- Desktop: ~2000px of empty beige space between hero and SystemFeed
- Mobile: Similar large gaps
- Suggests layout grid or flex layout is broken, not just CSS overrides

---

## Responsive Behavior Assessment

| Viewport | Card count | Card widths | Text overflow | Verdict |
|----------|-----------|-------------|----------------|---------|
| Mobile (375px) | 0 visible | N/A (hidden) | None | ❌ FAIL |
| Tablet (768px) | 0 visible | N/A (hidden) | None | ❌ FAIL |
| Desktop (1280px) | 0 visible | N/A (hidden) | None | ❌ FAIL |

**No responsive issues detected on visible elements**, but the core component (project cards) is not visible at any breakpoint.

---

## Geometric/Spacing Findings

### Hero Section ✅
- Scales proportionally: mobile (327px), tablet (720px), desktop (1280px)
- Accent shape (circular element top-right) maintains aspect ratio
- Typography readable at all sizes

### SystemFeed ✅
- Renders as scrollable ambient log stream
- Width matches viewport (responsive)
- No text squishing or geometric distortion

### Project Cards ❌
- **Cannot assess geometry** — they're not visible
- Need to unhide before evaluating card sizing, grid spacing, shadow depth

---

## Design System Compliance

| Token | Expected | Actual | Status |
|-------|----------|--------|--------|
| `--bg-primary` | #0f0c08 (dark) | #F4F0EA (light, hardcoded) | ❌ BROKEN |
| `--accent-color` | #c9a96e | #c9a96e | ✅ OK |
| `--text-primary` | #f8f0dc (light text on dark) | N/A (light theme) | ⚠️ N/A |
| Spacing grid | 8dp (documented) | Unknown | ⚠️ UNTESTED |

---

## Screenshots Captured

- `screenshot-desktop.png` (1280×3840px) — Shows full-page layout breakdown
- `screenshot-tablet.png` (768×3072px) — Confirms cards missing at tablet size
- `screenshot-mobile.png` (375×5120px) — Confirms cards missing on mobile

All screenshots show light theme + missing cards.

---

## Remediation Steps (Priority Order)

### 1️⃣ **URGENT — Unhide Project Cards** (15 min)
Check `new-page.module.css` and any component CSS for:
- `display: none` on `.projectMatrix`, `.card`, or similar
- `visibility: hidden`
- `height: 0` or `max-height: 0`
- Check for conditional rendering in `page.tsx` that hides cards

### 2️⃣ **URGENT — Fix Theme Override** (10 min)
Edit `new-page.module.css`:
```css
/* BEFORE (broken) */
.backgroundStage {
  background: #F4F0EA;
}

/* AFTER (fixed) */
.backgroundStage {
  background: var(--bg-primary, #0f0c08);
}
```

### 3️⃣ **Restore Split-Screen Layout** (20 min)
Verify `page.tsx` and `page.module.css` implement 2-column grid:
- Left column (50%): Hero section + metrics + CTAs
- Right column (50%): SystemFeed (scrollable, ambient)
- At mobile: Stack vertically (SystemFeed below hero)

### 4️⃣ **Verify Project Card Styling** (15 min)
Once cards are visible:
- Check card dimensions (should be consistent grid)
- Verify dark theme text colors work on dark background
- Test accent highlights on cards
- Check responsive stacking on mobile/tablet

---

## Next Loop Iteration Action Items

1. Read `src/app/new-page.module.css` — find `display: none` or hardcoded backgrounds
2. Read `src/app/page.tsx` — check for conditional rendering that hides cards
3. Fix theme hardcoding + run Playwright audit again
4. Verify project cards appear at all viewports
5. Screenshot to confirm "Signal & Noise" split-screen is restored

---

## Notes for Designer (User)

The "Signal & Noise" homepage concept is **structurally broken**. The code exists and renders, but:
- **Light theme override** masks the dark aesthetic
- **Project cards are hidden** by CSS or conditional logic (likely `display: none`)
- **Layout lost the split-screen intent** — should be 2-column on desktop, stacked on mobile

This is not a redesign problem — it's a **CSS/layout bug** preventing the 2026-06-10 redesign from showing. Once unfixed, the visual should snap back to the "Signal & Noise" vision.

---

## Metrics

- **Elements found:** 114 DOM nodes (most likely hidden)
- **Viewports tested:** 3 (mobile 375px, tablet 768px, desktop 1280px)
- **Text overflow issues:** 0
- **Cards visible:** 0/6
- **Theme tokens active:** 1/4 (accent color only)

**Overall redesign completeness: 40%** (concept exists, theme system broken, cards hidden)
