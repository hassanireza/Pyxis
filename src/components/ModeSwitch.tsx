import { NotebookModeIcon, PreviewerModeIcon } from "./icons";

export type AppMode = "notebook" | "previewer";

interface Props {
  mode: AppMode;
  onChange: (mode: AppMode) => void;
}

export function ModeSwitch({ mode, onChange }: Props) {
  return (
    <div className="mode-switch" role="tablist" aria-label="App mode">
      <button
        role="tab"
        aria-selected={mode === "notebook"}
        className={mode === "notebook" ? "active" : ""}
        onClick={() => onChange("notebook")}
      >
        <NotebookModeIcon />
        Notebook
      </button>
      <button
        role="tab"
        aria-selected={mode === "previewer"}
        className={mode === "previewer" ? "active" : ""}
        onClick={() => onChange("previewer")}
      >
        <PreviewerModeIcon />
        MD Previewer
      </button>
    </div>
  );
}
