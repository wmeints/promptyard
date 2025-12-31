using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Wolverine.Http;

namespace Promptyard.Api.Repositories;

public class FetchUserRepositoryEndpoint
{
    [Authorize]
    [WolverineGet("/api/repository/user")]
    public static async Task<IResult> GetAsync(ClaimsPrincipal user, IUserRepositoryLookup repositoryLookup)
    {
        var userId = user.Identity!.Name!;
        var userRepository = await repositoryLookup.GetByUserIdAsync(userId);

        if (userRepository is null)
        {
            return Results.NotFound();
        }

        return Results.Ok(userRepository);
    }
}
