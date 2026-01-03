using Promptyard.Api.Shared;

namespace Promptyard.Api.Skills;

public interface ISkillLookup
{
    Task<PagedResult<SkillDetails>> GetByRepositorySlugAsync(
        string repositorySlug,
        int page = 1,
        int pageSize = 20);
}
