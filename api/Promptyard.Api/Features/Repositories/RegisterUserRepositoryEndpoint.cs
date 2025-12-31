using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Promptyard.Api.Domain;
using Wolverine.Http;
using Wolverine.Marten;

namespace Promptyard.Api.Features.Repositories;

public record RegisterUserRepositoryRequest;

public record RegisterUserRepositoryResponse(Guid RepositoryId, string Slug);

public record UserRepositoryRegistered(Guid RepositoryId, string UserId, string Slug);

public class RegisterUserRepositoryEndpoint
{
    [Authorize]
    [WolverinePost("/api/repositories/user")]
    public static (RegisterUserRepositoryResponse, UserRepositoryRegistered, IStartStream) ExecuteAsync(ClaimsPrincipal user, IRepositorySlugGenerator slugGenerator)
    {
        var repositoryId = Guid.NewGuid();
        var repositorySlug = slugGenerator.GenerateSlug(user.Identity!.Name!);
        
        var userRepositoryRegistered = new UserRepositoryRegistered(repositoryId, user.Identity!.Name!, repositorySlug);
        var startStream = MartenOps.StartStream<Repository>(Guid.NewGuid(), userRepositoryRegistered);
        var response = new RegisterUserRepositoryResponse(repositoryId,  repositorySlug);
        
        return (response, userRepositoryRegistered, startStream);
    }
}