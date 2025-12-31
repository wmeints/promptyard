namespace Promptyard.Api.Repositories;

public interface IUserRepositoryLookup
{
    Task<UserRepositoryDetails?> GetByUserIdAsync(string userId);
}
