import { join } from "path";
import { select } from "@inquirer/prompts";
import { BUNTEMP_DIR } from "../constants";
import { getProjects, updateProjectDescription, writeCdPath } from "../utils";
import { c } from "../colors";

export async function openProject(projectId?: string): Promise<void> {
  const projects = await getProjects();

  if (projects.length === 0) {
    console.log("");
    console.log(`  ${c.yellow("No projects found.")} Create one with ${c.bold("buntemp new")}`);
    console.log("");
    return;
  }

  let selectedId: string;

  if (projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (!project) {
      console.error("");
      console.error(`  ${c.red("Error:")} Project ${c.bold(projectId)} not found.`);
      console.log("");
      console.log(`  ${c.dim("Available projects:")}`);
      for (const p of projects) {
        const desc = p.description ? c.dim(` - ${p.description}`) : "";
        console.log(`    ${c.cyan(p.id)}${desc}`);
      }
      console.log("");
      process.exit(1);
    }
    selectedId = projectId;
  } else {
    // Auto-generate missing descriptions before showing the picker
    const missing = projects.filter((p) => !p.description);
    if (missing.length > 0) {
      console.log("");
      console.log(`  ${c.dim(`Generating descriptions for ${missing.length} project(s)...`)}`);

      for (const project of missing) {
        const desc = await updateProjectDescription(project.path);
        if (desc) {
          project.description = desc;
        }
      }
    }

    selectedId = await select({
      message: "Select a project to open:",
      choices: projects.map((p) => ({
        name: `${p.id}${p.description ? ` - ${p.description}` : ""}`,
        value: p.id,
      })),
    });
  }

  const projectPath = join(BUNTEMP_DIR, selectedId);

  console.log("");
  console.log(`  ${c.green(">")} Opening ${c.bold(c.cyan(selectedId))}`);
  console.log("");

  await writeCdPath(projectPath);
}
