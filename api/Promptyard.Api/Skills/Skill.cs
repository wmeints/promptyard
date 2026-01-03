namespace Promptyard.Api.Skills;

public class Skill
{
    public Guid Id { get; private set; }
    public Guid RepositoryId { get; private set; }
    public string RepositorySlug { get; private set; } = null!;
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }

    private void Apply(SkillAddedToRepository @event)
    {
        Id = @event.SkillId;
        RepositoryId = @event.RepositoryId;
        RepositorySlug = @event.RepositorySlug;
        Name = @event.Name;
        Description = @event.Description;
    }
}
