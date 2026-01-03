using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promptyard.Api.Repositories;
using Wolverine.Http;
using Wolverine.Marten;

namespace Promptyard.Api.Agents;

public record AddAgentToRepositoryRequest(string Name, string? Description, string[]? Tags);

public class AddAgentToRepositoryRequestValidator : AbstractValidator<AddAgentToRepositoryRequest>
{
    private const int MaxTagCount = 10;
    private const int MaxTagLength = 50;

    public AddAgentToRepositoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(1000);

        RuleFor(x => x.Tags)
            .Must(tags => tags is null || tags.Length <= MaxTagCount)
            .WithMessage($"An agent can have a maximum of {MaxTagCount} tags.");

        RuleForEach(x => x.Tags)
            .NotEmpty()
            .WithMessage("Tags cannot be empty.")
            .MaximumLength(MaxTagLength)
            .WithMessage($"Each tag must be at most {MaxTagLength} characters.")
            .When(x => x.Tags is not null);
    }
}

public class AddAgentToRepositoryEndpoint
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
    [WolverinePost("/api/repository/{slug}/agents")]
    public static async Task<(AgentDetails, AgentCreated, IStartStream)> ExecuteAsync(
        string slug,
        AddAgentToRepositoryRequest request,
        IRepositoryLookup repositoryLookup)
    {
        var repository = await repositoryLookup.GetBySlugAsync(slug);

        var agentId = Guid.NewGuid();
        var tags = request.Tags ?? [];

        var agentCreated = new AgentCreated(
            agentId,
            repository!.Id,
            repository.Slug,
            request.Name,
            request.Description,
            tags);

        var startStream = MartenOps.StartStream<Agent>(agentId, agentCreated);

        var response = new AgentDetails(
            agentId,
            repository.Id,
            repository.Slug,
            request.Name,
            request.Description,
            tags);

        return (response, agentCreated, startStream);
    }
}
