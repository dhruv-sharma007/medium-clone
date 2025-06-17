import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const getPrisma = (DATABASE_URL: string) => {
    const client = new PrismaClient({ datasourceUrl: DATABASE_URL });
    return client.$extends(withAccelerate());
};
