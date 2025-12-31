namespace Promptyard.Api.IntegrationTests;

[ClassDataSource<AlbaBootstrap>(Shared = SharedType.PerTestSession)]
public class RegisterUserRepositoryEndpointTests(AlbaBootstrap bootstrap): AlbaTestBase(bootstrap)
{
    [Test]
    public async Task RegisterUserRepository_ReturnsOk()
    {
        await Host.Scenario(_ =>
        {
            _.Post.Url("/api/repositories/user");
            _.StatusCodeShouldBe(200);
        });
    }
}