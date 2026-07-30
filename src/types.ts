export type CellType = "code" | "markdown";

export type OutputType = "stream" | "error" | "execute_result" | "display_data";

export interface StreamOutput {
  type: "stream";
  name: "stdout" | "stderr";
  text: string;
}

export interface ErrorOutput {
  type: "error";
  ename: string;
  evalue: string;
  traceback: string[];
}

export interface ExecuteResultOutput {
  type: "execute_result";
  data: Record<string, string>;
  executionCount: number;
}

export interface DisplayDataOutput {
  type: "display_data";
  data: Record<string, string>;
}

export type CellOutput = StreamOutput | ErrorOutput | ExecuteResultOutput | DisplayDataOutput;

export interface BaseCell {
  id: string;
  type: CellType;
  source: string;
  collapsed?: boolean;
}

export interface CodeCellModel extends BaseCell {
  type: "code";
  outputs: CellOutput[];
  executionCount: number | null;
  isRunning: boolean;
  durationMs?: number;
  liveMode?: boolean;
}

export interface MarkdownCellModel extends BaseCell {
  type: "markdown";
  isEditing: boolean;
}

export type Cell = CodeCellModel | MarkdownCellModel;

export type KernelStatus = "booting" | "idle" | "busy" | "error" | "offline";

export interface NotebookMeta {
  title: string;
  kernelName: string;
  language: "python";
  createdAt: string;
  modifiedAt: string;
}

export interface NotebookState {
  meta: NotebookMeta;
  cells: Cell[];
}
