using Marten;
using Marten.Events.Projections;

namespace Promptyard.Api.Application.Repositories;

public class RepositoryDetailsProjection: EventProjection
{
    public static void Project(UserRepositoryOnboarded @event, IDocumentOperations ops)
    {
        ops.Insert(new RepositoryDetails(
            @event.RepositoryId,
            @event.Slug,
            @event.Name,
            @event.Description));
    }
}