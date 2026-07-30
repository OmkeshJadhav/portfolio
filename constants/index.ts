import type { NavSection, DockLink, Skill, ExperienceItem } from "@/types";

export const NAV_SECTIONS: NavSection[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "blogs", label: "Blogs" },
  { id: "open-source", label: "Open Source" },
  { id: "contact", label: "Contact" },
];

export const DOCK_LINKS: DockLink[] = [
  { id: "email", label: "Email", href: "mailto:omkesh.jadhav@example.com", icon: "Mail" },
  { id: "github", label: "GitHub", href: "https://github.com/omkeshjadhav", icon: "Github", external: true },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/omkeshjadhav", icon: "Linkedin", external: true },
  { id: "resume", label: "Resume", href: "/resume.pdf", icon: "FileText" },
  { id: "twitter", label: "Twitter / X", href: "https://x.com/omkeshjadhav", icon: "Twitter", external: true },
  { id: "leetcode", label: "LeetCode", href: "https://leetcode.com/omkeshjadhav", icon: "Code2", external: true },
  { id: "medium", label: "Medium", href: "https://medium.com/@omkeshjadhav", icon: "BookOpen", external: true },
  { id: "blog", label: "Blog", href: "/blog", icon: "PenLine" },
];

export const SKILLS: Skill[] = [
  { name: "React", category: "frontend" },
  { name: "Next.js", category: "frontend" },
  { name: "TypeScript", category: "frontend" },
  { name: "Tailwind CSS", category: "frontend" },
  { name: "Node.js", category: "backend" },
  { name: "Express", category: "backend" },
  { name: "MongoDB", category: "database" },
  { name: "PostgreSQL", category: "database" },
  { name: "Redis", category: "database" },
  { name: "Docker", category: "devops" },
  { name: "AWS", category: "devops" },
  { name: "Azure", category: "devops" },
  { name: "Git", category: "tools" },
];

export const HERO_COPY = {
  greeting: "Hi, I'm",
  name: "Omkesh Jadhav",
  role: "Full Stack Developer",
  description:
    "Building modern, scalable web applications using React, Next.js, Node.js and TypeScript.",
};

export const ABOUT_INTRO =
  "An Agriculture Engineer turned Full stack developer focused on building fast, accessible products end to end — from data models and APIs to the interfaces people actually touch. I care about the details that make software feel considered rather than assembled.";

export interface AboutInfoCard {
  label: string;
  value: string;
  icon: "Briefcase" | "Calendar" | "MapPin" | "Mail";
}

export const ABOUT_INFO_CARDS: AboutInfoCard[] = [
  { label: "Current Role", value: "Full Stack Developer", icon: "Briefcase" },
  { label: "Experience", value: "3+ Years", icon: "Calendar" },
  { label: "Location", value: "India", icon: "MapPin" },
  { label: "Email", value: "omkeshjadhav@gmail.com", icon: "Mail" },
];

// Maps each skill name to a lucide-react icon — approximations, not brand
// logos, kept intentionally simple and monochrome per the palette.
export const SKILL_ICON_MAP: Record<string, string> = {
  React: "Atom",
  "Next.js": "Triangle",
  TypeScript: "FileCode",
  "Tailwind CSS": "Wind",
  "Node.js": "Hexagon",
  Express: "Server",
  MongoDB: "Leaf",
  PostgreSQL: "Database",
  Redis: "Zap",
  Docker: "Box",
  AWS: "Cloud",
  Azure: "CloudCog",
  Git: "GitBranch",
};

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    company: "Mannlöwe Information Services",
    role: "Full Stack AI Engineer",
    duration: "Jan 2025 — Present",
    achievements: [
      "Led migration of a legacy dashboard to Next.js, cutting median load time by 40%",
      "Built and shipped a real-time notifications system used by 10k+ daily active users",
      "Mentored two junior engineers on TypeScript and component architecture",
    ],
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "PostgreSQL"],
  },
  {
    company: "Shekru Labs",
    role: "Software Developer",
    duration: "Oct 2022 — Dec 2024",
    achievements: [
      "Rebuilt the marketing site design system, reducing CSS bundle size by 35%",
      "Implemented CI/CD pipelines that cut deployment time from 20 minutes to under 4",
      "Collaborated directly with design to ship a11y-compliant components company-wide",
    ],
    technologies: ["JavaScript", "React", "Redux", "Tailwind CSS", "Express", "Node.js", "MongoDB"],
  },
];
