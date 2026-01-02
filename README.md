# Promptyard

Promptyard is a web application that makes it easy to reuse efforts in applying
generative AI across multiple teams. Help colleagues share prompts, skills,
and agents within your organization.

## System requirements

- [Bun](https://bun.sh/)
- [Docker](https://docker.com/) or [Podman](https://podman.io/)
- [.NET 10 SDK](https://dot.net/)
- [Aspire](https://aspire.dev/)
- [Nx](https://nx.dev)

## Getting started

Getting started locally involves a few steps outlined below. Most of these steps
are a one-time affair, so don't worry if this feels a little long and
complicated. You only need to do these steps once per machine.

### Setting up the MCP server

This project uses the Nx MCP server to provide Claude Code with context\
information about the repository setup. You need different configurations
depending on your operating system.

- Copy `mcp.windows.json` to `.mcp.json` in the root of the cloned repository
  for the MCP server config on Windows
- Copy `mcp.posix.json` to `.mcp.json` in the root of the cloned repository
  for the MCP server config on Mac/Linux

### Setting secrets and configuration parameters

This application uses the Aspire to manage the local orchestration of
components during development. You should configure the following secrets in the 
`hosting/Promptyard.AppHost` directory with the following command:

```bash
dotnet user-secrets set "<secret-name>" "<secret-value>"
```

Make sure to create the following secrets:

| Secret Name                        | Secret Value                                                            |
| ---------------------------------- | ----------------------------------------------------------------------- |
| `Parameters:portalClientId`        | The keycloak client ID for the portal                                   |
| `Parameters:portalClientSecret`    | The keycloak client secret for the portal                               |
| `Parameters:portalRealm`           | The keycloak realm where the portal is registered                       |
| `Parameters:keycloakAdminUserName` | The username of the keycloak admin user                                 |
| `Parameters:keycloakAdminPassword` | The password of the keycloak admin user                                 |
| `Parameters:authSecretKey`         | The authentication secret key, you can set this to a random value       |
| `Parameters:publicAuthUrl`         | The public url for the application (optional if you're running locally) |

### Running the application

You can run the application by executing the following command from the root of the repository:

```bash
aspire run
```

## Configuring the keycloak environment

Follow the [keycloak](./docs/engineering/keycloak.md) guide in the engineering
documentation to configure keycloak.

## Documentation

- [User documentation](docs/user)
- [Engineering documentation](docs/engineering)
- [Product documentation](docs/product)
- [Architecture documentation](docs/architecture)
