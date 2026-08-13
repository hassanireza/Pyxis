import { create } from "zustand";
import { useNotebookStore } from "./notebookStore";

const STORAGE_KEY = "pyxis.previewer.autosave.v1";

export type PreviewerView = "write" | "markdown" | "preview";

export interface PreviewerDoc {
  title: string;
  markdown: string;
}

const DEFAULT_MARKDOWN = `# Untitled document

Start writing here — click the toolbar buttons to format text, or switch
to the **Markdown** tab to edit the raw source directly.

- Click **Bold** on selected text and watch it change live
- No need to type \`###\` for a heading, just pick one from the toolbar
- Swap to *Preview* any time to see the final rendered HTML
`;

function defaultDoc(): PreviewerDoc {
  return { title: "Untitled document", markdown: DEFAULT_MARKDOWN };
}

function loadInitial(): PreviewerDoc {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PreviewerDoc>;
      if (typeof parsed.markdown === "string") {
        return { title: parsed.title || "Untitled document", markdown: parsed.markdown };
      }
    }
  } catch {
    /* ignore corrupted autosave */
  }
  return defaultDoc();
}

function persist(doc: PreviewerDoc) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
  } catch {
    /* storage quota or private mode, fail silently */
  }
}

interface PreviewerStore {
  doc: PreviewerDoc;
  view: PreviewerView;

  setTitle: (title: string) => void;
  setMarkdown: (markdown: string) => void;
  setView: (view: PreviewerView) => void;
  loadMarkdown: (markdown: string, title?: string) => void;
  newDocument: () => void;
}

export const usePreviewerStore = create<PreviewerStore>((set, get) => ({
  doc: loadInitial(),
  view: "write",

  setTitle: (title) => {
    const doc = { ...get().doc, title };
    set({ doc });
    persist(doc);
  },

  setMarkdown: (markdown) => {
    const doc = { ...get().doc, markdown };
    set({ doc });
    persist(doc);
  },

  setView: (view) => set({ view }),

  loadMarkdown: (markdown, title) => {
    const doc = { title: title || get().doc.title, markdown };
    set({ doc, view: "write" });
    persist(doc);
    useNotebookStore.getState().notify(`Loaded "${doc.title}"`, "success");
  },

  newDocument: () => {
    const doc = defaultDoc();
    set({ doc, view: "write" });
    persist(doc);
  }
}));
