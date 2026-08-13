import { useMemo } from "react";
import { markdownToHtml } from "../../lib/previewerEditor";
import { usePreviewerStore } from "../../store/previewerStore";

export function PreviewSurface() {
  const markdown = usePreviewerStore((s) => s.doc.markdown);

  const html = useMemo(() => {
    try {
      return markdownToHtml(markdown);
    } catch {
      return "";
    }
  }, [markdown]);

  const isEmpty = !markdown.trim();

  return (
    <div className="preview-surface">
      {isEmpty ? (
        <div className="markdown-body empty">Nothing to preview yet — start writing in the Write tab.</div>
      ) : (
        <div className="markdown-body is-readonly" dangerouslySetInnerHTML={{ __html: html }} />
      )}
    </div>
  );
}
