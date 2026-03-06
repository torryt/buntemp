import { rm } from "fs/promises";
import { checkbox, confirm } from "@inquirer/prompts";
import { getProjects } from "../utils";
import { c } from "../colors";

export async function cleanProjects(projectId?: string): Promise<void> {
  const projects = await getProjects();

  if (projects.length === 0) {
    console.log("");
    console.log(`  ${c.yellow("No projects to clean.")}`);
    console.log("");
    return;
  }

  let toDelete: string[];

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
    toDelete = [project.id];
  } else {
    const ALL_VALUE = "__all__";

    const selected = await checkbox({
      message: "Select projects to delete:",
      choices: [
        {
          name: c.bold("All projects"),
          value: ALL_VALUE,
        },
        ...projects.map((p) => ({
          name: `${p.id}${p.description ? c.dim(` - ${p.description}`) : ""}`,
          value: p.id,
        })),
      ],
    });

    if (selected.length === 0) {
      console.log("");
      console.log(`  ${c.dim("Nothing selected.")}`);
      console.log("");
      return;
    }

    toDelete = selected.includes(ALL_VALUE)
      ? projects.map((p) => p.id)
      : selected;
  }

  // Confirmation
  const label =
    toDelete.length === projects.length
      ? c.bold("all") + ` ${toDelete.length} projects`
      : `${c.bold(String(toDelete.length))} project(s)`;

  const ok = await confirm({
    message: `Delete ${label}? This cannot be undone.`,
    default: false,
  });

  if (!ok) {
    console.log("");
    console.log(`  ${c.dim("Cancelled.")}`);
    console.log("");
    return;
  }

  console.log("");

  let deleted = 0;
  for (const id of toDelete) {
    const project = projects.find((p) => p.id === id)!;
    try {
      await rm(project.path, { recursive: true, force: true });
      console.log(`  ${c.red("-")} ${c.dim("Deleted")} ${c.cyan(id)}`);
      deleted++;
    } catch {
      console.log(`  ${c.red("x")} ${c.dim("Failed to delete")} ${c.cyan(id)}`);
    }
  }

  console.log("");
  console.log(`  ${c.bold("Done.")} ${c.red(String(deleted) + " deleted")}`);
  console.log("");
}
