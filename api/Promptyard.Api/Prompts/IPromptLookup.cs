using Promptyard.Api.Shared;

namespace Promptyard.Api.Prompts;

public interface IPromptLookup
{
    Task<PagedResult<PromptDetails>> GetByRepositorySlugAsync(
        string repositorySlug,
        int page = 1,
        int pageSize = 20);
}
