import supertest from "supertest";

import app from "../app.js";
import { prisma } from "../database.js";
import songFactory from "./factories/songFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("get musics tests suite", () => {
  it("get musics with no music at database", async () => {
    const response = await agent.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("get musics with two posts on database", async () => {
    await songFactory.createTwoMusicsPosts();
    const response = await agent.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].youtubeLink).not.toBeNull();
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});