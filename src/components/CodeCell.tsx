import { useEffect, useRef } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { oneDark } from "@codemirror/theme-one-dark";
import { CodeCellModel } from "../types";
import { useNotebookStore } from "../store/notebookStore";
import { OutputRenderer } from "./OutputRenderer";
import { PlayIcon, ZapIcon } from "./icons";

export function CodeCell({ cell }: { cell: CodeCellModel; index: number }) {
  const updateSource = useNotebookStore((s) => s.updateSource);
  const runCell = useNotebookStore((s) => s.runCell);
  const setActiveCell = useNotebookStore((s) => s.setActiveCell);
  const activeCellId = useNotebookStore((s) => s.activeCellId);
  const toggleLiveMode = useNotebookStore((s) => s.toggleLiveMode);

  const debounceRef = useRef<number | null>(null);

  // Live mode: re-run the cell automatically a moment after typing stops.
  useEffect(() => {
    if (!cell.liveMode) return;
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      runCell(cell.id);
    }, 700);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cell.source, cell.liveMode]);

  const prompt = cell.isRunning ? "*" : cell.executionCount !== null ? String(cell.executionCount) : "";
  const hasOutput = cell.outputs.length > 0 || cell.isRunning;

  return (
    <div className={`code-cell ${activeCellId === cell.id ? "active" : ""}`} onFocus={() => setActiveCell(cell.id)}>
      <div className="code-cell-pane editor-pane">
        <div className="pane-header">
          <span className="pane-label">
            <span className="prompt-chip">In [{prompt}]</span>
            Code
          </span>
          <div className="pane-actions">
            <button
              className={`live-toggle ${cell.liveMode ? "on" : ""}`}
              title="Live mode: automatically re-run this cell as you type"
              onClick={() => toggleLiveMode(cell.id)}
            >
              <ZapIcon width={13} height={13} />
              Live
            </button>
            <button className="run-btn" title="Run (Ctrl/Cmd+Enter)" onClick={() => runCell(cell.id)}>
              <PlayIcon width={12} height={12} />
              Run
            </button>
          </div>
        </div>
        <CodeMirror
          value={cell.source}
          height="auto"
          minHeight="90px"
          theme={oneDark}
          extensions={[python()]}
          basicSetup={{ lineNumbers: true, foldGutter: true, highlightActiveLine: true, autocompletion: true }}
          onChange={(value) => updateSource(cell.id, value)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              e.preventDefault();
              runCell(cell.id);
            }
          }}
        />
      </div>

      <div className={`code-cell-pane output-pane ${hasOutput ? "" : "empty"}`}>
        <div className="pane-header">
          <span className="pane-label">
            <span className={`status-chip ${cell.isRunning ? "running" : "done"}`} />
            Live Output
          </span>
          {cell.durationMs !== undefined && !cell.isRunning && (
            <span className="duration-chip">{(cell.durationMs / 1000).toFixed(2)}s</span>
          )}
        </div>
        {hasOutput ? (
          <div className="output-scroll">
            {cell.isRunning && cell.outputs.length === 0 && <div className="running-indicator">Running...</div>}
            <OutputRenderer outputs={cell.outputs} />
          </div>
        ) : (
          <div className="output-placeholder">Output will appear here once you run this cell.</div>
        )}
      </div>
    </div>
  );
}
