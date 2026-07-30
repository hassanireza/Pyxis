<div align="center">

<img src=".github/assets/banner.svg" alt="Pyxis banner" width="100%" />

<br />

[![Build](https://img.shields.io/github/actions/workflow/status/hassanireza/pyxis/deploy.yml?branch=main&label=build&style=flat-square)](https://github.com/hassanireza/pyxis/actions)
[![Deployed on GitHub Pages](https://img.shields.io/badge/deployed-GitHub%20Pages-5B7FE0?style=flat-square)](https://hassanireza.github.io/pyxis/)
[![Made with TypeScript](https://img.shields.io/badge/made%20with-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-4FB8A8?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![Powered by Pyodide](https://img.shields.io/badge/powered%20by-Pyodide-3776AB?style=flat-square&logo=python&logoColor=white)](https://pyodide.org/)
[![License: Private](https://img.shields.io/badge/license-private%2C%20all%20rights%20reserved-6b7288?style=flat-square)](./LICENSE)

**A Python only computational notebook that runs entirely in your browser.**

No server. No account. No data ever leaves your machine.

This is a private portfolio project, shared for viewing only.

</div>

<br />

## What is Pyxis

Pyxis is a notebook environment for Python, in the spirit of Jupyter and the Anaconda tooling around it, rebuilt as a single page web app. It runs a real CPython interpreter client side through [Pyodide](https://pyodide.org/) (CPython compiled to WebAssembly), inside a dedicated Web Worker, so the interface stays responsive while code executes.

It is built for one language on purpose. Every editor binding, output renderer, and export format is tuned specifically for Python, instead of trying to be a generic multi-language tool.

<br />

## Interface

<table>
<tr>
<td width="50%" valign="top">

**Code cells**
Split into two panes: the editor on the left, live output on the right. Toggle Live mode on a cell and it re-executes automatically a moment after you stop typing.

</td>
<td width="50%" valign="top">

**Markdown cells**
An explicit Edit / Preview switch, GitHub flavored Markdown rendering (tables, task lists, strikethrough), and no hidden focus behavior to fight with.

</td>
</tr>
<tr>
<td width="50%" valign="top">

**Kernel controls**
A status pill shows Offline, Starting, Ready, Running, or Error, live in the toolbar. Restart Kernel actually reboots the interpreter and clears every cell's output and execution count.

</td>
<td width="50%" valign="top">

**Import and export**
Bring in an existing `.ipynb`, or ship your work out to Jupyter, plain Python, Markdown, or a standalone HTML page.

</td>
</tr>
</table>

<br />

## Architecture

<img src=".github/assets/architecture.svg" alt="Pyxis architecture diagram" width="100%" />

The UI (React, Zustand for state) lives on the main thread and never touches the interpreter directly. All Python execution happens in a dedicated Web Worker running Pyodide, communicating back over `postMessage` with streamed stdout and stderr, so a long running cell cannot freeze the editor. The Pyodide WASM runtime itself is fetched from a CDN on first load and cached by the browser afterward.

<br />

## Feature list

| Area | Details |
|---|---|
| Editor | CodeMirror 6, Python syntax highlighting, line numbers, code folding, autocomplete |
| Execution | Real CPython via Pyodide/WebAssembly, off the main thread, streamed stdout/stderr |
| Live mode | Optional per cell auto-run, debounced, with a split code/output view |
| Auto display | The value of a cell's last expression is shown automatically, matching IPython behavior |
| Markdown | GitHub Flavored Markdown, explicit edit/preview toggle |
| Kernel | Status indicator, restart, run all, clear outputs (single cell or whole notebook) |
| Packages | Install pure Python or WASM compatible packages at runtime with micropip |
| Persistence | Autosaves to local storage on every change, survives a refresh |
| Import | `.ipynb` (Jupyter nbformat 4), Pyxis's own `.json` state |
| Export | `.ipynb`, `.py` (percent cell format), `.md`, standalone `.html`, `.json` |
| Shortcuts | Ctrl/Cmd+Enter to run, Shift+Enter to run and advance |

<br />

## Export formats

<table>
<tr><th align="left">Format</th><th align="left">Use it for</th></tr>
<tr><td><code>.ipynb</code></td><td>Opening in Jupyter, JupyterLab, or VS Code</td></tr>
<tr><td><code>.py</code></td><td>Percent cell format, compatible with VS Code, Spyder, and Jupytext</td></tr>
<tr><td><code>.md</code></td><td>Documentation, blog posts, GitHub READMEs</td></tr>
<tr><td><code>.html</code></td><td>A single file you can send to anyone, no notebook viewer required</td></tr>
<tr><td><code>.json</code></td><td>Pyxis's own lossless internal state, for round tripping between sessions</td></tr>
</table>

<br />

## Design system

Pyxis uses a small, deliberately restrained color system rather than decorative gradients:

<table>
<tr>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-5B7FE0?style=flat-square" width="80"/><br /><sub>Brand / primary</sub></td>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-4FB8A8?style=flat-square" width="80"/><br /><sub>Teal / ready, live</sub></td>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-D9A94E?style=flat-square" width="80"/><br /><sub>Amber / running, warning</sub></td>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-E2685F?style=flat-square" width="80"/><br /><sub>Coral / error</sub></td>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-0D0F14?style=flat-square" width="80"/><br /><sub>Surface</sub></td>
<td align="center" width="16.6%"><img src="https://img.shields.io/badge/-EEF0F5?style=flat-square" width="80"/><br /><sub>Text</sub></td>
</tr>
</table>

Typography is Inter for interface text and JetBrains Mono for code and output, both loaded from Google Fonts. Every icon in the app is a hand drawn inline SVG, no icon font, no external icon package.

<br />

## Tech stack

- React 18 and TypeScript
- Vite for building and bundling
- Zustand for state management
- CodeMirror 6 for the code and markdown editors
- react-markdown with remark-gfm for rendering
- Pyodide, loaded from a CDN at runtime, running inside a dedicated Web Worker

<br />

## Project structure

```
src/
  components/        Toolbar, cells, output renderer, icons, toasts
  lib/                Pyodide worker, runtime bridge, import/export utilities
  store/              Zustand store: notebook state, execution, notifications
  types.ts            Shared TypeScript types for the notebook model
public/
  logo.svg            Favicon / brand mark
  404.html            GitHub Pages SPA fallback
.github/
  assets/             README diagrams
  workflows/deploy.yml  Build and deploy workflow for GitHub Pages
```

<br />

## Notes on the Python runtime

Pyodide ships a large subset of the Python standard library and can install many pure Python packages from PyPI through micropip, along with a growing set of packages already compiled to WebAssembly (numpy, pandas, and others). Packages that depend on native extensions without a WASM build will not install. The first cell run after a fresh page load takes a few seconds while the interpreter finishes booting, reflected by the kernel status pill in the toolbar.

<br />

## License

All rights reserved. This is a private portfolio project, shared publicly for viewing and demonstration purposes only. No use, copying, modification, or redistribution is permitted without explicit written permission from the author. See [LICENSE](./LICENSE).
