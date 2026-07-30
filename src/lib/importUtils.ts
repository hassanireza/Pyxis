import { nanoid } from "nanoid";
import { Cell, CellOutput, NotebookState } from "../types";

function joinSource(source: string | string[]): string {
  return Array.isArray(source) ? source.join("") : source;
}

function nbOutputToCellOutput(o: any): CellOutput | null {
  switch (o.output_type) {
    case "stream":
      return { type: "stream", name: o.name === "stderr" ? "stderr" : "stdout", text: joinSource(o.text) };
    case "error":
      return { type: "error", ename: o.ename, evalue: o.evalue, traceback: o.traceback ?? [] };
    case "execute_result":
      return {
        type: "execute_result",
        executionCount: o.execution_count ?? 0,
        data: normalizeData(o.data)
      };
    case "display_data":
      return { type: "display_data", data: normalizeData(o.data) };
    default:
      return null;
  }
}

function normalizeData(data: Record<string, string | string[]>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(data ?? {})) {
    out[k] = Array.isArray(v) ? v.join("") : v;
  }
  return out;
}

export function parseIpynb(json: string): NotebookState {
  const doc = JSON.parse(json);
  const cells: Cell[] = (doc.cells ?? []).map((c: any) => {
    if (c.cell_type === "markdown") {
      return { id: nanoid(), type: "markdown", source: joinSource(c.source), isEditing: false };
    }
    const outputs = (c.outputs ?? []).map(nbOutputToCellOutput).filter(Boolean) as CellOutput[];
    return {
      id: nanoid(),
      type: "code",
      source: joinSource(c.source),
      outputs,
      executionCount: c.execution_count ?? null,
      isRunning: false
    };
  });

  return {
    meta: {
      title: doc.metadata?.pyxis?.title ?? "Imported Notebook",
      kernelName: doc.metadata?.kernelspec?.name ?? "python3",
      language: "python",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    },
    cells: cells.length ? cells : [{ id: nanoid(), type: "code", source: "", outputs: [], executionCount: null, isRunning: false }]
  };
}

export function parsePynbJson(json: string): NotebookState {
  const parsed = JSON.parse(json) as NotebookState;
  // Re-generate ids to avoid collisions if the same file is imported twice.
  const cells = parsed.cells.map((c) => ({ ...c, id: nanoid() }));
  return { ...parsed, cells };
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
