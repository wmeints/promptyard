namespace Promptyard.Api.Agents;

public record AgentDetails(
    Guid Id,
    Guid RepositoryId,
    string RepositorySlug,
    string Name,
    string? Description,
    string[] Tags);
