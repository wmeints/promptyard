# Promptyard

Promptyard is a prompt management tool designed to help users organize, optimize, and reuse prompts for AI applications
like ChatGPT, Claude, and more. Whether you’re working with multiple projects, experimenting with different prompt
styles, or aiming to improve the efficiency and relevance of your AI interactions, Promptyard offers a streamlined
workspace for all your prompt management needs.

## Features

- **Prompt Library**: Store, categorize, and tag your prompts to keep them organized and easily accessible.
- **Version Control**: Track changes to prompts over time, allowing you to see what works best for different scenarios.
- **Sharing**: Share your prompts with other users that use promptyard.
- **Collaboration:** Share prompts and insights with team members or other users, making it easy to collaborate on AI projects.
- **Prompt Optimization:** Experiment with variations and analyze effectiveness to fine-tune your prompts.
- **Usage Analytics:** Understand which prompts perform best to continuously improve your AI interactions.

Promptyard is an ideal companion for developers, and AI enthusiasts who rely on prompt engineering for applications
across customer support, creative work, coding assistance, and beyond.

## Developing

### System requirements

- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- [Node 22 or higher](https://nodejs.org/en)
- [Pre-commit](https://pre-commit.com/#install)

**Important:** Make sure you install pre-commit globally, especially if you're using vscode. We found that the
pre-commit hooks don't work quite right when you have the pre-commit executable only in the virtual environment of the
project.

### Restoring dependencies

We use the uv package manager to manage the dependencies in the project. Make sure to
synchronize the dependencies. This also installs the correct Python version for the project.

```bash
uv sync
```

### Configuring the pre-commit hooks

Before you start working on the code, make sure you have the pre-commit hooks installed.
These hooks help you avoid common mistakes when working on this code base.

```bash
pre-commit install
```
