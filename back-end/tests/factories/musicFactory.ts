import { faker } from "@faker-js/faker";

import { prisma } from "../../src/database.js";

function createMusicData(wrong: boolean, name?: string) {
  return {
    name: name ? name : faker.name.findName(),
    youtubeLink: wrong
      ? `https://www.test.com/${faker.random.alphaNumeric(10)}`
      : `https://www.youtube.com/${faker.random.alphaNumeric(10)}`,
  };
}

interface Music {
  name: string;
  youtubeLink: string;
}

async function createMusicPost(musicData: Music) {
  const music = await prisma.recommendation.create({
    data: musicData,
  });

  return { ...music };
}

async function createTwoMusicsPosts() {
  const names = ["test 1", "test 2"];
  const musics: Music[] = [];
  for (let i = 0; i < names.length; i++) {
    const isWrongLink = false;
    const music = createMusicData(isWrongLink, names[i]);
    await prisma.recommendation.create({
      data: music,
    });
    musics.push(music);
  }
  return musics;
}

async function createMoreThanTenPosts(numberOfPosts: number) {
  let music: Music;
  const isWrongLink = false;
  for (let i = 0; i < numberOfPosts; i++) {
    music = createMusicData(isWrongLink);
    await createMusicPost(music);
  }
  return music;
}

const musicFactory = {
  createMusicData,
  createMusicPost,
  createTwoMusicsPosts,
  createMoreThanTenPosts,
};
export default musicFactory;
