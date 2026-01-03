using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Alba;
using Promptyard.Api.Prompts;

namespace Promptyard.Api.IntegrationTests;

[ClassDataSource<AlbaBootstrap>(Shared = SharedType.PerTestSession)]
public class AddPromptToRepositoryEndpointTests(AlbaBootstrap bootstrap) : AlbaTestBase(bootstrap)
{
    [Test]
    public async Task AddPromptToRepository_WhenRepositoryDoesNotExist_ReturnsNotFound()
    {
        var prompt = new { Name = "Test Prompt", Description = "A test prompt", Content = "This is the prompt content" };

        await Host.Scenario(_ =>
        {
            _.Post.Json(prompt).ToUrl("/api/repository/non-existent-repo/prompts");
            _.StatusCodeShouldBe(404);
        });
    }

    [Test]
    public async Task AddPromptToRepository_WithValidRequest_ReturnsCreatedPrompt()
    {
        var onboardingDetails = new
        {
            FullName = "User For Adding Prompts",
            Introduction = "Testing adding prompts"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-add-prompt"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        var prompt = new { Name = "New Prompt", Description = "A new prompt", Content = "This is the new prompt content" };

        var result = await Host.Scenario(_ =>
        {
            _.Post.Json(prompt).ToUrl("/api/repository/user-for-adding-prompts/prompts");
            _.StatusCodeShouldBe(200);
        });

        var createdPrompt = result.ReadAsJson<PromptDetails>();

        await Assert.That(createdPrompt).IsNotNull();
        await Assert.That(createdPrompt!.Name).IsEqualTo("New Prompt");
        await Assert.That(createdPrompt.Description).IsEqualTo("A new prompt");
        await Assert.That(createdPrompt.Content).IsEqualTo("This is the new prompt content");
        await Assert.That(createdPrompt.RepositorySlug).IsEqualTo("user-for-adding-prompts");
    }

    [Test]
    public async Task AddPromptToRepository_WithEmptyName_ReturnsBadRequest()
    {
        var onboardingDetails = new
        {
            FullName = "User For Validation Test",
            Introduction = "Testing validation"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-validation-prompt"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        var prompt = new { Name = "", Description = "A prompt with empty name", Content = "Some content" };

        await Host.Scenario(_ =>
        {
            _.Post.Json(prompt).ToUrl("/api/repository/user-for-validation-test/prompts");
            _.StatusCodeShouldBe(400);
        });
    }

    [Test]
    public async Task AddPromptToRepository_WithEmptyContent_ReturnsBadRequest()
    {
        var onboardingDetails = new
        {
            FullName = "User For Content Validation",
            Introduction = "Testing content validation"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-content-validation"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        var prompt = new { Name = "Valid Name", Description = "A prompt with empty content", Content = "" };

        await Host.Scenario(_ =>
        {
            _.Post.Json(prompt).ToUrl("/api/repository/user-for-content-validation/prompts");
            _.StatusCodeShouldBe(400);
        });
    }

    [Test]
    public async Task AddPromptToRepository_WithNullDescription_ReturnsCreatedPrompt()
    {
        var onboardingDetails = new
        {
            FullName = "User For Null Description",
            Introduction = "Testing null description"
        };

        await Host.Scenario(scenario =>
        {
            scenario.RemoveClaim(JwtRegisteredClaimNames.Name);
            scenario.WithClaim(new Claim(JwtRegisteredClaimNames.Name, "test-user-null-desc-prompt"));

            scenario.Post.Json(onboardingDetails).ToUrl("/api/repository/user");
            scenario.StatusCodeShouldBe(200);
        });

        var prompt = new { Name = "Prompt Without Description", Description = (string?)null, Content = "Content here" };

        var result = await Host.Scenario(_ =>
        {
            _.Post.Json(prompt).ToUrl("/api/repository/user-for-null-description/prompts");
            _.StatusCodeShouldBe(200);
        });

        var createdPrompt = result.ReadAsJson<PromptDetails>();

        await Assert.That(createdPrompt).IsNotNull();
        await Assert.That(createdPrompt!.Name).IsEqualTo("Prompt Without Description");
        await Assert.That(createdPrompt.Description).IsNull();
        await Assert.That(createdPrompt.Content).IsEqualTo("Content here");
    }
}
