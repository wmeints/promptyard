# Configuring Keycloak

This guide covers how to configure Keycloak as the identity management solution 
for Promptyard. Keycloak handles user authentication for both the portal 
(web application) and the API.

## Prerequisites

- The application is running via Aspire (Keycloak starts automatically as a container)
- Access to the Keycloak admin console at `http://localhost:8080`

## Overview

The application requires two clients in Keycloak:

| Client           | Purpose               | Authentication Type            |
| ---------------- | --------------------- | ------------------------------ |
| `portal`         | Web application login | OAuth2 Authorization Code Flow |
| `promptyard.api` | API token validation  | JWT Bearer                     |

## Configuring the Realm

Before you start, make sure you've configured the `keycloakAdminUserName` and 
`keycloakAdminPassword` user-secret as described in the solution 
[README file](../../README.md).

1. Open the Keycloak admin console at `http://localhost:8080`
2. Log in with the admin credentials you configured in user-secrets
3. Click the dropdown in the top-left corner and select **Create realm**
4. Enter the realm name: `promptyard`
5. Click **Create**

## Configuring the API Client

The API client is used for JWT Bearer token validation. The API validates tokens
issued by Keycloak to ensure requests are authenticated.

1. In the Keycloak admin console, ensure you have the `promptyard` realm selected
2. Navigate to **Clients** in the left menu
3. Click **Create client**
4. Configure the client:
   - **Client type**: OpenID Connect
   - **Client ID**: `promptyard.api`
   - Click **Next**
5. On the capability config page:
   - **Client authentication**: Off (this is a public client for audience validation)
   - **Authorization**: Off
   - Click **Next**
6. On the login settings page:
   - Leave all fields empty (this client is not used for login)
   - Click **Save**

## Configuring the Portal Client

The portal client handles user login via OAuth2 authorization code flow.

1. In the Keycloak admin console, ensure you have the `promptyard` realm selected
2. Navigate to **Clients** in the left menu
3. Click **Create client**
4. Configure the client:
   - **Client type**: OpenID Connect
   - **Client ID**: `promptyard.portal`
   - Click **Next**
5. On the capability config page:
   - **Client authentication**: On (this is a confidential client)
   - **Authorization**: Off
   - **Authentication flow**: Check only **Standard flow** (Authorization Code)
   - Click **Next**
6. On the login settings page:
   - **Root URL**: `http://localhost:3000`
   - **Home URL**: `http://localhost:3000`
   - **Valid redirect URIs**: `http://localhost:3000/api/auth/oauth2/callback/keycloak`
   - **Valid post logout redirect URIs**: `http://localhost:3000`
   - **Web origins**: `http://localhost:3000`
   - Click **Save**
7. After saving, go to the **Credentials** tab
8. Copy the **Client secret** value - you will need this for the Aspire configuration

## Creating Users

1. Navigate to **Users** in the left menu
2. Click **Create new user**
3. Fill in the user details:
   - **Username**: Required
   - **Email**: Recommended
   - **First name** and **Last name**: Optional
4. Click **Create**
5. Go to the **Credentials** tab
6. Click **Set password**
7. Enter the password and disable **Temporary** if you don't want the user to change it on first login
8. Click **Save**

## Aspire Configuration

The application uses .NET user-secrets to store Keycloak configuration. 
Run these commands from the `hosting/Promptyard.AppHost` directory:

```bash
# Portal OAuth client configuration
dotnet user-secrets set "Parameters:portalClientId" "promptyard.portal"
dotnet user-secrets set "Parameters:portalClientSecret" "<client-secret-from-keycloak>"
dotnet user-secrets set "Parameters:portalRealm" "promptyard"

# Better Auth secret (generate a random 32+ character string)
dotnet user-secrets set "Parameters:authSecretKey" "<random-secret-key>"
```

## Troubleshooting

### "Invalid redirect URI" error

Ensure the redirect URI in Keycloak matches exactly: `http://localhost:3000/api/auth/oauth2/callback/keycloak`

### "Client not found" error

Verify the `portalClientId` user-secret matches the Client ID in Keycloak (`portal`)

### "Invalid client credentials" error

Regenerate the client secret in Keycloak and update the `portalClientSecret` user-secret

### Keycloak container won't start

The Keycloak container uses persistent storage. If it gets into a bad state, you can reset it by removing the Docker volume:

```bash
docker volume rm promptyard-keycloak-data
```

