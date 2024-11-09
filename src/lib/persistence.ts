import { PrismaClient } from '@prisma/client';

const prismaClientInstance = () => {
    return new PrismaClient();
}

declare const globalThis: {
    prismaClient: ReturnType<typeof prismaClientInstance>;
} & typeof global;

const prisma = globalThis.prismaClient ?? prismaClientInstance();

export default prisma;

if (process.env.NODE_ENV !== 'development') {
    globalThis.prismaClient = prisma;
}
