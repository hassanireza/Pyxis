import { nanoid } from "nanoid";

export type StreamHandler = (name: "stdout" | "stderr", text: string) => void;

export interface RunResult {
  success: boolean;
  executeResult?: { data: Record<string, string> };
  error?: { ename: string; evalue: string; traceback: string[] };
}

type ReadyListener = () => void;
type ErrorListener = (message: string) => void;

class PyodideRuntime {
  private worker: Worker | null = null;
  private ready = false;
  private booting = false;
  private readyListeners: ReadyListener[] = [];
  private errorListeners: ErrorListener[] = [];
  private pending = new Map<string, { resolve: (r: RunResult) => void; onStream?: StreamHandler }>();
  private pendingInstalls = new Map<string, { resolve: (r: { success: boolean; message?: string }) => void }>();

  boot() {
    if (this.worker || this.booting) return;
    this.booting = true;
    this.worker = new Worker(new URL("./pyodideWorker.ts", import.meta.url), { type: "module" });
    this.worker.onmessage = (event) => this.handleMessage(event.data);
    this.worker.postMessage({ kind: "init" });
  }

  onReady(cb: ReadyListener) {
    this.readyListeners.push(cb);
    if (this.ready) cb();
  }

  onError(cb: ErrorListener) {
    this.errorListeners.push(cb);
  }

  isReady() {
    return this.ready;
  }

  private handleMessage(msg: any) {
    switch (msg.kind) {
      case "ready":
        this.ready = true;
        this.booting = false;
        this.readyListeners.forEach((cb) => cb());
        break;
      case "boot-error":
        this.booting = false;
        this.errorListeners.forEach((cb) => cb(msg.message));
        break;
      case "stream": {
        const pending = this.pending.get(msg.id);
        pending?.onStream?.(msg.name, msg.text);
        break;
      }
      case "result": {
        const pending = this.pending.get(msg.id);
        if (pending) {
          pending.resolve({ success: msg.success, executeResult: msg.executeResult, error: msg.error });
          this.pending.delete(msg.id);
        }
        break;
      }
      case "install-done": {
        const pending = this.pendingInstalls.get(msg.id);
        if (pending) {
          pending.resolve({ success: msg.success, message: msg.message });
          this.pendingInstalls.delete(msg.id);
        }
        break;
      }
    }
  }

  run(code: string, onStream?: StreamHandler): Promise<RunResult> {
    if (!this.worker) throw new Error("Kernel not started");
    const id = nanoid();
    return new Promise((resolve) => {
      this.pending.set(id, { resolve, onStream });
      this.worker!.postMessage({ kind: "run", id, code });
    });
  }

  installPackages(packages: string[]): Promise<{ success: boolean; message?: string }> {
    if (!this.worker) throw new Error("Kernel not started");
    const id = nanoid();
    return new Promise((resolve) => {
      this.pendingInstalls.set(id, { resolve });
      this.worker!.postMessage({ kind: "install", id, packages });
    });
  }

  restart() {
    this.worker?.terminate();
    this.worker = null;
    this.ready = false;
    this.booting = false;
    this.boot();
  }
}

export const pyodideRuntime = new PyodideRuntime();
