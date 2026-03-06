import { join } from "path";
import { mkdir, writeFile, chmod } from "fs/promises";
import { BUNTEMP_DIR } from "../constants";
import { ensureBuntempDir, generateId, writeCdPath } from "../utils";
import { c } from "../colors";

const POST_COMMIT_HOOK = `#!/bin/sh
# Auto-update project description on commit
buntemp _update-single "$(git rev-parse --show-toplevel)" &
`;

export async function newProject(): Promise<void> {
  await ensureBuntempDir();

  const id = generateId();
  const projectPath = join(BUNTEMP_DIR, id);

  await mkdir(projectPath, { recursive: true });

  // Run bun init inside the new project directory
  const bunInit = Bun.spawn(["bun", "init", "-y"], {
    cwd: projectPath,
    stdout: "ignore",
    stderr: "ignore",
  });
  await bunInit.exited;

  // Initialize git repo
  const gitInit = Bun.spawn(["git", "init"], {
    cwd: projectPath,
    stdout: "ignore",
    stderr: "ignore",
  });
  await gitInit.exited;

  // Install post-commit hook
  const hooksDir = join(projectPath, ".git", "hooks");
  await mkdir(hooksDir, { recursive: true });

  const hookPath = join(hooksDir, "post-commit");
  await writeFile(hookPath, POST_COMMIT_HOOK);
  await chmod(hookPath, 0o755);

  console.log("");
  console.log(`  ${c.green("+")} Created new project ${c.bold(c.cyan(id))}`);
  console.log(`  ${c.dim("Path:")} ${projectPath}`);
  console.log("");

  await writeCdPath(projectPath);
}
