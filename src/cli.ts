#!/usr/bin/env bun

import { newProject } from "./commands/new";
import { listProjects } from "./commands/list";
import { updateDocs } from "./commands/update-docs";
import { openProject } from "./commands/open";
import { cleanProjects } from "./commands/clean";
import { updateProjectDescription } from "./utils";
import { c } from "./colors";

function printHelp(): void {
  console.log();
  console.log(`  ${c.bold(c.cyan("buntemp"))} ${c.dim("— manage temporary Bun projects")}`);
  console.log();
  console.log(`  ${c.bold("Usage:")}  buntemp ${c.green("<command>")} ${c.dim("[options]")}`);
  console.log();
  console.log(`  ${c.bold("Commands:")}`);
  console.log(`    ${c.green("new")}            Create a new temporary project`);
  console.log(`    ${c.green("list")}${c.dim(", ls")}       List all existing projects`);
  console.log(`    ${c.green("update-docs")}    Generate descriptions for all projects`);
    console.log(`    ${c.green("open")} ${c.dim("[id]")}      Open a project ${c.dim("(interactive if no ID)")}`);
    console.log(`    ${c.green("clean")} ${c.dim("[id]")}     Delete projects ${c.dim("(multi-select if no ID)")}`);
    console.log(`    ${c.green("help")}           Show this help message`);
  console.log();
}

async function main(): Promise<void> {
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case "new":
      await newProject();
      break;

    case "list":
    case "ls":
      await listProjects();
      break;

    case "update-docs":
      await updateDocs();
      break;

    case "open":
      await openProject(args[0]);
      break;

    case "clean":
    case "rm":
      await cleanProjects(args[0]);
      break;

    // Hidden command used by the post-commit git hook
    case "_update-single":
      if (args[0]) {
        await updateProjectDescription(args[0]);
      }
      break;

    case "help":
    case "--help":
    case "-h":
    case undefined:
      printHelp();
      break;

    default:
      console.error(`\n  ${c.red("Error:")} Unknown command ${c.bold(command)}`);
      printHelp();
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(`${c.red("Error:")} ${error.message}`);
  process.exit(1);
});
