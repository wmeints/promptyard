# Building block view

This section covers the static building blocks of the application.
We take a top-down approach, zooming in level after level into each part of the
solution starting at the technical context.

## Technical context

TODO: Add diagram

## Backend API

The key responsibility for the backend API is store the content created by the
users of the application. It's build in ASP.NET Core with Marten as a document
database layer on top of PostgreSQL. We use WolverineFX to implement the request
handlers in the application.

### Vertical slice architecture

The backend API uses vertical slice architecture to implement functional slices.
The vertical slices make it easier for us to extend functionality as we add more
features to the application.

### Event sourcing

We use event sourcing to make it easier for us to reason about business logic
in terms of actions and events that happen as a consequence. We apply event
projections to provide convenient read models for the portal to render data.

## Portal

The portal is repsonsible for rendering the data stored in the backend and for
sending requests on behalf of the user to modify or create content. The portal
is implemented as Next.js application with shadcn components for the user
interface.

## Keycloak

We use keycloak as the authorization server for the project for the time being.
We plan on moving towards EntraID or add EntraID as a federated user provider.