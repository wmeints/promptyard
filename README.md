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

* [uv](https://docs.astral.sh/uv/getting-started/installation/)
* [Node 22 or higher](https://nodejs.org/en)

### Restoring dependencies

```bash
uv sync
```

### Applying migrations

```bash
uv run python manage.py migrate
```