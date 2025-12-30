# [ADR002] - Use ASP.NET Core for Backend API

- **Status**: Accepted
- **Date:** 2025-12-30

## Context

We need to decide on the technology stack for our backend API. Since we are
already using Next.js for the frontend, we have the option to leverage its
full-stack capabilities through API routes and server actions. However, our
application requires sophisticated event sourcing and event-driven
architecture patterns.

### Alternatives Considered

1. **Next.js Full-Stack (API Routes/Server Actions)**: Use Next.js's built-in
   backend capabilities for a unified JavaScript/TypeScript stack. This
   simplifies deployment and reduces the number of technologies in the stack.

2. **ASP.NET Core with WolverineFx and Marten**: Use a dedicated .NET backend
   that provides mature event sourcing and event-driven messaging capabilities
   through the WolverineFx and Marten libraries.

3. **Node.js with EventStoreDB**: Use a separate Node.js service with
   EventStoreDB for event sourcing capabilities while staying in the JavaScript ecosystem.

### Why We Need to Choose

Our application domain benefits significantly from event sourcing patterns,
including:

- Full audit trail of all state changes
- Ability to replay events for debugging and recovery
- Support for complex event-driven workflows
- Temporal queries to understand system state at any point in time

The .NET ecosystem offers mature, battle-tested libraries (WolverineFx and 
Marten) that provide these capabilities out of the box with PostgreSQL as the
event store.

## Decision

We will use ASP.NET Core for the backend API to leverage WolverineFx and Marten 
for event sourcing and event-driven architecture capabilities.

## Consequences

- **Positive**: Access to mature event sourcing implementation through Marten, which uses PostgreSQL as both document database and event store
- **Positive**: WolverineFx provides robust messaging patterns, including command handling, event publishing, and saga/workflow orchestration
- **Positive**: Strong typing and compile-time safety in C# for domain modeling
- **Positive**: Excellent tooling and debugging support in the .NET ecosystem
- **Positive**: PostgreSQL as the backing store provides reliability and familiarity
- **Negative**: Introduces a second technology stack (C#/.NET) alongside TypeScript/JavaScript
- **Negative**: Requires team proficiency in both ecosystems
- **Negative**: More complex deployment with separate frontend and backend services
- **Negative**: Additional network hop between Next.js frontend and ASP.NET Core backend
