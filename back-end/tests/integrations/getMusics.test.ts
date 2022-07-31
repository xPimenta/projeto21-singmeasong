import supertest from "supertest";

import app from "../../src/app.js";
import { prisma } from "../../src/database.js";
import musicFactory from "./../factories/musicFactory.js";

const agent = supertest(app);

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`;
});

describe("get musics tests suite", () => {
  it("get musics with no music at database", async () => {
    const response = await agent.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(0);
  });

  it("get musics with two posts on database", async () => {
    const musics = await musicFactory.createTwoMusicsPosts();
    console.log(musics);
    const response = await agent.get("/recommendations");
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe("test 2");
    expect(response.body[1].name).toBe("test 1");
  });

  it("get musics with more than 10 posts on database", async () => {
    const numberOfPosts = 15;
    const music = await musicFactory.createMoreThanTenPosts(numberOfPosts);
    const response = await agent.get("/recommendations");
    expect(response.body).toHaveLength(10);
    expect(response.body[0].name).toBe(music.name);
  });

  it("get music with wrong id", async () => {
    const response = await agent.get("/recommendations/3");
    expect(response.statusCode).toBe(404);
  });

  it("get music with a char id", async () => {
    const response = await agent.get("/recommendations/a");
    expect(response.statusCode).toBe(500);
  });

  it("get music by right id", async () => {
    const isWrongLink = false;
    const musicData = musicFactory.createMusicData(isWrongLink);
    const music = await musicFactory.createMusicPost(musicData);
    const response = await agent.get(`/recommendations/${music.id}`);
    expect(response.status).toBe(200);
    expect(response.body.id).toBe(music.id);
    expect(response.body.name).toBe(music.name);
    expect(response.body.youtubeLink).toBe(music.youtubeLink);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
