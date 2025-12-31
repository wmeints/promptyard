using Alba;

namespace Promptyard.Api.IntegrationTests;

[ClassDataSource<AlbaBootstrap>(Shared = SharedType.PerTestSession)]
public class OnboardUserRepositoryEndpointTests(AlbaBootstrap bootstrap) : AlbaTestBase(bootstrap)
{
    [Test]
    public async Task OnboardUserRepository_WhenUserAlreadyOnboarded_ReturnsBadRequest()
    {
        var onboardingDetails = new
        {
            FullName = "John Doe",
            Introduction = "I love prompts!"
        };

        // First request should succeed
        await Host.Scenario(_ =>
        {
            _.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            _.StatusCodeShouldBe(200);
        });

        // Second request should fail with 400
        await Host.Scenario(_ =>
        {
            _.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            _.StatusCodeShouldBe(400);
        });
    }
}
