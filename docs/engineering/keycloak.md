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

## Configuring the API Scope

The `api:manage` scope allows the portal to access the API's management
endpoints. This scope must be created and assigned to the portal client.

### Creating the Client Scope

1. In the Keycloak admin console, ensure you have the `promptyard` realm selected
2. Navigate to **Client scopes** in the left menu
3. Click **Create client scope**
4. Configure the scope:
   - **Name**: `api:manage`
   - **Description**: `Allows management access to the Promptyard API`
   - **Type**: None
   - **Protocol**: OpenID Connect
   - Click **Save**

### Adding the Scope to the Portal Client

1. Navigate to **Clients** in the left menu
2. Click on the `promptyard.portal` client
3. Go to the **Client scopes** tab
4. Click **Add client scope**
5. Select `api:manage` from the list
6. Choose **Default** (the scope will be included in all token requests)
7. Click **Add**

### Configuring the API Audience

To ensure the access token includes the correct audience for the API, add an
audience mapper to the scope:

1. Navigate to **Client scopes** in the left menu
2. Click on `api:manage`
3. Go to the **Mappers** tab
4. Click **Add mapper** → **By configuration**
5. Select **Audience**
6. Configure the mapper:
   - **Name**: `promptyard-api-audience`
   - **Included Client Audience**: `promptyard.api`
   - **Add to ID token**: Off
   - **Add to access token**: On
   - Click **Save**

### Verifying the Configuration

After configuration, access tokens issued to the portal will include:

- The `api:manage` scope in the `scope` claim
- `promptyard.api` in the `aud` (audience) claim

This allows the API to validate that the token was issued for its consumption
and that the user has management permissions.

## Configuring the Content Manager Role

The `content-manager` role grants users access to manage content in Promptyard.
Users with this role can access the API's management endpoints.

### Creating the Role

1. In the Keycloak admin console, ensure you have the `promptyard` realm selected
2. Navigate to **Realm roles** in the left menu
3. Click **Create role**
4. Configure the role:
   - **Role name**: `content-manager`
   - **Description**: `Allows users to manage content in Promptyard`
   - Click **Save**

### Assigning the Role as Default

To ensure all new users automatically receive the `content-manager` role:

1. Navigate to **Realm settings** in the left menu
2. Go to the **User registration** tab
3. Click on **Default roles**
4. Click **Assign role**
5. Select `content-manager` from the list
6. Click **Assign**

All newly created users will now automatically have the `content-manager` role.

### Linking the Role to the API Scope

To ensure the `api:manage` scope is only granted to users with the `content-manager`
role, add a role mapper to the scope:

1. Navigate to **Client scopes** in the left menu
2. Click on `api:manage`
3. Go to the **Scope** tab
4. Click **Assign role**
5. Select `content-manager` from the list
6. Click **Assign**

This restricts the `api:manage` scope to only be included in tokens for users
who have the `content-manager` role.

### Adding the Role to Tokens

To include the user's roles in the access token for API authorization:

1. Navigate to **Client scopes** in the left menu
2. Click on `api:manage`
3. Go to the **Mappers** tab
4. Click **Add mapper** → **By configuration**
5. Select **User Realm Role**
6. Configure the mapper:
   - **Name**: `realm-roles`
   - **Token Claim Name**: `roles`
   - **Add to ID token**: Off
   - **Add to access token**: On
   - **Add to userinfo**: Off
   - Click **Save**

The API can now check the `roles` claim in the access token to verify the user
has the `content-manager` role.

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

