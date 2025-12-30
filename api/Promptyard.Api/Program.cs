using JasperFx;
using Marten;
using Wolverine;
using Wolverine.Http;
using Wolverine.Marten;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddNpgsqlDataSource(builder.Configuration.GetConnectionString("applicationDatabase")!);

builder.Host.UseWolverine(options =>
{
    options.Policies.AutoApplyTransactions();
    options.Policies.UseDurableLocalQueues();
});

builder.Services
    .AddMarten(options => { })
    .IntegrateWithWolverine()
    .UseNpgsqlDataSource();

builder.Services.AddWolverineHttp();

builder.Services
    .AddAuthentication()
    .AddKeycloakJwtBearer(serviceName: "keycloak", realm: "promptyard", options =>
    {
        options.Audience = "promptyard.api";

        if (builder.Environment.IsDevelopment())
        {
            options.RequireHttpsMetadata = false;
        }
    });

builder.Services.AddAuthorization();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseRequestTimeouts();
app.UseOutputCache();

app.MapWolverineEndpoints();
app.MapDefaultEndpoints();

await app.RunJasperFxCommands(args);