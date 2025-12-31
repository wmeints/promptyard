using Marten;
using Marten.Events.Projections;

namespace Promptyard.Api.Features.Repositories;

public class RepositorySummaryProjection: EventProjection
{
    public static void Project(UserRepositoryRegistered @event, IDocumentOperations ops)
    {
        ops.Insert(new RepositorySummary(@event.RepositoryId, @event.UserId, @event.Slug));
    }
}