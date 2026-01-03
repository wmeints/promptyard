using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Promptyard.Api.Repositories;
using Wolverine.Http;
using Wolverine.Marten;

namespace Promptyard.Api.Skills;

public record AddSkillToRepositoryRequest(string Name, string? Description, string[]? Tags);

public class AddSkillToRepositoryRequestValidator : AbstractValidator<AddSkillToRepositoryRequest>
{
    private const int MaxTagCount = 10;
    private const int MaxTagLength = 50;

    public AddSkillToRepositoryRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(1000);

        RuleFor(x => x.Tags)
            .Must(tags => tags is null || tags.Length <= MaxTagCount)
            .WithMessage($"A skill can have a maximum of {MaxTagCount} tags.");

        RuleForEach(x => x.Tags)
            .NotEmpty()
            .WithMessage("Tags cannot be empty.")
            .MaximumLength(MaxTagLength)
            .WithMessage($"Each tag must be at most {MaxTagLength} characters.")
            .When(x => x.Tags is not null);
    }
}

public class AddSkillToRepositoryEndpoint
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
    [WolverinePost("/api/repository/{slug}/skills")]
    public static async Task<(SkillDetails, SkillAddedToRepository, IStartStream)> ExecuteAsync(
        string slug,
        AddSkillToRepositoryRequest request,
        IRepositoryLookup repositoryLookup)
    {
        var repository = await repositoryLookup.GetBySlugAsync(slug);

        var skillId = Guid.NewGuid();
        var tags = request.Tags ?? [];

        var skillAddedToRepository = new SkillAddedToRepository(
            skillId,
            repository!.Id,
            repository.Slug,
            request.Name,
            request.Description,
            tags);

        var startStream = MartenOps.StartStream<Skill>(skillId, skillAddedToRepository);

        var response = new SkillDetails(
            skillId,
            repository.Id,
            repository.Slug,
            request.Name,
            request.Description,
            tags);

        return (response, skillAddedToRepository, startStream);
    }
}
