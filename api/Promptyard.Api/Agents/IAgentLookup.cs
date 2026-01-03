using Promptyard.Api.Shared;

namespace Promptyard.Api.Agents;

public interface IAgentLookup
{
    Task<PagedResult<AgentDetails>> GetByRepositorySlugAsync(
        string repositorySlug,
        int page = 1,
        int pageSize = 20);
}
