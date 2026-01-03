using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Alba;
using Promptyard.Api.Shared;
using Promptyard.Api.Skills;

namespace Promptyard.Api.IntegrationTests;

[ClassDataSource<AlbaBootstrap>(Shared = SharedType.PerTestSession)]
public class GetRepositorySkillsEndpointTests(AlbaBootstrap bootstrap) : AlbaTestBase(bootstrap)
{
    [Test]
    public async Task GetRepositorySkills_WhenRepositoryDoesNotExist_ReturnsNotFound()
    {
        await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/non-existent-repo/skills?page=1&pageSize=20");
            _.StatusCodeShouldBe(404);
        });
    }

    [Test]
    public async Task GetRepositorySkills_WhenRepositoryHasNoSkills_ReturnsEmptyList()
    {
        var onboardingDetails = new
        {
            FullName = "User With No Skills",
            Introduction = "Testing empty skills list"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-no-skills"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        var result = await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/user-with-no-skills/skills?page=1&pageSize=20");
            _.StatusCodeShouldBe(200);
        });

        var pagedResult = result.ReadAsJson<PagedResult<SkillDetails>>();

        await Assert.That(pagedResult).IsNotNull();
        await Assert.That(pagedResult!.Items.Count).IsEqualTo(0);
        await Assert.That(pagedResult.TotalCount).IsEqualTo(0);
    }

    [Test]
    public async Task GetRepositorySkills_WhenRepositoryHasSkills_ReturnsPaginatedSkills()
    {
        var onboardingDetails = new
        {
            FullName = "User With Skills",
            Introduction = "Testing skills list"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-with-skills"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        var skill1 = new { Name = "Test Skill 1", Description = "First test skill" };
        var skill2 = new { Name = "Test Skill 2", Description = "Second test skill" };

        await Host.Scenario(_ =>
        {
            _.Post.Json(skill1).ToUrl("/api/repository/user-with-skills/skills");
            _.StatusCodeShouldBe(200);
        });

        await Host.Scenario(_ =>
        {
            _.Post.Json(skill2).ToUrl("/api/repository/user-with-skills/skills");
            _.StatusCodeShouldBe(200);
        });

        var result = await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/user-with-skills/skills?page=1&pageSize=20");
            _.StatusCodeShouldBe(200);
        });

        var pagedResult = result.ReadAsJson<PagedResult<SkillDetails>>();

        await Assert.That(pagedResult).IsNotNull();
        await Assert.That(pagedResult!.Items.Count).IsEqualTo(2);
        await Assert.That(pagedResult.TotalCount).IsEqualTo(2);
        await Assert.That(pagedResult.Page).IsEqualTo(1);
        await Assert.That(pagedResult.PageSize).IsEqualTo(20);
    }

    [Test]
    public async Task GetRepositorySkills_WithPagination_ReturnsCorrectPage()
    {
        var onboardingDetails = new
        {
            FullName = "User For Pagination",
            Introduction = "Testing pagination"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-pagination"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        for (int i = 1; i <= 3; i++)
        {
            var skill = new { Name = $"Pagination Skill {i}", Description = $"Skill {i} for pagination test" };
            await Host.Scenario(_ =>
            {
                _.Post.Json(skill).ToUrl("/api/repository/user-for-pagination/skills");
                _.StatusCodeShouldBe(200);
            });
        }

        var result = await Host.Scenario(_ =>
        {
            _.Get.Url("/api/repository/user-for-pagination/skills?page=1&pageSize=2");
            _.StatusCodeShouldBe(200);
        });

        var pagedResult = result.ReadAsJson<PagedResult<SkillDetails>>();

        await Assert.That(pagedResult).IsNotNull();
        await Assert.That(pagedResult!.Items.Count).IsEqualTo(2);
        await Assert.That(pagedResult.TotalCount).IsEqualTo(3);
        await Assert.That(pagedResult.TotalPages).IsEqualTo(2);
        await Assert.That(pagedResult.Page).IsEqualTo(1);
        await Assert.That(pagedResult.PageSize).IsEqualTo(2);
    }
}
