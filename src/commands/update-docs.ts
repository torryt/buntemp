import { getProjects, updateProjectDescription } from "../utils";
import { c } from "../colors";

export async function updateDocs(): Promise<void> {
  const projects = await getProjects();

  if (projects.length === 0) {
    console.log("");
    console.log(`  ${c.yellow("No projects found.")} Create one with ${c.bold("buntemp new")}`);
    console.log("");
    return;
  }

  console.log("");
  console.log(`  ${c.bold("Updating descriptions")} for ${c.cyan(String(projects.length))} project(s)...`);
  console.log("");

  let updated = 0;
  let failed = 0;

  for (const project of projects) {
    process.stdout.write(`  ${c.cyan(project.id)} `);

    const description = await updateProjectDescription(project.path);

    if (description) {
      console.log(`${c.green("+")} ${description}`);
      updated++;
    } else {
      console.log(`${c.red("x")} ${c.dim("failed to generate description")}`);
      failed++;
    }
  }

  console.log("");
  console.log(
    `  ${c.bold("Done.")} ${c.green(String(updated) + " updated")}${failed > 0 ? `, ${c.red(String(failed) + " failed")}` : ""}`
  );
  console.log("");
}
