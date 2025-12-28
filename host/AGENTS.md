# AGENTS.md

This file provides guidance to coding agents when working with code in this directory.

## Project Overview

This directory contains the .NET Aspire AppHost configuration for the Promptyard application. It orchestrates the local development environment including PostgreSQL database and the Next.js portal application running on Bun.

## Architecture

### Aspire AppHost (apphost.cs)

This is a .NET Aspire C# script that defines the distributed application structure:

- **Database**: PostgreSQL server with a named database (`promptyard`)
  - Uses a persistent data volume
  - Exposed via connection string to dependent services

- **Portal Application** (Next.js on Bun):
  - Location: `../portal`
  - Runs via `bun dev` command
  - HTTP endpoint: Port 3000 (exposed externally)
  - Database initialization: Runs `portal-init` script before starting

- **Portal Init Script**:
  - Runs `bun push-db` to initialize database schema
  - Waits for database to be ready
  - Must complete before portal starts

### Configuration Parameters

The following parameters are required (configured via Aspire user-secrets):

- `authSecretKey` (secret): Better Auth secret key for session encryption
- `publicAuthUrl`: Public URL for auth callbacks (default: `http://localhost:3000`)
- `githubClientId`: GitHub OAuth app client ID
- `githubClientSecret` (secret): GitHub OAuth app client secret

### Launch Settings (apphost.run.json)

Two profiles available:
- **https**: Runs on HTTPS (ports 17204/15265) with secure endpoints
- **http**: Runs on HTTP (port 15265) for simpler local development

Environment variables configure Aspire dashboard endpoints:
- OTLP telemetry endpoint
- MCP endpoint
- Resource service endpoint

## Commands

### Running the Application

From the repository root:
```bash
aspire run                           # Start the entire application stack
```

From this directory:
```bash
dotnet run --launch-profile https    # Run with HTTPS profile
dotnet run --launch-profile http     # Run with HTTP profile
```

### Managing Secrets

```bash
aspire secrets set authSecretKey <your-secret>
aspire secrets set githubClientId <your-client-id>
aspire secrets set githubClientSecret <your-client-secret>
```

## Dependencies

### NuGet Packages
- `Aspire.Hosting.PostgreSQL@13.1.0` - PostgreSQL hosting support
- `CommunityToolkit.Aspire.Hosting.Bun@13.0.1-beta.468` - Bun application hosting

### SDK
- `Aspire.AppHost.Sdk@13.1.0` - Aspire AppHost SDK for C# scripts

## System Requirements

- .NET 10 SDK
- Aspire workload (`dotnet workload install aspire`)
- Docker or Podman (for PostgreSQL container)
- Bun runtime (for portal application)

## Making Changes

When modifying the AppHost configuration:

1. **Adding Resources**: Use Aspire's fluent API to add new resources (databases, caches, services)
2. **Environment Variables**: Pass configuration via `.WithEnvironment()` method
3. **Service Dependencies**: Use `.WaitFor()` to ensure proper startup order
4. **Endpoints**: Configure HTTP endpoints with `.WithHttpEndpoint()`
5. **External Access**: Use `.WithExternalHttpEndpoints()` to expose services externally

## Notes

- The portal application expects database connection via `DATABASE_URI` environment variable (auto-configured by Aspire)
- All secrets should be stored using Aspire's user-secrets system, never in code
- The init script must complete successfully before the portal starts to ensure database schema is ready
