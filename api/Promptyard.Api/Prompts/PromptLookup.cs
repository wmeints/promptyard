using Marten;
using Promptyard.Api.Shared;

namespace Promptyard.Api.Prompts;

public class PromptLookup(IDocumentSession session) : IPromptLookup
{
    public async Task<PagedResult<PromptDetails>> GetByRepositorySlugAsync(
        string repositorySlug,
        int page = 1,
        int pageSize = 20)
    {
        var query = session
            .Query<PromptDetails>()
            .Where(x => x.RepositorySlug == repositorySlug);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<PromptDetails>(items, page, pageSize, totalCount);
    }
}
