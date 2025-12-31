namespace Promptyard.Api.Repositories;

public class Repository
{
    public Guid Id { get; private set; }
    public string Slug { get; private set; } = null!;
    public string? UserId { get; private set; }
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }

    private void Apply(UserRepositoryOnboarded userRepositoryOnboarded)
    {
        Id = userRepositoryOnboarded.RepositoryId;
        Slug = userRepositoryOnboarded.Slug;
        UserId = userRepositoryOnboarded.UserId;
        Name = userRepositoryOnboarded.Name;
        Description = userRepositoryOnboarded.Description;
    }
}