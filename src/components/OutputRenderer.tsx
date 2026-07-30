import { CellOutput } from "../types";

function isImageMime(mime: string) {
  return mime.startsWith("image/");
}

export function OutputRenderer({ outputs }: { outputs: CellOutput[] }) {
  if (!outputs.length) return null;
  return (
    <div className="cell-output">
      {outputs.map((output, idx) => {
        switch (output.type) {
          case "stream":
            return (
              <pre key={idx} className={`output-block stream ${output.name}`}>
                {output.text}
              </pre>
            );
          case "error":
            return (
              <pre key={idx} className="output-block error">
                {output.ename}: {output.evalue}
                {output.traceback.length ? "\n" + output.traceback.join("\n") : ""}
              </pre>
            );
          case "execute_result":
          case "display_data": {
            const entries = Object.entries(output.data);
            const imageEntry = entries.find(([mime]) => isImageMime(mime));
            if (imageEntry) {
              const [mime, data] = imageEntry;
              return <img key={idx} className="output-image" src={`data:${mime};base64,${data}`} alt="cell output" />;
            }
            const text = output.data["text/plain"];
            return (
              <pre key={idx} className="output-block result">
                {output.type === "execute_result" ? `Out[${output.executionCount}]: ` : ""}
                {text}
              </pre>
            );
          }
          default:
            return null;
        }
      })}
    </div>
  );
}
