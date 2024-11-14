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

## System requirements

- [UV](https://docs.astral.sh/uv/)

## Getting started

You can run this application on your local machine using the steps in this section.

### Configure Github application

If you want to login using Github, make sure you have an OAuth application registration.
You can create one on the [Github website](https://github.com/settings/apps/new).

After configuring the OAuth application, create a client secret and store the following
values in the a `.env` file in the root of the repository:

```environment
GITHUB_CLIENT_ID=<client id>
GITHUB_CLIENT_SECRET=<generated client secret>
```

### Migrating the database

The application uses sqlite in development mode. You do need to run the migrations though.
Use the following command to migrate the database to the latest version:

```bash
uv run manage.py migrate
```

### Starting the application

Use the following command to run the server:

```bash
uv run manage.py runserver
```

## Developing

This section covers how to work on the code base. You only need this if you want to change
the behavior of the code on some way.

### System requirements for development

- [Pre-commit](https://pre-commit.com/#install)
- [UV](https://docs.astral.sh/uv/)

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
