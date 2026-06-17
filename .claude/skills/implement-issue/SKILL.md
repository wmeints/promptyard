---
name: implement-issue
description: Use this skill to implement a user story based on a GitHub issue reference.
---

Use this skill to implement a user story based on a GitHub issue reference.
Make sure to follow the workflow defined below to implement the issue.

## Workflow

1. Read the issue $ARGS
2. Create a new feature branch for the implementation of the issue
3. Create a TODO list with the tasks in the order of implementation necessary to implement the issue
3. Use dedicated sub agents to implement + verify each step in the TODO list.
4. Run a final code review and make sure all items on the review checklist in the issue are done.
5. Create a pull request for the issue on GitHub
