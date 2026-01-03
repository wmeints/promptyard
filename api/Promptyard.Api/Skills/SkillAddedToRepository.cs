namespace Promptyard.Api.Skills;

public record SkillAddedToRepository(
    Guid SkillId,
    Guid RepositoryId,
    string RepositorySlug,
    string Name,
    string? Description);
