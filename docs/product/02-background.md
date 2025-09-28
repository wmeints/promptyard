# Background

This section provides some background information to help you understand why
promptyard was developed.

## How promptyard got started

The development of promptyard started because of one question posed by a
developer while I was working on a set of prompt templates to implement a
spec-driven workflow.

I made a set of templates that let me build software with three prompts used
one after the other:

1. First, I would generate a specification from a basic feature description.
2. Then, I would use the specification to generate an implementation plan.
3. Finally, I would use the implementation plan to let the agent code.

Deploying these prompt templates for the spec-driven workflow takes some effort
because you need to copy a set of files from a Github repository. Usually it
takes a few minutes to set things up, but it's annoying.

Looking at this workflow, I figured, how cool would it be to fix the deployment
of prompt templates for spec-driven workflows.

Also, I noticed that people have their own personal sets of prompt templates
that they want to use, so having a place to store and share those makes a lot
of sense given how specific these prompt templates are for various types of
projects.

## Other use cases that make sense for promptyard

While talking about sharing prompt templates for coding agents, I came across a
few people who use ChatGPT quite frequently and they had another use case that
I found interesting. They were copy/pasting prompts from notepad into the
application.

For this use case you can't deploy prompt templates automatically. You need to
copy/paste them into the tool. So why not let people save the prompt templates
on the website and have a copy button to quickly grab a prompt template?
