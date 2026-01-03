using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Alba;
using Promptyard.Api.Prompts;
using Promptyard.Api.Shared;

namespace Promptyard.Api.IntegrationTests;

[ClassDataSource<AlbaBootstrap>(Shared = SharedType.PerTestSession)]
public class GetRepositoryPromptsEndpointTests(AlbaBootstrap bootstrap) : AlbaTestBase(bootstrap)
{
    [Test]
    public async Task GetRepositoryPrompts_WhenRepositoryDoesNotExist_ReturnsNotFound()
    {
        await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/non-existent-repo/prompts?page=1&pageSize=20");
            _.StatusCodeShouldBe(404);
        });
    }

    [Test]
    public async Task GetRepositoryPrompts_WhenRepositoryHasNoPrompts_ReturnsEmptyList()
    {
        var onboardingDetails = new
        {
            FullName = "User With No Prompts",
            Introduction = "Testing empty prompts list"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-no-prompts"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        var result = await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/user-with-no-prompts/prompts?page=1&pageSize=20");
            _.StatusCodeShouldBe(200);
        });

        var pagedResult = result.ReadAsJson<PagedResult<PromptDetails>>();

        await Assert.That(pagedResult).IsNotNull();
        await Assert.That(pagedResult!.Items.Count).IsEqualTo(0);
        await Assert.That(pagedResult.TotalCount).IsEqualTo(0);
    }

    [Test]
    public async Task GetRepositoryPrompts_WhenRepositoryHasPrompts_ReturnsPaginatedPrompts()
    {
        var onboardingDetails = new
        {
            FullName = "User With Prompts",
            Introduction = "Testing prompts list"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-with-prompts"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        var prompt1 = new { Name = "Test Prompt 1", Description = "First test prompt", Content = "This is prompt 1 content" };
        var prompt2 = new { Name = "Test Prompt 2", Description = "Second test prompt", Content = "This is prompt 2 content" };

        await Host.Scenario(_ =>
        {
            _.Post.Json(prompt1).ToUrl("/api/repository/user-with-prompts/prompts");
            _.StatusCodeShouldBe(200);
        });

        await Host.Scenario(_ =>
        {
            _.Post.Json(prompt2).ToUrl("/api/repository/user-with-prompts/prompts");
            _.StatusCodeShouldBe(200);
        });

        var result = await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/user-with-prompts/prompts?page=1&pageSize=20");
            _.StatusCodeShouldBe(200);
        });

        var pagedResult = result.ReadAsJson<PagedResult<PromptDetails>>();

        await Assert.That(pagedResult).IsNotNull();
        await Assert.That(pagedResult!.Items.Count).IsEqualTo(2);
        await Assert.That(pagedResult.TotalCount).IsEqualTo(2);
        await Assert.That(pagedResult.Page).IsEqualTo(1);
        await Assert.That(pagedResult.PageSize).IsEqualTo(20);
    }

    [Test]
    public async Task GetRepositoryPrompts_WithPagination_ReturnsCorrectPage()
    {
        var onboardingDetails = new
        {
            FullName = "User For Prompt Pagination",
            Introduction = "Testing prompt pagination"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-prompt-pagination"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        for (int i = 1; i <= 3; i++)
        {
            var prompt = new { Name = $"Pagination Prompt {i}", Description = $"Prompt {i} for pagination test", Content = $"Content for prompt {i}" };
            await Host.Scenario(_ =>
            {
                _.Post.Json(prompt).ToUrl("/api/repository/user-for-prompt-pagination/prompts");
                _.StatusCodeShouldBe(200);
            });
        }

        var result = await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/user-for-prompt-pagination/prompts?page=1&pageSize=2");
            _.StatusCodeShouldBe(200);
        });

        var pagedResult = result.ReadAsJson<PagedResult<PromptDetails>>();

        await Assert.That(pagedResult).IsNotNull();
        await Assert.That(pagedResult!.Items.Count).IsEqualTo(2);
        await Assert.That(pagedResult.TotalCount).IsEqualTo(3);
        await Assert.That(pagedResult.TotalPages).IsEqualTo(2);
        await Assert.That(pagedResult.Page).IsEqualTo(1);
        await Assert.That(pagedResult.PageSize).IsEqualTo(2);
    }
}
