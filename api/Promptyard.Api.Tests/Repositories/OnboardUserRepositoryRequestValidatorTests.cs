using FluentValidation.TestHelper;
using Promptyard.Api.Repositories;

namespace Promptyard.Api.Tests.Repositories;

public class OnboardUserRepositoryRequestValidatorTests
{
    [Test]
    public async Task ValidateWithValidRequestReturnsTrue()
    {
        var validator = new OnboardUserRepositoryRequestValidator();
        var request = new OnboardUserRepositoryRequest("Test User", new string('a', 200));
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsTrue();
    }
    
    [Test]
    public async Task ValidateWithInvalidFullNameReturnsFalse()
    {
        var validator = new OnboardUserRepositoryRequestValidator();
        var request = new OnboardUserRepositoryRequest("", new string('a', 200));
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }
    
    [Test]
    public async Task ValidateWithTooLongIntroductionReturnsFalse()
    {
        var validator = new OnboardUserRepositoryRequestValidator();
        var request = new OnboardUserRepositoryRequest("Test User", new string('a', 501));
        var result = await validator.TestValidateAsync(request);

        await Assert.That(result.IsValid).IsFalse();
    }
}
