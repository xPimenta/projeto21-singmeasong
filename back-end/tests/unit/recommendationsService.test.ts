import { jest } from "@jest/globals";
import { response } from "express";
import { recommendationRepository } from "../../src/repositories/recommendationRepository";
import { recommendationService } from "../../src/services/recommendationsService.js";
import musicFactory from "./../factories/musicFactory.js";

beforeEach(() => {
  jest.resetAllMocks();
});

describe("recommendations service suite", () => {
  it("given name and link, insert music at database", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => false);

    jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();

    const isWrongLink = false;
    const musicInfo = musicFactory.createMusicData(isWrongLink);
    const promise = await recommendationService.insert(musicInfo);
    expect(recommendationRepository.findByName).toBeCalledTimes(1);
    expect(recommendationRepository.create).toBeCalledTimes(1);
  });

  it("given registered name, throw error", async () => {
    jest
      .spyOn(recommendationRepository, "findByName")
      .mockImplementationOnce((): any => true);

    jest.spyOn(recommendationRepository, "create").mockResolvedValueOnce();

    const isWrongLink = false;
    const musicInfo = musicFactory.createMusicData(isWrongLink);
    const promise = recommendationService.insert(musicInfo);
    expect(promise).rejects.toEqual({
      type: "conflict",
      message: "Recommendations names must be unique",
    });
    expect(recommendationRepository.findByName).toBeCalledTimes(1);
    expect(recommendationRepository.create).not.toBeCalled();
  });

  it("getById/getByIdOrFail with correct id", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((id): any => ({
        name: `teste ${id}`,
        youtubeLink: `teste ${id}`,
      }));

    const id = 3;
    const promise = await recommendationService.getById(id);
    expect(promise.name).toBe(`teste ${id}`);
    expect(promise.youtubeLink).toBe(`teste ${id}`);
    expect(recommendationRepository.find).toBeCalledTimes(1);
  });

  it("getById/getByIdOrFail with wrong correct id", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((id): any => false);

    const id = 3;
    const promise = recommendationService.getById(id);
    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
    expect(recommendationRepository.find).toBeCalledTimes(1);
  });

  it("upvote correct post id", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => true);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    const promise = await recommendationService.upvote(2);
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
  });

  it("upvote incorrect post id", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => false);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    const promise = recommendationService.upvote(2);
    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(0);
  });

  it("downvote correct post id", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => true);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => ({ score: 3 }));

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    const promise = await recommendationService.downvote(2);
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    expect(recommendationRepository.remove).toBeCalledTimes(0);
  });

  it("downvote correct post id with 5 downvotes, delete post", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => true);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => ({ score: -6 }));

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    const promise = await recommendationService.downvote(2);
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    expect(recommendationRepository.remove).toBeCalledTimes(1);
  });

  it("upvote incorrect post id", async () => {
    jest
      .spyOn(recommendationRepository, "find")
      .mockImplementationOnce((): any => false);

    jest
      .spyOn(recommendationRepository, "updateScore")
      .mockImplementationOnce((): any => {});

    jest
      .spyOn(recommendationRepository, "remove")
      .mockImplementationOnce((): any => {});

    const promise = recommendationService.downvote(2);
    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
    expect(recommendationRepository.find).toBeCalledTimes(1);
    expect(recommendationRepository.updateScore).toBeCalledTimes(0);
    expect(recommendationRepository.remove).toBeCalledTimes(0);
  });

  it("get musics posts (function get)", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return "test";
      });

    const promise = await recommendationService.get();
    expect(promise).toBe("test");
  });

  it("get top musics posts (function getTop)", async () => {
    jest
      .spyOn(recommendationRepository, "getAmountByScore")
      .mockImplementationOnce((): any => "test");

    const promise = await recommendationService.getTop(4);
    expect(promise).toBe("test");
  });

  it("get random music function with lte, return one music", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.4);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [{ name: "test 1" }, { name: "test 2" }];
      });

    const promise = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
    expect(Math.random).toBeCalledTimes(2);
    expect(promise.name).toBe("test 1");
  });

  it("get random music function with gt, return one music", async () => {
    jest.spyOn(Math, "random").mockReturnValue(0.8);
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementationOnce((): any => {
        return [{ name: "test 1" }, { name: "test 2" }];
      });

    const promise = await recommendationService.getRandom();
    expect(recommendationRepository.findAll).toBeCalledTimes(1);
    expect(Math.random).toBeCalledTimes(2);
    expect(promise.name).toBe("test 2");
  });

  it("get random music without music post, return error", async () => {
    jest
      .spyOn(recommendationRepository, "findAll")
      .mockImplementation((): any => {
        return [];
      });
    const promise = recommendationService.getRandom();
    expect(promise).rejects.toEqual({ type: "not_found", message: "" });
  });
});
