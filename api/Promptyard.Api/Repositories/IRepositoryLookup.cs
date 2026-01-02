namespace Promptyard.Api.Repositories;

public interface IRepositoryLookup
{
    int CountBySlugPrefix(string slugPrefix, Guid? excludeRepositoryId = null);
    Task<RepositoryDetails?> GetBySlugAsync(string slug);
}
