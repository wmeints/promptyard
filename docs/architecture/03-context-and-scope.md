# Context and scope

This section covers the context and scope of the promptyard software.

## Business context

Promptyard is a central marketplace for sharing prompt templates. We
deploy one instance of Promptyard online for people to share prompts.
Organizations can deploy promptyard within their organization to build an
internal marketplace for prompts.

Since we can't know how organizations want to use Promptyard, we'll limit
ourselves in the following ways:

- Promptyard focuses on providing capabilities to manage prompts. We don't
  integrate with any AI tool directly. Users need to copy-and-paste prompt
  templates from the website or deploy them to a directory using the 
  command-line client.

- Promptyard provides no direct authentication support. Users should configure
  their own authentication provider in the application. We support OpenID
  connect providers.

## Technical context

Promptyard is a webapplication that integrates the following components:

- Postgresql/Neon - For storing relational data. 
- OpenID Connect - For authentication.
- Opensearch/Upstash - For enabling search in the application.

We keep the number of integrations to a minimum to keep the solution as
portable as possible. Users are free to deploy the application on Kubernetes
or using a set of containers.

