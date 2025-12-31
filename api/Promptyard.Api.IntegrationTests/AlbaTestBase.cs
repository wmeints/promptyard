using Alba;

namespace Promptyard.Api.IntegrationTests;

public abstract class AlbaTestBase(AlbaBootstrap albaBootstrap)
{
    protected IAlbaHost Host => albaBootstrap.Host;
}