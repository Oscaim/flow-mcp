import { fork, type ChildProcess } from "node:child_process";
import { fileURLToPath } from "node:url";
import type { Core } from "./core.js";

export class WorkerSupervisor {
  constructor(private readonly workerFile = fileURLToPath(new URL("./worker.js", import.meta.url))) {}
  private child?: ChildProcess;
  private starting?: Promise<void>;
  private pending = new Map<number, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
  private next = 0;
  private restarting = false;
  private running = 0;
  private unexpectedExit = false;
  private stopping = false;

  private async start(): Promise<void> {
    if (this.unexpectedExit) throw new Error("Flow worker exited unexpectedly; its queue state is unknown. Check Flow for ongoing work before reconnecting the MCP server.");
    if (this.child?.connected) return;
    if (this.starting) return this.starting;
    this.starting = new Promise<void>((resolve, reject) => {
      const child = fork(this.workerFile, [], { stdio: ["ignore", "ignore", "inherit", "ipc"] });
      let ready = false;
      const timer = setTimeout(() => { child.kill(); reject(new Error("Flow worker did not start within 15 seconds.")); }, 15_000);
      child.on("message", (message: { ready?: boolean; id?: number; result?: unknown; error?: string }) => {
        if (message.ready && !ready) { ready = true; clearTimeout(timer); this.child = child; resolve(); return; }
        if (message.id === undefined) return;
        const call = this.pending.get(message.id);
        if (!call) return;
        this.pending.delete(message.id);
        if (message.error) call.reject(new Error(message.error)); else call.resolve(message.result);
      });
      child.on("error", error => { if (!ready) { clearTimeout(timer); reject(error); } });
      child.on("exit", () => {
        clearTimeout(timer);
        if (this.child === child) this.child = undefined;
        if (ready && !this.stopping) this.unexpectedExit = true;
        for (const call of this.pending.values()) call.reject(new Error("Flow worker stopped; check Flow before retrying any operation."));
        this.pending.clear();
        if (!ready) reject(new Error("Flow worker exited before becoming ready."));
      });
    }).finally(() => { this.starting = undefined; });
    return this.starting;
  }

  private async send(method: string, args?: unknown): Promise<unknown> {
    await this.start();
    const child = this.child;
    if (!child?.connected) throw new Error("Flow worker is disconnected.");
    const id = ++this.next;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      child.send({ id, method, args }, error => {
        if (error) { this.pending.delete(id); reject(error); }
      });
    });
  }

  async call(method: string, args?: unknown): Promise<unknown> {
    if (this.restarting) throw new Error("Flow worker is restarting; retry after it is ready.");
    this.running++;
    try { return await this.send(method, args); } finally { this.running--; }
  }

  async restart(): Promise<unknown> {
    if (this.restarting || this.running) throw new Error("Cannot restart while Flow requests are in progress.");
    this.restarting = true;
    try {
      const check = await this.send("__restart_check") as { active: number; completed: number };
      if (check.active) throw new Error(`Cannot restart: ${check.active} queued or running jobs remain. Wait or cancel queued jobs first.`);
      const old = this.child!;
      const exited = new Promise<void>(resolve => old.once("exit", () => resolve()));
      this.stopping = true;
      old.disconnect();
      await exited;
      this.stopping = false;
      await this.start();
      return { restarted: true, worker_pid: this.child?.pid, completed_jobs_cleared: check.completed, note: "Completed job history in worker memory was cleared. Files and Flow media remain. MCP connection and Chrome remain open; tool schemas require a client reconnect to refresh." };
    } finally { this.restarting = false; }
  }

  async close(): Promise<void> {
    if (!this.child?.connected) return;
    this.stopping = true;
    const child = this.child;
    const exited = new Promise<void>(resolve => child.once("exit", () => resolve()));
    child.disconnect();
    await exited;
    this.stopping = false;
  }

  core(): Core {
    return new Proxy({} as Core, { get: (_target, property) => {
      if (property === "then") return undefined;
      if (property === "restart_worker") return () => this.restart();
      return (args?: unknown) => this.call(String(property), args);
    } });
  }
}
