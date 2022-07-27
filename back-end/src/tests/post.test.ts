import supertest from "supertest";

import app from "../app.js";
import { prisma } from "../database.js";
import songFactory from "./factories/songFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
});

describe("Post musics suite", () => {
  it("given name and youtube music link, create music post", async () => {
    const isWrongLink = false;
    const musicData = songFactory.createMusicData(isWrongLink);
    const response = await agent.post("/recommendations").send(musicData);
    expect(response.statusCode).toBe(201);

    const music = await prisma.recommendation.findUnique({
      where: { name: musicData.name },
    });
    expect(music).not.toBeNull();
  });

  it("given repeated name and youtube music link, fail to create", async () => {
    const isWrongLink = false;
    const musicData = songFactory.createMusicData(isWrongLink);
    const musicCreated = await songFactory.createMusicPost(musicData);
    const response = await agent.post("/recommendations").send(musicData);
    expect(response.statusCode).toBe(409);
  });

  it("don't send any information, fail to create music post", async () => {
    const response = await agent.post("/recommendations");
    expect(response.statusCode).toBe(422);
  });

  it("given wrong music link, fail to create", async () => {
    const isWrongLink = true;
    const musicData = songFactory.createMusicData(isWrongLink);
    const response = await agent.post("/recommendations").send(musicData);
    expect(response.statusCode).toBe(422);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
