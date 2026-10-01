# Handoff: Dreamer's Bible College — Landing Page

## Overview
Single-page site for Dreamer's Bible College (Austin, TX), a ministry of Dreamer's Church. Goals: applications, scholarship applications, Preview Day sign-ups. Visual language follows dreamerschurch.com.

## About the Design Files
`Dreamers Bible College - Standalone.html` is a **design reference** — open it in any browser to see exact look and behavior. Rebuild it natively in Framer (Stacks/Frames, CMS optional) rather than pasting the HTML. `Dreamers Bible College (source).dc.html` is the editable source (not runnable on its own).

## Fidelity
**High-fidelity.** Final colors, type, copy, imagery, interactions.

## Design Tokens
**Colors**
- Ink / page bg `#07141B`
- Navy (sections, cards) `#0B1D26`, hover `#10262F`
- Coral (primary accent, CTAs) `#E4633F`
- Coral dark (eyebrows on peach) `#C24A28`
- Peach (sections) `#F7DDD0`
- Cream (sections, light cards) `#F8F3EE`
- Body on dark `#C9D2D6`; on cream `#33434B`; on peach `#3B3431`
- Hairlines: `rgba(248,243,238,.14)` on dark; `rgba(11,29,38,.12–.18)` on light

**Type (Google Fonts)**
- Display: DM Serif Display 400, UPPERCASE, line-height .92–1.0. H1 `clamp(52px,9vw,136px)`, H2 `clamp(40px,5.5vw,80px)`, card titles 28–30px
- Script accent: Mrs Saint Delafield, ~1.25–1.3em of heading, sentence case (“adventure”, “story”, “dream”, “Preview Day”)
- Body/UI: Manrope 400–800. Body 17–19px / 1.6–1.7. Eyebrows 12px/800, tracking .24em, uppercase. Buttons 13px/800, tracking .16em, uppercase
- Pull quotes: DM Serif Display 22–24px / 1.35

**Shape & spacing**
- Buttons: pill (999px), padding 18px 32–36px. Primary coral/white → hover peach/ink. Secondary 1.5px cream outline → hover cream fill/ink
- Cards radius 20–32px. Arch images: `999px 999px 24px 24px`
- Section padding: `clamp(72px,10vw,140px)` vertical, `clamp(20px,5vw,64px)` horizontal. Max content width 1200px
- Two-column grids collapse to one below ~900px

## Sections (top → bottom)
1. **Header** (over hero): white logo + “DREAMER'S / BIBLE COLLEGE” wordmark; anchor links Why DBC, Programs, Ministry, Tuition, FAQ; coral Apply Now pill.
2. **Hero** (100vh): `hero-worship.jpg` full-bleed; `hero-classroom.jpg` overlaid bottom-right (78% × 80%) with radial mask fading to top-left; left-to-right ink gradient (.88 → 0). Eyebrow “FALL 2026 · FULL-TIME & PART-TIME”, H1 “START THE” + script “adventure”, paragraph, Apply Now + Explore Programs.
3. **Launchpad** (cream): 3-photo collage (tall arch left: `ezra-smile.jpg`; right: `trip-2025.jpg`, `two-girls-smile.jpg`), H2, 2 paragraphs, coral pull line.
4. **Why DBC** (navy): H2 + copy; 6 cards numbered 01–06 in a hairline grid.
5. **Programs** (peach): 1 / 2 / 4-year navy stat tiles; cream “Program Highlights” card with 7 coral-dot rows.
6. **Rooted in the Word** (`rooted-bg.jpg`, ink overlay .86): H2, copy, 8 pill tags, “View Semester Overview →” (Dropbox PDF).
7. **Ministry Focus** (cream): pill tabs Creative / Youth / Worship / Kids (active = navy fill). Navy card: image left, “0X / 04” + title + text right. Creative = 4-photo collage (`cr-*.jpg`); Youth = `min-youth.jpg` with ping-pong inset bottom-right; Worship = `min-worship.jpg`; Kids = `min-kids.jpg`.
8. **Tuition** (navy): Full-time cream card **$2,800 / semester** (12–16 credits; $200 per extra credit); Part-time coral card **$250 / credit hour**. CTAs Apply Now + Ask About Scholarships.
9. **Student Life** (peach): 2 offset arch photos (`community-left.jpg`, `community-students.jpg`), H2, 7 pill tags, Schedule a Visit.
10. **Testimonials** (ink): 2 YouTube embeds (16:9, radius 24px); 3 quote cards — Chris, 1st-Year Student · Hailey, 2nd-Year Student · Lora, Parent.
11. **Preview Day** (coral): eyebrow “VISIT CAMPUS”, H2 “JOIN US FOR A” + script “Preview Day”, copy, ink Learn More button; collage (`preview-*.jpg`) with cream date card “NEXT PREVIEW DAY · Nov 23”.
12. **FAQ** (cream): 11-item accordion, single-open, first open by default; circular +/– icon, coral when open.
13. **Final CTA** (`final-cta-bg.jpg`, ink overlay .8): logo, “READY TO / dream / BIGGER?”, Apply Now + Request Info.
14. **Footer** (ink): logo, 10700 Anderson Mill Rd, Austin, TX 78750 · (512) 537-5871 · admin@dreamers.church · Sundays 9:30 & 11:30 AM · Wed Youth 6:30 PM · Instagram / Facebook / YouTube.

## Links
- Apply Now (×4): https://dreamers.populiweb.com/router/admissions/onlineapplications/index?application_form=1
- Ask About Scholarships: https://dreamers.populiweb.com/router/admissions/onlineapplications/index?application_form=2
- Preview Day Learn More: https://dreamers.populiweb.com/router/admissions/onlineinquiries/respond/1/be1aa670551ef7f7b08f9173b03d5261
- Videos: https://www.youtube.com/embed/JtyyrwmgUZs (left), https://www.youtube.com/embed/F6JZxvEEWHE (right)
- **Still needed:** Request Info, Schedule a Visit, Ask a Question (currently jump to footer)

## Interactions
- Hover: color swaps (~0.2s ease)
- Ministry tabs swap image/number/title/text
- FAQ accordion single-open
- External links open in new tab

## Assets
All in `/assets` (web-optimized JPGs, logo SVG — logo is black, displayed white via invert).
