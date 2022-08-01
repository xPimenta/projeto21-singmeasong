import supertest from "supertest";

import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import musicFactory from "../factories/musicFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("test route suite", () => {
  it("given 15 posts, delete all", async () => {
    const musicData = await musicFactory.createMoreThanTenPosts(15);
    const musics = await prisma.recommendation.findMany({});
    expect(musics).toHaveLength(15);
    const promise = await agent.delete("/reset");
    expect(promise.status).toBe(200);
    const DBMusics = await prisma.recommendation.findMany({});
    expect(DBMusics).toHaveLength(0);
  });
});
