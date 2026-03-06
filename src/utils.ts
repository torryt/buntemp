import { mkdir, readdir, writeFile } from "fs/promises";
import { join } from "path";
import { BUNTEMP_DIR, CD_PATH_FILE } from "./constants";

export interface ProjectInfo {
  id: string;
  path: string;
  description: string | null;
}

export async function ensureBuntempDir(): Promise<void> {
  await mkdir(BUNTEMP_DIR, { recursive: true });
}

export async function getProjects(): Promise<ProjectInfo[]> {
  await ensureBuntempDir();

  const entries = await readdir(BUNTEMP_DIR, { withFileTypes: true });
  const dirs = entries.filter((e) => e.isDirectory());

  const projects: ProjectInfo[] = [];

  for (const dir of dirs) {
    const projectPath = join(BUNTEMP_DIR, dir.name);
    const pkgPath = join(projectPath, "package.json");
    let description: string | null = null;

    try {
      const pkgFile = Bun.file(pkgPath);
      if (await pkgFile.exists()) {
        const pkg = await pkgFile.json();
        description = pkg.description || null;
      }
    } catch {
      // no package.json or invalid JSON
    }

    projects.push({
      id: dir.name,
      path: projectPath,
      description,
    });
  }

  return projects;
}

export function generateId(length = 7): string {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join("");
}

export async function writeCdPath(path: string): Promise<void> {
  await writeFile(CD_PATH_FILE, path);
}

/**
 * Generate a short description for a project using Copilot CLI.
 * Returns the description string, or null if generation failed.
 */
export async function generateDescription(
  projectPath: string
): Promise<string | null> {
  try {
    const prompt =
      "Describe this project's contents and theme in exactly 7-8 words. Reply with ONLY the description, nothing else.";

    const proc = Bun.spawn(
      ["copilot", "--model", "claude-haiku-4.5", "-sp", prompt],
      {
        cwd: projectPath,
        stdout: "pipe",
        stderr: "pipe",
      }
    );

    const output = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0 || !output.trim()) return null;

    const lines = output.trim().split("\n").filter(Boolean);
    let description = (lines.at(-1) ?? "").trim();

    // Remove any leading/trailing quotes
    description = description.replace(/^["']|["']$/g, "");

    if (description.length > 100 || description.length < 5) return null;

    return description;
  } catch {
    return null;
  }
}

/**
 * Generate a description and write it to the project's package.json.
 * Returns the description if successful, null otherwise.
 */
export async function updateProjectDescription(
  projectPath: string
): Promise<string | null> {
  const description = await generateDescription(projectPath);
  if (!description) return null;

  const pkgPath = join(projectPath, "package.json");
  const pkgFile = Bun.file(pkgPath);

  let pkg: Record<string, unknown> = {};
  if (await pkgFile.exists()) {
    pkg = await pkgFile.json();
  }

  pkg.description = description;
  await Bun.write(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

  return description;
}
