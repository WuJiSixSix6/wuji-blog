import { Marked, type TokenizerAndRendererExtension } from 'marked';
import katex from 'katex';
import hljs from 'highlight.js/lib/core';
import typescript from 'highlight.js/lib/languages/typescript';
import javascript from 'highlight.js/lib/languages/javascript';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import bash from 'highlight.js/lib/languages/bash';
import nginx from 'highlight.js/lib/languages/nginx';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import markdownLang from 'highlight.js/lib/languages/markdown';
import yaml from 'highlight.js/lib/languages/yaml';
import sql from 'highlight.js/lib/languages/sql';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import diff from 'highlight.js/lib/languages/diff';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import java from 'highlight.js/lib/languages/java';
import latex from 'highlight.js/lib/languages/latex';
import dockerfile from 'highlight.js/lib/languages/dockerfile';
import type { Post, PostFrontmatter, TocItem } from '../types/blog';

hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('tsx', typescript);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('jsx', javascript);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('shell', bash);
hljs.registerLanguage('nginx', nginx);
hljs.registerLanguage('json', json);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('markdown', markdownLang);
hljs.registerLanguage('md', markdownLang);
hljs.registerLanguage('yaml', yaml);
hljs.registerLanguage('yml', yaml);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('diff', diff);
hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c++', cpp);
hljs.registerLanguage('java', java);
hljs.registerLanguage('latex', latex);
hljs.registerLanguage('tex', latex);
hljs.registerLanguage('dockerfile', dockerfile);
hljs.registerLanguage('docker', dockerfile);

const rawModules = import.meta.glob<string>('../content/posts/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
});

interface PostStub {
  slug: string;
  title: string;
  category: string;
  date: string;
}

function parseFrontmatter(raw: string): { data: Partial<PostFrontmatter>; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    return { data: {}, body: raw };
  }

  const yamlBlock = match[1];
  const body = match[2];
  const data: Record<string, unknown> = {};

  for (const rawLine of yamlBlock.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith('#')) continue;
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) continue;

    const key = line.slice(0, colonIdx).trim();
    let val = line.slice(colonIdx + 1).trim();

    if (val.startsWith('[') && val.endsWith(']')) {
      const inner = val.slice(1, -1).trim();
      data[key] = inner
        ? inner
            .split(',')
            .map((item) => item.trim().replace(/^["']|["']$/g, ''))
            .filter(Boolean)
        : [];
    } else if (val === 'true' || val === 'false') {
      data[key] = val === 'true';
    } else {
      val = val.replace(/^["']|["']$/g, '');
      data[key] = val;
    }
  }

  return { data: data as Partial<PostFrontmatter>, body };
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]+>/g, '')
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .trim()
    .replace(/\s+/g, '-');
}

function computeStats(markdown: string): { wordCount: number; readingMinutes: number } {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/\$\$[\s\S]*?\$\$/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/[#>*_\-[\]()!]/g, ' ');
  const cjkChars = (plain.match(/[\u4e00-\u9fff]/g) || []).length;
  const latinWords = (plain.replace(/[\u4e00-\u9fff]/g, ' ').match(/[a-zA-Z0-9]+/g) || []).length;
  const wordCount = cjkChars + latinWords;
  const readingMinutes = Math.max(1, Math.ceil(cjkChars / 380 + latinWords / 200));
  return { wordCount, readingMinutes };
}

function renderKatexSafe(tex: string, displayMode: boolean): string {
  try {
    const rendered = katex.renderToString(tex.trim(), {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      trust: false,
    });
    if (displayMode) {
      return `<div class="katex-display-wrapper">${rendered}</div>`;
    }
    return `<span class="katex-inline-wrapper">${rendered}</span>`;
  } catch {
    return `<code class="katex-fallback">${escapeHtml(tex)}</code>`;
  }
}

function extractFootnotes(markdown: string): {
  cleaned: string;
  definitions: Map<string, string>;
} {
  const definitions = new Map<string, string>();
  const lines = markdown.split(/\r?\n/);
  const output: string[] = [];
  let inFence = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      inFence = !inFence;
      output.push(line);
      continue;
    }
    if (!inFence) {
      const defMatch = line.match(/^\[\^([^\]]+)\]:\s*(.+)$/);
      if (defMatch) {
        const id = defMatch[1].trim();
        let content = defMatch[2].trim();
        while (i + 1 < lines.length && /^(?: {2,4}|\t)\S/.test(lines[i + 1])) {
          i++;
          content += ' ' + lines[i].trim();
        }
        definitions.set(id, content);
        continue;
      }
    }
    output.push(line);
  }

  return { cleaned: output.join('\n'), definitions };
}

