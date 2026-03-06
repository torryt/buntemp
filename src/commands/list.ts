import { getProjects, updateProjectDescription } from "../utils";
import { c } from "../colors";

export async function listProjects(): Promise<void> {
  const projects = await getProjects();

  if (projects.length === 0) {
    console.log("");
    console.log(`  ${c.yellow("No projects found.")} Create one with ${c.bold("buntemp new")}`);
    console.log("");
    return;
  }

  // Auto-generate missing descriptions
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

  console.log("");
  console.log(`  ${c.bold(`${projects.length} project(s)`)}`);
  console.log("");

  const idWidth = Math.max(4, ...projects.map((p) => p.id.length));

  console.log(`  ${c.dim(c.bold("ID".padEnd(idWidth)))}  ${c.dim(c.bold("Description"))}`);
  console.log(`  ${c.dim("─".repeat(idWidth))}  ${c.dim("─".repeat(40))}`);

  for (const project of projects) {
    const id = c.cyan(project.id.padEnd(idWidth));
    const desc = project.description
      ? project.description
      : c.dim("(no description)");
    console.log(`  ${id}  ${desc}`);
  }

  console.log("");
}
