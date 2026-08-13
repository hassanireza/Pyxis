function downloadBlob(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function slug(title: string) {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "document";
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/**
 * Wraps a rendered HTML body in a self-contained document styled to match
 * the Pyxis / Abyssal Liturgy brand, so exported files look right whether
 * opened directly in a browser or handed to someone else.
 */
export function toStandaloneHtml(title: string, bodyHtml: string): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${escapeHtml(title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Jost:wght@300;400;500&family=JetBrains+Mono:wght@400;500&display=swap" />
<style>
  :root {
    --bg: #08090b; --surface-0: #0d1013; --surface-1: #12161a;
    --border: rgba(214,219,222,0.09); --border-soft: rgba(214,219,222,0.055);
    --text-primary: #e6e3da; --text-secondary: #9aa3a8; --text-muted: #6e7579;
    --brand-400: #c9cfd2; --brand-500: #7c8891; --teal-400: #8fb3ac;
    --font-display: "Cormorant Garamond", Georgia, serif;
    --font-ui: "Jost", -apple-system, sans-serif;
    --font-mono: "JetBrains Mono", ui-monospace, monospace;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; background: var(--bg); }
  body {
    font-family: var(--font-ui); color: var(--text-primary);
    padding: 56px 20px 100px; -webkit-font-smoothing: antialiased;
  }
  .doc { max-width: 720px; margin: 0 auto; background: var(--surface-0);
    border: 1px solid var(--border-soft); border-radius: 5px;
    padding: 44px clamp(20px, 6vw, 56px); box-shadow: 0 10px 30px rgba(0,0,0,0.45); }
  .doc-title { font-family: var(--font-mono); font-size: 11px; text-transform: uppercase;
    letter-spacing: 0.08em; color: var(--text-muted); margin: 0 0 28px; }
  .markdown-body { font-size: 16px; line-height: 1.75; }
  .markdown-body > * + * { margin-top: 0.85em; }
  .markdown-body h1, .markdown-body h2, .markdown-body h3, .markdown-body h4 {
    font-family: var(--font-display); font-style: italic; font-weight: 500;
    letter-spacing: 0.01em; line-height: 1.25; margin-top: 1.3em; color: var(--text-primary); }
  .markdown-body h1 { font-size: 2.15em; } .markdown-body h2 { font-size: 1.7em; }
  .markdown-body h3 { font-size: 1.35em; }
  .markdown-body p:first-child, .markdown-body h1:first-child { margin-top: 0; }
  .markdown-body strong { font-weight: 600; }
  .markdown-body a { color: var(--brand-400); text-decoration-color: rgba(201,207,210,0.35); text-underline-offset: 2px; }
  .markdown-body ul, .markdown-body ol { padding-left: 1.4em; }
  .markdown-body li { margin: 0.25em 0; }
  .markdown-body ul[data-type="taskList"] { list-style: none; padding-left: 0.2em; }
  .markdown-body ul[data-type="taskList"] li { display: flex; align-items: flex-start; gap: 8px; }
  .markdown-body blockquote { margin: 0; padding: 2px 0 2px 18px; border-left: 2px solid var(--brand-500);
    color: var(--text-secondary); font-style: italic; }
  .markdown-body pre { background: var(--surface-1); border: 1px solid var(--border-soft); border-radius: 3px;
    padding: 14px 16px; overflow-x: auto; font-family: var(--font-mono); font-size: 0.86em; line-height: 1.6; }
  .markdown-body code { background: var(--surface-1); border: 1px solid var(--border-soft); padding: 1px 6px;
    border-radius: 4px; font-family: var(--font-mono); font-size: 0.88em; color: var(--teal-400); }
  .markdown-body pre code { background: none; border: none; padding: 0; }
  .markdown-body hr { border: none; border-top: 1px solid var(--border); margin: 1.6em 0; }
  .markdown-body img { max-width: 100%; border-radius: 3px; display: block; }
  .markdown-body table { border-collapse: collapse; width: 100%; font-size: 0.92em; }
  .markdown-body th, .markdown-body td { border: 1px solid var(--border); padding: 7px 11px; text-align: left; }
  .markdown-body th { background: var(--surface-1); font-weight: 600; color: var(--text-secondary); }
</style>
</head>
<body>
  <article class="doc">
    <p class="doc-title">${escapeHtml(title)}</p>
    <div class="markdown-body">
${bodyHtml}
    </div>
  </article>
</body>
</html>
`;
}

export function downloadMarkdownFile(title: string, markdown: string) {
  downloadBlob(markdown, `${slug(title)}.md`, "text/markdown;charset=utf-8");
}

export function downloadHtmlFile(title: string, bodyHtml: string) {
  downloadBlob(toStandaloneHtml(title, bodyHtml), `${slug(title)}.html`, "text/html;charset=utf-8");
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
