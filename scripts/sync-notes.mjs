#!/usr/bin/env node
/**
 * Converts the interview-notes .docx files in content/notes-src/ into the
 * JSON files in content/notes/ that the /notes pages render (shape:
 * types/notes.ts). Images are copied to public/notes/<topic>/.
 *
 *   npm run sync-notes
 *
 * Conventions the converter relies on (true for all the Google Docs exports):
 *   - Heading 1                    → section ("INDEX" sections are skipped)
 *   - numbered heading             → question. The heading level used for
 *                                    questions is detected per document.
 *   - unnumbered heading between   → subsection (e.g. React › Hooks › useState)
 *     Heading 1 and question level
 *   - headings deeper than that    → sub-heading inside the answer
 *   - bullets / numbered lists     → nested lists
 *   - table whose text is monospace→ code block (a short plain row above
 *                                    the code is used as its filename;
 *                                    side-by-side cells → code group)
 *   - consecutive monospace lines  → code block
 *   - any other table              → table (first row is the header)
 *
 * File name → topic: a leading number sets the card order ("3.1 Output Based
 * Questions.docx" → order 3.1) and "Interview Q & A" is dropped from the
 * title ("1. HTML Interview Q & A.docx" → slug "html").
 */
import fs from "node:fs";
import path from "node:path";
import JSZip from "jszip";
import { DOMParser } from "@xmldom/xmldom";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const SRC_DIR = path.join(ROOT, "content/notes-src");
const OUT_DIR = path.join(ROOT, "content/notes");
const PUBLIC_DIR = path.join(ROOT, "public/notes");

const MONO_FONTS = new Set([
  "Roboto Mono", "Nova Mono", "Courier New", "Courier", "Consolas", "Source Code Pro",
  "Inconsolata", "Cousine", "Fira Code", "Fira Mono", "Ubuntu Mono", "Menlo", "Monaco",
  "JetBrains Mono", "Space Mono", "IBM Plex Mono", "PT Mono", "Lucida Console",
]);
const EMU_PER_PX = 9525;

// ---------------------------------------------------------------- helpers

const children = (el, name) =>
  el ? Array.from(el.childNodes).filter((n) => n.nodeType === 1 && (!name || n.nodeName === name)) : [];
const child = (el, name) => children(el, name)[0] ?? null;
const attr = (el, name) => (el ? el.getAttribute(name) : null) || null;

