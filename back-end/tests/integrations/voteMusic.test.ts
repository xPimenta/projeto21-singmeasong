import supertest from "supertest";

import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import musicFactory from "./../factories/musicFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("vote music post suite", () => {
  it("upvote music post, increase one its score", async () => {
    const isWrongLink = false;
    const musicData = musicFactory.createMusicData(isWrongLink);
    const music = await musicFactory.createMusicPost(musicData);
    const response = await agent.post(`/recommendations/${music.id}/upvote`);
    expect(response.status).toBe(200);
    const musicUpdate = await prisma.recommendation.findUnique({
      where: { id: music.id },
    });
    expect(musicUpdate.score).toBe(music.score + 1);
  });

  it("upvote music post with letter as id, get error", async () => {
    const response = await agent.post(`/recommendations/a/upvote`);
    expect(response.status).toBe(500);
  });

  it("upvote music post with wrong id, get not found error", async () => {
    const response = await agent.post(`/recommendations/3/upvote`);
    expect(response.status).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});

