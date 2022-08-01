/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

before(() => {
  cy.resetPosts();
  const musicData = {
    name: faker.name.findName(),
    youtubeLink: "https://youtu.be/ALZHF5UqnU4",
  };
  cy.createPost(musicData);
});

describe("upvote and downvote music post", () => {
  it("should upvote a music post", () => {
    cy.visit("http://localhost:3000");

    cy.contains("0").as("votes");
    cy.intercept("POST", "/recommendations/1/upvote").as("upvotePost");
    cy.get("#upvote").click();
    cy.wait("@upvotePost");

    cy.get("@votes").should("have.text", "1");
  });

  it("should upvote a music vote more 3 times", () => {
    cy.visit("http://localhost:3000");
    cy.contains("1").as("votes");

    for (let i = 0; i < 3; i++) {
      cy.intercept("POST", "/recommendations/1/upvote").as("upvotePost");
      cy.get("#upvote").click();
      cy.wait("@upvotePost");
    }

    cy.get("@votes").should("have.text", "4");
  });
});
