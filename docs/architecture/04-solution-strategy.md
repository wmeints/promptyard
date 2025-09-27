# Solution strategy

This section covers the solution strategy for promptyard.

## Solution archetype

Promptyard will have two parts to it:

1. **The website:** provides a central interface to manage repositories of
   prompt templates for users. 

2. **The command-line client:** provides a covenient interface for developers
   to quickly deploy templates to their software projects. Users can also use
   this to manage templates although it will likely only be used by developers.

## The website

The website will have a few key components:

1. **Catalog:** This functional area provides access to
   the management interface for prompts templates and repositories.

2. **Search:** This functional area allows users to quickly find repositories
   and prompt templates in the application.

## The command-line client

The command-line client will have a limited set of commands:

- **Deploying prompt templates:** Helps the user deploy prompt templates to a
- directory on the computer of the user. We'll focus mainly on deploying prompt
  templates in a new project. We'll add upgrading prompt templates later.

- **Publishing templates:** Helps the user push prompt templates to the website
  or a private instance of promptyard. We'll keep this basic at first, but we'll
  expand this as necessary to make managing prompt templates via the
  command-line a useful alternative to the website.

## Technology choices

We split the technology choices into two separate sections. One for the website
and one for the command-line client. We'll need to keep both decoupled so we
maximize the flexibility in versioning them independently.

### For the website

- **NextJS:** We use this framework as it provides a nice full stack approach
  to building a web application with React. NextJS has quite a large community
  behind it too, which helps finding people to maintain promptyard in the long
  run.

- **Typescript:** We use Typescript to add an additional layer of code
  validation on top of Javascript. This helps improve the quality of the code
  we write.

- **Shadcn:** We use shadcn + tailwindcss to style the frontend. Shadcn provides
  excellent quality user interface component while tailwindcss provides the 
  important CSS utility classes to style the user interface.

- **Drizzle:** We use Drizzle as our persistence layer technology. Drizzle 
  provides a flexible interface and allows us to configure multiple databases
  in the future if we want to. For now, we'll stick with Postgres or Neon.

- **Opensearch:** We use Opensearch for the search engine to provide the search
  functionality. It provides a friendly open-source licensing model that
  provides users with the appropriate freedom.

- **BetterAuth:** Provides the authentication integration components
  for the application. It supports multiple OAuth providers. We use clerk.com
  as the main integration for the public website. We provide configuration
  options for commonly used authentication providers.

### The command-line client

TODO: Describe the solution strategy for the command-line client.