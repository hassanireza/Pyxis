import { EditorContent, type Editor } from "@tiptap/react";

export function WriteSurface({ editor }: { editor: Editor | null }) {
  return (
    <div className="write-surface">
      <EditorContent editor={editor} />
    </div>
  );
}
