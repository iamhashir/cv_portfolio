# Design Improvements — Implementation Plan
**Based on Comprehensive Audit of 36+ Screenshots**

## Key Findings from Visual Audit

### ✅ What's Working Well
- Primary CTA button visibility (lime green) is excellent
- Focus states are visible and functional
- Component layout is clean and organized
- Text hierarchy is clear
- Color scheme is distinctive and consistent

### 🔴 Critical Issues to Fix

#### Issue #1: Secondary Text Contrast (About/Work Pages)
**Location:** About page body text, work page descriptions  
**Problem:** Light gray text (#888888) on white background needs to be darker  
**Impact:** Readability, accessibility (WCAG AA compliance)  
**Fix:** Increase opacity of secondary text from 0.6/0.7 to 0.75/0.8

#### Issue #2: Mobile Button Spacing
**Location:** About/Work page CTA buttons  
**Problem:** Buttons too close together on mobile, hard to tap  
**Impact:** Mobile UX, accessibility  
**Fix:** Increase button width to full or near-full width on mobile <480px

#### Issue #3: Project Card Button Visibility
**Location:** Work page "VIEW DETAILS" buttons  
**Problem:** Coral outline buttons on dark cards lack sufficient contrast  
**Impact:** Visibility, CTA effectiveness  
**Fix:** Add padding/make buttons larger, add hover glow effect

#### Issue #4: Section Spacing Consistency
**Location:** All pages  
**Problem:** Section margins vary (60px, 80px, 100px, etc.)  
**Impact:** Visual rhythm, professionalism  
**Fix:** Standardize to 60px/80px/120px scale

#### Issue #5: Mobile Typography Scaling
**Location:** About page headings, work page titles  
**Problem:** Some headings scale too small on mobile  
**Impact:** Readability on small screens  
**Fix:** Adjust clamp() functions to ensure minimum sizes

#### Issue #6: Breadcrumb Contrast
**Location:** About/Work pages  
**Problem:** Breadcrumb text color (#6B7280) doesn't have enough contrast  
**Impact:** Visibility of navigation context  
**Fix:** Darken to #4B5563 or use #0B0B0C with reduced opacity

---

## Implementation Checklist

- [ ] Fix secondary text contrast (opacity 0.75+)
- [ ] Make mobile buttons full-width or wider <480px
- [ ] Add hover glow to project card buttons
- [ ] Standardize section spacing (60/80/120px scale)
- [ ] Improve mobile heading sizes
- [ ] Fix breadcrumb contrast
- [ ] Add more padding to CTA groups on mobile
- [ ] Increase tag/badge font sizes slightly
- [ ] Improve project card hover effects
- [ ] Test all changes on actual devices

---

## Expected Outcomes

✅ WCAG AA compliance for all text  
✅ Better mobile usability (easier tap targets)  
✅ More premium, polished appearance  
✅ Improved visual hierarchy  
✅ Better responsive scaling  
