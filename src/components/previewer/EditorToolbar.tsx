import { useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import {
  BoldIcon,
  BulletListIcon,
  ClearFormatIcon,
  CodeBlockIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  HrIcon,
  ImageIcon,
  InlineCodeIcon,
  ItalicIcon,
  LinkIcon,
  OrderedListIcon,
  ParagraphIcon,
  QuoteIcon,
  RedoIcon,
  StrikeIcon,
  TableIcon,
  TaskListIcon,
  UndoIcon,
  UploadIcon
} from "../icons";

interface FormatButtonConfig {
  key: string;
  label: string;
  icon: (p: { width?: number; height?: number }) => JSX.Element;
  isActive?: (editor: Editor) => boolean;
  isDisabled?: (editor: Editor) => boolean;
  run: (editor: Editor) => void;
}

// Data-driven so a new formatting option is a single entry here.
const TEXT_GROUP: FormatButtonConfig[] = [
  { key: "bold", label: "Bold", icon: BoldIcon, isActive: (e) => e.isActive("bold"), run: (e) => e.chain().focus().toggleBold().run() },
  { key: "italic", label: "Italic", icon: ItalicIcon, isActive: (e) => e.isActive("italic"), run: (e) => e.chain().focus().toggleItalic().run() },
  { key: "strike", label: "Strikethrough", icon: StrikeIcon, isActive: (e) => e.isActive("strike"), run: (e) => e.chain().focus().toggleStrike().run() },
  { key: "code", label: "Inline code", icon: InlineCodeIcon, isActive: (e) => e.isActive("code"), run: (e) => e.chain().focus().toggleCode().run() }
];

const BLOCK_GROUP: FormatButtonConfig[] = [
  { key: "p", label: "Paragraph", icon: ParagraphIcon, isActive: (e) => e.isActive("paragraph"), run: (e) => e.chain().focus().setParagraph().run() },
  { key: "h1", label: "Heading 1", icon: Heading1Icon, isActive: (e) => e.isActive("heading", { level: 1 }), run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { key: "h2", label: "Heading 2", icon: Heading2Icon, isActive: (e) => e.isActive("heading", { level: 2 }), run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { key: "h3", label: "Heading 3", icon: Heading3Icon, isActive: (e) => e.isActive("heading", { level: 3 }), run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { key: "quote", label: "Blockquote", icon: QuoteIcon, isActive: (e) => e.isActive("blockquote"), run: (e) => e.chain().focus().toggleBlockquote().run() },
  { key: "codeblock", label: "Code block", icon: CodeBlockIcon, isActive: (e) => e.isActive("codeBlock"), run: (e) => e.chain().focus().toggleCodeBlock().run() }
];

const LIST_GROUP: FormatButtonConfig[] = [
  { key: "bullet", label: "Bullet list", icon: BulletListIcon, isActive: (e) => e.isActive("bulletList"), run: (e) => e.chain().focus().toggleBulletList().run() },
  { key: "ordered", label: "Numbered list", icon: OrderedListIcon, isActive: (e) => e.isActive("orderedList"), run: (e) => e.chain().focus().toggleOrderedList().run() },
  { key: "task", label: "Task list", icon: TaskListIcon, isActive: (e) => e.isActive("taskList"), run: (e) => e.chain().focus().toggleTaskList().run() }
];

const INSERT_GROUP: FormatButtonConfig[] = [
  {
    key: "table",
    label: "Insert table",
    icon: TableIcon,
    run: (e) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  },
  { key: "hr", label: "Horizontal rule", icon: HrIcon, run: (e) => e.chain().focus().setHorizontalRule().run() }
];

const HISTORY_GROUP: FormatButtonConfig[] = [
  { key: "undo", label: "Undo", icon: UndoIcon, isDisabled: (e) => !e.can().undo(), run: (e) => e.chain().focus().undo().run() },
  { key: "redo", label: "Redo", icon: RedoIcon, isDisabled: (e) => !e.can().redo(), run: (e) => e.chain().focus().redo().run() },
  { key: "clear", label: "Clear formatting", icon: ClearFormatIcon, run: (e) => e.chain().focus().clearNodes().unsetAllMarks().run() }
];

function Group({ editor, buttons, tick }: { editor: Editor; buttons: FormatButtonConfig[]; tick: number }) {
  void tick; // re-render trigger only
  return (
    <div className="format-group">
      {buttons.map(({ key, label, icon: Icon, isActive, isDisabled, run }) => (
        <button
          key={key}
          type="button"
          className={`format-btn${isActive?.(editor) ? " active" : ""}`}
          title={label}
          aria-label={label}
          aria-pressed={isActive?.(editor)}
          disabled={isDisabled?.(editor)}
          onMouseDown={(ev) => ev.preventDefault()}
          onClick={() => run(editor)}
        >
          <Icon />
        </button>
      ))}
    </div>
  );
}

type PopoverKind = "link" | "image" | null;

export function EditorToolbar({ editor }: { editor: Editor | null }) {
  const [, force] = useState(0);
  const [popover, setPopover] = useState<PopoverKind>(null);
  const [value, setValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Tiptap's own state doesn't trigger React re-renders on its own; re-render
  // the toolbar whenever selection/content changes so active states stay live.
  useEffect(() => {
    if (!editor) return;
    const rerender = () => force((n) => n + 1);
    editor.on("selectionUpdate", rerender);
    editor.on("transaction", rerender);
    return () => {
      editor.off("selectionUpdate", rerender);
      editor.off("transaction", rerender);
    };
  }, [editor]);

  useEffect(() => {
    if (!popover) return;
    function onDocClick(ev: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(ev.target as Node)) {
        setPopover(null);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [popover]);

  if (!editor) return null;

  function openLinkPopover() {
    const prev = editor!.getAttributes("link").href as string | undefined;
    setValue(prev || "");
    setPopover("link");
  }

  function applyLink() {
    const url = value.trim();
    if (!url) {
      editor!.chain().focus().unsetLink().run();
    } else {
      editor!.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    }
    setPopover(null);
    setValue("");
  }

  function applyImageUrl() {
    const url = value.trim();
    if (url) editor!.chain().focus().setImage({ src: url }).run();
    setPopover(null);
    setValue("");
  }

  function onFilePicked(ev: React.ChangeEvent<HTMLInputElement>) {
    const file = ev.target.files?.[0];
    ev.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      editor!.chain().focus().setImage({ src: String(reader.result) }).run();
      setPopover(null);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="format-toolbar" role="toolbar" aria-label="Formatting">
      <Group editor={editor} buttons={HISTORY_GROUP} tick={0} />
      <div className="format-sep" />
      <Group editor={editor} buttons={BLOCK_GROUP} tick={0} />
      <div className="format-sep" />
      <Group editor={editor} buttons={TEXT_GROUP} tick={0} />
      <div className="format-sep" />
      <Group editor={editor} buttons={LIST_GROUP} tick={0} />
      <div className="format-sep" />
      <div className="format-group" style={{ position: "relative" }}>
        <button
          type="button"
          className={`format-btn${editor.isActive("link") ? " active" : ""}`}
          title="Link"
          aria-label="Link"
          onMouseDown={(ev) => ev.preventDefault()}
          onClick={openLinkPopover}
        >
          <LinkIcon />
        </button>
        <button
          type="button"
          className="format-btn"
          title="Image"
          aria-label="Image"
          onMouseDown={(ev) => ev.preventDefault()}
          onClick={() => {
            setValue("");
            setPopover("image");
          }}
        >
          <ImageIcon />
        </button>
        {popover && (
          <div className="inline-popover" ref={popoverRef} style={{ top: 40, left: 0 }}>
            <input
              autoFocus
              type="url"
              placeholder={popover === "link" ? "https://example.com" : "https://example.com/image.png"}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (popover === "link") applyLink();
                  else applyImageUrl();
                }
                if (e.key === "Escape") setPopover(null);
              }}
            />
            <button type="button" onClick={popover === "link" ? applyLink : applyImageUrl} title="Confirm">
              Set
            </button>
            {popover === "image" && (
              <>
                <button type="button" title="Upload from device" onClick={() => fileInputRef.current?.click()}>
                  <UploadIcon />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={onFilePicked}
                />
              </>
            )}
          </div>
        )}
      </div>
      <div className="format-sep" />
      <Group editor={editor} buttons={INSERT_GROUP} tick={0} />
    </div>
  );
}
