import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownCellModel } from "../types";
import { useNotebookStore } from "../store/notebookStore";
import { EditIcon, EyeIcon } from "./icons";

export function MarkdownCell({ cell }: { cell: MarkdownCellModel }) {
  const updateSource = useNotebookStore((s) => s.updateSource);
  const setMarkdownEditing = useNotebookStore((s) => s.setMarkdownEditing);
  const setActiveCell = useNotebookStore((s) => s.setActiveCell);

  if (cell.isEditing) {
    return (
      <div className="markdown-cell editing" onFocus={() => setActiveCell(cell.id)}>
        <div className="pane-header">
          <span className="pane-label">Markdown source</span>
          <button className="preview-btn" onClick={() => setMarkdownEditing(cell.id, false)}>
            <EyeIcon width={13} height={13} />
            Preview
          </button>
        </div>
        <CodeMirror
          value={cell.source}
          height="auto"
          minHeight="70px"
          theme={oneDark}
          extensions={[markdown()]}
          basicSetup={{ lineNumbers: false, highlightActiveLine: true }}
          onChange={(value) => updateSource(cell.id, value)}
          onKeyDown={(e) => {
            if (e.shiftKey && e.key === "Enter") {
              e.preventDefault();
              setMarkdownEditing(cell.id, false);
            }
          }}
          autoFocus
        />
        <div className="markdown-hint">Shift+Enter, or the Preview button, renders this cell.</div>
      </div>
    );
  }

  return (
    <div className="markdown-cell rendered" onFocus={() => setActiveCell(cell.id)} tabIndex={0}>
      <div className="pane-header ghost-header">
        <span className="pane-label">Markdown</span>
        <button className="edit-btn" onClick={() => setMarkdownEditing(cell.id, true)}>
          <EditIcon width={13} height={13} />
          Edit
        </button>
      </div>
      <div className="markdown-render-body" onDoubleClick={() => setMarkdownEditing(cell.id, true)}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {cell.source.trim() ? cell.source : "*Empty markdown cell. Click Edit to write something.*"}
        </ReactMarkdown>
      </div>
    </div>
  );
}
