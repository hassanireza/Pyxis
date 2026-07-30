import { useEffect } from "react";
import { Toolbar } from "./components/Toolbar";
import { NotebookView } from "./components/NotebookView";
import { NotificationHost } from "./components/NotificationHost";
import { useNotebookStore } from "./store/notebookStore";

export default function App() {
  const bootKernel = useNotebookStore((s) => s.bootKernel);

  useEffect(() => {
    bootKernel();
  }, [bootKernel]);

  return (
    <div className="app-shell">
      <Toolbar />
      <NotebookView />
      <footer className="app-footer">
        Pyxis runs entirely in your browser using Pyodide (CPython compiled to WebAssembly). No server, no data leaves your machine.
      </footer>
      <NotificationHost />
    </div>
  );
}
