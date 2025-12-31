using Promptyard.Api.Features.Repositories;

namespace Promptyard.Api.Domain;

public class Repository
{
    public Guid Id { get; private set; }
    public string Slug { get; private set; } = null!;
    public string? UserId { get; private set; }

    private void Apply(UserRepositoryRegistered userRepositoryRegistered)
    {
        Id = userRepositoryRegistered.RepositoryId;
        Slug = userRepositoryRegistered.Slug;
        UserId = userRepositoryRegistered.UserId;
    }
}