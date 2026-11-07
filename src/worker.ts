import { LocalCore, shapes } from "./core.js";

const core = new LocalCore();
process.on("message", async (message: { id?: number; method?: string; args?: unknown }) => {
  const { id, method, args } = message;
  if (typeof id !== "number" || typeof method !== "string") return;
  try {
    if (method === "__restart_check") {
      process.send?.({ id, result: core.restartCheck() });
      return;
    }
    if (!Object.hasOwn(shapes, method) || typeof (core as unknown as Record<string, unknown>)[method] !== "function") throw new Error("Unknown worker method");
    const fn = (core as unknown as Record<string, (args: unknown) => Promise<unknown>>)[method];
    const result = await fn.call(core, args);
    process.send?.({ id, result: result ?? null });
  } catch (error) {
    process.send?.({ id, error: error instanceof Error ? error.message : String(error) });
  }
});
process.on("disconnect", () => process.exit(0));
process.send?.({ ready: true });
