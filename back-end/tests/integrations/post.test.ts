import supertest from "supertest";

import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import musicFactory from "../factories/musicFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("Post musics suite", () => {
  it("given name and youtube music link, create music post", async () => {
    const isWrongLink = false;
    const musicData = musicFactory.createMusicData(isWrongLink);
    const response = await agent.post("/recommendations").send(musicData);
    expect(response.statusCode).toBe(201);

    const music = await prisma.recommendation.findUnique({
      where: { name: musicData.name },
    });
    expect(music).not.toBeNull();
    expect(music.name).toBe(musicData.name);
  });

  it("given repeated name and youtube music link, fail to create", async () => {
    const isWrongLink = false;
    const musicData = musicFactory.createMusicData(isWrongLink);
    const musicCreated = await musicFactory.createMusicPost(musicData);
    const response = await agent.post("/recommendations").send(musicData);
    expect(response.statusCode).toBe(409);
  });

  it("don't send any information, fail to create music post", async () => {
    const response = await agent.post("/recommendations");
    expect(response.statusCode).toBe(422);
  });

  it("given wrong music link, fail to create", async () => {
    const isWrongLink = true;
    const musicData = musicFactory.createMusicData(isWrongLink);
    const response = await agent.post("/recommendations").send(musicData);
    expect(response.statusCode).toBe(422);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
