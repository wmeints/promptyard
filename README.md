# Promptyard

Promptyard is a prompt management tool designed to help users organize, optimize, and reuse prompts for AI applications like ChatGPT, Claude, and more. Whether you’re working with multiple projects, experimenting with different prompt styles, or aiming to improve the efficiency and relevance of your AI interactions, Promptyard offers a streamlined workspace for all your prompt management needs.

## Features
- **Prompt Library**: Store, categorize, and tag your prompts to keep them organized and easily accessible.
- **Version Control**: Track changes to prompts over time, allowing you to see what works best for different scenarios.

Promptyard is an ideal companion for developers, and AI enthusiasts who rely on prompt engineering for applications across customer support, creative work, coding assistance, and beyond. 

## Getting Started

### Using the dev container

This project contains a dev container to help you get started quickly. Make sure you have the 
following extension installed: [Remote development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack)

Next, Reopen the repository in a container by running the command `Dev containers: reopen in container`.

The dev container includes a PostgreSQL database to store the application data.
You can access the database directly using the following command:

```bash
psql -h localhost -p 5432 -d promptyard -U postgres -W
```

### Setting up a local environment file

You'll need to set up a `.env` file in the root of the project directory to configure the application correctly.
Please create the `.env` file and add the following content

```env
GITHUB_ID=
GITHUB_SECRET=
NEXTAUTH_URL=http://localhost:3000
NEXT_SECRET=
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/promptyard?schema=public"
```

**Note:** you'll have to set up a new [Github OAuth application](https://github.com/settings/apps) before you can
authenticate users.

You also need to generate a new secret using the following command and store it as `NEXT_SECRET`:

```bash
openssl rand -base64 32
```

### Restoring the dependencies

After opening the project in the dev container, restore the dependencies using the following command:

```bash
npm install
```

### Running the application

Use the following commands to run the application:

```bash
npx prisma db push
npm run dev
```

The first command pushes any missing database schema changes to the local PostgreSQL database.
The second command starts a development version of the app.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploying to production

This project is packaged up as a docker container. You can find it on the
[Docker hub](https://hub.docker.com/r/willemmeints/promptyard).
