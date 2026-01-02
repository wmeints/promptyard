using Promptyard.Api.Repositories;

namespace Promptyard.Api.Tests.Features.Repositories;

public class OnboardUserRepositoryRequestValidatorTests
{
    public class WhenFullNameIsEmpty
    {
        private readonly OnboardUserRepositoryRequestValidator _validator;

        public WhenFullNameIsEmpty()
        {
            _validator = new OnboardUserRepositoryRequestValidator();
        }

        [Test]
        public async Task ValidationFails()
        {
            var request = new OnboardUserRepositoryRequest("", null);
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.IsValid).IsFalse();
        }

        [Test]
        public async Task ReturnsErrorForFullName()
        {
            var request = new OnboardUserRepositoryRequest("", null);
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.Errors.Any(e => e.PropertyName == nameof(request.FullName))).IsTrue();
        }

        [Test]
        public async Task ReturnsNotEmptyErrorMessage()
        {
            var request = new OnboardUserRepositoryRequest("", null);
            var result = await _validator.ValidateAsync(request);
            var fullNameError = result.Errors.FirstOrDefault(e => e.PropertyName == nameof(request.FullName));

            await Assert.That(fullNameError).IsNotNull();
            await Assert.That(fullNameError!.ErrorMessage).Contains("empty");
        }
    }

    public class WhenFullNameIsNull
    {
        private readonly OnboardUserRepositoryRequestValidator _validator;

        public WhenFullNameIsNull()
        {
            _validator = new OnboardUserRepositoryRequestValidator();
        }

        [Test]
        public async Task ValidationFails()
        {
            var request = new OnboardUserRepositoryRequest(null!, null);
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.IsValid).IsFalse();
        }

        [Test]
        public async Task ReturnsErrorForFullName()
        {
            var request = new OnboardUserRepositoryRequest(null!, null);
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.Errors.Any(e => e.PropertyName == nameof(request.FullName))).IsTrue();
        }
    }

    public class WhenFullNameExceedsMaximumLength
    {
        private readonly OnboardUserRepositoryRequestValidator _validator;

        public WhenFullNameExceedsMaximumLength()
        {
            _validator = new OnboardUserRepositoryRequestValidator();
        }

        [Test]
        public async Task ValidationFails()
        {
            var request = new OnboardUserRepositoryRequest(new string('a', 201), null);
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.IsValid).IsFalse();
        }

        [Test]
        public async Task ReturnsErrorForFullName()
        {
            var request = new OnboardUserRepositoryRequest(new string('a', 201), null);
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.Errors.Any(e => e.PropertyName == nameof(request.FullName))).IsTrue();
        }

        [Test]
        public async Task ReturnsMaximumLengthErrorMessage()
        {
            var request = new OnboardUserRepositoryRequest(new string('a', 201), null);
            var result = await _validator.ValidateAsync(request);
            var fullNameError = result.Errors.FirstOrDefault(e => e.PropertyName == nameof(request.FullName));

            await Assert.That(fullNameError).IsNotNull();
            await Assert.That(fullNameError!.ErrorMessage).Contains("200");
        }
    }

    public class WhenFullNameIsAtMaximumLength
    {
        private readonly OnboardUserRepositoryRequestValidator _validator;

        public WhenFullNameIsAtMaximumLength()
        {
            _validator = new OnboardUserRepositoryRequestValidator();
        }

        [Test]
        public async Task ValidationPasses()
        {
            var request = new OnboardUserRepositoryRequest(new string('a', 200), null);
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.IsValid).IsTrue();
        }
    }

    public class WhenIntroductionExceedsMaximumLength
    {
        private readonly OnboardUserRepositoryRequestValidator _validator;

        public WhenIntroductionExceedsMaximumLength()
        {
            _validator = new OnboardUserRepositoryRequestValidator();
        }

        [Test]
        public async Task ValidationFails()
        {
            var request = new OnboardUserRepositoryRequest("John Doe", new string('a', 501));
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.IsValid).IsFalse();
        }

        [Test]
        public async Task ReturnsErrorForIntroduction()
        {
            var request = new OnboardUserRepositoryRequest("John Doe", new string('a', 501));
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.Errors.Any(e => e.PropertyName == nameof(request.Introduction))).IsTrue();
        }

        [Test]
        public async Task ReturnsMaximumLengthErrorMessage()
        {
            var request = new OnboardUserRepositoryRequest("John Doe", new string('a', 501));
            var result = await _validator.ValidateAsync(request);
            var introductionError = result.Errors.FirstOrDefault(e => e.PropertyName == nameof(request.Introduction));

            await Assert.That(introductionError).IsNotNull();
            await Assert.That(introductionError!.ErrorMessage).Contains("500");
        }
    }

    public class WhenIntroductionIsAtMaximumLength
    {
        private readonly OnboardUserRepositoryRequestValidator _validator;

        public WhenIntroductionIsAtMaximumLength()
        {
            _validator = new OnboardUserRepositoryRequestValidator();
        }

        [Test]
        public async Task ValidationPasses()
        {
            var request = new OnboardUserRepositoryRequest("John Doe", new string('a', 500));
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.IsValid).IsTrue();
        }
    }

    public class WhenIntroductionIsNull
    {
        private readonly OnboardUserRepositoryRequestValidator _validator;

        public WhenIntroductionIsNull()
        {
            _validator = new OnboardUserRepositoryRequestValidator();
        }

        [Test]
        public async Task ValidationPasses()
        {
            var request = new OnboardUserRepositoryRequest("John Doe", null);
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.IsValid).IsTrue();
        }
    }

    public class WhenRequestIsValid
    {
        private readonly OnboardUserRepositoryRequestValidator _validator;

        public WhenRequestIsValid()
        {
            _validator = new OnboardUserRepositoryRequestValidator();
        }

        [Test]
        public async Task ValidationPasses()
        {
            var request = new OnboardUserRepositoryRequest("John Doe", "I love prompts!");
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.IsValid).IsTrue();
        }

        [Test]
        public async Task NoValidationErrorsAreReturned()
        {
            var request = new OnboardUserRepositoryRequest("John Doe", "I love prompts!");
            var result = await _validator.ValidateAsync(request);

            await Assert.That(result.Errors.Count).IsEqualTo(0);
        }
    }
}
