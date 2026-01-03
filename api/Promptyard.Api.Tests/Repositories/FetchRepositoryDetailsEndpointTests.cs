using FakeItEasy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Promptyard.Api.Repositories;

namespace Promptyard.Api.Tests.Features.Repositories;

public class FetchRepositoryDetailsEndpointTests
{
    public class WhenRepositoryExistsBySlug
    {
        private readonly IResult _result;
        private readonly RepositoryDetails _expectedRepository;

        public WhenRepositoryExistsBySlug()
        {
            _expectedRepository = new RepositoryDetails(
                Guid.NewGuid(),
                "test-repo",
                "Test Repository",
                "A test repository description");

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync("test-repo"))
                .Returns(Task.FromResult<RepositoryDetails?>(_expectedRepository));

            _result = FetchRepositoryDetailsEndpoint.GetAsync("test-repo", repositoryLookup).Result;
        }

        [Test]
        public async Task ReturnsOkResult()
        {
            await Assert.That(_result).IsTypeOf<Ok<RepositoryDetails>>();
        }

        [Test]
        public async Task ReturnsRepositoryDetails()
        {
            var okResult = (Ok<RepositoryDetails>)_result;
            await Assert.That(okResult.Value).IsEqualTo(_expectedRepository);
        }

        [Test]
        public async Task ReturnsCorrectSlug()
        {
            var okResult = (Ok<RepositoryDetails>)_result;
            await Assert.That(okResult.Value!.Slug).IsEqualTo("test-repo");
        }

        [Test]
        public async Task ReturnsCorrectName()
        {
            var okResult = (Ok<RepositoryDetails>)_result;
            await Assert.That(okResult.Value!.Name).IsEqualTo("Test Repository");
        }
    }

    public class WhenRepositoryDoesNotExist
    {
        private IResult _result;

        [Before(Test)]
        public async Task Setup()
        {
            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync("non-existent-repo"))
                .Returns(Task.FromResult<RepositoryDetails?>(null));

            _result = await FetchRepositoryDetailsEndpoint.GetAsync("non-existent-repo", repositoryLookup);
        }

        [Test]
        public async Task ReturnsNotFoundResult()
        {
            await Assert.That(_result).IsTypeOf<NotFound>();
        }
    }
}
