// lib/render-linked-text.tsx
//
// Shared by app/blog/page.tsx and app/blog/[slug]/page.tsx.
// Turns simple markdown-style links — [visible text](url) — written in
// blog-posts.ts `content` strings into real anchor/Link elements. Kept
// out of any single page file so both the index and the per-post pages
// render links identically without duplicating this logic.

import type { ReactNode } from "react";
import Link from "next/link";

export function renderLinkedText(text: string): ReactNode[] {
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = linkPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const [, label, url] = match;
    const isInternal = url.startsWith("/");
    nodes.push(
      isInternal ? (
        <Link
          key={key++}
          href={url}
          className="text-purple-600 font-bold underline decoration-purple-200 underline-offset-2 hover:text-purple-700"
        >
          {label}
        </Link>
      ) : (
        <a
          key={key++}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-purple-600 font-bold underline decoration-purple-200 underline-offset-2 hover:text-purple-700"
        >
          {label}
        </a>
      )
    );
    lastIndex = linkPattern.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}