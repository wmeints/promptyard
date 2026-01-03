namespace Promptyard.Api.Skills;

public record SkillDetails(
    Guid Id,
    Guid RepositoryId,
    string RepositorySlug,
    string Name,
    string? Description);
