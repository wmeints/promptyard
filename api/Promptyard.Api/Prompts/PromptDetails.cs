namespace Promptyard.Api.Prompts;

public record PromptDetails(
    Guid Id,
    Guid RepositoryId,
    string RepositorySlug,
    string Name,
    string? Description,
    string Content);
