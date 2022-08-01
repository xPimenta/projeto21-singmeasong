/// <reference types="cypress" />

import { faker } from "@faker-js/faker";

beforeEach(() => {
  cy.resetPosts();
});

describe("add new music post", () => {
  it("should add new music post", () => {
    const musicData = {
      name: faker.name.findName(),
      youtubeLink: "https://youtu.be/ALZHF5UqnU4",
    };
    cy.visit("http://localhost:3000/");
    cy.get("input").first().type(musicData.name);
    cy.get("input").last().type(musicData.youtubeLink);

    cy.intercept("POST", "/recommendations").as("addPost");
    cy.get("button").click();
    cy.wait("@addPost");
    cy.contains(musicData.name).should("be.visible");

    cy.url().should("equal", "http://localhost:3000/");
  });

  it("should not add new music post with wrong link", () => {
    const musicData = {
      name: faker.name.findName(),
      youtubeLink: "https://test.be/ALZHF5UqnU4",
    };
    cy.visit("http://localhost:3000/");
    cy.get("input").first().type(musicData.name);
    cy.get("input").last().type(musicData.youtubeLink);

    cy.intercept("POST", "/recommendations").as("addPost");
    cy.get("button").click();
    cy.wait("@addPost").its("response.statusCode").should("eq", 422);
  });

  it("should not add new music post without input informations", () => {
    cy.visit("http://localhost:3000/");

    cy.intercept("POST", "/recommendations").as("addPost");
    cy.get("button").click();
    cy.wait("@addPost").its("response.statusCode").should("eq", 422);
  });
});
