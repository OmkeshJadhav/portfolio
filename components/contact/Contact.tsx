"use client";

import { useRef } from "react";
import { Mail, Linkedin, Github, FileText, ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ContactForm } from "./ContactForm";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

const QUICK_LINKS = [
  { label: "Email", value: "omkesh.jadhav@example.com", href: "mailto:omkesh.jadhav@example.com", icon: Mail },
  { label: "LinkedIn", value: "/in/omkeshjadhav", href: "https://linkedin.com/in/omkeshjadhav", icon: Linkedin },
  { label: "GitHub", value: "/omkeshjadhav", href: "https://github.com/omkeshjadhav", icon: Github },
  { label: "Resume", value: "Download PDF", href: "/resume.pdf", icon: FileText },
];

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="border-t px-6 py-32 md:px-12 lg:px-20"
      style={{ borderColor: "var(--color-border)" }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Contact"
          title="Let's talk"
          description="Open to full-time roles, freelance work, or just a good conversation about what you're building."
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <ul className="flex flex-col gap-3">
            {QUICK_LINKS.map(({ label, value, href, icon: Icon }) => (
              <li key={label} data-reveal>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  data-cursor="pointer"
                  className="group flex items-center justify-between gap-4 rounded-[var(--radius-card)] border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--color-accent)]"
                  style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-4 w-4" strokeWidth={1.75} style={{ color: "var(--color-accent)" }} />
                    <span>
                      <span className="block text-sm font-medium">{label}</span>
                      <span className="block text-xs" style={{ color: "var(--color-ink-soft)" }}>
                        {value}
                      </span>
                    </span>
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    strokeWidth={1.75}
                    style={{ color: "var(--color-ink-soft)" }}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div data-reveal>
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
