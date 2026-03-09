# 🤝 Contributing to buntemp

First off — thanks for wanting to contribute to a tool for managing *temporary* projects. The irony is not lost on us. 😄

## 🛠️ Getting started

```bash
# Clone the repo
git clone https://github.com/torry/buntemp.git
cd buntemp

# Install dependencies
bun install
```

That's it. No 47-step setup guide. You're welcome.

## 🏃 Running locally

```bash
# Run any command directly
bun src/cli.ts new
bun src/cli.ts list
bun src/cli.ts open
bun src/cli.ts clean

# Or link it globally for the full CLI experience
bun link
buntemp new
```

## 🧪 Testing

```bash
bun test
```

Tests use Bun's built-in test runner. If you add a feature, add a test. If you fix a bug, add a test that would have caught it. You know the drill. 🧑‍⚖️

## 📁 Project structure

```
src/
├── cli.ts                 # 🚪 Entry point & command routing
├── colors.ts              # 🎨 ANSI color helpers (respects NO_COLOR)
├── constants.ts           # 📌 Config paths (~/.buntemp, etc.)
├── utils.ts               # 🔧 Shared utilities (project listing, description generation)
└── commands/
    ├── new.ts             # 🆕 Create a new project
    ├── list.ts            # 📋 List projects with descriptions
    ├── open.ts            # 📂 Open/switch to a project
    ├── clean.ts           # 🧹 Delete projects
    └── update-docs.ts     # 🤖 Batch-update AI descriptions
```

## ➕ Adding a new command

1. Create a new file in `src/commands/` — follow the existing pattern (export an async function)
2. Wire it up in `src/cli.ts` — add a case to the `switch` statement
3. Add it to the `printHelp()` output so people actually know it exists
4. Update the README while you're at it. Future you will appreciate this.

Example skeleton:

```typescript
// src/commands/my-cool-command.ts
import { c } from "../colors";

export async function myCoolCommand(): Promise<void> {
  console.log(`${c.green("✓")} Did the cool thing`);
}
```

## 📐 Code style & conventions

- **TypeScript** — strict mode. The compiler is your friend, even when it doesn't feel like it.
- **Bun-first** — use Bun APIs (`Bun.file`, `Bun.$`, `bun:sqlite`, etc.) instead of Node.js equivalents. See `AGENTS.md` for the full list.
- **No `dotenv`** — Bun loads `.env` automatically.
- **No `express`** — use `Bun.serve()` if you need a server.
- **`NO_COLOR` support** — the color system in `colors.ts` already respects this. Don't bypass it with raw ANSI codes.
- **Minimal dependencies** — we currently have exactly one runtime dependency (`@inquirer/prompts`). Let's keep the `node_modules` diet going. 🥗

## 🐛 Reporting bugs

Open an issue. Include:
- What you ran
- What you expected
- What actually happened
- Your Bun version (`bun --version`)

Screenshots welcome. Interpretive dances less so, but we respect the effort. 💃

## 💡 Feature ideas

Got an idea? Open an issue and describe:
- **What** you want
- **Why** it's useful
- **How** you'd use it

We're pretty open-minded, but "rewrite it in Rust" will be politely declined. 🦀❌

## 🔑 Key things to know

- **All project data lives in `~/.buntemp/`** — each project gets its own subdirectory with a random 7-character ID
- **Descriptions are stored in each project's `package.json`** in the `description` field
- **`generateDescription()` in `utils.ts`** calls GitHub Copilot CLI under the hood — keep this in mind if you're working offline
- **The post-commit hook** (`src/commands/new.ts`) auto-updates descriptions after each commit in a temp project

---

Happy hacking! 🐰
