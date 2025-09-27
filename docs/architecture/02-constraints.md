# Constraints

This section describes important constraints for the system. These constraints
limit the technical choices we can make in the solution strategy and other
places.

## Business constraints

- We need to support a public instance of promptyard via promptyard.dev so 
  individuals can share prompts via the public web. We want to host this
  instance on Vercel with the appropriate integrations. We can't run containers
  on Vercel.
- Next to the public instance, we want to enable organizations to run
  promptyard on their internal servers via container platforms like Kubernetes.

## Technical constraints 

- We need to support a broad set of authentication mechanisms so organizations
  can connect their own OAuth/OpenID connect servers to the application.

- We need to keep the solution as portable as possible. We limit ourselves
  to using postgres as the database for that matter. We use opensearch for
  search capabilities.

- We assume no cloud capabilities for portability reasons. Users are free
  to deploy the application using Kubernetes, a set of containers or on
  Vercel.
