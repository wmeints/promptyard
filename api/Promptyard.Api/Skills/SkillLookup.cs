using Marten;
using Promptyard.Api.Shared;

namespace Promptyard.Api.Skills;

public class SkillLookup(IDocumentSession session) : ISkillLookup
{
    public async Task<PagedResult<SkillDetails>> GetByRepositorySlugAsync(
        string repositorySlug,
        int page = 1,
        int pageSize = 20)
    {
        var query = session
            .Query<SkillDetails>()
            .Where(x => x.RepositorySlug == repositorySlug);

        var totalCount = await query.CountAsync();
        var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<SkillDetails>(
            items,
            page,
            pageSize,
            totalCount,
            totalPages);
    }
}
