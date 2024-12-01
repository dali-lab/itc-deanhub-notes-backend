# DeanHub CRUD Backend for Notes

This repository is a backend web service used for CRUD functionality to allow deans to create advising notes for students that visit them.

## Architecture
### Tech Stack
  - [Express](https://expressjs.com/)
  - [Prisma ORM](https://www.prisma.io/)
  - [Passport.js](https://www.passportjs.org/)
  - [axios](https://github.com/axios/axios)
  - [TypeScript](https://www.typescriptlang.org/docs/)

### Style
We are using [typically a configuration like [CS52's React-Native ESLint Configuration](https://gist.github.com/timofei7/c8df5cc69f44127afb48f5d1dffb6c84) or [CS52's ES6 and Node ESLint Configuration](https://gist.github.com/timofei7/21ac43d41e506429495c7368f0b40cc7)]

### Data Models
Notes will store information about Author id, Student UUID, note content, initial issue or reason to meet, and date created.


### Directory Structure

    .
    ├── ...
    ├── src
    |   └── auth                # JWT middleware
    |   └── controllers         # dispatch input; output
    |   └── db                  # Prisma database definitions
    |   └── errors              # internal error handling
    |   └── routers             # route url endpoint
    |     └── __tests__         # test cases for routers
    |   └── services            # handles database queries and related functionality
    |     └── __tests__         # test cases for services
    |   └── util                # util functions, usually used by services
    |   └── validation          # validates input w/ joi
    |   └── server.ts           # starting point of server

For more detailed documentation on our file structure and specific functions in the code, feel free to check the project files themselves.

## Setup

For this setup, we will use MongoDB as the database Prisma operates upon. It should be relatively straightforward to use a different database (like Postgres) with the same code, if you so desire.

1. Clone repo and `yarn install`
2. Create a `.env` file in the root directory, according to the format specified by `.env.example`
3. Run `yarn prisma db seed` to apply seeding to DB.
4. App should be ready for use now
  - `yarn start` to run

#### Linting

ESLint is set up in this project. To keep code clean, always remember to run `yarn run lint` and fix any lint problems before merging into master.

## Deployment
The app is deployed on [Render](https://itc-deanhub-notes-backend.onrender.com)

## Authors
* Marvin Escobar Barajas '25, Software Developer

---
Designed and developed by [@DALI Lab](https://github.com/dali-lab)

### Template

- Eric Lu '25

Additional credit goes to Adam McQuilkin '22, Ziray Hao '22, Jack Keane '22, Thomas Monfre '21 for developing the original DALI CRUD Template Backend, which this starter pack was evolved from.
