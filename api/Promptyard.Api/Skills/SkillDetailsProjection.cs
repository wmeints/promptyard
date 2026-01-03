using Marten;
using Marten.Events.Projections;

namespace Promptyard.Api.Skills;

public class SkillDetailsProjection : EventProjection
{
    public static void Project(SkillAddedToRepository @event, IDocumentOperations ops)
    {
        ops.Insert(new SkillDetails(
            @event.SkillId,
            @event.RepositoryId,
            @event.RepositorySlug,
            @event.Name,
            @event.Description));
    }
}
