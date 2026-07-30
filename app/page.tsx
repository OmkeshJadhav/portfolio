import { Hero } from "@/components/home/Hero";
import { AnimatedStatement } from "@/components/home/AnimatedStatement";
import { About } from "@/components/home/About";
import { Skills } from "@/components/home/Skills";
import { Experience } from "@/components/home/Experience";
import { ProjectsGrid } from "@/components/projects/ProjectsGrid";
import { BlogsGrid } from "@/components/blog/BlogsGrid";
import { OpenSourceGrid } from "@/components/open-source/OpenSourceGrid";
import { Contact } from "@/components/contact/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <AnimatedStatement />
      <Skills />
      <ProjectsGrid />
      <Experience />
      <BlogsGrid />
      <OpenSourceGrid />
      <Contact />
    </>
  );
}
