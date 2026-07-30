import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/types";
import { BlogCover } from "./BlogCover";

interface BlogCardProps {
  post: BlogPost;
  index: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noopener noreferrer"
      data-cursor="pointer"
      data-reveal
      className="group flex h-full flex-col overflow-hidden rounded-[var(--radius-card)] border transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(0,0,0,0.12)]"
      style={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)" }}
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden">
        <BlogCover
          src={post.cover}
          alt=""
          title={post.title}
          index={index}
          className="transition-transform duration-500 ease-[var(--ease-out-soft)] group-hover:scale-[1.06]"
        />
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div
          className="mb-3 flex items-center gap-2 text-xs font-medium"
          style={{ color: "var(--color-ink-soft)" }}
        >
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readTime}</span>
        </div>

        <h3 className="mb-2 text-lg font-semibold leading-snug tracking-tight sm:text-xl">
          {post.title}
        </h3>

        <p className="mb-6 flex-1 text-sm leading-relaxed" style={{ color: "var(--color-ink-soft)" }}>
          {post.summary}
        </p>

        <span
          className="inline-flex items-center gap-1.5 text-sm font-medium"
          style={{ color: "var(--color-accent)" }}
        >
          <span className="relative">
            Read More
            <span
              aria-hidden
              className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover:scale-x-100"
            />
          </span>
          <ArrowUpRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
        </span>
      </div>
    </a>
  );
}
