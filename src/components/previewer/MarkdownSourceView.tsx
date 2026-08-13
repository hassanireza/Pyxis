import CodeMirror from "@uiw/react-codemirror";
import { markdown as markdownLang } from "@codemirror/lang-markdown";
import { oneDark } from "@codemirror/theme-one-dark";
import { usePreviewerStore } from "../../store/previewerStore";

export function MarkdownSourceView() {
  const doc = usePreviewerStore((s) => s.doc);
  const setMarkdown = usePreviewerStore((s) => s.setMarkdown);

  return (
    <div className="markdown-source-wrap">
      <CodeMirror
        value={doc.markdown}
        height="auto"
        minHeight="60vh"
        theme={oneDark}
        extensions={[markdownLang()]}
        basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: true }}
        onChange={(value) => setMarkdown(value)}
      />
    </div>
  );
}
