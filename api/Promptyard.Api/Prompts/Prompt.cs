namespace Promptyard.Api.Prompts;

public class Prompt
{
    public Guid Id { get; private set; }
    public Guid RepositoryId { get; private set; }
    public string RepositorySlug { get; private set; } = null!;
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }
    public string Content { get; private set; } = null!;

    private void Apply(PromptAddedToRepository @event)
    {
        Id = @event.PromptId;
        RepositoryId = @event.RepositoryId;
        RepositorySlug = @event.RepositorySlug;
        Name = @event.Name;
        Description = @event.Description;
        Content = @event.Content;
    }
}
