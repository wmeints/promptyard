using System.Text.RegularExpressions;
using Marten;

namespace Promptyard.Api.Features.Repositories;

public interface IRepositorySlugGenerator
{
    string GenerateSlug(string name, Guid? repositoryId = null);
}

public class RepositorySlugGenerator(IDocumentSession session): IRepositorySlugGenerator
{
    public string GenerateSlug(string name, Guid? repositoryId = null)
    {
        var generatedSlug = GenerateRawSlug(name);
        
        var collidingSlugs = session
            .Query<RepositorySummary>()
            .Where(x => x.Slug.StartsWith(generatedSlug));

        if (repositoryId != null)
        {
            collidingSlugs = collidingSlugs.Where(x => x.Id != repositoryId);
        }

        var slugCount = collidingSlugs.Count();
        
        if (slugCount > 0)
        {
            return $"{generatedSlug}-{slugCount}";
        }

        return generatedSlug;
    }

    private string GenerateRawSlug(string name)
    {
        name = name.ToLower().Trim();
        name = Regex.Replace(name, @"[\s_]+", "-"); // Replace spaces and underscores with hyphens
        name = Regex.Replace(name, "[^a-z0-9-]", ""); // Remove non-alphanumeric except hyphens
        name = Regex.Replace(name, "-+", "-"); // Collapse multiple hyphens
        name = Regex.Replace(name, "^-|-$", ""); // Trim leading/trailing hyphens

        return name;
    }
}