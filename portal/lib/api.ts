"use server";

const serviceKey = "api";
const serviceScheme = "https";

const apiUrl = process.env[`services__${serviceKey}__${serviceScheme}_0`];

export async function userRepositoryExists(): Promise<boolean> {
    const response = await fetch(`${apiUrl}/repository/user`, {});

    if (response.ok) {
        return true;
    } else if (response.status == 404) {
        return false;
    }

    throw new Error("Unexpected response from API");
}

export async function createUserRepository(): Promise<void> {
    const response = await fetch(`${apiUrl}/repository/user`, {
        method: "POST",
    });
}
