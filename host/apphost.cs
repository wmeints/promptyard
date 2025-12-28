#:package Aspire.Hosting.PostgreSQL@13.1.0
#:package CommunityToolkit.Aspire.Hosting.Bun@13.0.1-beta.468
#:sdk Aspire.AppHost.Sdk@13.1.0

var builder = DistributedApplication.CreateBuilder(args);

var databaseServer = builder.AddPostgres("postgres").WithDataVolume();
var applicationDatabase = databaseServer.AddDatabase("database", "promptyard");

builder.AddBunApp("portal", "../portal", "dev")
    .WithReference(applicationDatabase)
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithExternalHttpEndpoints()
    .WaitFor(applicationDatabase);

builder.Build().Run();