const CALLOUT_META: Record<string, { label: string; kind: string; icon: string }> = {
  NOTE: { label: '注记 · Note', kind: 'note', icon: '✦' },
  TIP: { label: '技巧 · Tip', kind: 'tip', icon: '💡' },
  IMPORTANT: { label: '要点 · Important', kind: 'important', icon: '◆' },
  WARNING: { label: '注意 · Warning', kind: 'warning', icon: '⚠' },
  CAUTION: { label: '警示 · Caution', kind: 'caution', icon: '❖' },
  QUOTE: { label: '引语 · Quote', kind: 'quote', icon: '❝' },
};

function renderMarkdown(markdown: string, postIndex: Map<string, PostStub>): { html: string; toc: TocItem[] } {
  const toc: TocItem[] = [];
  const usedIds = new Map<string, number>();
  const usedFootnotes: string[] = [];

  const { cleaned, definitions } = extractFootnotes(markdown);

  // 1. Block LaTeX: $$ ... $$ or \[ ... \]
  const blockMathExtension: TokenizerAndRendererExtension = {
    name: 'blockMath',
    level: 'block',
    start(src) {
      const idxDollar = src.indexOf('$$');
      const idxBracket = src.indexOf('\\[');
      if (idxDollar === -1) return idxBracket;
      if (idxBracket === -1) return idxDollar;
      return Math.min(idxDollar, idxBracket);
    },
    tokenizer(src) {
      const dollarMatch = src.match(/^\$\$([\s\S]+?)\$\$(?:\s*(?:\n|$))/);
      if (dollarMatch) {
        return {
          type: 'blockMath',
          raw: dollarMatch[0],
          text: dollarMatch[1].trim(),
        };
      }
      const bracketMatch = src.match(/^\\\[([\s\S]+?)\\\](?:\s*(?:\n|$))/);
      if (bracketMatch) {
        return {
          type: 'blockMath',
          raw: bracketMatch[0],
          text: bracketMatch[1].trim(),
        };
      }
      return undefined;
    },
    renderer(token) {
      return `${renderKatexSafe(String(token.text || ''), true)}\n`;
    },
  };

  // 2. Inline LaTeX: $ ... $ or \( ... \)
  const inlineMathExtension: TokenizerAndRendererExtension = {
    name: 'inlineMath',
    level: 'inline',
    start(src) {
      const idxDollar = src.indexOf('$');
      const idxParen = src.indexOf('\\(');
      if (idxDollar === -1) return idxParen;
      if (idxParen === -1) return idxDollar;
      return Math.min(idxDollar, idxParen);
    },
    tokenizer(src) {
      // Avoid matching $$ here (block display)
      if (src.startsWith('$$')) {
        const inlineDouble = src.match(/^\$\$([^\n$]+?)\$\$/);
        if (inlineDouble) {
          return {
            type: 'inlineMath',
            raw: inlineDouble[0],
            text: inlineDouble[1].trim(),
            display: true,
          };
        }
        return undefined;
      }
      const parenMatch = src.match(/^\\\((.+?)\\\)/);
      if (parenMatch) {
        return {
          type: 'inlineMath',
          raw: parenMatch[0],
          text: parenMatch[1].trim(),
          display: false,
        };
      }
      // Single dollar inline math: must not start with space after opening $ or end with space before closing $
      const dollarMatch = src.match(/^\$([^\s$](?:[^$\n]*?[^\s$])?)\$(?!\d)/);
      if (dollarMatch) {
        return {
          type: 'inlineMath',
          raw: dollarMatch[0],
          text: dollarMatch[1],
          display: false,
        };
      }
      return undefined;
    },
    renderer(token) {
      return renderKatexSafe(String(token.text || ''), Boolean(token.display));
    },
  };

  // 3. Highlight text: ==highlighted==
  const highlightExtension: TokenizerAndRendererExtension = {
    name: 'highlight',
    level: 'inline',
    start(src) {
      return src.indexOf('==');
    },
    tokenizer(src) {
      const match = src.match(/^==([^=\n](?:[^=\n]*?[^=\n])?)==/);
      if (match) {
        return {
          type: 'highlight',
          raw: match[0],
          text: match[1],
          tokens: this.lexer.inlineTokens(match[1]),
        };
      }
      return undefined;
    },
    renderer(token) {
      const inner = token.tokens ? this.parser.parseInline(token.tokens) : escapeHtml(String(token.text || ''));
      return `<mark class="wuji-mark">${inner}</mark>`;
    },
  };

  // 4. Obsidian-style internal article citation: [[slug]] or [[slug|Custom Label]]
  const wikiLinkExtension: TokenizerAndRendererExtension = {
    name: 'wikiLink',
    level: 'inline',
    start(src) {
      return src.indexOf('[[');
    },
    tokenizer(src) {
      const match = src.match(/^\[\[([^\]\n]+)\]\]/);
      if (match) {
        const inner = match[1].trim();
        const [rawTarget, rawAlias] = inner.split('|').map((s) => s.trim());
        return {
          type: 'wikiLink',
          raw: match[0],
          target: rawTarget,
          alias: rawAlias || '',
        };
      }
      return undefined;
    },
    renderer(token) {
      const target = String(token.target || '').replace(/^\d+-/, '').replace(/\.md$/, '');
      const alias = String(token.alias || '');
      let matched = postIndex.get(target);
      if (!matched) {
        for (const stub of postIndex.values()) {
          if (stub.title === target || stub.title.includes(target)) {
            matched = stub;
            break;
          }
        }
      }
      if (matched) {
        const label = alias || matched.title;
        return `<a href="/blog/${escapeHtml(matched.slug)}" data-internal-href="/blog/${escapeHtml(matched.slug)}" class="wuji-wikilink" title="站内文章引用：${escapeHtml(matched.title)}"><span class="wuji-wikilink-icon">↗</span><span>${escapeHtml(label)}</span><span class="wuji-wikilink-cat">${escapeHtml(matched.category)}</span></a>`;
      }
      return `<span class="wuji-wikilink wuji-wikilink-missing">${escapeHtml(alias || target)}</span>`;
    },
  };

  // 5. Footnote inline reference: [^1]
  const footnoteRefExtension: TokenizerAndRendererExtension = {
    name: 'footnoteRef',
    level: 'inline',
    start(src) {
      return src.indexOf('[^');
    },
    tokenizer(src) {
      const match = src.match(/^\[\^([^\]]+)\](?!:)/);
      if (match) {
        return {
          type: 'footnoteRef',
          raw: match[0],
          id: match[1].trim(),
        };
      }
      return undefined;
    },
    renderer(token) {
      const id = String(token.id || '');
      let idx = usedFootnotes.indexOf(id);
      if (idx === -1) {
        usedFootnotes.push(id);
        idx = usedFootnotes.length - 1;
      }
      const num = idx + 1;
      return `<sup class="wuji-fn-ref" id="fnref-${escapeHtml(id)}"><a href="#fn-${escapeHtml(id)}" title="查看脚注 ${num}">[${num}]</a></sup>`;
    },
  };

  const instance = new Marked({
    gfm: true,
    breaks: false,
  });

  instance.use({
    extensions: [
      blockMathExtension,
      inlineMathExtension,
      highlightExtension,
      wikiLinkExtension,
      footnoteRefExtension,
    ],
    renderer: {
      heading({ tokens, depth }) {
        const rendered = this.parser.parseInline(tokens);
        const plainText = rendered.replace(/<[^>]+>/g, '').trim();
        let id = slugifyHeading(plainText) || `section-${toc.length + 1}`;
        const count = usedIds.get(id) ?? 0;
        usedIds.set(id, count + 1);
        if (count > 0) id = `${id}-${count}`;

        if (depth === 2 || depth === 3) {
          toc.push({ id, text: plainText, level: depth });
        }
        return `<h${depth} id="${id}"><a class="heading-anchor" href="#${id}" aria-hidden="true">#</a>${rendered}</h${depth}>\n`;
      },
      code({ text, lang }) {
        const cleanLang = (lang || '').trim().split(/\s+/)[0].toLowerCase() || 'text';
        // Support ```math or ```latex fenced blocks rendered directly as KaTeX formulas!
        if (cleanLang === 'math') {
          return `${renderKatexSafe(text, true)}\n`;
        }
        let highlighted: string;
        if (cleanLang !== 'text' && hljs.getLanguage(cleanLang)) {
          highlighted = hljs.highlight(text, { language: cleanLang }).value;
        } else {
          highlighted = escapeHtml(text);
        }
        const encoded = encodeURIComponent(text);
        return `
<div class="code-block-wrapper">
  <div class="code-block-header">
    <div class="code-block-dots">
      <span style="background:#ef4444"></span>
      <span style="background:#f59e0b"></span>
      <span style="background:#10b981"></span>
    </div>
    <span class="code-block-lang">${escapeHtml(cleanLang)}</span>
    <button type="button" class="code-copy-btn" data-copy-code="${encoded}">Copy</button>
  </div>
  <pre><code class="hljs language-${escapeHtml(cleanLang)}">${highlighted}</code></pre>
</div>`;
      },
      blockquote({ tokens }) {
        const body = this.parser.parse(tokens);
        // Detect GitHub / Obsidian Callout syntax: > [!NOTE] optional title
        const calloutMatch = body.match(/^\s*<p>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|QUOTE)\](?:[ \t]*([^\n<]*))?(?:<br\s*\/?>|\n)?([\s\S]*?)<\/p>([\s\S]*)$/i);
        if (calloutMatch) {
          const typeKey = calloutMatch[1].toUpperCase();
          const meta = CALLOUT_META[typeKey] || CALLOUT_META.NOTE;
          const customTitle = calloutMatch[2]?.trim();
          const firstParaRest = calloutMatch[3]?.trim();
          const restBlocks = calloutMatch[4] || '';
          const innerHtml = `${firstParaRest ? `<p>${firstParaRest}</p>` : ''}${restBlocks}`;
          return `
<div class="wuji-callout wuji-callout-${meta.kind}">
  <div class="wuji-callout-title">
    <span class="wuji-callout-icon">${meta.icon}</span>
    <span>${escapeHtml(customTitle || meta.label)}</span>
  </div>
  <div class="wuji-callout-body">${innerHtml}</div>
</div>\n`;
        }
        return `<blockquote>${body}</blockquote>\n`;
      },
      image({ href, title, text }) {
        const safeHref = escapeHtml(href || '');
        const safeAlt = escapeHtml(text || '');
        const caption = title ? escapeHtml(title) : safeAlt;
        return `
<figure class="wuji-figure">
  <div class="wuji-figure-frame">
    <img src="${safeHref}" alt="${safeAlt}" loading="lazy" data-lightbox-src="${safeHref}" data-lightbox-alt="${caption}" />
  </div>
  ${caption ? `<figcaption class="wuji-figcaption">${caption}</figcaption>` : ''}
</figure>`;
      },
      table(token) {
        const headerCells = token.header
          .map((cell, i) => {
            const align = token.align[i] ? ` style="text-align:${token.align[i]}"` : '';
            return `<th${align}>${this.parser.parseInline(cell.tokens)}</th>`;
          })
          .join('');
        const bodyRows = token.rows
          .map((row) => {
            const cells = row
              .map((cell, i) => {
                const align = token.align[i] ? ` style="text-align:${token.align[i]}"` : '';
                return `<td${align}>${this.parser.parseInline(cell.tokens)}</td>`;
              })
              .join('');
            return `<tr>${cells}</tr>`;
          })
          .join('');
        return `<div class="table-wrapper"><table><thead><tr>${headerCells}</tr></thead><tbody>${bodyRows}</tbody></table></div>\n`;
      },
      link({ href, title, tokens }) {
        const text = this.parser.parseInline(tokens);
        const isExternal = href.startsWith('http://') || href.startsWith('https://');
        const isInternalBlog = href.startsWith('/blog/') || href.startsWith('/');
        const titleAttr = title ? ` title="${escapeHtml(title)}"` : '';
        if (isExternal) {
          return `<a href="${escapeHtml(href)}"${titleAttr} class="wuji-ext-link" target="_blank" rel="noopener noreferrer">${text}</a>`;
        }
        if (isInternalBlog && !href.startsWith('#')) {
          return `<a href="${escapeHtml(href)}"${titleAttr} data-internal-href="${escapeHtml(href)}">${text}</a>`;
        }
        return `<a href="${escapeHtml(href)}"${titleAttr}>${text}</a>`;
      },
    },
  });

  let html = instance.parse(cleaned) as string;

  // Render Footnotes section at bottom if any footnote references were used
  const footnoteIds = usedFootnotes.filter((id) => definitions.has(id));
  if (footnoteIds.length > 0) {
    const items = footnoteIds
      .map((id, i) => {
        const rawDef = definitions.get(id) || '';
        const renderedDef = instance.parseInline(rawDef) as string;
        return `<li id="fn-${escapeHtml(id)}"><span class="wuji-fn-num">${i + 1}.</span><span class="wuji-fn-text">${renderedDef}</span> <a class="wuji-fn-back" href="#fnref-${escapeHtml(id)}" title="返回正文">↩</a></li>`;
      })
      .join('');
    html += `\n<section class="wuji-footnotes"><div class="wuji-footnotes-title">注释与引用 · Footnotes</div><ol>${items}</ol></section>`;
  }

  return { html, toc };
}

