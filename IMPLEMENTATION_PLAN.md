# Implementation Plan: Authentication

This plan covers the authentication scope described in [README.md](README.md): admins and agents can log in and log out, and admins can create agents. Each phase ends with something you can run and check.

## Decisions

- **Backend language:** TypeScript, to share types with the frontend
- **Test tools:** Vitest + Supertest + mongodb-memory-server

---

## Phase 0: Project Setup

**Done when:** `npm run dev` starts the client and the server. The client can call the API through the Vite proxy, and the server connects to MongoDB.

- [x] `git init`, add `.gitignore` (node_modules, `.env`, build output)
- [x] Create the folder structure: `client/` and `server/`
- [x] Scaffold `client/` with Vite + React + TypeScript
- [x] Install and configure Tailwind in `client/`
- [x] Scaffold `server/` with Express + TypeScript
- [x] Run MongoDB locally with Docker and document how to start it
- [x] Add a Mongoose connection module, read `MONGODB_URI` from env
- [ ] Add `.env.example` with `MONGODB_URI`, `JWT_SECRET`, `CLIENT_ORIGIN`, `NODE_ENV`, `PORT`, `SEED_ADMIN_EMAIL`, `SEED_ADMIN_PASSWORD`
- [ ] Validate required env variables on server start (fail fast if any are missing)
- [x] Add a `GET /api/health` endpoint
- [ ] Configure the Vite proxy: `/api` → `http://localhost:3000`
- [ ] Add a root script that runs the client and server together
- [ ] Set up Vitest in both packages, plus Supertest and mongodb-memory-server in `server/`, with one passing test in each package

## Phase 1: Authentication Backend

**Done when:** You can log in as the seeded admin, create an agent, log in as that agent, and log out, all through API calls. Old tokens are rejected after logout.

### User model and seeding
- [ ] Create the `User` model (`name`, `email`, `passwordHash`, `role`, `tokenVersion`, `createdBy`, timestamps)
- [ ] Add a unique index on `email`; store emails lowercase and trimmed
- [ ] Exclude `passwordHash` from queries by default
- [ ] Add password hashing and comparison helpers (bcrypt)
- [ ] Write the admin seed script (`npm run seed:admin`). It reads the credentials from env and does nothing if that admin already exists.

### Security middleware
- [ ] Add `cookie-parser` and the JSON body parser
- [ ] Add middleware that rejects `POST`/`PUT`/`PATCH`/`DELETE` requests whose `Content-Type` isn't `application/json`
- [ ] Add middleware that rejects state-changing requests whose `Origin` isn't `CLIENT_ORIGIN`
- [ ] Add a central error handler that returns consistent JSON errors and hides stack traces in production

### Auth
- [ ] JWT helpers: sign `{ userId, tokenVersion }` with a 1-day expiry, and verify
- [ ] Cookie helper: `httpOnly`, `sameSite=strict`, `secure` when `NODE_ENV=production`
- [ ] `requireAuth` middleware: verify the JWT, load the user, compare `tokenVersion`, attach `req.user`
- [ ] `requireAdmin` middleware: check `req.user.role === "admin"`
- [ ] `POST /api/auth/login`: validate the input and set the cookie. Return the same error whether the email or the password is wrong.
- [ ] `POST /api/auth/logout`: increment `tokenVersion` and clear the cookie
- [ ] `GET /api/auth/me`: return the current user

### User management
- [ ] `POST /api/users` (admin): validate the input (name, email, password of at least 8 characters), always set `role: "agent"`, set `createdBy`, return 409 on a duplicate email
- [ ] `GET /api/users` (admin): list users without password hashes

### Tests
- [ ] Login: success, wrong password, unknown email
- [ ] `requireAuth`: missing token, invalid token, token with an outdated `tokenVersion`
- [ ] Logout invalidates the old token
- [ ] An agent can't reach admin routes
- [ ] Create agent: success, duplicate email, invalid input
- [ ] Requests with the wrong `Origin` or a non-JSON body are rejected

## Phase 2: Authentication Frontend

**Done when:** You can log in and out in the browser. The admin can create agents from the UI, and agents can't see admin pages.

- [ ] API client wrapper: fetch with `credentials: "include"`, JSON headers, consistent error handling
- [ ] Shared types for `User` and API errors
- [ ] Auth context: call `/api/auth/me` on load, expose `user`, `login`, `logout`, and a loading state
- [ ] Set up routing (React Router)
- [ ] Login page: form, validation, error message, redirect after login
- [ ] `ProtectedRoute`: redirect to the login page if not authenticated
- [ ] `AdminRoute`: block agents from admin pages
- [ ] App layout: nav bar showing the user's name and role, a logout button, and an admin-only "Users" link
- [ ] Handle 401 responses everywhere: clear the user and send them back to the login page
- [ ] Users page (admin): list of users
- [ ] Create-agent form (admin): validation, duplicate-email error, list refreshes on success
