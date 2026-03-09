# 🐰 buntemp

> Temporary Bun projects, without the existential dread of naming them.

**buntemp** is a CLI tool for creating and managing throwaway [Bun](https://bun.sh) projects. Need to spike something out? Test a weird idea at 2am? Prototype that thing your coworker said was "impossible"? Spin up an isolated project, hack away, and clean up when you're done — or don't. We won't judge.

Each project lives in `~/.buntemp/` and gets an auto-generated AI description so you can figure out what past-you was thinking. 🔮

## ✨ Features

- 🆕 **Create** isolated temp projects in one command
- 📋 **List** all your projects with AI-generated descriptions
- 📂 **Open** projects interactively or by ID
- 🧹 **Clean** up projects individually or in bulk
- 🤖 **Auto-describe** projects via GitHub Copilot CLI (post-commit hook included, because you *will* forget what this one does)

## 📦 Installation

**Prerequisites:**
- [Bun](https://bun.sh) installed (you saw this coming)
- [GitHub Copilot CLI](https://docs.github.com/en/copilot/github-copilot-in-the-cli) for auto-generated descriptions (optional, but your future self will thank you)

```bash
# Clone the repo
git clone https://github.com/torry/buntemp.git
cd buntemp

# Install dependencies
bun install

# Link it globally so you can run `buntemp` from anywhere
bun link
```

Or just run it directly if commitment isn't your thing:

```bash
bun src/cli.ts <command>
```

## 🚀 Usage

```
buntemp <command> [options]
```

### Commands

| Command | Description |
|---|---|
| `buntemp new` | Create a fresh temporary project |
| `buntemp list` (or `ls`) | List all projects with descriptions |
| `buntemp open [id]` | Open a project (interactive picker if no ID) |
| `buntemp clean [id]` (or `rm`) | Delete projects (multi-select if no ID) |
| `buntemp update-docs` | Regenerate descriptions for all projects |
| `buntemp help` | Show help |

### Quick start 🏃

```bash
# Create a new project
buntemp new

# See what you've been up to
buntemp list

# Jump back into one
buntemp open

# Marie Kondo the ones that no longer spark joy
buntemp clean
```

### How it works 🧠

1. `buntemp new` creates a directory under `~/.buntemp/` with a random ID, runs `bun init`, and sets up a git repo with a post-commit hook
2. Every time you commit, the hook asks Copilot CLI to summarize your project in ~7 words (it's surprisingly good at this)
3. `buntemp list` shows all your projects with their descriptions — no more opening 14 folders to find the one with the WebSocket experiment
4. `buntemp clean` lets you select and delete projects when the guilt of digital hoarding sets in

## 🤝 Contributing

Want to help make buntemp better? Excellent taste. See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions and guidelines.

## 📄 License

[MIT](LICENSE) — go wild. 🎉
