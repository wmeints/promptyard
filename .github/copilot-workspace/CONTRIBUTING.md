# Instructions

This document provides instructions to contribute to the promptyard application.

## Web Framework

We use [Next.js](https://nextjs.org/) to build the application. We use [Tailwind CSS](https://tailwindcss.com/) to style the components of the website.

## Testing

We run unit-tests with [Vitest](https://nextjs.org/docs/app/building-your-application/testing/vitest) and e2e tests with [Playwright](https://nextjs.org/docs/app/building-your-application/testing/playwright).

## Authentication

We use [NextAuth](https://next-auth.js.org/configuration/providers/oauth) to authenticate users using their Github account. While they authenticate with Github, we have our own profile data for the user that displays the full name
and a short biography so people know who's publishing prompts on the website.

## Data persistence

We use [Azure Cosmos](https://learn.microsoft.com/en-us/azure/cosmos-db/) to store the data behind the application. The [Cosmos client](https://www.npmjs.com/package/@azure/cosmos) is used to access the database.
