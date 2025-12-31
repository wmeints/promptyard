using System.Security.Claims;

namespace Promptyard.Api.Tests.Shared;

public class TestObjectFactory
{
    public static ClaimsPrincipal CreateApplicationUser()
    {
        var identity = new ClaimsIdentity([new Claim(ClaimTypes.Name, "test-user")]);
        var principal = new ClaimsPrincipal(identity);
        
        return principal;
    }
}