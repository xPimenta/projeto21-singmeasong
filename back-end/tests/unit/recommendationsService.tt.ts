// import { faker } from "@faker-js/faker";
// import { Recommendation } from "@prisma/client";
// import { recommendationRepository } from "../../src/repositories/recommendationRepository";
// import { recommendationService } from "../../src/services/recommendationsService.js";

// describe("recommendations service suite", () => {
//   it("given right id, return recommendation", async () => {
//     jest
//       .spyOn(recommendationRepository, "find")
//       .mockImplementationOnce(async (id: number) => {
//         return {
//           id,
//           name: "Mock 1",
//           youtubeLink: faker.internet.url(),
//           score: Math.floor(Math.random() * 40),
//         };
//       });

//     const recommendation = await recommendationService.getById(2);
//     expect(recommendation.name).toBe("Mock 1");
//   });
// });


