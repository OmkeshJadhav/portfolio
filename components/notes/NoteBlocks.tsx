import Image from "next/image";
import type { NoteBlock } from "@/types/notes";
import { cn } from "@/lib/utils";
import { CodeBlock } from "./CodeBlock";
import { NoteInline } from "./NoteInline";

/** Renders a converted answer — lists nest, and code/tables can sit inside list items. */
export function NoteBlocks({ blocks, depth = 0 }: { blocks: NoteBlock[]; depth?: number }) {
  return (
    <>
      {blocks.map((block, i) => (
        <Block key={i} block={block} depth={depth} />
      ))}
    </>
  );
}

function Block({ block, depth }: { block: NoteBlock; depth: number }) {
  switch (block.type) {
    case "paragraph":
      return (
        <p className="my-2 whitespace-pre-line">
          <NoteInline content={block.content} />
        </p>
      );

    case "heading":
      return (
        <h4 className="mb-2 mt-5 font-display text-base font-semibold tracking-tight first:mt-0">
          <NoteInline content={block.content} />
        </h4>
      );

    case "list": {
      const ListTag = block.ordered ? "ol" : "ul";
      return (
        <ListTag
          className={cn(
            "my-2 space-y-1.5 pl-5 marker:text-[var(--color-ink-soft)]",
            block.ordered ? "list-decimal" : depth === 0 ? "list-disc" : depth === 1 ? "list-[circle]" : "list-[square]"
          )}
        >
          {block.items.map((item, i) => (
            <li key={i} className="pl-1">
              <NoteInline content={item.content} />
              {item.children.length > 0 && <NoteBlocks blocks={item.children} depth={depth + 1} />}
            </li>
          ))}
        </ListTag>
      );
    }

    case "code":
      return <CodeBlock block={block} />;

    case "codeGroup":
      return (
        <div className="my-3 grid gap-3 md:grid-cols-2 [&>figure]:my-0">
          {block.blocks.map((code, i) => (
            <CodeBlock key={i} block={code} />
          ))}
        </div>
      );

    case "table":
      return (
        <div
          className="my-3 overflow-x-auto rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        >
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead style={{ backgroundColor: "var(--color-bg)" }}>
              <tr>
                {block.header.map((cell, i) => (
                  <th key={i} className="whitespace-pre-line border-b px-4 py-2.5 align-top font-semibold" style={{ borderColor: "var(--color-border)" }}>
                    <NoteInline content={cell} />
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r} className="border-b last:border-b-0" style={{ borderColor: "var(--color-border)" }}>
                  {row.map((cell, c) => (
                    <td key={c} className={cn("whitespace-pre-line px-4 py-2.5 align-top", c === 0 && "font-medium")}>
                      <NoteInline content={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case "callout":
      return (
        <div
          className="my-3 rounded-xl border-l-4 px-4 py-2"
          style={{
            borderColor: "var(--color-accent)",
            backgroundColor: "color-mix(in srgb, var(--color-accent) 7%, transparent)",
          }}
        >
          <NoteBlocks blocks={block.blocks} depth={depth} />
        </div>
      );

    case "image":
      return (
        <Image
          src={block.src}
          alt=""
          width={block.width}
          height={block.height}
          sizes="(min-width: 1024px) 720px, 100vw"
          className="my-3 h-auto max-w-full rounded-xl border"
          style={{ borderColor: "var(--color-border)" }}
        />
      );
  }
}
