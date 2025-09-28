Feature: Create prompt templates
  As a user of promptyard
  I want to create prompt templates in my personal profile or in a repository
  So that I can share and organize my prompt engineering work with others

  Background:
    Given I am authenticated as 'test_user'

  Scenario Outline: Create prompt template in personal profile
    Given I am on my personal profile page
    When I create a prompt template named "<title>" with content "<content>" for products "<products>"
    Then the prompt template "<title>" should be created in my personal repository
    And the template should have the slug "<slug>"
    And the template should be accessible via "/test_user/<slug>"
    And the template should support <product_count> products

    Examples:
      | title              | slug               | content                                                        | products                             | product_count |
      | Git Commit Helper  | git-commit-helper  | Generate a clear commit message for this                       | Github Copilot, Claude Code          | 2             |
      | Code Explanation   | code-explanation   | Explain what this code does step by step                       | ChatGPT, Claude Chat                 | 2             |
      | Code Review Helper | code-review-helper | Review this code for best practices and potential improvements | Claude Code, ChatGPT, Github Copilot | 3             |

  Scenario Outline: Create prompt template in existing repository
    Given I have a repository named "<repository>"
    And I am on the repository page for "<repository>"
    When I create a prompt template named "<title>" with content "<content>" for products "<products>"
    Then the prompt template "<title>" should be created in the "<repository>" repository
    And the template should have the slug "<slug>"
    And the template should be accessible via "/test_user/<repository>/<slug>"
    And the template should support <product_count> products

    Examples:
      | repository           | title             | slug              | content                                                 | products                          | product_count |
      | development-workflow | Git Commit Helper | git-commit-helper | Generate a clear commit message for this                | Github Copilot, Claude Code       | 2             |
      | development-workflow | API Documentation | api-documentation | Document this API endpoint with examples                | Claude Code, Claude Chat, ChatGPT | 3             |
      | development-workflow | Bug Analysis      | bug-analysis      | Analyze this bug report and suggest investigation steps | Claude Code, Microsoft Copilot    | 2             |
