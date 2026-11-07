import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { HOME_DIR, getFlowPage, inEnglish, openProject } from "./chrome.js";

type Project = { id: string; name: string; url: string; updated_at: string };
const FILE = join(HOME_DIR, "projects.json");
const idFrom = (s: string) => s.match(/(?:^|\/project\/)([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})(?:[/?#]|$)/i)?.[1];
export function listRememberedProjects(): Project[] {
  if (!existsSync(FILE)) return [];
  const data: unknown = JSON.parse(readFileSync(FILE, "utf8"));
  if (!Array.isArray(data)) throw new Error("Project memory is invalid; preserve projects.json and repair it before continuing.");
  return data as Project[];
}
export function rememberProject(id: string, name: string): Project {
  if (!idFrom(id) || !name.trim()) throw new Error("Project ID and name are required.");
  const item = { id, name: name.trim(), url: `https://flow.google.com/project/${id}`, updated_at: new Date().toISOString() };
  const all = listRememberedProjects().filter(p => p.id.toLowerCase() !== id.toLowerCase());
  all.push(item);
  mkdirSync(HOME_DIR, { recursive: true });
  const temp = `${FILE}.${randomUUID()}.tmp`;
  writeFileSync(temp, JSON.stringify(all, null, 2), { encoding: "utf8", mode: 0o600 });
  renameSync(temp, FILE);
  return item;
}
export async function openRememberedProject(project: string): Promise<Project> {
  let id = idFrom(project);
  if (!id) {
    const found = listRememberedProjects().filter(p => p.name.toLocaleLowerCase() === project.trim().toLocaleLowerCase());
    if (found.length !== 1) throw new Error(found.length ? `More than one project is named "${project}"; use its ID.` : `Project "${project}" is not in local memory. Use its Flow URL or ID first.`);
    id = found[0].id;
  }
  const result = await openProject(id);
  const page = await getFlowPage();
  const title = page.getByRole("textbox", { name: "Editable text" }).first();
  await title.waitFor({ state: "visible", timeout: 30000 });
  const name = (await title.inputValue()).trim();
  if (!name) throw new Error(`Project opened (${result.url}) but its name could not be verified.`);
  return rememberProject(id, name);
}
export async function createProject(name: string): Promise<Project> {
  if (!name.trim()) throw new Error("Project name cannot be empty.");
  const page = await getFlowPage();
  await page.goto(inEnglish("https://flow.google.com/"), { waitUntil: "domcontentloaded" });
  const create = page.getByRole("button", { name: "New project", exact: true });
  await create.waitFor({ state: "visible", timeout: 30000 });
  await create.click();
  try { await page.waitForURL(/\/project\/[a-f0-9-]{36}/i, { timeout: 60000 }); }
  catch { throw new Error("Flow did not confirm the new project. Check Flow before retrying to avoid duplicates."); }
  const id = idFrom(page.url());
  if (!id) throw new Error(`Flow returned an unexpected new project URL: ${page.url()}`);
  try {
    const title = page.getByRole("textbox", { name: "Editable text" }).first();
    await title.waitFor({ state: "visible", timeout: 30000 });
    await title.fill(name.trim());
    await title.press("Enter");
    await page.getByRole("heading", { name: name.trim(), exact: true }).waitFor({ state: "visible", timeout: 15000 });
    return rememberProject(id, name);
  } catch (e) { throw new Error(`Project created at https://flow.google.com/project/${id}, but naming or saving memory failed. Check it before retrying. ${e instanceof Error ? e.message : String(e)}`); }
}
