Feature: Create a new repository
  As a user of promptyard
  I want to create a new repository
  So that I can organize my prompt templates by purpose or workflow and share them with others

  Background:
    Given I am authenticated as 'test_user'

  Scenario Outline: Create a prompt template repository
    When I create a repository named "<name>" with description "<description>" and tags "<tags>"
    Then the repository "<name>" should be created successfully
    And the repository should have <tag_count> tags
    And the repository is reachable via "/test_user/<slug>"

    Examples:
      | name                 | slug                 | description                               | tags                                               | tag_count |
      | Development workflow | development-workflow | Prompt templates for software development | development, workflow, coding, automation, testing | 5         |
      | Simple workflow      | simple-repo          | A simple repository for basic prompts     | simple, basic                                      | 2         |
      | Minimal repo         | minimal-repo         |                                           |                                                    | 0         |
