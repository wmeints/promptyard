namespace Promptyard.Api.Prompts;

public record PromptAddedToRepository(
    Guid PromptId,
    Guid RepositoryId,
    string RepositorySlug,
    string Name,
    string? Description,
    string Content);
