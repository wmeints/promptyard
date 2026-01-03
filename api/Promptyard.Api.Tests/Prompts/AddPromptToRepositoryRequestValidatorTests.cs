using FluentValidation.TestHelper;
using Promptyard.Api.Prompts;

namespace Promptyard.Api.Tests.Prompts;

public class AddPromptToRepositoryRequestValidatorTests
{
    [Test]
    public async Task ValidateWithValidRequestReturnsTrue()
    {
        var validator = new AddPromptToRepositoryRequestValidator();
        var request = new AddPromptToRepositoryRequest("Test Prompt", "A test prompt description", "This is the prompt content");
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithEmptyNameReturnsFalse()
    {
        var validator = new AddPromptToRepositoryRequestValidator();
        var request = new AddPromptToRepositoryRequest("", "A test prompt description", "This is the prompt content");
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithTooLongNameReturnsFalse()
    {
        var validator = new AddPromptToRepositoryRequestValidator();
        var request = new AddPromptToRepositoryRequest(new string('a', 201), "A test prompt description", "This is the prompt content");
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithNullDescriptionReturnsTrue()
    {
        var validator = new AddPromptToRepositoryRequestValidator();
        var request = new AddPromptToRepositoryRequest("Test Prompt", null, "This is the prompt content");
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithTooLongDescriptionReturnsFalse()
    {
        var validator = new AddPromptToRepositoryRequestValidator();
        var request = new AddPromptToRepositoryRequest("Test Prompt", new string('a', 1001), "This is the prompt content");
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithEmptyContentReturnsFalse()
    {
        var validator = new AddPromptToRepositoryRequestValidator();
        var request = new AddPromptToRepositoryRequest("Test Prompt", "A test prompt description", "");
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }
}
