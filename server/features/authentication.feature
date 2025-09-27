Feature: Authentication
    As a user of the application I want to sign in to the application so I can
    access my personal profile and repositories.

    Scenario: User signs in with existing account
        Given a user is registered in the system
        When they sign in using a configured authentication provider
        Then they should be redirected to their personal profile page