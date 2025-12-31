using System.Security.Claims;
using FakeItEasy;
using Promptyard.Api.Features.Repositories;
using Promptyard.Api.Tests.Shared;
using Wolverine.Marten;

namespace Promptyard.Api.Tests.Features.Repositories;

public class RegisterUserRepositoryTests
{
    public class WhenTheUserIsAuthenticated
    {
        private readonly ClaimsPrincipal _applicationUser;
        private readonly UserRepositoryRegistered _userRepositoryRegistered;
        private readonly RegisterUserRepositoryResponse _registerUserRepositoryResponse;
        private readonly IStartStream _startStream;
        private readonly IRepositorySlugGenerator _slugGenerator;

        public WhenTheUserIsAuthenticated()
        {
            _slugGenerator = A.Fake<IRepositorySlugGenerator>();
            A.CallTo(() => _slugGenerator.GenerateSlug(A<string>._)).Returns("test");
            
            _applicationUser = TestObjectFactory.CreateApplicationUser();
            
            var (response, repositoryRegisteredEvent, startStream) =
                RegisterUserRepositoryEndpoint.ExecuteAsync(_applicationUser, _slugGenerator);

            _registerUserRepositoryResponse = response;
            _userRepositoryRegistered = repositoryRegisteredEvent;
            _startStream = startStream;
        }

        [Test]
        public async Task UserRepositoryRegisteredEventIsRaised()
        {
            await Assert.That(_applicationUser.Identity!.Name).IsEqualTo(_userRepositoryRegistered.UserId);
        }
        
        [Test]
        public async Task TheUserRepositoryIsCreated()
        {
            await Assert.That(_startStream.Events[0]).IsOfType(typeof(UserRepositoryRegistered));
        }

        [Test]
        public Task ASlugIsGenerated()
        {
            A.CallTo(() => _slugGenerator.GenerateSlug(A<string>._)).MustHaveHappened();
            return Task.CompletedTask;
        }
    }
}