using System.Security.Claims;
using FakeItEasy;
using Microsoft.AspNetCore.Mvc;
using Promptyard.Api.Repositories;
using Promptyard.Api.Tests.Shared;
using Wolverine.Http;

namespace Promptyard.Api.Tests.Features.Repositories;

public class OnboardUserRepositoryTests
{
    public class WhenUserDoesNotHaveARepository
    {
        private readonly ClaimsPrincipal _applicationUser;
        private readonly UserRepositoryOnboarded _userRepositoryOnboarded;
        private readonly UserRepositoryDetails _response;
        private readonly IRepositorySlugGenerator _slugGenerator;
        private readonly ProblemDetails? _validationResult;

        public WhenUserDoesNotHaveARepository()
        {
            _slugGenerator = A.Fake<IRepositorySlugGenerator>();
            A.CallTo(() => _slugGenerator.GenerateSlug(A<string>._, A<Guid?>._)).Returns("john-doe");

            var repositoryLookup = A.Fake<IUserRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetByUserIdAsync(A<string>._))
                .Returns(Task.FromResult<UserRepositoryDetails?>(null));

            _applicationUser = TestObjectFactory.CreateApplicationUser();

            _validationResult = OnboardUserRepositoryEndpoint.ValidateAsync(_applicationUser, repositoryLookup).Result;

            var request = new OnboardUserRepositoryRequest("John Doe", "I love prompts!");
            var (response, repositoryOnboardedEvent, _) =
                OnboardUserRepositoryEndpoint.Execute(request, _applicationUser, _slugGenerator);

            _response = response;
            _userRepositoryOnboarded = repositoryOnboardedEvent;
        }

        [Test]
        public async Task ValidationPasses()
        {
            await Assert.That(_validationResult).IsEqualTo(WolverineContinue.NoProblems);
        }

        [Test]
        public async Task UserRepositoryOnboardedEventIsRaised()
        {
            await Assert.That(_userRepositoryOnboarded).IsNotNull();
            await Assert.That(_userRepositoryOnboarded.UserId).IsEqualTo(_applicationUser.Identity!.Name);
        }

        [Test]
        public async Task TheRepositoryNameIsSet()
        {
            await Assert.That(_userRepositoryOnboarded.Name).IsEqualTo("John Doe");
        }

        [Test]
        public async Task TheRepositoryDescriptionIsSet()
        {
            await Assert.That(_userRepositoryOnboarded.Description).IsEqualTo("I love prompts!");
        }

        [Test]
        public async Task TheSlugIsGenerated()
        {
            await Assert.That(_userRepositoryOnboarded.Slug).IsEqualTo("john-doe");
        }

        [Test]
        public async Task ReturnsUserRepositoryDetails()
        {
            await Assert.That(_response).IsNotNull();
            await Assert.That(_response.Name).IsEqualTo("John Doe");
        }

        [Test]
        public void ASlugIsGeneratedFromFullName() => A.CallTo(() => _slugGenerator.GenerateSlug("John Doe", A<Guid?>._)).MustHaveHappened();
    }

    public class WhenUserAlreadyHasARepository
    {
        private readonly ProblemDetails? _validationResult;

        public WhenUserAlreadyHasARepository()
        {
            var repositoryLookup = A.Fake<IUserRepositoryLookup>();

            var existingDetails = new UserRepositoryDetails(
                Guid.NewGuid(),
                "test-user",
                "Existing Repo",
                "existing-repo",
                "Description");

            A.CallTo(() => repositoryLookup.GetByUserIdAsync(A<string>._))
                .Returns(Task.FromResult<UserRepositoryDetails?>(existingDetails));

            var applicationUser = TestObjectFactory.CreateApplicationUser();

            _validationResult = OnboardUserRepositoryEndpoint.ValidateAsync(applicationUser, repositoryLookup).Result;
        }

        [Test]
        public async Task ValidationFails()
        {
            await Assert.That(_validationResult).IsNotNull();
            await Assert.That(_validationResult).IsNotEqualTo(WolverineContinue.NoProblems);
        }

        [Test]
        public async Task ReturnsProblemDetailsWithBadRequestStatus()
        {
            await Assert.That(_validationResult!.Status).IsEqualTo(400);
        }

        [Test]
        public async Task ReturnsProblemDetailsWithCorrectTitle()
        {
            await Assert.That(_validationResult!.Title).IsEqualTo("User already has a repository");
        }
    }
}
