using Marten;

namespace Promptyard.Api.Application.Repositories;

public class UserRepositoryLookup(IDocumentSession session) : IUserRepositoryLookup
{
    public async Task<UserRepositoryDetails?> GetByUserIdAsync(string userId)
    {
        return await session
            .Query<UserRepositoryDetails>()
            .Where(x => x.UserId == userId)
            .FirstOrDefaultAsync();
    }
}
