using Marten;
using Marten.Events.Projections;

namespace Promptyard.Api.Repositories;

public class UserRepositoryDetailsProjection : EventProjection
{
    public static void Project(UserRepositoryOnboarded @event, IDocumentOperations ops)
    {
        ops.Insert(new UserRepositoryDetails(
            @event.RepositoryId,
            @event.UserId,
            @event.Name,
            @event.Slug,
            @event.Description));
    }
}
