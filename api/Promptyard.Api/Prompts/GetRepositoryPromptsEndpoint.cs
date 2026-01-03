using Microsoft.AspNetCore.Authorization;
using Promptyard.Api.Repositories;
using Wolverine.Http;

namespace Promptyard.Api.Prompts;

public class GetRepositoryPromptsEndpoint
{
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    [Authorize]
    [WolverineGet("/api/repository/{slug}/prompts")]
    public static async Task<IResult> GetAsync(
        string slug,
        int page,
        int pageSize,
        IPromptLookup promptLookup,
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

        var prompts = await promptLookup.GetByRepositorySlugAsync(slug, page, pageSize);

        return Results.Ok(prompts);
    }
}
