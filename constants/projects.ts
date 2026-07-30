import type { Project } from "@/types";

// Placeholder projects — swap descriptions, tech, links and gallery images
// for your real work. `image`/`gallery` paths are expected under /public;
// until real screenshots are added, ProjectThumbnail renders a generated
// placeholder instead of next/image.
export const PROJECTS: Project[] = [
  {
    slug: "orbit-analytics",
    title: "Orbit Analytics",
    description:
      "A real-time analytics dashboard for SaaS teams, with customizable widgets and live data streaming.",
    overview:
      "Orbit gives product teams a single view of usage, revenue and retention without waiting on a data team. I designed and built the full stack — ingestion pipeline, aggregation layer, and the dashboard itself.",
    features: [
      "Live-updating charts via WebSocket, no manual refresh",
      "Drag-and-drop dashboard builder with 12 widget types",
      "Role-based access control for teams and workspaces",
      "CSV and PDF export for any view",
    ],
    architecture:
      "Next.js frontend on Vercel, Node.js ingestion workers behind a queue, PostgreSQL for aggregates and Redis for the live-update layer. Events land in a queue, get batched and rolled up on a cron, then pushed to connected clients over WebSocket.",
    challenges:
      "The hardest part was keeping the live dashboard consistent under high write volume — batched rollups occasionally raced with client reads. Solved it with a version-stamped read model so the UI always renders a consistent snapshot, even mid-update.",
    techStack: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "Redis"],
    tags: ["Full Stack", "Real-time", "SaaS"],
    image: "/images/projects/orbit-analytics.png",
    gallery: [
      "/images/projects/orbit-analytics-1.png",
      "/images/projects/orbit-analytics-2.png",
      "/images/projects/orbit-analytics-3.png",
    ],
    github: "https://github.com/omkeshjadhav/orbit-analytics",
    liveDemo: "https://orbit-analytics.vercel.app",
    featured: true,
  },
  {
    slug: "commerce-kit",
    title: "CommerceKit",
    description:
      "A headless e-commerce starter with cart, checkout, and inventory sync built for speed.",
    overview:
      "CommerceKit is an opinionated starting point for small e-commerce teams who don't want to pay platform fees on every order. It handles catalog, cart, checkout and inventory sync out of the box.",
    features: [
      "Optimistic cart updates with offline queueing",
      "Stripe Checkout integration with webhook-driven order sync",
      "Inventory sync job that reconciles stock every 5 minutes",
      "Fully typed product schema shared between API and frontend",
    ],
    architecture:
      "Next.js App Router with server actions for cart mutations, Express API for order/inventory logic, MongoDB for catalog data, and a scheduled job for inventory reconciliation with a third-party supplier feed.",
    challenges:
      "Cart state needed to survive flaky mobile connections without duplicating orders on retry. Built an idempotency-key system so repeated submits from a dropped connection resolve to a single order.",
    techStack: ["Next.js", "TypeScript", "Express", "MongoDB", "Tailwind CSS"],
    tags: ["E-commerce", "Full Stack"],
    image: "/images/projects/commerce-kit.png",
    gallery: ["/images/projects/commerce-kit-1.png", "/images/projects/commerce-kit-2.png"],
    github: "https://github.com/omkeshjadhav/commerce-kit",
    liveDemo: "https://commerce-kit.vercel.app",
    featured: true,
  },
  {
    slug: "focusflow",
    title: "FocusFlow",
    description: "A minimal task and time-tracking app with keyboard-first navigation.",
    overview:
      "FocusFlow is a personal project I built to replace my own todo-app hopping habit. It's deliberately minimal: no tags, no priorities, just a daily list and a timer.",
    features: [
      "Full keyboard navigation, no mouse required for core flows",
      "Local-first storage with optional account sync",
      "Daily focus timer with gentle break reminders",
      "Weekly review view generated automatically from completed tasks",
    ],
    architecture:
      "React SPA with IndexedDB for local-first storage, syncing to a small Node.js API and PostgreSQL when a user opts into an account. Sync uses a simple last-write-wins strategy since conflicts are rare for single-user task lists.",
    challenges:
      "Getting local-first storage to feel instant while still syncing reliably in the background took a few iterations — settled on optimistic writes to IndexedDB first, with sync happening silently after.",
    techStack: ["React", "TypeScript", "Node.js", "PostgreSQL"],
    tags: ["Productivity", "Frontend"],
    image: "/images/projects/focusflow.png",
    gallery: ["/images/projects/focusflow-1.png", "/images/projects/focusflow-2.png"],
    github: "https://github.com/omkeshjadhav/focusflow",
    liveDemo: "https://focusflow.app",
  },
  {
    slug: "devlog-cms",
    title: "Devlog CMS",
    description: "A lightweight, git-backed CMS for developer blogs — write in markdown, publish on push.",
    overview:
      "Devlog CMS lets developers write posts in markdown in their own repo and get a fast, SEO-friendly blog with zero database. It reads content directly from GitHub at build time.",
    features: [
      "Zero-database — content lives in a GitHub repo as markdown",
      "Incremental static regeneration so new posts appear within seconds",
      "Automatic OG image generation per post",
      "Full-text search across all published posts",
    ],
    architecture:
      "Next.js with ISR, GitHub's API for content fetching and webhook-triggered revalidation, and an edge function that generates OG images on demand using Satori.",
    challenges:
      "Needed search to work without a database or third-party service. Built a small inverted-index generated at build time and shipped as a static JSON file, queried client-side.",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS"],
    tags: ["Content", "Frontend"],
    image: "/images/projects/devlog-cms.png",
    gallery: ["/images/projects/devlog-cms-1.png"],
    github: "https://github.com/omkeshjadhav/devlog-cms",
    liveDemo: "https://devlog-cms.vercel.app",
  },
  {
    slug: "pulse-api",
    title: "Pulse API",
    description: "An uptime and status-page service with a public API, built for indie developers.",
    overview:
      "Pulse checks your endpoints on a schedule and gives you a public status page plus a webhook when something goes down. Built as a smaller, cheaper alternative for solo developers.",
    features: [
      "Configurable check intervals down to 30 seconds",
      "Public status page with historical uptime graph",
      "Webhook and email alerts on state change",
      "REST API for programmatic check management",
    ],
    architecture:
      "Node.js worker fleet running checks on a schedule via a queue, results written to PostgreSQL with a rollup job for the uptime graph, Express REST API, and a Next.js status-page frontend deployed per customer.",
    challenges:
      "Needed checks to run reliably even if a single worker crashed mid-cycle. Moved to a queue-based dispatch model with visibility timeouts so a stalled check gets picked up by another worker automatically.",
    techStack: ["Node.js", "Express", "PostgreSQL", "Docker", "AWS"],
    tags: ["API", "Infrastructure"],
    image: "/images/projects/pulse-api.png",
    gallery: ["/images/projects/pulse-api-1.png", "/images/projects/pulse-api-2.png"],
    github: "https://github.com/omkeshjadhav/pulse-api",
    liveDemo: "https://pulse-api.dev",
  },
];
