import { Cell, CellOutput, NotebookState } from "../types";

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

function slug(title: string) {
  return title.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "notebook";
}

// --- .ipynb (Jupyter nbformat 4) -------------------------------------------------

export function toIpynb(notebook: NotebookState): string {
  const cells = notebook.cells.map((cell) => {
    if (cell.type === "markdown") {
      return {
        cell_type: "markdown",
        metadata: {},
        source: splitLines(cell.source)
      };
    }
    return {
      cell_type: "code",
      metadata: {},
      execution_count: cell.executionCount,
      outputs: cell.outputs.map(outputToNb),
      source: splitLines(cell.source)
    };
  });

  const doc = {
    cells,
    metadata: {
      kernelspec: { display_name: "Python 3 (Pyodide)", language: "python", name: "python3" },
      language_info: { name: "python", version: "3.11" },
      pyxis: { title: notebook.meta.title, exportedAt: new Date().toISOString() }
    },
    nbformat: 4,
    nbformat_minor: 5
  };

  return JSON.stringify(doc, null, 1);
}

function splitLines(source: string): string[] {
  const lines = source.split("\n");
  return lines.map((line, idx) => (idx < lines.length - 1 ? line + "\n" : line));
}

function outputToNb(output: CellOutput) {
  switch (output.type) {
    case "stream":
      return { output_type: "stream", name: output.name, text: splitLines(output.text) };
    case "error":
      return { output_type: "error", ename: output.ename, evalue: output.evalue, traceback: output.traceback };
    case "execute_result":
      return {
        output_type: "execute_result",
        execution_count: output.executionCount,
        data: mapData(output.data),
        metadata: {}
      };
    case "display_data":
      return { output_type: "display_data", data: mapData(output.data), metadata: {} };
  }
}

function mapData(data: Record<string, string>) {
  const out: Record<string, string[] | string> = {};
  for (const [k, v] of Object.entries(data)) {
    out[k] = k === "text/plain" ? splitLines(v) : v;
  }
  return out;
}

export function downloadIpynb(notebook: NotebookState) {
  downloadBlob(toIpynb(notebook), `${slug(notebook.meta.title)}.ipynb`, "application/x-ipynb+json");
}

// --- .py (percent format, VS Code / Spyder / Jupytext compatible) --------------

export function toPy(notebook: NotebookState): string {
  const parts = notebook.cells.map((cell) => {
    if (cell.type === "markdown") {
      const commented = cell.source
        .split("\n")
        .map((l) => (l.length ? `# ${l}` : "#"))
        .join("\n");
      return `# %% [markdown]\n${commented}`;
    }
    return `# %%\n${cell.source}`;
  });
  return `# ${notebook.meta.title}\n# Exported from Pyxis on ${new Date().toISOString()}\n\n${parts.join("\n\n")}\n`;
}

export function downloadPy(notebook: NotebookState) {
  downloadBlob(toPy(notebook), `${slug(notebook.meta.title)}.py`, "text/x-python");
}

// --- .md (Markdown, code + outputs as fenced blocks) ----------------------------

export function toMarkdown(notebook: NotebookState): string {
  const parts = [`# ${notebook.meta.title}\n`];
  for (const cell of notebook.cells) {
    if (cell.type === "markdown") {
      parts.push(cell.source);
    } else {
      parts.push("```python\n" + cell.source + "\n```");
      const outText = renderOutputsAsText(cell);
      if (outText) parts.push("```text\n" + outText + "\n```");
    }
  }
  return parts.join("\n\n") + "\n";
}

function renderOutputsAsText(cell: Extract<Cell, { type: "code" }>): string {
  return cell.outputs
    .map((o) => {
      if (o.type === "stream") return o.text;
      if (o.type === "execute_result" || o.type === "display_data") return o.data["text/plain"] ?? "";
      if (o.type === "error") return [o.ename + ": " + o.evalue, ...o.traceback].join("\n");
      return "";
    })
    .join("\n")
    .trim();
}

export function downloadMarkdown(notebook: NotebookState) {
  downloadBlob(toMarkdown(notebook), `${slug(notebook.meta.title)}.md`, "text/markdown");
}

// --- .html (standalone static export) -------------------------------------------

export function toHtml(notebook: NotebookState): string {
  const escapeHtml = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const body = notebook.cells
    .map((cell) => {
      if (cell.type === "markdown") {
        return `<section class="cell markdown-cell"><div class="md">${escapeHtml(cell.source)}</div></section>`;
      }
      const outHtml = cell.outputs
        .map((o) => {
          if (o.type === "stream") return `<pre class="output ${o.name}">${escapeHtml(o.text)}</pre>`;
          if (o.type === "execute_result" || o.type === "display_data")
            return `<pre class="output result">${escapeHtml(o.data["text/plain"] ?? "")}</pre>`;
          if (o.type === "error")
            return `<pre class="output error">${escapeHtml(o.ename + ": " + o.evalue + "\n" + o.traceback.join("\n"))}</pre>`;
          return "";
        })
        .join("\n");
      return `<section class="cell code-cell">
        <div class="prompt">In [${cell.executionCount ?? " "}]:</div>
        <pre class="code"><code>${escapeHtml(cell.source)}</code></pre>
        ${outHtml}
      </section>`;
    })
    .join("\n");

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>${escapeHtml(notebook.meta.title)}</title>
<style>
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; max-width: 900px; margin: 40px auto; padding: 0 20px; background: #0f1115; color: #e6e6e6; }
  h1 { border-bottom: 1px solid #333; padding-bottom: 12px; }
  .cell { margin-bottom: 22px; }
  .prompt { font-family: monospace; color: #7fb2ff; font-size: 12px; margin-bottom: 4px; }
  pre.code { background: #1a1d24; padding: 12px 14px; border-radius: 6px; overflow-x: auto; font-family: "Fira Code", monospace; font-size: 13px; }
  pre.output { background: #14161b; padding: 10px 14px; border-left: 3px solid #3a3f4b; margin-top: 6px; overflow-x: auto; font-size: 13px; }
  pre.output.error { border-left-color: #d95a5a; color: #ffb3b3; }
  pre.output.result { border-left-color: #5ad9a0; }
  .md { line-height: 1.6; white-space: pre-wrap; }
</style>
</head>
<body>
<h1>${escapeHtml(notebook.meta.title)}</h1>
${body}
<hr />
<p style="color:#666;font-size:12px;">Exported from Pyxis on ${new Date().toLocaleString()}</p>
</body>
</html>`;
}

export function downloadHtml(notebook: NotebookState) {
  downloadBlob(toHtml(notebook), `${slug(notebook.meta.title)}.html`, "text/html");
}

// --- JSON (raw internal state, useful for re-importing losslessly) -------------

export function downloadJson(notebook: NotebookState) {
  downloadBlob(JSON.stringify(notebook, null, 2), `${slug(notebook.meta.title)}.pyxis.json`, "application/json");
}
