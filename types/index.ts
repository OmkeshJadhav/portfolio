export type SectionId =
  | "home"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "blogs"
  | "open-source"
  | "contact";

export interface NavSection {
  id: SectionId;
  label: string;
}

export interface DockLink {
  id: string;
  label: string;
  href: string;
  icon: string; // lucide-react icon name, resolved in DockIcon
  external?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  overview: string;
  features: string[];
  architecture: string;
  challenges: string;
  techStack: string[];
  tags: string[];
  image: string;
  gallery: string[];
  github?: string;
  liveDemo?: string;
  featured?: boolean;
}

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  achievements: string[];
  technologies: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  cover: string;
  readTime: string;
  date: string;
  url: string;
}

export interface OpenSourceContribution {
  repository: string;
  contribution: string;
  prUrl: string;
  issueUrl?: string;
  technology: string;
  githubUrl: string;
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "database" | "devops" | "tools";
}
