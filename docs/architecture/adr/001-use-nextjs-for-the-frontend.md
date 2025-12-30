# [ADR001] - Use Next.js for Frontend

- **Status**: Accepted
- **Date:** 2025-12-30

## Context

We are starting a new project and need to select a frontend framework. The main
alternative considered was Vite + React, which offers fast build tooling with
React but lacks built-in server-side rendering capabilities.

Key requirements for the frontend include:

- Server-side rendering support
- A robust routing solution
- Access to the React ecosystem and community

## Decision

We will use Next.js as the frontend framework.

## Consequences

- **Positive**: Built-in support for server-side rendering (SSR) and static site generation (SSG), enabling better SEO and initial page load performance
- **Positive**: File-based routing system reduces boilerplate and simplifies navigation structure
- **Positive**: Full access to the React ecosystem, libraries, and community resources
- **Negative**: Increased complexity compared to a simple Vite + React setup
- **Negative**: Learning curve for team members unfamiliar with Next.js conventions and features
