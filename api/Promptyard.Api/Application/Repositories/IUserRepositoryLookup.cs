namespace Promptyard.Api.Application.Repositories;

public interface IUserRepositoryLookup
{
    Task<UserRepositoryDetails?> GetByUserIdAsync(string userId);
}
