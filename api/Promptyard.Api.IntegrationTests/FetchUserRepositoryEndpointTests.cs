using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Alba;
using Promptyard.Api.Repositories;

namespace Promptyard.Api.IntegrationTests;

[ClassDataSource<AlbaBootstrap>(Shared = SharedType.PerTestSession)]
public class FetchUserRepositoryEndpointTests(AlbaBootstrap bootstrap) : AlbaTestBase(bootstrap)
{
    [Test]
    public async Task FetchUserRepository_WhenUserHasNoRepository_ReturnsNotFound()
    {
        await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/user");
            _.StatusCodeShouldBe(404);
        });
    }

    [Test]
    public async Task FetchUserRepository_WhenUserHasRepository_ReturnsRepositoryDetails()
    {
        var onboardingDetails = new
        {
            FullName = "Test User",
            Introduction = "Testing the fetch endpoint"
        };
        
        await Host.Scenario(scenario =>
        {
            // Replace the current user with a different user.
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-2"));
            
            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
        });

        // Fetch the user repository
        var result = await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/user");
            _.StatusCodeShouldBe(200);
        });

        var userRepository = result.ReadAsJson<UserRepositoryDetails>();

        await Assert.That(userRepository).IsNotNull();
        await Assert.That(userRepository!.Id).IsNotEqualTo(Guid.Empty);
        await Assert.That(userRepository.UserId).IsEqualTo("test-user");
        await Assert.That(userRepository.Name).IsNotEmpty();
        await Assert.That(userRepository.Slug).IsNotEmpty();
    }
}
