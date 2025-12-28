# Promptyard

Promptyard is a web application that makes it easy to reuse efforts in applying 
generative AI across multiple teams. Help colleagues share prompts, skills, 
and agents within your organization.

## System requirements

- [Bun](https://bun.sh/)
- [Docker](https://docker.com/) or [Podman](https://podman.io/)
- [.NET 10 SDK](https://dot.net/)
- [Aspire](https://aspire.dev/)

## Getting started

### Setting up social providers for the application

Currently, we only have support for Github-based authentication. Make sure to
configure a GitHub OAuth application [here](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app).

### Setting secrets and configuration parameters

This application uses the Aspire to manage the local orchestration of
components. You should configure the following secrets in the `host` directory
with the following command:

```bash
dotnet user-secrets set --file apphost.cs "<secret-name>" "<secret-value>"
```

Make sure to create the following secrets:

| Secret Name                     | Secret Value                                                            |
| ------------------------------- | ----------------------------------------------------------------------- |
| `Parameters:githubClientId `    | The Client ID of the OAuth application on GitHub                        |
| `Parameters:githubClientSecret` | The Client Secret of the OAuth application on GitHub                    |
| `Parameters:authSecretKey`      | The authentication secret key, you can set this to a random value       |
| `Parameters:publicAuthUrl`      | The public url for the application (optional if you're running locally) |

### Running the application

You can run the application by executing the following command from
the root of the repository:

```bash
aspire run
```

## Documentation

- [User documentation](docs/user)
- [Product documentation](docs/product)
- [Architecture documentation](docs/architecture)