function loadAllPosts(): Post[] {
  // Pass 1: parse frontmatter & build slug/title index for internal [[article]] citations
  const parsedEntries: { slug: string; data: Partial<PostFrontmatter>; body: string }[] = [];
  const postIndex = new Map<string, PostStub>();

  for (const [path, raw] of Object.entries(rawModules)) {
    const filename = path.split('/').pop() || '';
    const slug = filename.replace(/\.md$/, '').replace(/^\d+-/, '');
    const { data, body } = parseFrontmatter(raw);
    parsedEntries.push({ slug, data, body });
    postIndex.set(slug, {
      slug,
      title: data.title || slug,
      category: data.category || '随笔',
      date: data.date || '2026-01-01',
    });
  }

  // Pass 2: render rich Markdown with full cross-reference & LaTeX support
  const posts: Post[] = parsedEntries.map(({ slug, data, body }) => {
    const { html, toc } = renderMarkdown(body, postIndex);
    const { wordCount, readingMinutes } = computeStats(body);

    return {
      slug,
      title: data.title || slug,
      subtitle: data.subtitle,
      date: data.date || '2026-01-01',
      category: data.category || '随笔',
      tags: Array.isArray(data.tags) ? data.tags : [],
      summary: data.summary || body.slice(0, 140).replace(/[#*`\n]/g, ' ').trim(),
      featured: Boolean(data.featured),
      accent: data.accent || '#38bdf8',
      content: body,
      html,
      toc,
      readingMinutes,
      wordCount,
    };
  });

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export const allPosts: Post[] = loadAllPosts();

export function getPostBySlug(slug: string): Post | undefined {
  return allPosts.find((post) => post.slug === slug);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(allPosts.map((p) => p.category)));
}

export function getAllTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const post of allPosts) {
    for (const tag of post.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(counts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getBlogMetrics() {
  const totalWords = allPosts.reduce((sum, p) => sum + p.wordCount, 0);
  const totalPosts = allPosts.length;
  const totalCategories = getAllCategories().length;
  const totalTags = getAllTags().length;
  return { totalWords, totalPosts, totalCategories, totalTags };
}
