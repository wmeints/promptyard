using FluentValidation.TestHelper;
using Promptyard.Api.Skills;

namespace Promptyard.Api.Tests.Skills;

public class AddSkillToRepositoryRequestValidatorTests
{
    [Test]
    public async Task ValidateWithValidRequestReturnsTrue()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", "A test skill description");
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithEmptyNameReturnsFalse()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("", "A test skill description");
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithTooLongNameReturnsFalse()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest(new string('a', 201), "A test skill description");
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }

    [Test]
    public async Task ValidateWithNullDescriptionReturnsTrue()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", null);
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }

    [Test]
    public async Task ValidateWithTooLongDescriptionReturnsFalse()
    {
        var validator = new AddSkillToRepositoryRequestValidator();
        var request = new AddSkillToRepositoryRequest("Test Skill", new string('a', 1001));
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }
}
