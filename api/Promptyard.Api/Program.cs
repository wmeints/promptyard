using JasperFx;
using JasperFx.Events.Projections;
using Marten;
using Microsoft.IdentityModel.Tokens;
using Promptyard.Api.Repositories;
using Promptyard.Api.Skills;
using Wolverine;
using Wolverine.FluentValidation;
using Wolverine.Http;
using Wolverine.Http.FluentValidation;
using Wolverine.Marten;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

builder.Services.AddNpgsqlDataSource(builder.Configuration.GetConnectionString("applicationDatabase")!);

builder.Host.UseWolverine(options =>
{
    options.Policies.AutoApplyTransactions();
    options.Policies.UseDurableLocalQueues();
    options.UseFluentValidation();
});

builder.Services
    .AddMarten(options =>
    {
        options.Projections.Add<RepositoryDetailsProjection>(ProjectionLifecycle.Inline);
        options.Projections.Add<UserRepositoryDetailsProjection>(ProjectionLifecycle.Inline);
        options.Projections.Add<SkillDetailsProjection>(ProjectionLifecycle.Inline);
    })
    .IntegrateWithWolverine()
    .UseNpgsqlDataSource();

builder.Services.AddWolverineHttp();

builder.Services
    .AddAuthentication()
    .AddKeycloakJwtBearer(serviceName: "keycloak", realm: "promptyard", options =>
    {
        options.Audience = "promptyard.api";

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = false,
            ValidateLifetime = true,
        };
        
        if (builder.Environment.IsDevelopment())
        {
            options.RequireHttpsMetadata = false;
        }
    });

builder.Services.AddAuthorization();

builder.Services.AddTransient<IRepositorySlugGenerator, RepositorySlugGenerator>();
builder.Services.AddTransient<IRepositoryLookup, RepositoryLookup>();
builder.Services.AddTransient<IUserRepositoryLookup, UserRepositoryLookup>();
builder.Services.AddTransient<ISkillLookup, SkillLookup>();

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();
app.UseRequestTimeouts();
app.UseOutputCache();

app.MapWolverineEndpoints(options =>
{
    options.WarmUpRoutes = RouteWarmup.Eager;
    options.UseFluentValidationProblemDetailMiddleware();
});

app.MapDefaultEndpoints();

await app.RunJasperFxCommands(args);