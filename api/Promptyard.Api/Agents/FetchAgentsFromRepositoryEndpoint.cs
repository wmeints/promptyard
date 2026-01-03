using Microsoft.AspNetCore.Authorization;
using Promptyard.Api.Repositories;
using Wolverine.Http;

namespace Promptyard.Api.Agents;

public class FetchAgentsFromRepositoryEndpoint
{
    private const int DefaultPageSize = 20;
    private const int MaxPageSize = 100;

    [Authorize]
    [WolverineGet("/api/repository/{slug}/agents")]
    public static async Task<IResult> GetAsync(
        string slug,
        int page,
        int pageSize,
        IAgentLookup agentLookup,
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

        var agents = await agentLookup.GetByRepositorySlugAsync(slug, page, pageSize);

        return Results.Ok(agents);
    }
}
