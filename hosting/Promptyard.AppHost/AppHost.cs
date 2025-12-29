using Microsoft.Extensions.Hosting;

var builder = DistributedApplication.CreateBuilder(args);

var databaseServer = builder.AddPostgres("postgres").WithDataVolume();
var applicationDatabase = databaseServer.AddDatabase("applicationDatabase", "promptyard");

var authSecretKey = builder.AddParameter("authSecretKey", secret: true);
var authPublicUrl = builder.AddParameter("publicAuthUrl", "http://localhost:3000");

var keycloakAdminUserName = builder.AddParameter("keycloakAdminUserName");
var keycloakAdminPassword = builder.AddParameter("keycloakAdminPassword", secret: true);
var portalClientId = builder.AddParameter("portalClientId");
var portalClientSecret = builder.AddParameter("portalClientSecret", secret: true);
var portalRealm = builder.AddParameter("portalRealm");

// http://localhost:3000/api/auth/oauth2/callback/keycloak

// NOTE: Keycloak has a persistent lifetime because it's super slow to start.
// If you have any problems with keycloak, you can reboot it through the dashboard.

var keycloak = builder
    .AddKeycloak(
        name: "keycloak",
        adminUsername: keycloakAdminUserName,
        adminPassword: keycloakAdminPassword,
        port: 8080
    )
    .WithDataVolume()
    .WithLifetime(ContainerLifetime.Persistent);

var api = builder
    .AddProject<Projects.Promptyard_Api>("api")
    .WithReference(applicationDatabase)
    .WithReference(keycloak)
    .WithHttpHealthCheck("/health")
    .WaitFor(applicationDatabase)
    .WaitFor(keycloak);

// NOTE: We're skipping TLS checks in development mode to allow self-signed certificates.
// In production, proper TLS verification should be enforced.

builder.AddBunApp("portal", "../../portal", "dev")
    .WithEnvironment("BETTER_AUTH_SECRET", authSecretKey)
    .WithEnvironment("BETTER_AUTH_URL", authPublicUrl)
    .WithEnvironment("KEYCLOAK_CLIENT_ID", portalClientId)
    .WithEnvironment("KEYCLOAK_CLIENT_SECRET", portalClientSecret)
    .WithEnvironment("KEYCLOAK_REALM", portalRealm)
    .WithEnvironment("NODE_TLS_REJECT_UNAUTHORIZED", builder.Environment.IsDevelopment() ? "0" : "1")
    .WithReference(keycloak)
    .WaitFor(keycloak)
    .WaitFor(api)
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithExternalHttpEndpoints()
    .WithOtlpExporter(OtlpProtocol.HttpProtobuf);


builder.Build().Run();