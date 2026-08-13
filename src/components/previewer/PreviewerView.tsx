import { usePreviewerStore } from "../../store/previewerStore";
import { usePreviewerEditor } from "./usePreviewerEditor";
import { EditorToolbar } from "./EditorToolbar";
import { WriteSurface } from "./WriteSurface";
import { MarkdownSourceView } from "./MarkdownSourceView";
import { PreviewSurface } from "./PreviewSurface";

export function PreviewerView() {
  const view = usePreviewerStore((s) => s.view);
  const editor = usePreviewerEditor();

  return (
    <div className="previewer-view">
      {view === "write" && <EditorToolbar editor={editor} />}
      <div className="previewer-body">
        {view === "write" && <WriteSurface editor={editor} />}
        {view === "markdown" && <MarkdownSourceView />}
        {view === "preview" && <PreviewSurface />}
      </div>
    </div>
  );
}
