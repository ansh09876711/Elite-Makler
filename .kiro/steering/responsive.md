---
inclusion: always
---

# Responsive Design Rule

**EVERY component and page MUST be fully responsive — Mobile + Desktop both.**

## Breakpoints to always handle:
- `default` (no prefix) = Mobile first — 320px to 639px
- `sm:` = 640px+ (large phones, small tablets)
- `md:` = 768px+ (tablets)
- `lg:` = 1024px+ (desktop)
- `xl:` = 1280px+ (large desktop)

## Mandatory rules for every component:

### Layout
- Mobile: `flex-col`, single column grids, full-width elements
- Desktop: `lg:flex-row`, multi-column grids, constrained widths
- Never use fixed pixel widths that break on mobile

### Typography
- Mobile: smaller text (`text-2xl`, `text-sm`)
- Desktop: larger text (`lg:text-4xl`, `lg:text-base`)
- Headings: always scale — `text-3xl lg:text-5xl`

### Navigation
- Mobile: hamburger menu / bottom nav / drawer
- Desktop: horizontal nav bar

### Padding / Spacing
- Mobile: `px-4 py-8`
- Desktop: `lg:px-6 lg:py-16`

### Grids
- Mobile: `grid-cols-1`
- Tablet: `md:grid-cols-2`
- Desktop: `lg:grid-cols-3` or `lg:grid-cols-4`

### Admin Dashboard
- Mobile: collapsible sidebar, stacked cards
- Desktop: persistent sidebar, table/grid views

### Forms & Modals
- Mobile: full-screen or bottom-sheet style
- Desktop: centered modal with max-width

### Images
- Always use `w-full h-auto` or `object-cover` with fixed height containers
- Responsive heights: `h-48 md:h-64 lg:h-80`

## Quick checklist before finishing any component:
1. ✅ Tested at 375px (iPhone SE)
2. ✅ Tested at 768px (iPad)
3. ✅ Tested at 1280px (Desktop)
4. ✅ No horizontal scroll on mobile
5. ✅ Touch targets minimum 44x44px on mobile
6. ✅ Text readable without zoom on mobile
