namespace Promptyard.Api.Agents;

public class Agent
{
    public Guid Id { get; private set; }
    public Guid RepositoryId { get; private set; }
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }

    private void Apply(AgentCreated agentCreated)
    {
        Id = agentCreated.AgentId;
        RepositoryId = agentCreated.RepositoryId;
        Name = agentCreated.Name;
        Description = agentCreated.Description;
    }
}
