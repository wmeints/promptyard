# Unit-testing in the portal project

- The portal project is located in the `portal` directory in the repository.
- The tests are written in typescript with vitest using `describe`, `it`, and `expect` statements.
- Test files must be located next to the original file. So if you have an `auth.ts` file, you should create a `auth.test.ts` next to it.

## Layout of a test file

- Each test file has a top-level `describe` statement with the name of the module.
- For each class, function in the file, create a second level `describe` statement.
- Then, for each scenario, create a third level `describe` statement with a description of the scenario.
- Use `before` to create the setup for each scenario, making sure that the necessary information is accessible for the assertions.
- Use one `it` function per assertion in the third level `describe` statement to verify the outcome of a scenario.

## Mocking information

- Use the included mocking functionality in vitest to mock external dependencies.
- Mock as little as possible to ensure we cover enough logic in the application for the tests to make sense.

## Test quality

- Don't go overboard with test scenarios. Write as few tests as possible to cover the necessary scenarios.
- Prefer writing functional scenarios for testing to mimic how a developer would use the code in the file you're writing tests for.