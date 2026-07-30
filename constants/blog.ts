import type { BlogPost } from "@/types";

// Placeholder posts — swap for your real writing. `url` can point at
// Medium, Dev.to, or an internal /blog/[slug] route if you add one later.
export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "server-components-mental-model",
    title: "A mental model for React Server Components that actually stuck",
    summary:
      "Most explanations of Server Components focus on the mechanics. This one focuses on the question I kept getting wrong: where does this code run, and why does that matter?",
    cover: "/images/blog/server-components.png",
    readTime: "7 min read",
    date: "2026-04-12",
    url: "https://medium.com/@omkeshjadhav/server-components-mental-model",
  },
  {
    slug: "postgres-indexes-that-mattered",
    title: "Three PostgreSQL indexes that cut our p95 latency in half",
    summary:
      "A walkthrough of the exact queries that were slow, how I found them with EXPLAIN ANALYZE, and the indexes that fixed them without a single schema migration headache.",
    cover: "/images/blog/postgres-indexes.png",
    readTime: "9 min read",
    date: "2026-02-03",
    url: "https://medium.com/@omkeshjadhav/postgres-indexes-that-mattered",
  },
  {
    slug: "lenis-gsap-smooth-scroll",
    title: "Getting Lenis and GSAP ScrollTrigger to actually agree with each other",
    summary:
      "The two libraries don't sync automatically, and the failure mode is subtle — animations that are just slightly, maddeningly out of phase with the scroll. Here's the fix.",
    cover: "/images/blog/lenis-gsap.png",
    readTime: "5 min read",
    date: "2025-11-20",
    url: "https://medium.com/@omkeshjadhav/lenis-gsap-smooth-scroll",
  },
  {
    slug: "debugging-a-race-condition",
    title: "Debugging a race condition that only happened on Tuesdays",
    summary:
      "Not a metaphor — an actual bug that only reproduced during a specific cron window. A log-first debugging story with an embarrassingly simple root cause.",
    cover: "/images/blog/race-condition.png",
    readTime: "6 min read",
    date: "2025-09-08",
    url: "https://medium.com/@omkeshjadhav/debugging-a-race-condition",
  },
];
