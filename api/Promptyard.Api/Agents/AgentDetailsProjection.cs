using Marten;
using Marten.Events.Projections;

namespace Promptyard.Api.Agents;

public class AgentDetailsProjection : EventProjection
{
    public static void Project(AgentCreated @event, IDocumentOperations ops)
    {
        ops.Insert(new AgentDetails(
            @event.AgentId,
            @event.RepositoryId,
            @event.RepositorySlug,
            @event.Name,
            @event.Description,
            @event.Tags));
    }
}
