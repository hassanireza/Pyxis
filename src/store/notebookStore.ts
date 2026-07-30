import { create } from "zustand";
import { nanoid } from "nanoid";
import { Cell, CellOutput, CodeCellModel, KernelStatus, MarkdownCellModel, NotebookState } from "../types";
import { pyodideRuntime } from "../lib/pyodideRuntime";

const STORAGE_KEY = "pyxis.autosave.v1";

function newCodeCell(source = ""): CodeCellModel {
  return { id: nanoid(), type: "code", source, outputs: [], executionCount: null, isRunning: false, liveMode: false };
}

function newMarkdownCell(source = "", editing = true): MarkdownCellModel {
  return { id: nanoid(), type: "markdown", source, isEditing: editing };
}

function defaultNotebook(): NotebookState {
  return {
    meta: {
      title: "Untitled Notebook",
      kernelName: "python3",
      language: "python",
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString()
    },
    cells: [
      newMarkdownCell("# Welcome to Pyxis\n\nA Python only notebook that runs entirely in your browser.", false),
      newCodeCell('print("Hello, Pyxis!")')
    ]
  };
}

function loadInitial(): NotebookState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as NotebookState;
  } catch {
    /* ignore corrupted autosave */
  }
  return defaultNotebook();
}

export interface Notification {
  id: string;
  message: string;
  tone: "info" | "success" | "error";
}

interface NotebookStore {
  notebook: NotebookState;
  kernelStatus: KernelStatus;
  executionCounter: number;
  activeCellId: string | null;
  notifications: Notification[];

  notify: (message: string, tone?: Notification["tone"]) => void;
  dismissNotification: (id: string) => void;
  toggleLiveMode: (id: string) => void;

  bootKernel: () => void;
  setActiveCell: (id: string | null) => void;
  setTitle: (title: string) => void;

  addCell: (type: "code" | "markdown", afterId?: string | null) => string;
  deleteCell: (id: string) => void;
  duplicateCell: (id: string) => void;
  moveCell: (id: string, direction: "up" | "down") => void;
  updateSource: (id: string, source: string) => void;
  setMarkdownEditing: (id: string, editing: boolean) => void;

  runCell: (id: string) => Promise<void>;
  runAll: () => Promise<void>;
  clearOutputs: (id: string) => void;
  clearAllOutputs: () => void;

  restartKernel: () => void;
  loadNotebook: (notebook: NotebookState) => void;
  newNotebook: () => void;
}

function persist(notebook: NotebookState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notebook));
  } catch {
    /* storage quota or private mode, fail silently */
  }
}

