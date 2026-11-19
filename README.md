# AI-powered Ticket Management System

## Problem

An online coding school receives hundreds of support emails daily. Real humans have to spend hours reading them, so they can classify and respond to tickets.

## Solution

Building a ticket management system that uses AI to automatically classify, respond to and route support tickets - delivering faster responses to students and freeing up humans to deal with more complex issues.

## Features

- Receive support emails and create tickets
- Auto-generate human responses using a knowledge base
- Ticket list with filtering and sorting
- Ticket detail view
- AI-powered ticket classification
- AI-summaries
- AI-suggested replies
- User management (admin only)
- Dashboard to view and manage all tickets

## Tech Stack

- **Frontend:** React + TypeScript, Tailwind CSS
- **Backend:** Node.js + Express + TypeScript
- **Database:** MongoDB
- **Auth:** JWT
- **Validation:** Zod
- **Testing:** Vitest, Supertest, mongodb-memory-server

## Ticket Source (MVP)

Until email integration is built, tickets are loaded into the database with a seed script.

## Ticket Statuses

| Status   | Meaning                                         | Set by                        |
| -------- | ----------------------------------------------- | ----------------------------- |
| Open     | Needs attention from support                    | New ticket, or reopened       |
| Resolved | Answered; student may still follow up           | Agent                         |
| Closed   | Final and read-only                             | Agent                         |

Allowed transitions:

- Open → Resolved → Closed
- Resolved → Open (reopen if the issue wasn't actually fixed)
- Closed tickets cannot be reopened; follow-ups become a new ticket

In the MVP all status changes are manual.

## Ticket Categories

- General question
- Technical question
- Refund request

## Roles

- **Admin**: can create additional agents
- **Agent**: can view and work on all tickets (no assignment in the MVP)

## Phase 1: Authentication

### Requirements

- Admins and agents can log in with email and password, and log out.
- Admins can create agent accounts. There is no self-sign-up.
- The first admin is created by a seed script, using credentials from environment variables.
- Admins create agents only; creating other admins is out of scope.
- Because there is no email yet, the admin sets the agent's initial password and shares it with them.
- The create-agent form can generate a random initial password in the browser. Passwords are never generated or returned by the API.

### Approach

- Passwords are hashed with bcrypt and never returned by the API.
- On login, the server issues a JWT containing the user's id and current `tokenVersion`.
- The JWT is stored in an `httpOnly` cookie (`sameSite=strict`, `secure` in production), so it can't be read by browser JavaScript.
- The token expires after 1 day.
- Every protected route verifies the JWT, then loads the user from the database and rejects the request if the user no longer exists or the token's `tokenVersion` doesn't match the user's. The role is read from the database record, not from the token, so role changes apply immediately.
- Admin-only routes also check `role === "admin"`.

### Token Invalidation

- Logout increments the user's `tokenVersion` and clears the cookie. Any copy of the old token stops working, even before it expires.
- Logging out ends the user's sessions on every device. That's acceptable for the MVP.
- The same mechanism can be reused later to force-logout a deactivated user or after a password change.

### CSRF Protection

Browsers send cookies automatically, so cookie-based auth needs CSRF protection. The project uses several layers:

1. **`sameSite=strict` cookie**: the browser doesn't send the auth cookie on requests from other sites.
2. **Origin check**: middleware rejects any `POST`/`PUT`/`PATCH`/`DELETE` request whose `Origin` header isn't the frontend's origin.
3. **JSON only**: state-changing endpoints accept only `Content-Type: application/json`, which a plain HTML form on another site can't send.
4. **Strict CORS**: CORS allows credentials only from the frontend origin.
5. **No side effects on `GET`**: `GET` requests never change data.

### Local Development Setup

The MVP runs locally only. Hosting is not decided yet.

- React (Vite) dev server: `http://localhost:5173`
- Express API: `http://localhost:3000`
- The Vite dev server proxies `/api/*` to Express. The browser only talks to `localhost:5173`, so cookies are same-origin and CORS isn't needed.
- The cookie's `secure` flag is off locally because the site runs over plain HTTP. It's turned on in production via `NODE_ENV`.
- The allowed origin for the Origin check comes from an environment variable (`CLIENT_ORIGIN=http://localhost:5173`).
- MongoDB runs in Docker at `mongodb://localhost:27018` (see below).

### Running MongoDB with Docker

MongoDB is defined in `compose.yaml` and needs Docker Desktop running.

| Command                         | What it does                                                   |
| ------------------------------- | -------------------------------------------------------------- |
| `docker compose up -d`          | Start MongoDB in the background (downloads the image the first time) |
| `docker compose ps`             | Show whether it's running and healthy                          |
| `docker compose logs -f mongo`  | Follow MongoDB's logs (`Ctrl+C` to stop following)             |
| `docker compose stop`           | Stop MongoDB; data is kept                                     |
| `docker compose down`           | Stop and remove the container; data is kept in the volume      |
| `docker compose down -v`        | Remove the container **and delete all data**                   |
| `docker exec -it ticket-mongo mongosh` | Open a MongoDB shell inside the container               |

The container is exposed on port **27018**, not MongoDB's default 27017, so it doesn't clash with a locally installed MongoDB.

**Before deploying:** the frontend and API must be served from the same site, either by Express serving the React build or by a reverse proxy. If they're ever hosted on different sites, the cookie needs `sameSite=none`, and then CSRF tokens become required.

### API Endpoints

| Method | Path               | Access        | Description                         |
| ------ | ------------------ | ------------- | ----------------------------------- |
| POST   | `/api/auth/login`  | Public        | Log in, set auth cookie             |
| POST   | `/api/auth/logout` | Authenticated | Clear auth cookie                   |
| GET    | `/api/auth/me`     | Authenticated | Return the current user             |
| POST   | `/api/users`       | Admin         | Create an agent                     |
| GET    | `/api/users`       | Admin         | List users                          |

### Database Schema

**`users` collection**

| Field          | Type     | Rules                                                       |
| -------------- | -------- | ----------------------------------------------------------- |
| `_id`          | ObjectId | Auto-generated                                              |
| `name`         | String   | Required, trimmed                                           |
| `email`        | String   | Required, unique, lowercase, trimmed                        |
| `passwordHash` | String   | Required, bcrypt hash, excluded from queries by default     |
| `role`         | String   | Required, enum: `admin`, `agent`; default `agent`           |
| `tokenVersion` | Number   | Required, default `0`; incremented to invalidate all tokens |
| `createdBy`    | ObjectId | Ref `users`; `null` for the seeded admin                    |
| `createdAt`    | Date     | Auto (timestamps)                                           |
| `updatedAt`    | Date     | Auto (timestamps)                                           |

Indexes: unique index on `email`.

## Out of Scope (for now)

- Email integration (receiving and sending support emails)
- Invite emails for new agents, so they set their own password instead of the admin choosing one
- Production hosting and deployment
- Auto-reopen on student reply and auto-close of resolved tickets (depends on email integration)
- Ticket assignment and routing to specific agents
- Editing, deactivating or deleting users; password reset; creating additional admins
- Refund approval workflow (refund requests must eventually be approved by a human; in the MVP they are classified but handled like any other ticket)
