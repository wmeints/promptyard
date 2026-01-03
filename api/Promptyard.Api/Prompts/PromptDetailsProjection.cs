using Marten;
using Marten.Events.Projections;

namespace Promptyard.Api.Prompts;

public class PromptDetailsProjection : EventProjection
{
    public static void Project(PromptAddedToRepository @event, IDocumentOperations ops)
    {
        ops.Insert(new PromptDetails(
            @event.PromptId,
            @event.RepositoryId,
            @event.RepositorySlug,
            @event.Name,
            @event.Description,
            @event.Content));
    }
}
