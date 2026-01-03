namespace Promptyard.Api.Agents;

public record AgentCreated(
    Guid AgentId,
    Guid RepositoryId,
    string RepositorySlug,
    string Name,
    string? Description,
    string[] Tags);
