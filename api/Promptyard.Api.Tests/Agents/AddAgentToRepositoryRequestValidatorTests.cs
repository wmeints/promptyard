using FluentValidation.TestHelper;
using Promptyard.Api.Agents;

namespace Promptyard.Api.Tests.Features.Agents;

public class AddAgentToRepositoryRequestValidatorTests
{
    [Test]
    public async Task ValidateWithValidRequestReturnsTrue()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var request = new AddAgentToRepositoryRequest("Test Agent", "A test agent description", null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithEmptyNameReturnsFalse()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var request = new AddAgentToRepositoryRequest("", "A test agent description", null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithTooLongNameReturnsFalse()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var request = new AddAgentToRepositoryRequest(new string('a', 201), "A test agent description", null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithNullDescriptionReturnsTrue()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var request = new AddAgentToRepositoryRequest("Test Agent", null, null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithTooLongDescriptionReturnsFalse()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var request = new AddAgentToRepositoryRequest("Test Agent", new string('a', 1001), null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithValidTagsReturnsTrue()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var request = new AddAgentToRepositoryRequest("Test Agent", "Description", ["tag1", "tag2", "tag3"]);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithTooManyTagsReturnsFalse()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var tags = Enumerable.Range(1, 11).Select(i => $"tag{i}").ToArray();
        var request = new AddAgentToRepositoryRequest("Test Agent", "Description", tags);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithEmptyTagReturnsFalse()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var request = new AddAgentToRepositoryRequest("Test Agent", "Description", ["valid", "", "another"]);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithTooLongTagReturnsFalse()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var request = new AddAgentToRepositoryRequest("Test Agent", "Description", [new string('a', 51)]);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithNullTagsReturnsTrue()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var request = new AddAgentToRepositoryRequest("Test Agent", "Description", null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithEmptyTagsArrayReturnsTrue()
    {
        var validator = new AddAgentToRepositoryRequestValidator();
        var request = new AddAgentToRepositoryRequest("Test Agent", "Description", []);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }
}
