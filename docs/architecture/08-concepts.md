# Concepts

This section covers cross-cutting concepts in the project. 
Anything that doesn't get covered by other sections is placed here.

## Testing

### Component testing

We use storybook to test components in the application. We use storybook for documenting components as well so we have
a tight relationship between the documentation and the actual functionality of the components in the application.

We've included [an agent skill](../../.github/skills/component-testing/SKILL.md) to help write stories for the
components in the application. You can ask Github Copilot to write a story or component test for the component you're
working on and it will apply the following practices:

- It creates scenarios for each of the states in the component
- It adds tests to verify event handlers and user interaction

### Unit-testing

We use vitest to unit-test classes and functions in the codebase that aren't considered a component.
We've added [an agent skill](../../.github/skills/unit-testing/SKILL.md) to help you write unit-tests effectively in
the application.