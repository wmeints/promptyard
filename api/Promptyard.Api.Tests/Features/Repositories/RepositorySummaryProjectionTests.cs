using FakeItEasy;
using Marten;
using Promptyard.Api.Features.Repositories;

namespace Promptyard.Api.Tests.Features.Repositories;

public class RepositorySummaryProjectionTests
{
    public class WhenUserRepositoryRegisteredEventIsProjected
    {
        private readonly IDocumentOperations _documentOperations;
        private readonly UserRepositoryRegistered _event;
        private readonly Guid _repositoryId;
        private readonly string _userId;
        private readonly string _slug;

        public WhenUserRepositoryRegisteredEventIsProjected()
        {
            _repositoryId = Guid.NewGuid();
            _userId = "test-user-123";
            _slug = "test-repository-slug";
            
            _event = new UserRepositoryRegistered(_repositoryId, _userId, _slug);
            _documentOperations = A.Fake<IDocumentOperations>();
            
            RepositorySummaryProjection.Project(_event, _documentOperations);
        }

        [Test]
        public Task RepositorySummaryIsInserted()
        {
            A.CallTo(() => _documentOperations.Insert(
                A<RepositorySummary>.That.Matches(summary => 
                    summary.Id == _repositoryId &&
                    summary.Name == _userId &&
                    summary.Slug == _slug)))
                .MustHaveHappenedOnceExactly();
            
            return Task.CompletedTask;
        }
    }
}

