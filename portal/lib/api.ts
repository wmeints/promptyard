"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const apiUrl = process.env.services__api__https__0;

export interface OnboardUserRequest {
    fullName: string;
    introduction?: string;
}

export interface UserRepositoryDetails {
    id: string;
    userId: string;
    name: string;
    slug: string;
    description?: string;
}

export async function isUserOnboarded(): Promise<boolean> {
    const { accessToken } = await auth.api.getAccessToken({
        headers: await headers(),
        body: {
            providerId: "keycloak",
        },
    });

    const response = await fetch(`${apiUrl}/api/repository/user`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status === 404) {
        return false;
    }

    if (response.status === 200) {
        return true;
    }

    throw new Error(`Unexpected API response status: ${response.status}`);
}

export async function onboardUser(
    request: OnboardUserRequest
): Promise<UserRepositoryDetails> {
    const { accessToken } = await auth.api.getAccessToken({
        headers: await headers(),
        body: {
            providerId: "keycloak",
        },
    });

    const response = await fetch(`${apiUrl}/api/repository/user`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            fullName: request.fullName,
            introduction: request.introduction,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to onboard user: ${errorText}`);
    }

    return await response.json();
}

export interface RepositoryDetails {
    id: string;
    slug: string;
    name: string;
    description?: string | null;
}

export async function getRepositoryBySlug(
    slug: string
): Promise<RepositoryDetails | null> {
    const { accessToken } = await auth.api.getAccessToken({
        headers: await headers(),
        body: {
            providerId: "keycloak",
        },
    });

    const response = await fetch(`${apiUrl}/api/repository/${slug}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch repository: ${errorText}`);
    }

    return await response.json();
}
