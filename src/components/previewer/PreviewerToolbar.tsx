import { useRef, useState } from "react";
import { usePreviewerStore, type PreviewerView } from "../../store/previewerStore";
import { useNotebookStore } from "../../store/notebookStore";
import { markdownToHtml } from "../../lib/previewerEditor";
import { copyToClipboard, downloadHtmlFile, downloadMarkdownFile } from "../../lib/previewerExport";
import { readFileAsText } from "../../lib/importUtils";
import { AppMode, ModeSwitch } from "../ModeSwitch";
import {
  CopyIcon,
  DownloadIcon,
  EditIcon,
  EyeIcon,
  FileTextIcon,
  LogoMark,
  MarkdownIcon,
  NewFileIcon,
  UploadIcon
} from "../icons";

const TABS: { key: PreviewerView; label: string; icon: (p: { width?: number; height?: number }) => JSX.Element }[] = [
  { key: "write", label: "Write", icon: EditIcon },
  { key: "markdown", label: "Markdown", icon: MarkdownIcon },
  { key: "preview", label: "Preview", icon: EyeIcon }
];

export function PreviewerToolbar({ mode, onModeChange }: { mode: AppMode; onModeChange: (m: AppMode) => void }) {
  const doc = usePreviewerStore((s) => s.doc);
  const view = usePreviewerStore((s) => s.view);
  const setTitle = usePreviewerStore((s) => s.setTitle);
  const setView = usePreviewerStore((s) => s.setView);
  const loadMarkdown = usePreviewerStore((s) => s.loadMarkdown);
  const newDocument = usePreviewerStore((s) => s.newDocument);
  const notify = useNotebookStore((s) => s.notify);

  const [exportOpen, setExportOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImport = async (file: File) => {
    const text = await readFileAsText(file);
    const title = file.name.replace(/\.md$/i, "");
    loadMarkdown(text, title);
  };

  const runExport = async (kind: "md" | "html" | "copy-md" | "copy-html") => {
    if (kind === "md") {
      downloadMarkdownFile(doc.title, doc.markdown);
      notify("Exported .md", "success");
    } else if (kind === "html") {
      downloadHtmlFile(doc.title, markdownToHtml(doc.markdown));
      notify("Exported .html", "success");
    } else if (kind === "copy-md") {
      const ok = await copyToClipboard(doc.markdown);
      notify(ok ? "Markdown copied to clipboard" : "Couldn't access clipboard", ok ? "success" : "error");
    } else {
      const ok = await copyToClipboard(markdownToHtml(doc.markdown));
      notify(ok ? "HTML copied to clipboard" : "Couldn't access clipboard", ok ? "success" : "error");
    }
    setExportOpen(false);
  };

  return (
    <header className="toolbar">
      <div className="toolbar-left">
        <div className="brand">
          <LogoMark />
          <span className="brand-name">Pyxis</span>
        </div>
        <ModeSwitch mode={mode} onChange={onModeChange} />
        <input className="title-input" value={doc.title} onChange={(e) => setTitle(e.target.value)} spellCheck={false} />
      </div>

      <div className="toolbar-center">
        <div className="view-tabs" role="tablist" aria-label="Document view">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} role="tab" aria-selected={view === key} className={view === key ? "active" : ""} onClick={() => setView(key)}>
              <Icon width={13} height={13} />
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="toolbar-right">
        <button onClick={() => fileInputRef.current?.click()} title="Import a .md file">
          <UploadIcon width={13} height={13} />
          Import
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".md,.markdown,text/markdown,text/plain"
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
              <button onClick={() => runExport("md")}>
                <FileTextIcon width={13} height={13} /> Download .md
              </button>
              <button onClick={() => runExport("html")}>
                <FileTextIcon width={13} height={13} /> Download .html
              </button>
              <button onClick={() => runExport("copy-md")}>
                <CopyIcon width={13} height={13} /> Copy Markdown
              </button>
              <button onClick={() => runExport("copy-html")}>
                <CopyIcon width={13} height={13} /> Copy HTML
              </button>
            </div>
          )}
        </div>
        <button
          className="danger"
          onClick={() => confirm("Start a new blank document? Unsaved autosave will be replaced.") && newDocument()}
          title="New document"
        >
          <NewFileIcon width={13} height={13} />
        </button>
      </div>
    </header>
  );
}
