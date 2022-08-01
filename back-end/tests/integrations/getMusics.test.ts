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
    expect(response.body[0].youtubeLink).toBe(music.youtubeLink);
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

  it("get 2 top musics posts", async () => {
    const maxUpvotes = await musicFactory.createThreePostWithUpvotes();
    const response = await agent.get("/recommendations/top/2");
    expect(response.body).toHaveLength(2);
    expect(response.body[0].score).toBe(maxUpvotes);
  });

  it("get top musics with letter to amount, fail to get", async () => {
    const response = await agent.get("/recommendations/top/a");
    expect(response.status).toBe(500);
  });

  it("get top musics with amount greater than posts, return only existed posts", async () => {
    const maxUpvotes = await musicFactory.createThreePostWithUpvotes();
    const response = await agent.get("/recommendations/top/5");
    expect(response.body).toHaveLength(3);
    expect(response.body[0].score).toBe(maxUpvotes);
  });

  it("get top musics without amount, fail to connect", async () => {
    const maxUpvotes = await musicFactory.createThreePostWithUpvotes();
    const response = await agent.get("/recommendations/top");
    expect(response.status).toBe(500);
  });

  it("get top musics without any post, return empty array", async () => {
    const response = await agent.get("/recommendations/top/5");
    expect(response.body).toHaveLength(0);
  });

  it("get random music with no posts registered, returns not found", async () => {
    const response = await agent.get("/recommendations/random");
    expect(response.status).toBe(404);
  });

  it("get random music, return one music", async () => {
    const maxUpvotes = await musicFactory.createThreePostWithUpvotes();
    const response = await agent.get("/recommendations/random");
    expect(response.body.id).not.toBeUndefined();
    expect(response.body.name).not.toBeUndefined();
    expect(response.body.youtubeLink).not.toBeUndefined();
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
