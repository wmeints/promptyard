#:package CommunityToolkit.Aspire.Hosting.Bun@13.0.1-beta.468
#:sdk Aspire.AppHost.Sdk@13.1.0

var builder = DistributedApplication.CreateBuilder(args);

builder.AddBunApp("portal", "../portal", "dev")
    .WithHttpEndpoint(port: 3000, env: "PORT")
    .WithExternalHttpEndpoints();

builder.Build().Run();
