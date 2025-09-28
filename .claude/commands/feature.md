Create a specification for the feature described in $ARGUMENTS.
Follow the specification process described below when designing a specification.

## Workflow

### Phase 1: Outlining key scenarios

1. Read the input for the specification carefully. You can find it in $ARGUMENTS.
2. Read the following documentation to understand the context:
   - docs/product/01-introduction-and-goals.md
   - docs/product/03-assumptions.md
   - docs/architecture/02-constraints.md
   - docs/architecture/04-solution-strategy.md
   - docs/architecture/05-building-block-view.md
3. Read the guidelines described here: 
   https://cucumber.io/docs/bdd/better-gherkin/
4. Identify related feature files based what kind of feature we're describing.
   - You can find the server related features in `server/features`
   - Client related features can be found in `client/features`
5. Identify key scenarios in the input. 
   - Only keep functional scenarios that a user can execute.
   - A scenario should have a single flow, alternative flows need a separate scenario.
   - Prefer scenarios where you can provide examples for key input.
   - Follow the gherkin guidelines when creating scenarios.
6. Create a gherkin feature file that looks like this:
   - The title of the feature is the name specified in the input.
   - Add a user story below the title of the feature file to provide a
     descripion of of the feature that we'll implement later.
   - Add the key scenarios to the feature file but leave them empty for now.

### Phase 2: Fill in key scenarios

After writing the rough scenarios in the feature file, read the complete feature
file and fill in each of the scenarios using the following guidelines

- Each scenario should contain a single flow
- Include a few key examples in the scenario.
- Move steps that are common for each scenario in a background section in the 
  feature file. These should be performed before a scenario is executed.

Use the guidelines described here to write high quality scenarios:
https://cucumber.io/docs/bdd/better-gherkin/

Store the expanded scenarios in the feature file.

### Phase 3: Review feature file quality

1. Review the feature file using the guidelines described here: 
   https://cucumber.io/docs/bdd/better-gherkin/
3. Report a score between 1 and 5 to the developer for the quality of the
   feature file. Include a top 5 list of improvements that the developer
   can make to the feature file.

## Guidelines for writing feature files

- Ask questions if somethings is unclear or you need to make assumptions.
- Mark incomplete scenarios and examples in the feature file.

## Where to store feature files

- Features related to the server should be stored in `server/features`
- Features related to the client should be stored in `client/features`