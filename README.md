# Promptyard

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
