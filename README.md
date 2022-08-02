# <p align = "center"> Project 21 - Tests Sign me a song </p>

<p align = "center"> Desenvolvido por Mateus Pimenta </p>

## :clipboard: Description

Sign me a song is an app to post your favorite songs, and rank them through up and down votes. This was a project to implement tests:
- E2E tests
- Integration tests
- Unity tests

---

## :computer: Technologies

- Node.js
- TypeScript
- Express
- REST APIs
- JWTs
- PostgreSQL
- Prisma
- Jest
- Cypress

---

## 🏁 Running the tests

### Back-end

This project was created using TypeScript, [Node.js](https://nodejs.org/en/download/) and [PostgresSQL](https://www.postgresql.org/) as database. So, make sure do you have the last version of [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/) running localy.

Start cloning the in you local machine:

```
git clone https://github.com/xPimenta/projeto21-singmeasong
```

After that, inside the [back-end]( https://github.com/xPimenta/projeto21-singmeasong/tree/main/back-end ) cloned folder, run the command below to install the project dependencies.

```
npm install
```

After intall all packages, create a `.env` file with the right path to the database it will be used, as shown in `.env.example` file.

The test in the back-end are separate in two types:

- Integration tests: tests which will check the functionality of all routes of the project. These can be started with the command below.

```
npm run test:int
```

- Unity tests: tests which will check the functionality of all services functions of the application. These can be started with the command below.

```
npm run test:unit
```

Finally, all tests can be run together with:

```
npm test
```

### Front-end

This project was created using React create app. So, make sure do you have the last version of [Node.js](https://nodejs.org/en/download/) and [npm](https://www.npmjs.com/) running localy.

Start cloning the in you local machine:

```
git clone https://github.com/xPimenta/projeto21-singmeasong
```

After that, inside the [front-end](https://github.com/xPimenta/projeto21-singmeasong/tree/main/front-end) cloned folder, run the command below to install the project dependencies.

```
npm install
```

After intall all packages, create a `.env` file as shown in `.env.example` file.

To run the tests at front-end, first is necessary to make the back-end online, so in the back-end folder run:

```
npm run dev:test
```

Now, back to the front-end folder, just need to execute the command:

```
npx cypress open
```

At last, navigate through Cypress application and select the tests you want to run:

```
add_music_post.cy.js
top_random_pages.cy.js
vote_music_post.cy.js
```
