import { NextResponse } from "next/server";
import prisma from "@/lib/persistence";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authentication";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { email: session.user?.email || "" },
    });

    const prompts = await prisma.prompt.findMany({
        where: {
            userId: user?.id,
        },
        orderBy: [
            {
                modifiedAt: "desc"
            },
            {
                createdAt: "desc"
            }
        ],
        take: 10
    });

    return NextResponse.json({
        items: prompts
    });
}
