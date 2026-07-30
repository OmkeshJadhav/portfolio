import type { OpenSourceContribution } from "@/types";

// Placeholder contributions — swap for your real merged PRs and issues.
export const OPEN_SOURCE_CONTRIBUTIONS: OpenSourceContribution[] = [
  {
    repository: "vercel/next.js",
    contribution: "Fixed a hydration mismatch warning triggered by next/image when used inside a Suspense boundary.",
    prUrl: "https://github.com/vercel/next.js/pull/00000",
    technology: "Next.js",
    githubUrl: "https://github.com/vercel/next.js",
  },
  {
    repository: "shadcn-ui/ui",
    contribution: "Added a `size` prop to the Skeleton component and updated the docs with usage examples.",
    prUrl: "https://github.com/shadcn-ui/ui/pull/00000",
    technology: "React",
    githubUrl: "https://github.com/shadcn-ui/ui",
  },
  {
    repository: "colinhacks/zod",
    contribution: "Reported and helped narrow down a type-inference edge case with discriminated unions and `.optional()`.",
    prUrl: "https://github.com/colinhacks/zod/pull/00000",
    issueUrl: "https://github.com/colinhacks/zod/issues/00000",
    technology: "TypeScript",
    githubUrl: "https://github.com/colinhacks/zod",
  },
  {
    repository: "darkroomengineering/lenis",
    contribution: "Documented a gotcha around syncing Lenis with GSAP ScrollTrigger that wasn't covered in the README.",
    prUrl: "https://github.com/darkroomengineering/lenis/pull/00000",
    technology: "Documentation",
    githubUrl: "https://github.com/darkroomengineering/lenis",
  },
];
