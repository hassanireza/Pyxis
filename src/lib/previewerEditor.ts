import { Editor, type AnyExtension } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TableKit } from "@tiptap/extension-table";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { Markdown, type MarkdownStorage } from "tiptap-markdown";

// tiptap-markdown ships no module augmentation for its own storage slot —
// add it once here so `editor.storage.markdown` typechecks everywhere.
declare module "@tiptap/core" {
  interface Storage {
    markdown: MarkdownStorage;
  }
}

/**
 * The single extension set shared by the interactive Write surface and the
 * headless renderer used for the Preview tab and file export — keeping this
 * in one place guarantees Write / Markdown / Preview never drift out of
 * sync with each other.
 */
export function buildPreviewerExtensions(opts: { placeholder?: string } = {}): AnyExtension[] {
  return [
    StarterKit.configure({
      heading: { levels: [1, 2, 3] },
      link: {
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https"
      }
    }),
    Image.configure({ inline: false, allowBase64: true }),
    TableKit.configure({ table: { resizable: true } }),
    TaskList,
    TaskItem.configure({ nested: true }),
    Placeholder.configure({ placeholder: opts.placeholder || "Start writing…" }),
    Markdown.configure({
      html: false,
      tightLists: true,
      linkify: true,
      transformPastedText: true,
      transformCopiedText: true
    })
  ];
}

/** Typed accessor for the markdown extension's storage. */
export function getMarkdown(editor: Editor): string {
  return editor.storage.markdown.getMarkdown();
}

/**
 * Renders a Markdown string to sanitized HTML using a detached (never
 * mounted) Tiptap editor instance, so the Preview tab and the exported
 * .html file are byte-for-byte the same renderer the Write surface uses.
 */
export function markdownToHtml(markdown: string): string {
  const editor = new Editor({
    extensions: buildPreviewerExtensions(),
    content: markdown,
    editable: false
  });
  const html = editor.getHTML();
  editor.destroy();
  return html;
}
