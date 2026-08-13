import { useEffect, useState } from "react";
import { Toolbar } from "./components/Toolbar";
import { NotebookView } from "./components/NotebookView";
import { NotificationHost } from "./components/NotificationHost";
import { PreviewerToolbar } from "./components/previewer/PreviewerToolbar";
import { PreviewerView } from "./components/previewer/PreviewerView";
import { AppMode } from "./components/ModeSwitch";
import { useNotebookStore } from "./store/notebookStore";

const MODE_STORAGE_KEY = "pyxis.appMode.v1";

function loadInitialMode(): AppMode {
  try {
    const stored = localStorage.getItem(MODE_STORAGE_KEY);
    if (stored === "notebook" || stored === "previewer") return stored;
  } catch {
    /* ignore */
  }
  return "notebook";
}

export default function App() {
  const bootKernel = useNotebookStore((s) => s.bootKernel);
  const [mode, setMode] = useState<AppMode>(loadInitialMode);

  useEffect(() => {
    bootKernel();
  }, [bootKernel]);

  useEffect(() => {
    try {
      localStorage.setItem(MODE_STORAGE_KEY, mode);
    } catch {
      /* storage quota or private mode, fail silently */
    }
  }, [mode]);

  return (
    <div className="app-shell">
      {mode === "notebook" ? (
        <>
          <Toolbar mode={mode} onModeChange={setMode} />
          <NotebookView />
          <footer className="app-footer">
            Pyxis runs entirely in your browser using Pyodide (CPython compiled to WebAssembly). No server, no data leaves your machine.
          </footer>
        </>
      ) : (
        <>
          <PreviewerToolbar mode={mode} onModeChange={setMode} />
          <PreviewerView />
          <footer className="app-footer">
            The MD Previewer runs entirely in your browser. Nothing you write ever leaves your machine.
          </footer>
        </>
      )}
      <NotificationHost />
    </div>
  );
}
