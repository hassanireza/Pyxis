import { Cell as CellModel } from "../types";
import { useNotebookStore } from "../store/notebookStore";
import { CodeCell } from "./CodeCell";
import { MarkdownCell } from "./MarkdownCell";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  BroomIcon,
  CodeIcon,
  CopyIcon,
  MarkdownIcon,
  PlusIcon,
  TrashIcon
} from "./icons";

export function CellWrapper({ cell, index, total }: { cell: CellModel; index: number; total: number }) {
  const deleteCell = useNotebookStore((s) => s.deleteCell);
  const duplicateCell = useNotebookStore((s) => s.duplicateCell);
  const moveCell = useNotebookStore((s) => s.moveCell);
  const addCell = useNotebookStore((s) => s.addCell);
  const clearOutputs = useNotebookStore((s) => s.clearOutputs);
  const runCell = useNotebookStore((s) => s.runCell);

  return (
    <div
      className="cell-wrapper"
      onKeyDownCapture={(e) => {
        if (cell.type === "code" && e.shiftKey && e.key === "Enter") {
          e.preventDefault();
          runCell(cell.id);
        }
      }}
    >
      <div className="cell-index">{String(index + 1).padStart(2, "0")}</div>
      <div className="cell-body-column">
        <div className="cell-toolbar">
          <span className={`cell-type-tag ${cell.type}`}>
            {cell.type === "code" ? <CodeIcon width={12} height={12} /> : <MarkdownIcon width={12} height={12} />}
            {cell.type === "code" ? "Python" : "Markdown"}
          </span>
          <div className="cell-actions">
            {cell.type === "code" && (
              <button title="Clear output" onClick={() => clearOutputs(cell.id)}>
                <BroomIcon width={13} height={13} />
              </button>
            )}
            <button title="Move up" disabled={index === 0} onClick={() => moveCell(cell.id, "up")}>
              <ArrowUpIcon width={13} height={13} />
            </button>
            <button title="Move down" disabled={index === total - 1} onClick={() => moveCell(cell.id, "down")}>
              <ArrowDownIcon width={13} height={13} />
            </button>
            <button title="Duplicate" onClick={() => duplicateCell(cell.id)}>
              <CopyIcon width={13} height={13} />
            </button>
            <button title="Add code cell below" onClick={() => addCell("code", cell.id)}>
              <PlusIcon width={13} height={13} />
              <CodeIcon width={13} height={13} />
            </button>
            <button title="Add markdown cell below" onClick={() => addCell("markdown", cell.id)}>
              <PlusIcon width={13} height={13} />
              <MarkdownIcon width={13} height={13} />
            </button>
            <button title="Delete cell" className="danger" onClick={() => deleteCell(cell.id)}>
              <TrashIcon width={13} height={13} />
            </button>
          </div>
        </div>
        {cell.type === "code" ? <CodeCell cell={cell} index={index} /> : <MarkdownCell cell={cell} />}
      </div>
    </div>
  );
}
