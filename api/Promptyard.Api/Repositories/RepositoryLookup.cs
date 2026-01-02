using Marten;

namespace Promptyard.Api.Repositories;

public class RepositoryLookup(IDocumentSession session) : IRepositoryLookup
{
    public int CountBySlugPrefix(string slugPrefix, Guid? excludeRepositoryId = null)
    {
        var query = session
            .Query<RepositoryDetails>()
            .Where(x => x.Slug.StartsWith(slugPrefix));

        if (excludeRepositoryId != null)
        {
            query = query.Where(x => x.Id != excludeRepositoryId);
        }

        return query.Count();
    }
}
