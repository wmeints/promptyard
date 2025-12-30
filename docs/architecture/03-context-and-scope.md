# Context and scope

This section covers the context and scope of the application.

## Business context

TODO: Describe the business context

## Technical context

The following diagram shows the technical context of the system:

```mermaid
C4Context
    title System Context Diagram for Promptyard

    Person(user, "User", "A user of the application")

    System_Boundary(promptyard, "Promptyard") {
        Container(portal, "Portal", "Next.js + Bun", "User interface and client-side application")
        Container(api, "Backend API", "ASP.NET Core + Marten", "Business logic, data access, and API endpoints")
    }

    System(keycloak, "Keycloak", "Authentication and authorization via OAuth2/OIDC")
    ContainerDb(postgres, "PostgreSQL", "Database", "Persistent storage for application data")

    Rel(user, portal, "Uses")
    Rel(portal, api, "HTTP requests")
    Rel(portal, keycloak, "OAuth2/OIDC")
    Rel(api, postgres, "Document storage")
    Rel(api, keycloak, "Token validation")
```

| Component   | Technology               | Responsibility                                   |
| ----------- | ------------------------ | ------------------------------------------------ |
| PostgreSQL  | PostgreSQL database      | Persistent storage for application data          |
| Keycloak    | Keycloak identity server | Authentication and authorization via OAuth2/OIDC |
| Backend API | ASP.NET Core + Marten    | Business logic, data access, and API endpoints   |
| Portal      | Next.js + Bun            | User interface and client-side application       |