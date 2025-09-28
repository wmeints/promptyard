# Introduction and goals

Promptyard is a an application that helps developers and other business users to
manage prompt templates in a central place with the primary goal of sharing them
with co-workers so that more people can profit from their prompt engineering
efforts. 

## Goals

- Improve the output quality of generative AI tools by allowing people to
  reuse and collaborate on prompt templates within the organization via
  a central website.

- Increase productivity of software teams by letting developers publish
  prompts as repositories to the central website and then deploy these shared 
  prompt templates to their software projects quickly through a command-line
  interface.

## Functional components in the solution

The promptyard solution will have two parts:

- A central website to share prompt templates and to collaborate on those
  shared templates to improve them.

- A command-line utility to manage sets of prompt templates as part of software
  projects supporting publication and deployment of repositories of prompt
  prompt templates.

## Target audiences

We've identified two groups of users for the application:

- **Developers:** Will use the application primarily in combination with a
  coding agent. Their primary entrypoint will be the command-line utility
  to manage sets of prompts to implement specification-driven development.

- **Information workers:** Will use the application to share prompts that
  they've made for chat-based applications like Microsoft Copilot and ChatGPT.
  They will use the website as the primary entrypoint to share and collaborate
  on prompt templates.