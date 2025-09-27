# Quality

This section describes the quality measures we take to make sure that the
product is useful and safe. We used the ISO25010 standard as inspiration for
the quality measures described in this section.

## Functional suitability

- We use storybook to run component tests combined with vitest to run basic
  unit-tests for code that isn't a component.
- We use playwright with cucumber to create automated acceptance tests for
  the application. The feature files serve as a source for specifications
  to ensure that we minimize the gap between functional specifications and the
  technical implementation of those specs.

## Security

### Authentication

- We use BetterAuth to implement authentication with standard provider
  integration for Clerk.com for now. Later on, we'll add support for more
  providers when there's demand for them.

- We standardized on OpenID connect as this is one of the most widely used
  authentication mechanisms. We minimize the risk of misconfiguration by
  using standard frameworks such as BetterAuth and external identity providers.

### Authorization

- We use a basic authorization model based on specific scenarios described in
  the acceptance tests for the application. We may need to introduce a more
  complex policy based model later on.

## Maintainability

### Observability

- We use OpenTelemetry to output metrics, logs, and traces. You can collect
  these by connecting the application to one of the supported collectors.

### Testability

- We use [atomic design](https://atomicdesign.bradfrost.com/chapter-2/) to
  structure components in the application. This reduces their size so we can
  more easily test them.
- We move shared logic into the `src/lib` directory and group them into
  modules that are functionally coherent so we can test those modules separately
  from the user interface.
- We use vitest mocks to disable external interactions so we can focus on our
  own logic instead of having to deal with external dependencies.

### Reusability

- We're taking a monolithic approach to keep things simple to deploy. This means
  that pieces of the application can't be reused in other applications.
- We build components using [atomic design](https://atomicdesign.bradfrost.com/chapter-2/)
  so we can reuse them across pages in the application. The components are not
  meant to be reused outside the application.

## Flexibility

### Installability

- We offer a docker image for people to install on a container platform of their
  choice. The person that's operating the application is going to have to bring
  their own version of the external dependencies.
- The public version of promptyard will use cloud-based services and is deployed
  from the CI/CD environment directly.

### Scalability

- We build the application so that it can be horizontally scaled across multiple
  machines as long as they connect to the same database and search engine.
  Although we don't expect that we need to scale out the application webserver
  very much. Most of the load will be placed on the database and search engine.
