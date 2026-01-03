using FakeItEasy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Promptyard.Api.Repositories;
using Promptyard.Api.Shared;
using Promptyard.Api.Skills;

namespace Promptyard.Api.Tests.Skills;

public class GetRepositorySkillsEndpointTests
{
    public class WhenRepositoryExistsWithSkills
    {
        private readonly IResult _result;
        private readonly PagedResult<SkillDetails> _expectedSkills;

        public WhenRepositoryExistsWithSkills()
        {
            var repositoryId = Guid.NewGuid();
            var repositorySlug = "test-repo";

            var repository = new RepositoryDetails(
                repositoryId,
                repositorySlug,
                "Test Repository",
                "A test repository");

            var skills = new List<SkillDetails>
            {
                new(Guid.NewGuid(), repositoryId, repositorySlug, "Skill 1", "Description 1"),
                new(Guid.NewGuid(), repositoryId, repositorySlug, "Skill 2", "Description 2")
            };

            _expectedSkills = new PagedResult<SkillDetails>(
                skills,
                1,
                20,
                2);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync(repositorySlug))
                .Returns(Task.FromResult<RepositoryDetails?>(repository));

            var skillLookup = A.Fake<ISkillLookup>();
            A.CallTo(() => skillLookup.GetByRepositorySlugAsync(repositorySlug, 1, 20))
                .Returns(Task.FromResult(_expectedSkills));

            _result = GetRepositorySkillsEndpoint.GetAsync(
                repositorySlug, 1, 20, skillLookup, repositoryLookup).Result;
        }

        [Test]
        public async Task ReturnsOkResult()
        {
            await Assert.That(_result).IsTypeOf<Ok<PagedResult<SkillDetails>>>();
        }

        [Test]
        public async Task ReturnsPagedSkills()
        {
            var okResult = (Ok<PagedResult<SkillDetails>>)_result;
            await Assert.That(okResult.Value).IsEqualTo(_expectedSkills);
        }

        [Test]
        public async Task ReturnsCorrectItemCount()
        {
            var okResult = (Ok<PagedResult<SkillDetails>>)_result;
            await Assert.That(okResult.Value!.Items.Count).IsEqualTo(2);
        }
    }

    public class WhenRepositoryExistsWithNoSkills
    {
        private readonly IResult _result;

        public WhenRepositoryExistsWithNoSkills()
        {
            var repositoryId = Guid.NewGuid();
            var repositorySlug = "empty-repo";

            var repository = new RepositoryDetails(
                repositoryId,
                repositorySlug,
                "Empty Repository",
                "A repository with no skills");

            var emptySkills = new PagedResult<SkillDetails>(
                new List<SkillDetails>(),
                1,
                20,
                0);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync(repositorySlug))
                .Returns(Task.FromResult<RepositoryDetails?>(repository));

            var skillLookup = A.Fake<ISkillLookup>();
            A.CallTo(() => skillLookup.GetByRepositorySlugAsync(repositorySlug, 1, 20))
                .Returns(Task.FromResult(emptySkills));

            _result = GetRepositorySkillsEndpoint.GetAsync(
                repositorySlug, 1, 20, skillLookup, repositoryLookup).Result;
        }

        [Test]
        public async Task ReturnsOkResult()
        {
            await Assert.That(_result).IsTypeOf<Ok<PagedResult<SkillDetails>>>();
        }

        [Test]
        public async Task ReturnsEmptyItemsList()
        {
            var okResult = (Ok<PagedResult<SkillDetails>>)_result;
            await Assert.That(okResult.Value!.Items.Count).IsEqualTo(0);
        }

        [Test]
        public async Task ReturnsTotalCountOfZero()
        {
            var okResult = (Ok<PagedResult<SkillDetails>>)_result;
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

            var skillLookup = A.Fake<ISkillLookup>();

            _result = await GetRepositorySkillsEndpoint.GetAsync(
                "non-existent-repo", 1, 20, skillLookup, repositoryLookup);
        }

        [Test]
        public async Task ReturnsNotFoundResult()
        {
            await Assert.That(_result).IsTypeOf<NotFound>();
        }
    }

    public class WhenPageSizeExceedsMaximum
    {
        private readonly ISkillLookup _skillLookup;

        public WhenPageSizeExceedsMaximum()
        {
            var repositoryId = Guid.NewGuid();
            var repositorySlug = "test-repo";

            var repository = new RepositoryDetails(
                repositoryId,
                repositorySlug,
                "Test Repository",
                "A test repository");

            var skills = new PagedResult<SkillDetails>(
                new List<SkillDetails>(),
                1,
                100,
                0);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync(repositorySlug))
                .Returns(Task.FromResult<RepositoryDetails?>(repository));

            _skillLookup = A.Fake<ISkillLookup>();
            A.CallTo(() => _skillLookup.GetByRepositorySlugAsync(repositorySlug, 1, 100))
                .Returns(Task.FromResult(skills));

            _ = GetRepositorySkillsEndpoint.GetAsync(
                repositorySlug, 1, 500, _skillLookup, repositoryLookup).Result;
        }

        [Test]
        public async Task CapsPageSizeToMaximum()
        {
            A.CallTo(() => _skillLookup.GetByRepositorySlugAsync(A<string>._, A<int>._, 100))
                .MustHaveHappened();
        }
    }

    public class WhenPageIsLessThanOne
    {
        private readonly ISkillLookup _skillLookup;

        public WhenPageIsLessThanOne()
        {
            var repositoryId = Guid.NewGuid();
            var repositorySlug = "test-repo";

            var repository = new RepositoryDetails(
                repositoryId,
                repositorySlug,
                "Test Repository",
                "A test repository");

            var skills = new PagedResult<SkillDetails>(
                new List<SkillDetails>(),
                1,
                20,
                0);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync(repositorySlug))
                .Returns(Task.FromResult<RepositoryDetails?>(repository));

            _skillLookup = A.Fake<ISkillLookup>();
            A.CallTo(() => _skillLookup.GetByRepositorySlugAsync(repositorySlug, 1, 20))
                .Returns(Task.FromResult(skills));

            _ = GetRepositorySkillsEndpoint.GetAsync(
                repositorySlug, -1, 20, _skillLookup, repositoryLookup).Result;
        }

        [Test]
        public async Task DefaultsPageToOne()
        {
            A.CallTo(() => _skillLookup.GetByRepositorySlugAsync(A<string>._, 1, A<int>._))
                .MustHaveHappened();
        }
    }
}
