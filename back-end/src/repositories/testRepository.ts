import { prisma } from "../database.js";

async function resetDatabase() {
  await prisma.recommendation.deleteMany({ where: {} });
}

export const testRepository = { resetDatabase };
