using FakeItEasy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Promptyard.Api.Prompts;
using Promptyard.Api.Repositories;
using Promptyard.Api.Shared;

namespace Promptyard.Api.Tests.Prompts;

public class GetRepositoryPromptsEndpointTests
{
    public class WhenRepositoryExistsWithPrompts
    {
        private readonly IResult _result;
        private readonly PagedResult<PromptDetails> _expectedPrompts;

        public WhenRepositoryExistsWithPrompts()
        {
            var repositoryId = Guid.NewGuid();
            var repositorySlug = "test-repo";

            var repository = new RepositoryDetails(
                repositoryId,
                repositorySlug,
                "Test Repository",
                "A test repository");

            var prompts = new List<PromptDetails>
            {
                new(Guid.NewGuid(), repositoryId, repositorySlug, "Prompt 1", "Description 1", "Content 1"),
                new(Guid.NewGuid(), repositoryId, repositorySlug, "Prompt 2", "Description 2", "Content 2")
            };

            _expectedPrompts = new PagedResult<PromptDetails>(
                prompts,
                1,
                20,
                2);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync(repositorySlug))
                .Returns(Task.FromResult<RepositoryDetails?>(repository));

            var promptLookup = A.Fake<IPromptLookup>();
            A.CallTo(() => promptLookup.GetByRepositorySlugAsync(repositorySlug, 1, 20))
                .Returns(Task.FromResult(_expectedPrompts));

            _result = GetRepositoryPromptsEndpoint.GetAsync(
                repositorySlug, 1, 20, promptLookup, repositoryLookup).Result;
        }

        [Test]
        public async Task ReturnsOkResult()
        {
            await Assert.That(_result).IsTypeOf<Ok<PagedResult<PromptDetails>>>();
        }

        [Test]
        public async Task ReturnsPagedPrompts()
        {
            var okResult = (Ok<PagedResult<PromptDetails>>)_result;
            await Assert.That(okResult.Value).IsEqualTo(_expectedPrompts);
        }

        [Test]
        public async Task ReturnsCorrectItemCount()
        {
            var okResult = (Ok<PagedResult<PromptDetails>>)_result;
            await Assert.That(okResult.Value!.Items.Count).IsEqualTo(2);
        }
    }

    public class WhenRepositoryExistsWithNoPrompts
    {
        private readonly IResult _result;

        public WhenRepositoryExistsWithNoPrompts()
        {
            var repositoryId = Guid.NewGuid();
            var repositorySlug = "empty-repo";

            var repository = new RepositoryDetails(
                repositoryId,
                repositorySlug,
                "Empty Repository",
                "A repository with no prompts");

            var emptyPrompts = new PagedResult<PromptDetails>(
                new List<PromptDetails>(),
                1,
                20,
                0);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync(repositorySlug))
                .Returns(Task.FromResult<RepositoryDetails?>(repository));

            var promptLookup = A.Fake<IPromptLookup>();
            A.CallTo(() => promptLookup.GetByRepositorySlugAsync(repositorySlug, 1, 20))
                .Returns(Task.FromResult(emptyPrompts));

            _result = GetRepositoryPromptsEndpoint.GetAsync(
                repositorySlug, 1, 20, promptLookup, repositoryLookup).Result;
        }

        [Test]
        public async Task ReturnsOkResult()
        {
            await Assert.That(_result).IsTypeOf<Ok<PagedResult<PromptDetails>>>();
        }

        [Test]
        public async Task ReturnsEmptyItemsList()
        {
            var okResult = (Ok<PagedResult<PromptDetails>>)_result;
            await Assert.That(okResult.Value!.Items.Count).IsEqualTo(0);
        }

        [Test]
        public async Task ReturnsTotalCountOfZero()
        {
            var okResult = (Ok<PagedResult<PromptDetails>>)_result;
            await Assert.That(okResult.Value!.TotalCount).IsEqualTo(0);
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

            var promptLookup = A.Fake<IPromptLookup>();

            _result = await GetRepositoryPromptsEndpoint.GetAsync(
                "non-existent-repo", 1, 20, promptLookup, repositoryLookup);
        }

        [Test]
        public async Task ReturnsNotFoundResult()
        {
            await Assert.That(_result).IsTypeOf<NotFound>();
        }
    }

    public class WhenPageSizeExceedsMaximum
    {
        private readonly IPromptLookup _promptLookup;

        public WhenPageSizeExceedsMaximum()
        {
            var repositoryId = Guid.NewGuid();
            var repositorySlug = "test-repo";

            var repository = new RepositoryDetails(
                repositoryId,
                repositorySlug,
                "Test Repository",
                "A test repository");

            var prompts = new PagedResult<PromptDetails>(
                new List<PromptDetails>(),
                1,
                100,
                0);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync(repositorySlug))
                .Returns(Task.FromResult<RepositoryDetails?>(repository));

            _promptLookup = A.Fake<IPromptLookup>();
            A.CallTo(() => _promptLookup.GetByRepositorySlugAsync(repositorySlug, 1, 100))
                .Returns(Task.FromResult(prompts));

            _ = GetRepositoryPromptsEndpoint.GetAsync(
                repositorySlug, 1, 500, _promptLookup, repositoryLookup).Result;
        }

        [Test]
        public async Task CapsPageSizeToMaximum()
        {
            A.CallTo(() => _promptLookup.GetByRepositorySlugAsync(A<string>._, A<int>._, 100))
                .MustHaveHappened();
        }
    }

    public class WhenPageIsLessThanOne
    {
        private readonly IPromptLookup _promptLookup;

        public WhenPageIsLessThanOne()
        {
            var repositoryId = Guid.NewGuid();
            var repositorySlug = "test-repo";

            var repository = new RepositoryDetails(
                repositoryId,
                repositorySlug,
                "Test Repository",
                "A test repository");

            var prompts = new PagedResult<PromptDetails>(
                new List<PromptDetails>(),
                1,
                20,
                0);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync(repositorySlug))
                .Returns(Task.FromResult<RepositoryDetails?>(repository));

            _promptLookup = A.Fake<IPromptLookup>();
            A.CallTo(() => _promptLookup.GetByRepositorySlugAsync(repositorySlug, 1, 20))
                .Returns(Task.FromResult(prompts));

            _ = GetRepositoryPromptsEndpoint.GetAsync(
                repositorySlug, -1, 20, _promptLookup, repositoryLookup).Result;
        }

        [Test]
        public async Task DefaultsPageToOne()
        {
            A.CallTo(() => _promptLookup.GetByRepositorySlugAsync(A<string>._, 1, A<int>._))
                .MustHaveHappened();
        }
    }
}
