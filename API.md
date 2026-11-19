# API endpoints

Base URL: `http://localhost:3000` (the client reaches it through the Vite proxy at `/api/...`).

Authentication uses an httpOnly cookie named `token`, set by `POST /api/auth/login` and valid for 1 day.

| Method | Path | Auth | Description |
| ------ | ---- | ---- | ----------- |
| GET | `/api/health` | — | Server and database status |
| POST | `/api/auth/login` | — | Log in and set the auth cookie |
| POST | `/api/auth/logout` | User | Log out on all devices and clear the cookie |
| GET | `/api/auth/me` | User | Get the current user |
| POST | `/api/users` | Admin | Create an agent |
| GET | `/api/protected` | User | Temporary route for trying out `requireAuth` |

## Errors

All errors are JSON:

```json
{ "error": "Message", "fields": { "email": "Enter a valid email" } }
```

`fields` is only present on validation errors (400).

| Status | When |
| ------ | ---- |
| 400 | Invalid input or malformed JSON |
| 401 | Missing, invalid, or revoked token (`Not authenticated`) |
| 403 | Logged in but not an admin (`Admin access required`) |
| 404 | Unknown route (`Route not found: GET /api/...`) |
| 500 | Unexpected server error |

A user object always looks like this:

```json
{ "id": "…", "name": "Jane Doe", "email": "jane@example.com", "role": "admin" }
```

`role` is `admin` or `agent`.

---

## `GET /api/health`

**200** when the database is connected, **503** when it isn't.

```json
{ "status": "ok", "database": "connected", "uptime": 12.34 }
```

`status` is `ok` or `degraded`; `database` is `connected` or `disconnected`.

## `POST /api/auth/login`

```json
{ "email": "admin@example.com", "password": "secret123" }
```

The email is trimmed and lowercased before lookup.

- **200** `{ "user": User }` and sets the `token` cookie
- **400** missing or invalid email/password
- **401** `Invalid email or password`

## `POST /api/auth/logout`

Requires the cookie. Revokes every token issued to this user so far (all devices).

- **204** no body, clears the cookie
- **401** not authenticated

## `GET /api/auth/me`

Requires the cookie.

- **200** `{ "user": User }`
- **401** not authenticated

## `POST /api/users`

Requires the cookie and the `admin` role. Always creates an `agent`; admins can't be created through the API.

```json
{ "name": "Jane Doe", "email": "jane@example.com", "password": "secret123" }
```

| Field | Rules |
| ----- | ----- |
| `name` | Required, trimmed, 1–100 characters |
| `email` | Required, valid email, trimmed and lowercased |
| `password` | Required, 8–72 characters |

- **201** `{ "user": User }`
- **400** validation errors in `fields`
- **401** not authenticated
- **403** not an admin
- **409** `A user with this email already exists`

## `GET /api/protected`

Temporary. Requires the cookie.

- **200** `{ "message": "You see this because you are logged in, <name>" }`
- **401** not authenticated
