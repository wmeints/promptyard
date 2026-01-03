using Microsoft.AspNetCore.Authorization;
using Promptyard.Api.Repositories;
using Wolverine.Http;

namespace Promptyard.Api.Skills;

public class GetRepositorySkillsEndpoint
{
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    [Authorize]
    [WolverineGet("/api/repository/{slug}/skills")]
    public static async Task<IResult> GetAsync(
        string slug,
        int page,
        int pageSize,
        ISkillLookup skillLookup,
        IRepositoryLookup repositoryLookup)
    {
        var repository = await repositoryLookup.GetBySlugAsync(slug);

        if (repository is null)
        {
            return Results.NotFound();
        }

        if (page < 1)
        {
            page = 1;
        }

        if (pageSize < 1)
        {
            pageSize = DefaultPageSize;
        }
        else if (pageSize > MaxPageSize)
        {
            pageSize = MaxPageSize;
        }

        var skills = await skillLookup.GetByRepositorySlugAsync(slug, page, pageSize);

        return Results.Ok(skills);
    }
}
