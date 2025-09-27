# Promptyard

Welcome to the promptyard repository. This repository contains the source code
for https://promptyard.dev/ and the promptyard NPM package.

Promptyard helps users manage and version their prompt templates. It includes
a client to quickly deploy prompt templates for coding agents like Claude Code
and Github Copilot. 

I developed this project as a follow up to my other repository: 
[context-engineering](https://github.com/wmeints/context-engineering) to help
make it easier to use the spec-driven workflow I defined in that repository.

You can run promptyard on your own server too! This is useful when you want to
promote sharing of prompt templates within your own company :smile:

## Project goals

- Make it easy for people to manage and share prompt templates with their team or the general public
- Make it easy to install prompt templates in software projects that use coding agents

## Getting started

Make sure you've configured the following environment variables in a `.env` file.

```text
DB_USER=<database-username>
DB_PASSWORD=<database-password>
DATABASE_URL=<full url to the database>
```

- `git clone https://github.com/wmeints/promptyard`
- `cd promptyard`
- `npm install`
- `docker compose up -d`
- `npm run dev`

## Documentation

- [Architecture documentation](docs/architecture)
