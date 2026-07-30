import { useNotebookStore } from "../store/notebookStore";
import { CellWrapper } from "./CellWrapper";

export function NotebookView() {
  const cells = useNotebookStore((s) => s.notebook.cells);
  const addCell = useNotebookStore((s) => s.addCell);

  return (
    <main className="notebook-view">
      {cells.map((cell, idx) => (
        <CellWrapper key={cell.id} cell={cell} index={idx} total={cells.length} />
      ))}
      <div className="add-cell-row">
        <button onClick={() => addCell("code")}>+ Code cell</button>
        <button onClick={() => addCell("markdown")}>+ Markdown cell</button>
      </div>
    </main>
  );
}
