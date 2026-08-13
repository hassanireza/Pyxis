import { useEffect, useMemo, useRef } from "react";
import { useEditor } from "@tiptap/react";
import { buildPreviewerExtensions, getMarkdown } from "../../lib/previewerEditor";
import { usePreviewerStore } from "../../store/previewerStore";

export function usePreviewerEditor() {
  const markdown = usePreviewerStore((s) => s.doc.markdown);
  const view = usePreviewerStore((s) => s.view);
  const setMarkdown = usePreviewerStore((s) => s.setMarkdown);
  const initialMarkdown = useRef(markdown);

  // @tiptap/react's useEditor destroys and rebuilds the whole editor
  // whenever any option's *reference* changes (it diffs with `!==`, not
  // deep equality) — so extensions/editorProps must keep a stable identity
  // across renders. Without this, every store update (i.e. every keystroke,
  // since onUpdate below writes back to the store) recreated the editor,
  // and a render could briefly return a torn-down instance whose storage
  // was already cleared — that's what crashed the whole tree on switching
  // into MD Previewer.
  const extensions = useMemo(
    () => buildPreviewerExtensions({ placeholder: "Start writing — click a toolbar button to format…" }),
    []
  );
  const editorProps = useMemo(() => ({ attributes: { class: "markdown-body", spellCheck: "true" } }), []);

  const editor = useEditor({
    extensions,
    content: initialMarkdown.current,
    editorProps,
    onUpdate: ({ editor }) => {
      setMarkdown(getMarkdown(editor));
    }
  });

  // Keep the WYSIWYG doc in sync with markdown edited elsewhere (the raw
  // Markdown tab, an import, or a fresh document) whenever Write becomes active.
  useEffect(() => {
    if (!editor || view !== "write") return;
    const current = getMarkdown(editor);
    if (current !== markdown) {
      editor.commands.setContent(markdown, { emitUpdate: false });
    }
    // Only re-sync on tab activation / external doc swaps, not on every keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, editor]);

  return editor;
}