function slugify(text, max = 60) {
  return (
    text
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[’'`"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, max)
      .replace(/-+$/g, "") || "item"
  );
}

function uniqueId(base, used) {
  let id = base;
  for (let n = 2; used.has(id); n++) id = `${base}-${n}`;
  used.add(id);
  return id;
}

function cleanText(text) {
  return text.replace(/ /g, " ").replace(/[​﻿]/g, "");
}

function topicFromFilename(file) {
  const base = file.replace(/\.docx$/i, "");
  const num = base.match(/^(\d+(?:\.\d+)*)\.?[\s_]+/);
  const title = base
    .slice(num ? num[0].length : 0)
    .replace(/_/g, " ")
    .replace(/\binterview\s*q\s*&\s*a\b/i, "")
    .replace(/\s+/g, " ")
    .trim();
  return { title, slug: slugify(title), order: num ? Number.parseFloat(num[1]) : 999 };
}

// ---------------------------------------------------------- code language

function langFromFilename(filename) {
  const ext = filename?.match(/\.([a-z0-9]+)$/i)?.[1]?.toLowerCase();
  const map = { js: "javascript", mjs: "javascript", cjs: "javascript", jsx: "jsx", ts: "typescript",
    tsx: "tsx", css: "css", scss: "scss", html: "html", json: "json", sh: "bash", sql: "sql", md: "markdown" };
  return ext ? map[ext] ?? null : null;
}

function defaultLang(slug) {
  if (/react|next/.test(slug)) return "jsx";
  if (/typescript/.test(slug)) return "typescript";
  if (/postgres|sql/.test(slug)) return "sql";
  if (/git/.test(slug)) return "bash";
  return "javascript";
}

function guessLang(code, filename, slug) {
  const fromName = langFromFilename(filename);
  if (fromName) return fromName;
  const src = code.trim();
  const fallback = defaultLang(slug);
  if (/^\$ |^(git|npm|npx|yarn|pnpm|cd|mkdir) /m.test(src.split("\n")[0])) return "bash";
  if (/^\s*(SELECT\b[\s\S]*\bFROM\b|INSERT\s+INTO\b|UPDATE\s+\w+\s+SET\b|DELETE\s+FROM\b|CREATE\s+(TABLE|INDEX|DATABASE|VIEW)\b)/i.test(src)) return "sql";
  const looksJs = /\b(function|const|let|var|return|=>|import|console\.)\b|=>/.test(src);
  if (/^<(!doctype|[a-z])/i.test(src) && !looksJs) return "html";
  if (!looksJs && /[^{}();=]+\{[^{}]*?[a-z-]+\s*:\s*[^;{}]+;?[^{}]*\}/i.test(src)) return "css";
  return fallback;
}

// -------------------------------------------------------------- converter

class DocxConverter {
  constructor(zip, slug) {
    this.zip = zip;
    this.slug = slug;
    this.warnings = [];
    this.images = [];
    this.stats = { code: 0, tables: 0, images: 0 };
  }

  async load() {
    const read = async (p) => {
      const file = this.zip.file(p);
      return file ? new DOMParser().parseFromString(await file.async("string"), "text/xml") : null;
    };
    this.doc = await read("word/document.xml");
    const rels = await read("word/_rels/document.xml.rels");
    this.rels = new Map();
    for (const rel of Array.from(rels?.getElementsByTagName("Relationship") ?? [])) {
      this.rels.set(attr(rel, "Id"), attr(rel, "Target"));
    }
    this.numFormats = new Map(); // numId → Map(ilvl → numFmt)
    const numbering = await read("word/numbering.xml");
    if (numbering) {
      const abstract = new Map();
      for (const a of Array.from(numbering.getElementsByTagName("w:abstractNum"))) {
        const lvls = new Map();
        for (const lvl of children(a, "w:lvl")) {
          lvls.set(attr(lvl, "w:ilvl"), attr(child(lvl, "w:numFmt"), "w:val"));
        }
        abstract.set(attr(a, "w:abstractNumId"), lvls);
      }
      for (const num of Array.from(numbering.getElementsByTagName("w:num"))) {
        const absId = attr(child(num, "w:abstractNumId"), "w:val");
        this.numFormats.set(attr(num, "w:numId"), abstract.get(absId) ?? new Map());
      }
    }
  }

  // ---- paragraph inspection

  paraInfo(p) {
    const pPr = child(p, "w:pPr");
    const style = attr(child(pPr, "w:pStyle"), "w:val") ?? "";
    const numPr = child(pPr, "w:numPr");
    const numId = attr(child(numPr, "w:numId"), "w:val");
    let level = null;
    let ordered = false;
    if (numPr && numId && numId !== "0") {
      level = Number(attr(child(numPr, "w:ilvl"), "w:val") ?? 0);
      const fmt = this.numFormats.get(numId)?.get(String(level));
      ordered = Boolean(fmt && fmt !== "bullet" && fmt !== "none");
    }
    const headingMatch = style.match(/^Heading(\d)$/);
    const runs = this.runs(p);
    const text = cleanText(runs.map((r) => r.text).join(""));
    const visible = runs.filter((r) => r.text.trim());
    const total = visible.reduce((n, r) => n + r.text.length, 0);
    const mono = visible.reduce((n, r) => n + (r.mono ? r.text.length : 0), 0);
    return {
      style,
      heading: headingMatch ? Number(headingMatch[1]) : null,
      isTitle: style === "Title" || style === "Subtitle",
      level,
      ordered,
      runs,
      text,
      mono: total > 0 && mono / total > 0.8,
      images: runs.filter((r) => r.image).map((r) => r.image),
    };
  }

  /** Flattens a paragraph into text runs with formatting, following hyperlinks/insertions. */
  runs(p) {
    const out = [];
    const walk = (node, href) => {
      for (const el of children(node)) {
        if (el.nodeName === "w:pPr" || el.nodeName === "w:rPr") continue;
        if (el.nodeName === "w:hyperlink") {
          const target = this.rels.get(attr(el, "r:id"));
          walk(el, target && !attr(el, "w:anchor") ? target : href);
        } else if (el.nodeName === "w:r") {
          out.push(...this.run(el, href));
        } else if (el.nodeName !== "w:del" && el.nodeName !== "w:moveFrom") {
          walk(el, href);
        }
      }
    };
    walk(p, null);
    return out;
  }

  run(r, href) {
    const rPr = child(r, "w:rPr");
    const on = (name) => {
      const el = child(rPr, name);
      if (!el) return false;
      const v = attr(el, "w:val");
      return v === null || (v !== "0" && v !== "false" && v !== "none");
    };
    const fonts = child(rPr, "w:rFonts");
    const font = attr(fonts, "w:ascii") ?? attr(fonts, "w:hAnsi") ?? attr(fonts, "w:cs");
    const base = { bold: on("w:b"), italic: on("w:i"), mono: MONO_FONTS.has(font), href };
    const out = [];
    let text = "";
    const flush = () => {
      if (text) out.push({ ...base, text });
      text = "";
    };
    for (const el of children(r)) {
      if (el.nodeName === "w:t") text += el.textContent ?? "";
      else if (el.nodeName === "w:tab") text += "\t";
      else if (el.nodeName === "w:br" || el.nodeName === "w:cr") text += "\n";
      else if (el.nodeName === "w:noBreakHyphen") text += "-";
      else if (el.nodeName === "w:drawing") {
        flush();
        const image = this.image(el);
        if (image) out.push({ ...base, text: "", image });
      }
    }
    flush();
    return out;
  }

  image(drawing) {
    const blip = drawing.getElementsByTagName("a:blip")[0];
    const target = this.rels.get(attr(blip, "r:embed"));
    if (!target) return null;
    const extent = drawing.getElementsByTagName("wp:extent")[0];
    const name = path.basename(target);
    this.images.push({ zipPath: path.posix.join("word", target), name });
    this.stats.images++;
    return {
      type: "image",
      src: `/notes/${this.slug}/${name}`,
      width: Math.round(Number(attr(extent, "cx") ?? 0) / EMU_PER_PX) || 600,
      height: Math.round(Number(attr(extent, "cy") ?? 0) / EMU_PER_PX) || 400,
    };
  }

  /** Runs → merged inline spans, with `backtick` text turned into inline code. */
  inline(runs, { trim = true } = {}) {
    const spans = [];
    for (const r of runs) {
      if (!r.text) continue;
      const text = cleanText(r.text).replace(/\n/g, " ");
      const parts = r.mono ? [[text, true]] : text.split(/(`[^`\n]+`)/).map((t, i) => (i % 2 ? [t.slice(1, -1), true] : [t, false]));
      for (const [t, code] of parts) {
        if (!t) continue;
        const span = { text: t };
        if (r.bold && !code) span.bold = true;
        if (r.italic && !code) span.italic = true;
        if (code) span.code = true;
        if (r.href) span.href = r.href;
        const prev = spans.at(-1);
        if (prev && prev.bold === span.bold && prev.italic === span.italic && prev.code === span.code && prev.href === span.href) {
          prev.text += t;
        } else spans.push(span);
      }
    }
    if (trim && spans.length) {
      spans[0].text = spans[0].text.replace(/^\s+/, "");
      spans.at(-1).text = spans.at(-1).text.replace(/\s+$/, "");
    }
    return spans.filter((s) => s.text);
  }

  codeText(lines) {
    const out = lines.map((l) => cleanText(l).replace(/\s+$/, ""));
    while (out.length && !out[0].trim()) out.shift();
    while (out.length && !out.at(-1).trim()) out.pop();
    return out.join("\n");
  }

  codeBlock(code, filename) {
    this.stats.code++;
    const block = { type: "code", code, lang: guessLang(code, filename, this.slug) };
    if (filename) block.filename = filename;
    return block;
  }

  // ---- tables

  cellInfo(tc) {
    const paras = children(tc, "w:p").map((p) => this.paraInfo(p));
    const nonEmpty = paras.filter((p) => p.text.trim());
    return {
      paras,
      text: paras.map((p) => p.text).join("\n").trim(),
      mono: nonEmpty.length > 0 && nonEmpty.filter((p) => p.mono).length / nonEmpty.length >= 0.6,
      empty: nonEmpty.length === 0,
    };
  }

  table(tbl) {
    const rows = children(tbl, "w:tr").map((tr) => children(tr, "w:tc").map((tc) => this.cellInfo(tc)));
    const cols = Math.max(0, ...rows.map((r) => r.length));
    const cells = rows.flat().filter((c) => !c.empty);
    if (!cells.length) return [];

    const code = (cell, filename) => this.codeBlock(this.codeText(cell.paras.map((p) => p.text)), filename);

    if (cols > 1 && cells.every((c) => c.mono)) {
      return rows.map((r) => {
        const blocks = r.filter((c) => !c.empty).map((c) => code(c));
        return blocks.length === 1 ? blocks[0] : { type: "codeGroup", blocks };
      });
    }

    if (cols === 1) {
      const out = [];
      let filename = null;
      rows.forEach((r, i) => {
        const cell = r[0];
        if (!cell || cell.empty) return;
        const next = rows.slice(i + 1).find((nr) => nr[0] && !nr[0].empty)?.[0];
        if (cell.mono) {
          out.push(code(cell, filename));
          filename = null;
        } else if (next?.mono && !cell.text.includes("\n") && cell.text.length <= 60) {
          filename = cell.text.trim();
        } else {
          out.push({ type: "callout", blocks: this.cellBlocks(cell) });
        }
      });
      return out;
    }

    this.stats.tables++;
    const toCell = (cell) => {
      const spans = [];
      cell.paras
        .filter((p) => p.text.trim())
        .forEach((p, i) => {
          if (i > 0) spans.push({ text: "\n" });
          if (p.level !== null) spans.push({ text: "• " });
          spans.push(...this.inline(p.runs));
        });
      return spans;
    };
    const [head = [], ...body] = rows.map((r) => {
      const padded = [...r];
      while (padded.length < cols) padded.push({ paras: [] });
      return padded.map(toCell);
    });
    return [{ type: "table", header: head, rows: body }];
  }

  cellBlocks(cell) {
    return cell.paras
      .filter((p) => p.text.trim())
      .map((p) => ({ type: "paragraph", content: this.inline(p.level !== null ? [{ text: "• " }, ...p.runs] : p.runs) }));
  }

  // ---- document walk

  detectQuestionHeading(paras) {
    const counts = new Map();
    for (const p of paras) {
      if (p.heading && p.heading > 1 && p.level === 0 && p.text.trim()) {
        counts.set(p.heading, (counts.get(p.heading) ?? 0) + 1);
      }
    }
    const best = [...counts.entries()].sort((a, b) => b[1] - a[1])[0];
    return best ? best[0] : 2;
  }

  convert(meta) {
    const body = this.doc.getElementsByTagName("w:body")[0];
    const elements = children(body)
      .filter((el) => el.nodeName === "w:p" || el.nodeName === "w:tbl")
      .map((el) => (el.nodeName === "w:p" ? { kind: "p", info: this.paraInfo(el) } : { kind: "tbl", el }));
    const qLevel = this.detectQuestionHeading(elements.filter((e) => e.kind === "p").map((e) => e.info));

    // Section and question ids share the page's DOM — keep them unique together.
    const ids = new Set(["notes-content", "main-content"]);
    const sections = [];
    let section = null;
    let subsection = null;
    let question = null;
    let skipping = false; // inside an INDEX section
    let listStack = []; // [{ level, list }]
    let openCode = null; // code block being built from monospace paragraphs
    let blankLines = 0;
    let dropped = 0;

    const ensureSubsection = (title = null) => {
      if (!section) {
        section = { id: uniqueId("notes", ids), title: null, subsections: [] };
        sections.push(section);
      }
      if (!subsection || title !== null) {
        subsection = { id: uniqueId(title ? slugify(title) : `${section.id}-intro`, ids), title, questions: [] };
        section.subsections.push(subsection);
      }
    };
    const closeList = () => (listStack = []);
    const resetCode = () => {
      openCode = null;
      blankLines = 0;
    };
    // Code, tables and images that follow a bullet belong to that bullet.
    const emit = (block) => {
      if (listStack.length) {
        const items = listStack.at(-1).list.items;
        items.at(-1).children.push(block);
      } else question.blocks.push(block);
    };

    for (const element of elements) {
      if (element.kind === "tbl") {
        if (!question || skipping) {
          dropped++;
          continue;
        }
        resetCode();
        this.table(element.el).forEach(emit);
        continue;
      }

      const p = element.info;
      const text = p.text.trim();
      if (p.isTitle) continue;

      // Heading-styled paragraphs that sit inside a list are just list items.
      const heading = p.heading && !(p.level && p.level > 0) ? p.heading : null;

      if (heading && heading < qLevel) {
        if (!text) continue;
        closeList();
        resetCode();
        question = null;
        if (heading === 1) {
          skipping = /^index$/i.test(text);
          if (skipping) continue;
          section = { id: uniqueId(slugify(text), ids), title: text, subsections: [] };
          sections.push(section);
          subsection = null;
        } else if (!skipping) {
          ensureSubsection(text);
        }
        continue;
      }

      if (heading === qLevel) {
        if (!text) continue;
        closeList();
        resetCode();
        if (skipping) continue;
        ensureSubsection();
        // A trailing "**" is a personal marker in some docs, not part of the question.
        const title = text.replace(/\s+/g, " ").replace(/\s*\*\*$/, "");
        question = { id: uniqueId(slugify(title), ids), title, blocks: [] };
        subsection.questions.push(question);
        continue;
      }

      if (!question || skipping) {
        if (text) dropped++;
        continue;
      }

      if (heading) {
        if (!text) continue;
        closeList();
        resetCode();
        question.blocks.push({ type: "heading", content: this.inline(p.runs) });
        continue;
      }

      for (const image of p.images) {
        resetCode();
        emit(image);
      }

      if (!text) {
        if (openCode) blankLines++;
        continue;
      }

      if (p.level !== null) {
        resetCode();
        const item = { content: this.inline(p.runs), children: [] };
        while (listStack.length && listStack.at(-1).level > p.level) listStack.pop();
        const top = listStack.at(-1);
        if (top && top.level === p.level) {
          top.list.items.push(item);
        } else {
          const list = { type: "list", ordered: p.ordered, items: [item] };
          if (top) top.list.items.at(-1).children.push(list);
          else question.blocks.push(list);
          listStack.push({ level: p.level, list });
        }
        continue;
      }

      if (p.mono) {
        const line = p.runs.map((r) => r.text).join("");
        if (openCode) {
          openCode.lines.push(...Array(blankLines).fill(""), line);
          openCode.block.code = this.codeText(openCode.lines);
          openCode.block.lang = guessLang(openCode.block.code, null, this.slug);
        } else {
          const block = this.codeBlock(this.codeText([line]));
          openCode = { block, lines: [line] };
          emit(block);
        }
        blankLines = 0;
        continue;
      }

      closeList();
      resetCode();
      question.blocks.push({ type: "paragraph", content: this.inline(p.runs) });
    }

    // Unanswered questions are placeholders in the docs — leave them off the
    // site until they have an answer. Then drop containers left empty.
    for (const s of sections) {
      for (const ss of s.subsections) {
        for (const q of ss.questions) if (!q.blocks.length) this.warnings.push(`skipped (no answer yet): "${q.title}"`);
        ss.questions = ss.questions.filter((q) => q.blocks.length);
      }
      s.subsections = s.subsections.filter((ss) => ss.questions.length);
    }
    const kept = sections.filter((s) => s.subsections.length);
    const questions = kept.flatMap((s) => s.subsections.flatMap((ss) => ss.questions));

    if (dropped) this.warnings.push(`${dropped} paragraph(s)/table(s) outside any question were skipped`);

    return { ...meta, questionCount: questions.length, sections: kept };
  }
}

// ------------------------------------------------------------------- main

async function main() {
  const files = fs.readdirSync(SRC_DIR).filter((f) => f.toLowerCase().endsWith(".docx") && !f.startsWith("~$"));
  if (!files.length) {
    console.error(`No .docx files found in ${path.relative(ROOT, SRC_DIR)}`);
    process.exit(1);
  }

  fs.rmSync(OUT_DIR, { recursive: true, force: true });
  fs.rmSync(PUBLIC_DIR, { recursive: true, force: true });
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const seen = new Map();
  const summary = [];
  for (const file of files.sort()) {
    const meta = topicFromFilename(file);
    if (seen.has(meta.slug)) {
      console.error(`✖ "${file}" and "${seen.get(meta.slug)}" both map to /notes/${meta.slug} — rename one.`);
      process.exit(1);
    }
    seen.set(meta.slug, file);

    const zip = await JSZip.loadAsync(fs.readFileSync(path.join(SRC_DIR, file)));
    const converter = new DocxConverter(zip, meta.slug);
    await converter.load();
    const topic = converter.convert({ slug: meta.slug, title: meta.title, order: meta.order, source: file });

    fs.writeFileSync(path.join(OUT_DIR, `${meta.slug}.json`), JSON.stringify(topic, null, 2) + "\n");
    if (converter.images.length) {
      const dir = path.join(PUBLIC_DIR, meta.slug);
      fs.mkdirSync(dir, { recursive: true });
      for (const img of converter.images) {
        const data = await zip.file(img.zipPath)?.async("nodebuffer");
        if (data) fs.writeFileSync(path.join(dir, img.name), data);
      }
    }

    summary.push({
      topic: `/notes/${meta.slug}`,
      sections: topic.sections.filter((s) => s.title).length,
      questions: topic.questionCount,
      code: converter.stats.code,
      tables: converter.stats.tables,
      images: converter.stats.images,
    });
    for (const w of converter.warnings) console.warn(`  ⚠ ${file}: ${w}`);
  }
  console.table(summary);
  console.log(`Wrote ${summary.length} topic(s) to ${path.relative(ROOT, OUT_DIR)}/`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
