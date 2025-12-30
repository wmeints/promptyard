# Unit-testing in the API project

- The API project is located in the `api` directory in the repository
- The unit-tests are written in C# using xunit3

## Test class layout

- Create a test class in the same namespace in the test project to mirror the actual class in the same namespace in the actual API.
- Test only one behavior/scenario per test method to ensure readability of the tests.

## Mocking

- Mock external dependencies, leave the internal dependencies as-is.
- Use FakeItEasy to create mocks in the unit-tests.