Feature: Onboarding
    As a new user of the application I want to create a profile and my user
    repository so that I can start publishing my first prompt templates.

    Scenario: New user signs in to the application
        Given a user is not registered in the system
        When they sign in using a configured authentication provider
        Then they should be redirected to the onboarding page

    Scenario Outline: Onboard new user
        Given a user is on the onboarding page
        When they enter the username <username>
        And they enter the full name <full_name>
        And they submit the form
        Then a new repository named <username> is created
        And a new user profile <username> is created with full name <full_name>

        Examples:

            | username      | full_name     |
            | wmeints       | Willem Meints |
            | bob_marley    | Bob Marley    |
            | alice123      | Alice Smith   |
            | charley-brown | Charley Brown |