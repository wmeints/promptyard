using Alba;
using Alba.Security;
using JasperFx.CommandLine;
using Testcontainers.PostgreSql;
using TUnit.Core.Interfaces;
using JwtRegisteredClaimNames = Microsoft.IdentityModel.JsonWebTokens.JwtRegisteredClaimNames;

namespace Promptyard.Api.IntegrationTests;

public sealed class AlbaBootstrap : IAsyncInitializer, IAsyncDisposable
{
    public PostgreSqlContainer? DatabaseContainer { get; private set; }
    public IAlbaHost? Host { get; private set; }

    public async Task InitializeAsync()
    {
        DatabaseContainer = new PostgreSqlBuilder().Build();

        await DatabaseContainer.StartAsync();

        var databaseConfiguration = new Dictionary<string, string?>
        {
            ["ConnectionStrings:applicationDatabase"] = DatabaseContainer.GetConnectionString(),
        };
        var authenticationStub = new JwtSecurityStub()
            .WithName("test-user")
            .With(JwtRegisteredClaimNames.Email, "test@domain.org");

        JasperFxEnvironment.AutoStartHost = true;

        Host = await AlbaHost.For<Program>(
            authenticationStub,
            ConfigurationOverride.Create(databaseConfiguration));
    }

    public async ValueTask DisposeAsync()
    {
        if (Host != null)
        {
            await Host.DisposeAsync();
        }

        if (DatabaseContainer != null)
        {
            await DatabaseContainer.StopAsync();
        }
    }
}