#:package Aspire.Hosting.PostgreSQL@13.1.0
#:package CommunityToolkit.Aspire.Hosting.Bun@13.0.1-beta.468
#:sdk Aspire.AppHost.Sdk@13.1.0

var builder = DistributedApplication.CreateBuilder(args);

var databaseServer = builder.AddPostgres("postgres").WithDataVolume().WithPgWeb();
var applicationDatabase = databaseServer.AddDatabase("database", "promptyard");

var authSecretKey = builder.AddParameter("authSecretKey", secret: true);
var authPublicUrl = builder.AddParameter("publicAuthUrl", "http://localhost:3000");

var githubClientId = builder.AddParameter("githubClientId");
var githubClientSecret = builder.AddParameter("githubClientSecret", secret: true);

// This script initializes the database for the portal application.
// The portal application will wait for this script to complete before starting.
var portalInitScript = builder.AddBunApp("portal-init", "../portal", "db:push")
    .WithReference(applicationDatabase)
    .WaitFor(applicationDatabase);

builder.AddBunApp("portal", "../portal", "dev")
    .WithEnvironment("BETTER_AUTH_SECRET", authSecretKey)
    .WithEnvironment("BETTER_AUTH_URL", authPublicUrl)
    .WithEnvironment("GITHUB_CLIENT_ID", githubClientId)
    .WithEnvironment("GITHUB_CLIENT_SECRET", githubClientSecret)
    .WithReference(applicationDatabase)
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithExternalHttpEndpoints()
    .WaitFor(applicationDatabase)
    .WaitForCompletion(portalInitScript)
    .WithOtlpExporter();


builder.Build().Run();
