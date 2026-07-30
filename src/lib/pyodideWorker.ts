/// <reference lib="webworker" />

// This worker loads Pyodide (CPython compiled to WebAssembly) from the
// jsDelivr CDN and executes Python code sent from the main thread.
// Running the interpreter in a worker keeps the UI responsive while
// code executes, and lets us stream stdout/stderr as it is produced.

const workerSelf = self as unknown as DedicatedWorkerGlobalScope;

const PYODIDE_VERSION = "0.26.4";
const PYODIDE_CDN = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;

type WorkerRequest =
  | { kind: "init" }
  | { kind: "run"; id: string; code: string }
  | { kind: "interrupt" }
  | { kind: "install"; id: string; packages: string[] };

type WorkerResponse =
  | { kind: "ready" }
  | { kind: "boot-error"; message: string }
  | { kind: "stream"; id: string; name: "stdout" | "stderr"; text: string }
  | { kind: "result"; id: string; success: boolean; executeResult?: { data: Record<string, string> }; error?: { ename: string; evalue: string; traceback: string[] } }
  | { kind: "install-done"; id: string; success: boolean; message?: string };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let pyodide: any = null;

async function boot() {
  try {
    // @vite-ignore keeps Vite from trying to statically resolve the CDN URL.
    const { loadPyodide } = await import(/* @vite-ignore */ `${PYODIDE_CDN}pyodide.mjs`);
    pyodide = await loadPyodide({
      indexURL: PYODIDE_CDN,
      stdout: (text: string) => post({ kind: "stream", id: currentId, name: "stdout", text: text + "\n" }),
      stderr: (text: string) => post({ kind: "stream", id: currentId, name: "stderr", text: text + "\n" })
    });

    // Give Python a helper that mirrors repr() for the "last expression"
    // auto-display behaviour Jupyter users expect.
    await pyodide.runPythonAsync(`
import sys
import io
import json as _json

def _pynb_repr(value):
    if value is None:
        return None
    try:
        return repr(value)
    except Exception:
        return "<unrepresentable object>"
`);
    post({ kind: "ready" });
  } catch (err) {
    post({ kind: "boot-error", message: err instanceof Error ? err.message : String(err) });
  }
}

let currentId = "";

function post(message: WorkerResponse) {
  workerSelf.postMessage(message);
}

async function run(id: string, code: string) {
  currentId = id;
  if (!pyodide) {
    post({ kind: "result", id, success: false, error: { ename: "KernelError", evalue: "Kernel is not ready yet", traceback: [] } });
    return;
  }
  try {
    // pyodide.runPythonAsync returns the value of the last expression,
    // matching Jupyter/IPython "auto display" semantics.
    const result = await pyodide.runPythonAsync(code, { globals: pyodide.globals });
    if (result !== undefined && result !== null) {
      let text: string;
      try {
        text = pyodide.globals.get("_pynb_repr")(result);
      } catch {
        text = String(result);
      }
      if (result?.toJs !== undefined && typeof result.toJs === "function") {
        try {
          result.destroy?.();
        } catch {
          /* noop */
        }
      }
      if (text !== null && text !== undefined) {
        post({
          kind: "result",
          id,
          success: true,
          executeResult: { data: { "text/plain": text } }
        });
        return;
      }
    }
    post({ kind: "result", id, success: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    const lines = message.split("\n").filter(Boolean);
    const last = lines[lines.length - 1] || message;
    const [ename, ...rest] = last.split(":");
    post({
      kind: "result",
      id,
      success: false,
      error: {
        ename: ename?.trim() || "Error",
        evalue: rest.join(":").trim() || message,
        traceback: lines
      }
    });
  }
}

async function installPackages(id: string, packages: string[]) {
  if (!pyodide) {
    post({ kind: "install-done", id, success: false, message: "Kernel not ready" });
    return;
  }
  try {
    await pyodide.loadPackage("micropip");
    const micropip = pyodide.pyimport("micropip");
    for (const pkg of packages) {
      await micropip.install(pkg);
    }
    post({ kind: "install-done", id, success: true });
  } catch (err) {
    post({ kind: "install-done", id, success: false, message: err instanceof Error ? err.message : String(err) });
  }
}

workerSelf.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const msg = event.data;
  switch (msg.kind) {
    case "init":
      await boot();
      break;
    case "run":
      await run(msg.id, msg.code);
      break;
    case "install":
      await installPackages(msg.id, msg.packages);
      break;
    case "interrupt":
      // Pyodide does not support true interruption without SharedArrayBuffer
      // based interrupt handlers configured at load time; a future
      // enhancement could wire that up for long running loops.
      break;
  }
};
