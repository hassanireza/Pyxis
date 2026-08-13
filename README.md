<div align="center">

<img src=".github/assets/banner.svg" alt="Pyxis — a Python notebook and a Markdown workspace that run entirely in your browser" width="100%" />

<br /><br />

[![Build](https://img.shields.io/github/actions/workflow/status/hassanireza/pyxis/deploy.yml?branch=main&label=build&style=flat-square&color=6F9C95)](https://github.com/hassanireza/pyxis/actions)
[![Deployed on GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-7C8891?style=flat-square)](https://hassanireza.github.io/pyxis/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=0d1013)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Pyodide](https://img.shields.io/badge/Pyodide-CPython%20on%20WASM-3776AB?style=flat-square&logo=python&logoColor=white)](https://pyodide.org/)
[![Tiptap](https://img.shields.io/badge/Tiptap-3-B5645C?style=flat-square)](https://tiptap.dev/)
[![License](https://img.shields.io/badge/license-all%20rights%20reserved-6e7579?style=flat-square)](./LICENSE)

**Two focused tools, one page, zero servers.**

A Python notebook and a Markdown workspace that run entirely in your browser. Nothing you write is ever sent anywhere — there's no backend to send it to.

This is a private portfolio project, shared publicly for viewing and demonstration only.

</div>

<br />

## Contents

[Why Pyxis](#why-pyxis) · [At a glance](#at-a-glance) · [Interface](#interface) · [Architecture](#architecture) · [Feature list](#feature-list) · [Export formats](#export-formats) · [Design system](#design-system) · [Tech stack](#tech-stack) · [Project structure](#project-structure) · [Running it locally](#running-it-locally) · [Notes on the Python runtime](#notes-on-the-python-runtime) · [License](#license)

<br />

## Why Pyxis

Most "run Python in the browser" demos and most Markdown editors are already good enough on their own. Pyxis exists for a narrower reason: to put a real Python kernel and a real WYSIWYG Markdown editor on the same page, built to the same standard, without asking you to trust a server with either.

<table>
<tr>
<td width="16.6%" align="center">

<img src=".github/assets/icons/offline.svg" width="44" height="44" alt="" /><br /><sub><b>Private by construction</b><br />No account, no server, no telemetry. Close the tab and it's gone — reopen it and autosave brings it back.</sub>

</td>
<td width="16.6%" align="center">

<img src=".github/assets/icons/kernel.svg" width="44" height="44" alt="" /><br /><sub><b>A real Python kernel</b><br />CPython compiled to WebAssembly, not a subset or a simulation. `pip install`-style packages work.</sub>

</td>
<td width="16.6%" align="center">

<img src=".github/assets/icons/wysiwyg.svg" width="44" height="44" alt="" /><br /><sub><b>Markdown without the syntax</b><br />Click Bold and the text turns bold. No one has to remember `**` mid-sentence.</sub>

</td>
<td width="16.6%" align="center">

<img src=".github/assets/icons/sync.svg" width="44" height="44" alt="" /><br /><sub><b>Three views, one truth</b><br />Write, raw Markdown, and rendered HTML stay in sync automatically — edit any one, trust all three.</sub>

</td>
<td width="16.6%" align="center">

<img src=".github/assets/icons/export.svg" width="44" height="44" alt="" /><br /><sub><b>Leaves in any format</b><br />`.ipynb`, `.py`, `.md`, standalone `.html`, or `.json` — your work isn't locked to this tab.</sub>

</td>
<td width="16.6%" align="center">

<img src=".github/assets/icons/autosave.svg" width="44" height="44" alt="" /><br /><sub><b>Forgets nothing</b><br />Every change autosaves to local storage the moment it happens. A refresh costs you nothing.</sub>

</td>
</tr>
</table>

<br />

## At a glance

Not sure which mode you need? Both live behind one switch in the toolbar — flip between them without losing either one's work.

| | **Notebook** | **MD Previewer** |
|---|---|---|
| For | Running and iterating on Python | Writing and formatting Markdown |
| Core surface | Code + Markdown cells, split editor/output | WYSIWYG editor, backed by real Markdown |
| Execution | Real CPython, in a Web Worker | N/A — no code runs, just renders |
| Views | Edit / Preview per markdown cell | Write / Markdown / Preview, always in sync |
| Exports to | `.ipynb`, `.py`, `.md`, `.html`, `.json` | `.md`, standalone `.html` |
| Autosave key | `pyxis.autosave.v1` | `pyxis.previewer.autosave.v1` |

<br />

## Interface

<table>
<tr>
<td width="50%" valign="top">

**Code cells**
Split into two panes: the editor on the left, live output on the right. Toggle Live mode on a cell and it re-executes automatically a moment after you stop typing — no button to remember to press.

</td>
<td width="50%" valign="top">

**Notebook markdown cells**
An explicit Edit / Preview switch, GitHub Flavored Markdown rendering (tables, task lists, strikethrough), and no hidden focus behavior fighting your cursor.

</td>
</tr>
<tr>
<td width="50%" valign="top">

**Kernel controls**
A status pill shows Offline, Starting, Ready, Running, or Error, live in the toolbar, so you always know what state you're in before you hit run. Restart Kernel actually reboots the interpreter and clears every cell's output and execution count.

</td>
<td width="50%" valign="top">

**Import and export**
Bring in an existing `.ipynb`, or ship your work out to Jupyter, plain Python, Markdown, or a standalone HTML page — pick whichever the person on the other end actually needs.

</td>
</tr>
<tr>
<td width="50%" valign="top">

**MD Previewer — Write**
A word-processor-style formatting toolbar — bold, italic, headings, lists, task lists, quotes, code, tables, links, images, undo/redo — that edits a real document, not a text field with hotkeys bolted on.

</td>
<td width="50%" valign="top">

**MD Previewer — Markdown / Preview**
Drop into raw Markdown source whenever you want the exact text, or the fully rendered HTML whenever you want the exact output. Import an existing `.md` file, and export both `.md` and a self-contained styled `.html` document, or copy either straight to your clipboard.

</td>
</tr>
</table>

<br />

## Architecture

<img src=".github/assets/architecture.svg" alt="Pyxis architecture: React UI on the main thread, Pyodide in a dedicated Web Worker, MD Previewer rendering headlessly through the same Tiptap extensions" width="100%" />

The UI — React and Zustand for state — lives on the main thread and never touches the Python interpreter directly. All execution happens in a dedicated Web Worker running Pyodide, communicating back over `postMessage` with streamed stdout and stderr, so one long-running cell can't freeze the editor out from under you. The Pyodide WASM runtime itself is fetched from a CDN on first load and cached by the browser from then on.

The MD Previewer runs entirely client-side too, and shares one detail worth calling out: the exact same Tiptap extension set powers both the interactive Write surface and a headless editor instance — never rendered to screen — that generates the Preview tab and the exported `.html`. There's only one code path for "turn Markdown into HTML," so the three views can't quietly drift apart from each other.

<br />

## Feature list

| Area | Details |
|---|---|
| Editor | CodeMirror 6, Python syntax highlighting, line numbers, code folding, autocomplete |
| Execution | Real CPython via Pyodide/WebAssembly, off the main thread, streamed stdout/stderr |
| Live mode | Optional per-cell auto-run, debounced, with a split code/output view |
| Auto display | The value of a cell's last expression is shown automatically, matching IPython behavior |
| Notebook markdown | GitHub Flavored Markdown, explicit edit/preview toggle |
| Kernel | Status indicator, restart, run all, clear outputs (single cell or whole notebook) |
| Packages | Install pure-Python or WASM-compatible packages at runtime with micropip |
| MD Previewer — Write | WYSIWYG toolbar: bold, italic, strikethrough, headings, blockquote, inline/block code, bullet/numbered/task lists, links, images (URL or upload), tables, horizontal rule, undo/redo, clear formatting |
| MD Previewer — views | Write (WYSIWYG), Markdown (raw source), Preview (rendered HTML) — all kept in sync |
| MD Previewer — import/export | Import `.md`, export `.md` and self-contained `.html`, copy Markdown or HTML to the clipboard |
| Persistence | Autosaves to local storage on every change, survives a refresh — Notebook and MD Previewer each keep their own autosave |
| Import | `.ipynb` (Jupyter nbformat 4), Pyxis's own `.json` state, `.md` for the previewer |
| Export | `.ipynb`, `.py` (percent cell format), `.md`, standalone `.html`, `.json` |
| Shortcuts | <kbd>Ctrl/Cmd</kbd>+<kbd>Enter</kbd> to run, <kbd>Shift</kbd>+<kbd>Enter</kbd> to run and advance |

<br />

## Export formats

<table>
<tr><th align="left">Format</th><th align="left">Use it for</th></tr>
<tr><td><code>.ipynb</code></td><td>Opening in Jupyter, JupyterLab, or VS Code</td></tr>
<tr><td><code>.py</code></td><td>Percent cell format, compatible with VS Code, Spyder, and Jupytext</td></tr>
<tr><td><code>.md</code></td><td>Documentation, blog posts, GitHub READMEs — from the notebook or the MD Previewer</td></tr>
<tr><td><code>.html</code></td><td>A single file you can send to anyone — no notebook or Markdown viewer required on their end</td></tr>
<tr><td><code>.json</code></td><td>Pyxis's own lossless internal state, for round-tripping between sessions</td></tr>
</table>

<br />

## Design system

Pyxis follows the same **Abyssal Liturgy** identity as the rest of [hassanireza.github.io](https://hassanireza.github.io) — near-black surfaces, one restrained accent, and a couple of desaturated status hues kept small on purpose, so they inform without ever competing with it.

<table>
<tr>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-7C8891?style=flat-square" width="80"/><br /><sub>Oxidized silver — accent</sub></td>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-6F9C95?style=flat-square" width="80"/><br /><sub>Muted teal — ready, live</sub></td>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-B99A5C?style=flat-square" width="80"/><br /><sub>Muted amber — running, warning</sub></td>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-B5645C?style=flat-square" width="80"/><br /><sub>Muted coral — error</sub></td>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-08090B?style=flat-square" width="80"/><br /><sub>Void — surface</sub></td>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-E6E3DA?style=flat-square" width="80"/><br /><sub>Bone — text</sub></td>
</tr>
</table>

Typography follows the brand's three-role system: **Cormorant Garamond** (italic) for display moments — the wordmark, document headings — **Jost** for interface text and prose, and **JetBrains Mono** for code, timestamps, and the small uppercase labels used throughout the chrome. Every icon in the app, and every icon on this page, is a hand-drawn inline SVG — no icon font, no external icon package.

<br />

## Tech stack

- React 18 and TypeScript
- Vite 7 for building and bundling
- Zustand for state management
- CodeMirror 6 for the code and Markdown source editors
- react-markdown with remark-gfm for notebook markdown cell rendering
- Tiptap 3 with tiptap-markdown for the MD Previewer's WYSIWYG editor
- Pyodide, loaded from a CDN at runtime, running inside a dedicated Web Worker

<br />

## Project structure

```
src/
  components/             Toolbar, cells, output renderer, icons, toasts, mode switch
  components/previewer/   MD Previewer toolbar, formatting toolbar, Write/Markdown/Preview surfaces
  lib/                    Pyodide worker, runtime bridge, import/export utilities (notebook + previewer)
  store/                  Zustand stores: notebook state/execution/notifications, previewer document
  types.ts                Shared TypeScript types for the notebook model
public/
  logo.svg                Favicon / brand mark
  404.html                GitHub Pages SPA fallback
.github/
  assets/                 README banner, architecture diagram, feature icons
  workflows/deploy.yml    Build and deploy workflow for GitHub Pages
```

<br />

## Running it locally

```bash
npm install
npm run dev        # local dev server with hot reload
npm run build      # type-check, then build a production bundle to dist/
npm run preview    # serve the production build locally
npm run lint        # eslint across the project
```

Requires Node.js 20.19+ or 22.12+ (Vite 7's floor).

<br />

## Notes on the Python runtime

Pyodide ships a large subset of the Python standard library and can install many pure-Python packages from PyPI through micropip, alongside a growing set of packages already compiled to WebAssembly (NumPy, pandas, and others). Packages that depend on native extensions without a WASM build won't install — that's a Pyodide ceiling, not a Pyxis one. The first cell run after a fresh page load takes a few seconds while the interpreter finishes booting, reflected honestly by the kernel status pill rather than left to look like a hang.

<br />

## License

All rights reserved. This is a private portfolio project, shared publicly for viewing and demonstration purposes only. No use, copying, modification, or redistribution is permitted without explicit written permission from the author. See [LICENSE](./LICENSE).
