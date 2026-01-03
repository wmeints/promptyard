using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Alba;
using Promptyard.Api.Agents;
using Promptyard.Api.Shared;

namespace Promptyard.Api.IntegrationTests;

[ClassDataSource<AlbaBootstrap>(Shared = SharedType.PerTestSession)]
public class FetchAgentsFromRepositoryEndpointTests(AlbaBootstrap bootstrap) : AlbaTestBase(bootstrap)
{
    [Test]
    public async Task FetchAgents_WhenRepositoryDoesNotExist_ReturnsNotFound()
    {
        await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/non-existent-slug/agents?page=1&pageSize=20");
            _.StatusCodeShouldBe(404);
        });
    }

    [Test]
    public async Task FetchAgents_WhenRepositoryExistsWithNoAgents_ReturnsEmptyPagedResult()
    {
        var onboardingDetails = new
        {
            FullName = "Agent Test User",
            Introduction = "Testing the fetch agents endpoint"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "agent-test-user"));
            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        var result = await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/agent-test-user/agents?page=1&pageSize=20");
            _.StatusCodeShouldBe(200);
        });

        var pagedResult = result.ReadAsJson<PagedResult<AgentDetails>>();

        await Assert.That(pagedResult).IsNotNull();
        await Assert.That(pagedResult!.Items.Count).IsEqualTo(0);
        await Assert.That(pagedResult.TotalCount).IsEqualTo(0);
        await Assert.That(pagedResult.Page).IsEqualTo(1);
        await Assert.That(pagedResult.PageSize).IsEqualTo(20);
    }

    [Test]
    public async Task FetchAgents_WithDefaultPagingParameters_ReturnsPagedResult()
    {
        var onboardingDetails = new
        {
            FullName = "Default Paging User",
            Introduction = "Testing default paging"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "default-paging-user"));
            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        var result = await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/default-paging-user/agents");
            _.StatusCodeShouldBe(200);
        });

        var pagedResult = result.ReadAsJson<PagedResult<AgentDetails>>();

        await Assert.That(pagedResult).IsNotNull();
        await Assert.That(pagedResult!.Page).IsEqualTo(1);
        await Assert.That(pagedResult.PageSize).IsEqualTo(20);
    }
}
