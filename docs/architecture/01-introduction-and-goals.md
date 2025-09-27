# Introduction and goals

Promptyard is a website to manage prompt templates so they can be easily shared
with other people. Promptyard also provides a command line tool to easily
install sets of prompt templates into software projects for various coding
agents that exist.

You can use promptyard through the public website https://promptyard.dev/
or deploy it on your own server.

## Key requirements

- Provide an easy way to manage and share prompt templates through a website
  so more people can profit from the prompt engineering efforts of others.
- Provide a command line utility to quickly deploy sets of prompt templates
  to implement spec-driven development via coding agents.

## Non-goals

- Provide a SaaS solution for organizations to manage their internal prompt
  templates. When an organization needs an internal prompt template sharing
  tool, they can deploy promptyard internally.

## Quality goals

- **Portability:** The software needs to be as portable as possible to help
  users install the software quickly and easily on different environments.

- **Maintainability:** The software must have minimal integrations to make\
  operations as simple and cost-effective as possible.

- **Interoperability:** The software must allow users to import/export data
  to allow them to move prompt templates between instances of promptyard.

- **Security:** The website can be connected to internal authentication
  solutions as long as they use the OpenID connect protocol. We provide no
  authentication solution of our own. For the public version of the solution
  we'll use an external login provider.