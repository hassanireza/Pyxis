import { useRef, useState } from "react";
import { useNotebookStore } from "../store/notebookStore";
import { downloadHtml, downloadIpynb, downloadJson, downloadMarkdown, downloadPy } from "../lib/exportUtils";
import { parseIpynb, parsePynbJson, readFileAsText } from "../lib/importUtils";
import {
  BroomIcon,
  CodeIcon,
  DownloadIcon,
  LogoMark,
  MarkdownIcon,
  NewFileIcon,
  PlayIcon,
  PlusIcon,
  RestartIcon,
  UploadIcon
} from "./icons";

const statusLabel: Record<string, string> = {
  offline: "Kernel offline",
  booting: "Starting kernel",
  idle: "Kernel ready",
  busy: "Running",
  error: "Kernel error"
};

export function Toolbar() {
  const notebook = useNotebookStore((s) => s.notebook);
  const kernelStatus = useNotebookStore((s) => s.kernelStatus);
  const bootKernel = useNotebookStore((s) => s.bootKernel);
  const restartKernel = useNotebookStore((s) => s.restartKernel);
  const runAll = useNotebookStore((s) => s.runAll);
  const clearAllOutputs = useNotebookStore((s) => s.clearAllOutputs);
  const addCell = useNotebookStore((s) => s.addCell);
  const setTitle = useNotebookStore((s) => s.setTitle);
  const loadNotebook = useNotebookStore((s) => s.loadNotebook);
  const newNotebook = useNotebookStore((s) => s.newNotebook);
  const notify = useNotebookStore((s) => s.notify);

  const [exportOpen, setExportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (file: File) => {
    const text = await readFileAsText(file);
    const nb = file.name.endsWith(".ipynb") ? parseIpynb(text) : parsePynbJson(text);
    loadNotebook(nb);
    notify(`Imported ${file.name}`, "success");
  };

  const runExport = (fn: (n: typeof notebook) => void, label: string) => {
    fn(notebook);
    setExportOpen(false);
    notify(`Exported ${label}`, "success");
  };

  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <div className="brand">
          <LogoMark />
          <span className="brand-name">Pyxis</span>
        </div>
        <input
          className="title-input"
          value={notebook.meta.title}
          onChange={(e) => setTitle(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className="toolbar-center">
        <button
          className="primary-btn"
          onClick={() => (kernelStatus === "offline" || kernelStatus === "error" ? bootKernel() : runAll())}
        >
          <PlayIcon width={13} height={13} />
          {kernelStatus === "offline" || kernelStatus === "error" ? "Start Kernel" : "Run All"}
        </button>
        <button onClick={() => addCell("code")}>
          <PlusIcon width={13} height={13} />
          <CodeIcon width={13} height={13} />
        </button>
        <button onClick={() => addCell("markdown")}>
          <PlusIcon width={13} height={13} />
          <MarkdownIcon width={13} height={13} />
        </button>
        <button onClick={clearAllOutputs} title="Clear all outputs">
          <BroomIcon width={13} height={13} />
        </button>
        <button onClick={restartKernel} title="Restart kernel: reboots Python and clears every cell's output">
          <RestartIcon width={13} height={13} />
        </button>
        <span className={`kernel-status ${kernelStatus}`}>
          <span className="dot" /> {statusLabel[kernelStatus]}
        </span>
      </div>

      <div className="toolbar-right">
        <button onClick={() => fileInputRef.current?.click()} title="Import .ipynb or .json">
          <UploadIcon width={13} height={13} />
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".ipynb,.json"
          hidden
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
            e.target.value = "";
          }}
        />
        <div className="export-menu">
          <button onClick={() => setExportOpen((v) => !v)}>
            <DownloadIcon width={13} height={13} />
            Export
          </button>
          {exportOpen && (
            <div className="export-dropdown" onMouseLeave={() => setExportOpen(false)}>
              <button onClick={() => runExport(downloadIpynb, ".ipynb")}>.ipynb (Jupyter)</button>
              <button onClick={() => runExport(downloadPy, ".py")}>.py (percent format)</button>
              <button onClick={() => runExport(downloadMarkdown, ".md")}>.md (Markdown)</button>
              <button onClick={() => runExport(downloadHtml, ".html")}>.html (standalone)</button>
              <button onClick={() => runExport(downloadJson, ".json")}>.json (raw state)</button>
            </div>
          )}
        </div>
        <button
          className="danger"
          onClick={() => confirm("Start a new blank notebook? Unsaved autosave will be replaced.") && newNotebook()}
          title="New notebook"
        >
          <NewFileIcon width={13} height={13} />
        </button>
      </div>
    </header>
  );
}
