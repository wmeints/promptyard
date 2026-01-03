using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Alba;
using Promptyard.Api.Repositories;

namespace Promptyard.Api.IntegrationTests;

[ClassDataSource<AlbaBootstrap>(Shared = SharedType.PerTestSession)]
public class FetchRepositoryDetailsEndpointTests(AlbaBootstrap bootstrap) : AlbaTestBase(bootstrap)
{
    [Test]
    public async Task FetchRepositoryDetails_WhenRepositoryDoesNotExist_ReturnsNotFound()
    {
        await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/non-existent-slug");
            _.StatusCodeShouldBe(404);
        });
    }

    [Test]
    public async Task FetchRepositoryDetails_WhenRepositoryExists_ReturnsRepositoryDetails()
    {
        var onboardingDetails = new
        {
            FullName = "Integration Test User",
            Introduction = "Testing the fetch repository by slug endpoint"
        };

        // Create a repository first by onboarding a user
        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-fetch-details"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        // Fetch the repository by slug
        var result = await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/integration-test-user");
            _.StatusCodeShouldBe(200);
        });

        var repository = result.ReadAsJson<RepositoryDetails>();

        await Assert.That(repository).IsNotNull();
        await Assert.That(repository!.Id).IsNotEqualTo(Guid.Empty);
        await Assert.That(repository.Slug).IsEqualTo("integration-test-user");
        await Assert.That(repository.Name).IsEqualTo("Integration Test User");
    }

}
