import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/persistence";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authentication";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const pageSize = parseInt(searchParams.get("pageSize") || "10", 10);

  const user = await prisma.user.findUnique({
    where: { email: session.user?.email || "" },
  });

  const prompts = await prisma.prompt.findMany({
    where: {
      userId: user?.id,
    },
    skip: (page - 1) * pageSize,
    take: pageSize,
    include: {
      versions: false,
    },
  });

  const totalPrompts = await prisma.prompt.count({
    where: {
      userId: user?.id,
    },
  });

  return NextResponse.json({
    items: prompts,
    totalPages: Math.ceil(totalPrompts / pageSize),
  });
}
