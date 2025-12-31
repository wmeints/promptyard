using Alba;

namespace Promptyard.Api.IntegrationTests;

[ClassDataSource<AlbaBootstrap>(Shared = SharedType.PerTestSession)]
public class RegisterUserRepositoryEndpointTests(AlbaBootstrap bootstrap): AlbaTestBase(bootstrap)
{
    [Test]
    public async Task RegisterUserRepository_ReturnsOk()
    {
        await Host.Scenario(_ =>
        {
            var onboardingDetails = new
            {
                FullName = "John Doe",
                Description = "I love prompts!"
            };
            
            _.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            _.StatusCodeShouldBe(200);
        });
    }
}