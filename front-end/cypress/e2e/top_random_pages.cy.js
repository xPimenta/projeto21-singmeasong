/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

before(() => {
  cy.resetPosts();
});

describe("top and random pages suite", () => {
  it("without any post, should not show any post at top page", () => {
    cy.visit("http://localhost:3000");
    cy.intercept("GET", "/recommendations/top/10").as("getTop");
    cy.contains("Top").click();
    cy.wait("@getTop").its("response.statusCode").should("eq", 200);
    cy.get('[data-identifier="vote-menu"]').should("not.exist");
  });

  it("without any post, should get erro at random page", () => {
    cy.intercept("GET", "/recommendations/random").as("getRandom");
    cy.visit("http://localhost:3000/random");
    cy.wait("@getRandom").its("response.statusCode").should("eq", 404);
  });

  it("post three posts with different votes, should order by votes in top page", () => {
    const musics = [];
    for (let i = 0; i < 3; i++) {
      const musicData = {
        name: faker.name.findName(),
        youtubeLink: "https://youtu.be/ALZHF5UqnU4",
      };
      musics.push(musicData);
      cy.createPost(musicData);
    }
    cy.visit("http://localhost:3000");
    for (let i = 0; i < 10; i++) {
      cy.intercept("POST", "/recommendations/2/upvote").as("upvotePost2");
      cy.contains(musics[1].name)
        .parent()
        .find('[data-identifier="upvote"]')
        .click();
      cy.wait("@upvotePost2");
      cy.intercept("POST", "/recommendations/1/upvote").as("upvotePost1");
      cy.contains(musics[0].name)
        .parent()
        .find('[data-identifier="upvote"]')
        .click();
      cy.wait("@upvotePost1");
      if (i % 3 === 0) {
        cy.intercept("POST", "/recommendations/3/downvote").as("downvotePost");
        cy.contains(musics[2].name)
          .parent()
          .find('[data-identifier="downvote"]')
          .click();
        cy.wait("@downvotePost");
      }
    }
    cy.intercept("POST", "/recommendations/1/downvote").as("downvotePost1");
    cy.contains(musics[0].name)
      .parent()
      .find('[data-identifier="downvote"]')
      .click();
    cy.wait("@downvotePost1");

    cy.contains("Top").click();
    cy.url().should("equal", "http://localhost:3000/top");
    cy.get("article")
      .first()
      .find('[data-identifier="vote-menu"]')
      .should("have.text", "10");
    cy.get("article")
      .last()
      .find('[data-identifier="vote-menu"]')
      .should("have.text", "-4");
  });

  it("")

  it("with three posts, get one post at random page", () => {});
});
