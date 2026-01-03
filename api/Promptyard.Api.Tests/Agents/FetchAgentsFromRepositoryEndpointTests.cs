using FakeItEasy;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Promptyard.Api.Agents;
using Promptyard.Api.Repositories;
using Promptyard.Api.Shared;

namespace Promptyard.Api.Tests.Features.Agents;

public class FetchAgentsFromRepositoryEndpointTests
{
    public class WhenRepositoryExistsWithAgents
    {
        private readonly IResult _result;
        private readonly PagedResult<AgentDetails> _expectedResult;
        private readonly Guid _repositoryId = Guid.NewGuid();

        public WhenRepositoryExistsWithAgents()
        {
            var agents = new List<AgentDetails>
            {
                new(Guid.NewGuid(), _repositoryId, "test-repo", "Agent 1", "Description 1", ["tag1", "tag2"]),
                new(Guid.NewGuid(), _repositoryId, "test-repo", "Agent 2", null, [])
            };

            _expectedResult = new PagedResult<AgentDetails>(agents, 1, 20, 2);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync("test-repo"))
                .Returns(Task.FromResult<RepositoryDetails?>(
                    new RepositoryDetails(_repositoryId, "test-repo", "Test Repository", null)));

            var agentLookup = A.Fake<IAgentLookup>();
            A.CallTo(() => agentLookup.GetByRepositorySlugAsync("test-repo", 1, 20))
                .Returns(Task.FromResult(_expectedResult));

            _result = FetchAgentsFromRepositoryEndpoint
                .GetAsync("test-repo", 1, 20, agentLookup, repositoryLookup).Result;
        }

        [Test]
        public async Task ReturnsOkResult()
        {
            await Assert.That(_result).IsTypeOf<Ok<PagedResult<AgentDetails>>>();
        }

        [Test]
        public async Task ReturnsPagedResult()
        {
            var okResult = (Ok<PagedResult<AgentDetails>>)_result;
            await Assert.That(okResult.Value).IsEqualTo(_expectedResult);
        }

        [Test]
        public async Task ReturnsCorrectItemCount()
        {
            var okResult = (Ok<PagedResult<AgentDetails>>)_result;
            await Assert.That(okResult.Value!.Items.Count).IsEqualTo(2);
        }

        [Test]
        public async Task ReturnsCorrectTotalCount()
        {
            var okResult = (Ok<PagedResult<AgentDetails>>)_result;
            await Assert.That(okResult.Value!.TotalCount).IsEqualTo(2);
        }
    }

    public class WhenRepositoryDoesNotExist
    {
        private IResult _result = null!;

        [Before(Test)]
        public async Task Setup()
        {
            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync("non-existent-repo"))
                .Returns(Task.FromResult<RepositoryDetails?>(null));

            var agentLookup = A.Fake<IAgentLookup>();

            _result = await FetchAgentsFromRepositoryEndpoint
                .GetAsync("non-existent-repo", 1, 20, agentLookup, repositoryLookup);
        }

        [Test]
        public async Task ReturnsNotFoundResult()
        {
            await Assert.That(_result).IsTypeOf<NotFound>();
        }
    }

    public class WhenRepositoryExistsWithNoAgents
    {
        private IResult _result = null!;
        private readonly Guid _repositoryId = Guid.NewGuid();

        [Before(Test)]
        public async Task Setup()
        {
            var emptyResult = new PagedResult<AgentDetails>(
                new List<AgentDetails>(), 1, 20, 0);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync("empty-repo"))
                .Returns(Task.FromResult<RepositoryDetails?>(
                    new RepositoryDetails(_repositoryId, "empty-repo", "Empty Repository", null)));

            var agentLookup = A.Fake<IAgentLookup>();
            A.CallTo(() => agentLookup.GetByRepositorySlugAsync("empty-repo", 1, 20))
                .Returns(Task.FromResult(emptyResult));

            _result = await FetchAgentsFromRepositoryEndpoint
                .GetAsync("empty-repo", 1, 20, agentLookup, repositoryLookup);
        }

        [Test]
        public async Task ReturnsOkResult()
        {
            await Assert.That(_result).IsTypeOf<Ok<PagedResult<AgentDetails>>>();
        }

        [Test]
        public async Task ReturnsEmptyItems()
        {
            var okResult = (Ok<PagedResult<AgentDetails>>)_result;
            await Assert.That(okResult.Value!.Items.Count).IsEqualTo(0);
        }

        [Test]
        public async Task ReturnsTotalCountZero()
        {
            var okResult = (Ok<PagedResult<AgentDetails>>)_result;
            await Assert.That(okResult.Value!.TotalCount).IsEqualTo(0);
        }
    }

    public class WhenInvalidPageParameters
    {
        private IResult _result = null!;
        private readonly Guid _repositoryId = Guid.NewGuid();

        [Before(Test)]
        public async Task Setup()
        {
            var expectedResult = new PagedResult<AgentDetails>(
                new List<AgentDetails>(), 1, 20, 0);

            var repositoryLookup = A.Fake<IRepositoryLookup>();
            A.CallTo(() => repositoryLookup.GetBySlugAsync("test-repo"))
                .Returns(Task.FromResult<RepositoryDetails?>(
                    new RepositoryDetails(_repositoryId, "test-repo", "Test Repository", null)));

            var agentLookup = A.Fake<IAgentLookup>();
            A.CallTo(() => agentLookup.GetByRepositorySlugAsync("test-repo", 1, 20))
                .Returns(Task.FromResult(expectedResult));

            // Pass invalid page (-1) and pageSize (0) - should normalize to 1 and 20
            _result = await FetchAgentsFromRepositoryEndpoint
                .GetAsync("test-repo", -1, 0, agentLookup, repositoryLookup);
        }

        [Test]
        public async Task NormalizesInvalidParametersAndReturnsOk()
        {
            await Assert.That(_result).IsTypeOf<Ok<PagedResult<AgentDetails>>>();
        }
    }
}
