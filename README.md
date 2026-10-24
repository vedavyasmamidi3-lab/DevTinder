# DevTinder Backend

**Status: Work in Progress**

DevTinder is a backend project inspired by dating and connection platforms. It is being developed to practice and demonstrate backend development using Node.js, Express.js, and MongoDB.

##  Project Status

This project is currently under active development. APIs, features, validation, error handling, and other improvements are being implemented incrementally.

The current code is a development version and is not intended to represent a final, production-ready release.

##  Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- Git and GitHub

##  Required APIs

### 1. `authRouter`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register a new user |
| POST | `/login` | Log in a user |
| POST | `/logout` | Log out a user |

### 2. `profileRouter`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile/view` | View the logged-in user's profile |
| PATCH | `/profile/edit` | Update profile details |
| PATCH | `/profile/password` | Update the user's password |

### 3. `connectionRequestRouter`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/request/send/interested/:userId` | Send an interested request to another user |
| POST | `/request/send/ignored/:userId` | Ignore another user |

### 4. `userRouter`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/user/connections` | Get accepted connections |
| GET | `/user/requests/received` | Get received connection requests |
| GET | `/user/feed` | Get profiles of other users on the platform |

*Note: The routes shown above are endpoint paths. The final URLs may include a prefix depending on how the routers are mounted in Express.*

##  Connection Request Statuses

Connection requests can have the following statuses:

- `ignored` — The user chooses to ignore another profile.
- `interested` — The user sends a connection request.
- `accepted` — The recipient accepts the request.
- `rejected` — The recipient rejects the request.

##  Project Goal

The goal is to strengthen backend development skills by building REST APIs, working with databases, implementing authentication, and learning good software development practices.

##  Note

This repository will be updated as development progresses. Features and implementation details may change before the project reaches its first stable release.

**This is a learning project and is currently a work in progress.**
