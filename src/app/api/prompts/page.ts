import { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/persistence";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { page = 1, pageSize = 10 } = req.query;
  const pageNumber = parseInt(page as string, 10);
  const pageSizeNumber = parseInt(pageSize as string, 10);

  const prompts = await prisma.prompt.findMany({
    skip: (pageNumber - 1) * pageSizeNumber,
    take: pageSizeNumber,
    include: {
      versions: true,
    },
  });

  const totalPrompts = await prisma.prompt.count();

  res.status(200).json({
    prompts,
    totalPages: Math.ceil(totalPrompts / pageSizeNumber),
  });
}