export const useNotebookStore = create<NotebookStore>((set, get) => ({
  notebook: loadInitial(),
  kernelStatus: "offline",
  executionCounter: 1,
  activeCellId: null,
  notifications: [],

  notify: (message, tone = "info") => {
    const id = nanoid();
    set({ notifications: [...get().notifications, { id, message, tone }] });
    setTimeout(() => get().dismissNotification(id), 3200);
  },

  dismissNotification: (id) => {
    set({ notifications: get().notifications.filter((n) => n.id !== id) });
  },

  toggleLiveMode: (id) => {
    const cells = get().notebook.cells.map((c) =>
      c.id === id && c.type === "code" ? { ...c, liveMode: !c.liveMode } : c
    );
    set({ notebook: { ...get().notebook, cells } });
  },

  bootKernel: () => {
    if (get().kernelStatus !== "offline") return;
    set({ kernelStatus: "booting" });
    get().notify("Starting Python kernel...", "info");
    pyodideRuntime.onReady(() => {
      set({ kernelStatus: "idle" });
      get().notify("Kernel ready", "success");
    });
    pyodideRuntime.onError((msg) => {
      set({ kernelStatus: "error" });
      get().notify(`Kernel failed to start: ${msg}`, "error");
    });
    pyodideRuntime.boot();
  },

  setActiveCell: (id) => set({ activeCellId: id }),

  setTitle: (title) => {
    const notebook = { ...get().notebook, meta: { ...get().notebook.meta, title, modifiedAt: new Date().toISOString() } };
    set({ notebook });
    persist(notebook);
  },

  addCell: (type, afterId) => {
    const cell = type === "code" ? newCodeCell() : newMarkdownCell();
    const cells = [...get().notebook.cells];
    if (afterId) {
      const idx = cells.findIndex((c) => c.id === afterId);
      cells.splice(idx + 1, 0, cell);
    } else {
      cells.push(cell);
    }
    const notebook = { ...get().notebook, cells, meta: { ...get().notebook.meta, modifiedAt: new Date().toISOString() } };
    set({ notebook, activeCellId: cell.id });
    persist(notebook);
    return cell.id;
  },

  deleteCell: (id) => {
    const cells = get().notebook.cells.filter((c) => c.id !== id);
    const notebook = { ...get().notebook, cells };
    set({ notebook });
    persist(notebook);
  },

  duplicateCell: (id) => {
    const cells = [...get().notebook.cells];
    const idx = cells.findIndex((c) => c.id === id);
    if (idx === -1) return;
    const original = cells[idx];
    const copy: Cell =
      original.type === "code"
        ? { ...original, id: nanoid(), outputs: [], executionCount: null, isRunning: false }
        : { ...original, id: nanoid() };
    cells.splice(idx + 1, 0, copy);
    const notebook = { ...get().notebook, cells };
    set({ notebook });
    persist(notebook);
  },

  moveCell: (id, direction) => {
    const cells = [...get().notebook.cells];
    const idx = cells.findIndex((c) => c.id === id);
    const target = direction === "up" ? idx - 1 : idx + 1;
    if (idx === -1 || target < 0 || target >= cells.length) return;
    [cells[idx], cells[target]] = [cells[target], cells[idx]];
    const notebook = { ...get().notebook, cells };
    set({ notebook });
    persist(notebook);
  },

  updateSource: (id, source) => {
    const cells = get().notebook.cells.map((c) => (c.id === id ? { ...c, source } : c));
    const notebook = { ...get().notebook, cells };
    set({ notebook });
    persist(notebook);
  },

  setMarkdownEditing: (id, editing) => {
    const cells = get().notebook.cells.map((c) => (c.id === id && c.type === "markdown" ? { ...c, isEditing: editing } : c));
    set({ notebook: { ...get().notebook, cells } });
  },

  runCell: async (id) => {
    const state = get();
    const cell = state.notebook.cells.find((c) => c.id === id);
    if (!cell || cell.type !== "code") return;

    if (state.kernelStatus === "offline" || state.kernelStatus === "error") {
      get().bootKernel();
    }
    if (!pyodideRuntime.isReady()) {
      await new Promise<void>((resolve) => pyodideRuntime.onReady(resolve));
    }

    const setCells = (updater: (cells: Cell[]) => Cell[]) => {
      const notebook = { ...get().notebook, cells: updater(get().notebook.cells) };
      set({ notebook });
      persist(notebook);
    };

    setCells((cells) => cells.map((c) => (c.id === id ? { ...c, isRunning: true, outputs: [] } : c)));
    set({ kernelStatus: "busy" });

    const start = performance.now();
    const outputs: CellOutput[] = [];

    const flush = () => {
      setCells((cells) => cells.map((c) => (c.id === id ? { ...c, outputs: [...outputs] } : c)));
    };

    const result = await pyodideRuntime.run(cell.source, (name, text) => {
      const last = outputs[outputs.length - 1];
      if (last && last.type === "stream" && last.name === name) {
        last.text += text;
      } else {
        outputs.push({ type: "stream", name, text });
      }
      flush();
    });

    const execCount = get().executionCounter;

    if (result.success) {
      if (result.executeResult) {
        outputs.push({ type: "execute_result", data: result.executeResult.data, executionCount: execCount });
      }
    } else if (result.error) {
      outputs.push({ type: "error", ename: result.error.ename, evalue: result.error.evalue, traceback: result.error.traceback });
    }

    const duration = performance.now() - start;

    setCells((cells) =>
      cells.map((c) =>
        c.id === id
          ? { ...c, isRunning: false, outputs, executionCount: execCount, durationMs: duration }
          : c
      )
    );
    set({ kernelStatus: "idle", executionCounter: execCount + 1 });
  },

  runAll: async () => {
    const ids = get().notebook.cells.filter((c) => c.type === "code").map((c) => c.id);
    for (const id of ids) {
      // eslint-disable-next-line no-await-in-loop
      await get().runCell(id);
    }
  },

  clearOutputs: (id) => {
    const cells = get().notebook.cells.map((c) => (c.id === id && c.type === "code" ? { ...c, outputs: [], executionCount: null } : c));
    const notebook = { ...get().notebook, cells };
    set({ notebook });
    persist(notebook);
  },

  clearAllOutputs: () => {
    const cells = get().notebook.cells.map((c) => (c.type === "code" ? { ...c, outputs: [], executionCount: null } : c));
    const notebook = { ...get().notebook, cells };
    set({ notebook });
    persist(notebook);
  },

  restartKernel: () => {
    pyodideRuntime.restart();
    const cells = get().notebook.cells.map((c) =>
      c.type === "code" ? { ...c, outputs: [], executionCount: null, isRunning: false } : c
    );
    const notebook = { ...get().notebook, cells };
    set({ notebook, kernelStatus: "booting", executionCounter: 1 });
    persist(notebook);
    get().notify("Restarting kernel, all outputs cleared", "info");
    pyodideRuntime.onReady(() => {
      set({ kernelStatus: "idle" });
      get().notify("Kernel restarted", "success");
    });
  },

  loadNotebook: (notebook) => {
    set({ notebook, executionCounter: 1 });
    persist(notebook);
  },

  newNotebook: () => {
    const notebook = defaultNotebook();
    set({ notebook, executionCounter: 1 });
    persist(notebook);
  }
}));
