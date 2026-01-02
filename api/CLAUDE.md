# Promptyard API

The Promptyard API is implemented in ASP.NET Core with Marten and Wolverine
as frameworks. Wolverine takes care of the endpoint implementation and
Marten is used for  event sourcing and general document database storage.

## Implementing changes in the API

- Use the `endpoint-implementation` skill when writing code for an endpoint
- Use the `unit-testing` skill when writing test code for the application. 
  The skill can be used for unit-tests as well as integration tests.

## Project architecture

Review ../docs/architecture/05-building-block-view.md for a complete overview
of the building blocks included in the solution and how the API relates to the
Portal.
