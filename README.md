# Omkesh Jadhav — Portfolio

Award-worthy personal portfolio. Next.js 16 (App Router) + TypeScript + Tailwind v4 + GSAP + Lenis + Framer Motion.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Status — Phase 1–6 complete

Every section from the brief is built, and this pass focused on polish, responsiveness, and code-quality gaps found on review:

**Fixed in this pass:**
- **Mobile navigation was missing** — `RightNav` is desktop-only (`hidden lg:block`) by design (it's a center-right dot indicator that doesn't translate to small screens), but there was no equivalent below `lg`. Added `MobileNav`: hamburger trigger + full-screen overlay list, reusing the same focus-trap hook as the project modal.
- **Bottom dock could overflow on narrow phones** — 8 icons at full size + gaps could exceed a 375px viewport. Reduced base icon size slightly, tightened gaps/padding on small screens, and added a horizontal-scroll-with-hidden-scrollbar fallback (`.no-scrollbar` in `globals.css`) so it degrades gracefully instead of breaking layout.
- **Hero heading used a raw `vw` unit**, which scales unpredictably on tall narrow phones and small on landscape tablets — switched to `clamp()`.
- **Disabled buttons had no visual state** — added `disabled:opacity-50 disabled:pointer-events-none` to `MagneticButton` (the contact form's submit button needed this).
- **ScrollTrigger could desync after font swap** — added a refresh on `window.load`, `resize`, and `document.fonts.ready` in `SmoothScrollProvider`.

**Added (from the brief's bonus list):**
- `ScrollProgressBar` — thin accent-colored bar pinned to the top, fills with scroll position, lerped for smoothness
- `LoadingScreen` — brief entrance cover (capped at 900ms, skipped entirely under reduced motion) so it can't meaningfully hurt perceived performance

**Code quality:** ran a project-wide sweep for unbalanced braces/parens, unqualified `React.*` type references (all fixed to explicit imports back in earlier phases), and unused imports — all clean as of this pass.

**What I can't verify without a real browser:** exact Lighthouse scores, actual layout at each breakpoint, and whether the dock/mobile-nav fixes look right in practice. Run it locally (`npm run dev`, then check responsive mode in devtools) and tell me what you see — I'd rather fix real issues than guess at more.

- Project scaffold, TypeScript config, Tailwind v4 theme tokens (exact palette from brief)
- Geist + Inter fonts via `next/font`
- Lenis smooth scroll synced to GSAP ScrollTrigger
- Custom cursor: lerped trail, hover scale, per-section color tint
- Right-side section indicator nav, ChatGPT-style
- Floating bottom dock with macOS-style proximity magnification
- Hero: split layout, GSAP entrance timeline, magnetic CTAs, SVG illustration
- Full-width ink-fill scroll-reveal statement section
- About: intro + 6 stat cards
- Skills: interactive icon pills
- Experience: connected vertical timeline
- Projects: tilt cards, cursor-following floating preview, full detail modal (code-split via `next/dynamic`)
- **Blogs**: cards with hover-zoom cover image and animated "Read More" underline (`components/blog/`)
- **Open Source**: contribution cards — repo, description, merged PR / issue links, tech tag (`components/open-source/`)
- **Contact**: quick-link cards (Email/LinkedIn/GitHub/Resume) + a real working form (`components/contact/`) — validated client-side and server-side with a shared validator (`lib/validate-contact.ts`), posts to `app/api/contact/route.ts`, which sends via Resend if `RESEND_API_KEY`/`CONTACT_TO_EMAIL` are set, otherwise logs to the server console so it's testable without a provider
- **Footer**: built-with stack + back-to-top
- **Dark mode**: toggle button, top-right, class-based theme via CSS custom properties, persisted to `localStorage`, flash-of-wrong-theme prevented with an inline pre-hydration script
- **SEO**: Open Graph, Twitter cards, `sitemap.ts`, `robots.ts`, and JSON-LD `Person` structured data
- Shared `SectionHeading`, `useScrollReveal`, and `ImageFallback` (used by both project thumbnails and blog covers) to avoid duplicated code across sections
- Accessibility: skip link, focus-visible rings, focus trap + Escape-to-close + scroll lock on the project modal, `aria-invalid`/`aria-describedby` on form fields, reduced-motion support throughout

## Optional: enable real contact-form emails

Copy `.env.example` to `.env.local` and fill in a [Resend](https://resend.com) API key plus the address you want messages sent to. Without this, submissions still validate and "succeed" from the user's perspective but only get logged server-side — fine for local dev, but wire it up before deploying if you want to actually receive messages.

## Assets you'll need to add

- `public/resume.pdf` — your resume
- `public/og-image.png` — 1200×630 social preview image
- `public/images/projects/*.png` — project screenshots (`constants/projects.ts`)
- `public/images/blog/*.png` — blog cover images (`constants/blog.ts`)
- Until the above exist, cards render a generated placeholder automatically — no code changes needed once real files are added
- Update social links in `constants/index.ts` (`DOCK_LINKS`) and `components/contact/Contact.tsx` (`QUICK_LINKS`) to your real profiles
- Update project data in `constants/projects.ts`, blog posts in `constants/blog.ts`, and open-source contributions in `constants/open-source.ts` — all currently sample content
- Update `SITE_URL` in `app/layout.tsx`, `app/sitemap.ts`, and `app/robots.ts` once you have a domain

## Notes

- Custom cursor auto-disables on touch devices and when the OS "reduce motion" setting is on.
- All animation entry points check `useReducedMotion()` before running.
