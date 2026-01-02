using Microsoft.AspNetCore.Authorization;
using Wolverine.Http;

namespace Promptyard.Api.Repositories;

public class FetchRepositoryDetailsEndpoint
{
    [Authorize]
    [WolverineGet("/api/repository/{slug}")]
    public static async Task<IResult> GetAsync(string slug, IRepositoryLookup repositoryLookup)
    {
        var repository = await repositoryLookup.GetBySlugAsync(slug);

        if (repository is null)
        {
            return Results.NotFound();
        }

        return Results.Ok(repository);
    }
}
