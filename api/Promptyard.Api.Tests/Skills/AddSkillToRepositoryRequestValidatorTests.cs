using FluentValidation.TestHelper;
using Promptyard.Api.Skills;

namespace Promptyard.Api.Tests.Skills;

public class AddSkillToRepositoryRequestValidatorTests
{
    [Test]
    public async Task ValidateWithValidRequestReturnsTrue()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", "A test skill description", null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithEmptyNameReturnsFalse()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("", "A test skill description", null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithTooLongNameReturnsFalse()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest(new string('a', 201), "A test skill description", null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithNullDescriptionReturnsTrue()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", null, null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithTooLongDescriptionReturnsFalse()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", new string('a', 1001), null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithValidTagsReturnsTrue()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", "Description", ["tag1", "tag2", "tag3"]);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithTooManyTagsReturnsFalse()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var tags = Enumerable.Range(1, 11).Select(i => $"tag{i}").ToArray();
        var request = new AddSkillToRepositoryRequest("Test Skill", "Description", tags);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithEmptyTagReturnsFalse()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", "Description", ["valid", "", "another"]);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithTooLongTagReturnsFalse()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", "Description", [new string('a', 51)]);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithNullTagsReturnsTrue()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", "Description", null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithEmptyTagsArrayReturnsTrue()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", "Description", []);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }
}
