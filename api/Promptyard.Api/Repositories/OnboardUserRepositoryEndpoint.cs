using System.Security.Claims;
using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Wolverine.Http;
using Wolverine.Marten;

namespace Promptyard.Api.Repositories;

public record OnboardUserRepositoryRequest(string FullName, string? Introduction);

public record UserRepositoryOnboarded(Guid RepositoryId, string UserId, string Name, string Slug, string? Description);

public class OnboardUserRepositoryRequestValidator : AbstractValidator<OnboardUserRepositoryRequest>
{
    public OnboardUserRepositoryRequestValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Introduction)
            .MaximumLength(500);
    }
}

public class OnboardUserRepositoryEndpoint
{
    public static async Task<ProblemDetails?> ValidateAsync(
        ClaimsPrincipal user,
        IUserRepositoryLookup repositoryLookup)
    {
        var userId = user.Identity!.Name!;
        var existingRepository = await repositoryLookup.GetByUserIdAsync(userId);

        if (existingRepository != null)
        {
            return new ProblemDetails
            {
                Title = "User already has a repository",
                Detail = "A user can only have one user repository. The current user already has an existing user repository.",
                Status = StatusCodes.Status400BadRequest
            };
        }

        return WolverineContinue.NoProblems;
    }

    [Authorize]
    [WolverinePost("/api/repository/user")]
    public static (UserRepositoryDetails, UserRepositoryOnboarded, IStartStream) Execute(
        OnboardUserRepositoryRequest request,
        ClaimsPrincipal user,
        IRepositorySlugGenerator slugGenerator)
    {
        var userId = user.Identity!.Name!;
        var repositoryId = Guid.NewGuid();
        var repositorySlug = slugGenerator.GenerateSlug(request.FullName);

        var userRepositoryOnboarded = new UserRepositoryOnboarded(
            repositoryId,
            userId,
            request.FullName,
            repositorySlug,
            request.Introduction);

        var startStream = MartenOps.StartStream<Repository>(repositoryId, userRepositoryOnboarded);

        var response = new UserRepositoryDetails(
            repositoryId,
            userId,
            request.FullName,
            repositorySlug,
            request.Introduction);

        return (response, userRepositoryOnboarded, startStream);
    }
}
