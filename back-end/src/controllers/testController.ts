import { Request, Response } from "express";
import { testRepository } from "../repositories/testRepository.js";

export async function reset(req: Request, res: Response) {
  await testRepository.resetDatabase();

  res.sendStatus(200);
}
