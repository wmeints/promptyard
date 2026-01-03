using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promptyard.Api.Repositories;
using Wolverine.Http;
using Wolverine.Marten;

namespace Promptyard.Api.Prompts;

public record AddPromptToRepositoryRequest(string Name, string? Description, string Content);

public class AddPromptToRepositoryRequestValidator : AbstractValidator<AddPromptToRepositoryRequest>
{
    public AddPromptToRepositoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(1000);

        RuleFor(x => x.Content)
            .NotEmpty();
    }
}

public class AddPromptToRepositoryEndpoint
{
    public static async Task<ProblemDetails?> ValidateAsync(
        string slug,
        IRepositoryLookup repositoryLookup)
    {
        var repository = await repositoryLookup.GetBySlugAsync(slug);

        if (repository is null)
        {
            return new ProblemDetails
            {
                Title = "Repository not found",
                Detail = $"No repository was found with slug '{slug}'.",
                Status = StatusCodes.Status404NotFound
            };
        }

        return WolverineContinue.NoProblems;
    }

    [Authorize]
    [WolverinePost("/api/repository/{slug}/prompts")]
    public static async Task<(PromptDetails, PromptAddedToRepository, IStartStream)> ExecuteAsync(
        string slug,
        AddPromptToRepositoryRequest request,
        IRepositoryLookup repositoryLookup)
    {
        var repository = await repositoryLookup.GetBySlugAsync(slug);

        var promptId = Guid.NewGuid();

        var promptAddedToRepository = new PromptAddedToRepository(
            promptId,
            repository!.Id,
            repository.Slug,
            request.Name,
            request.Description,
            request.Content);

        var startStream = MartenOps.StartStream<Prompt>(promptId, promptAddedToRepository);

        var response = new PromptDetails(
            promptId,
            repository.Id,
            repository.Slug,
            request.Name,
            request.Description,
            request.Content);

        return (response, promptAddedToRepository, startStream);
    }
}
