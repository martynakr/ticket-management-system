# CLAUDE.md

AI-powered support ticket management system for an online coding school. `README.md` is the spec: scope, statuses, roles, auth design, schema. `IMPLEMENTATION_PLAN.md` is the task list for the current scope.

## Working agreements

- **Stick to the current scope.** Only authentication is planned right now (Phases 0–2 in `IMPLEMENTATION_PLAN.md`). Don't build tickets, AI features, or email integration unless asked.
- **Tick off tasks** in `IMPLEMENTATION_PLAN.md` (`- [x]`) when they're done and verified.
- **Keep `README.md` in sync** when a decision changes the spec.
- **Don't run `git add`, `git commit`, or `git push`.** The user does that. Suggest a commit point in text instead.
- **The user is learning** (especially Docker). Explain new concepts and why choices were made, briefly, in the chat reply, not in code comments.
- **Keep code comments sparse.** Only comment what the code can't say itself: a non-obvious reason, a security or timing concern, a gotcha. No comments that restate the code, describe a layer's role, or explain basic library usage.

## Structure

```
client/        React 19 + TypeScript + Vite 8 + Tailwind v4
server/        Express 5 + TypeScript + Mongoose 9
compose.yaml   MongoDB 8.0 in Docker
```

Separate npm packages with no root `package.json`. Run npm commands inside `client/` or `server/`. The user prefers running the client and server in separate terminals, so don't add a combined root script.

## Commands

```bash
docker compose up -d          # start MongoDB (from repo root)
cd server && npm run dev      # API on http://localhost:3000 (tsx watch)
cd client && npm run dev      # client on http://localhost:5173
npm run typecheck             # server only; client uses `npm run build` (tsc -b)
npm run lint                  # Oxlint, in either package
```

Check a change with `npm test && npm run typecheck && npm run lint` in `server/`, and `npm test && npm run build && npm run lint` in `client/`.

Only test endpoints (through Supertest), not models or helpers directly. Tests use Vitest with `globals: true`, so don't import `describe`/`it`/`expect`. Server tests live in `server/tests/` (not next to the code, since each one exercises a whole endpoint) and use Supertest against `app` and an in-memory MongoDB via `tests/helpers/database.ts`, never the Docker database. Client tests stay next to their components.

## Server conventions

- **Layers:** `routes/` → `controllers/` (HTTP only) → `services/` (business rules) → `repositories/` (the only code that queries Mongoose models).
- **Validate input with Zod:** define schemas in `src/schemas/`, add `validateBody(schema)` from `src/validation/validate.ts` to the route, and type the controller's request as `ValidatedRequest<Input>`. Invalid input becomes a 400 with `{ error, fields }`.
- **Errors:** throw `HttpError(status, message)` from any layer; `middleware/error-handler.ts` turns it into JSON.

## Client conventions

- **Reusable UI** lives in `src/components/ui/` (`Input`, `Button`, `Alert`). Build new forms from these instead of styling raw elements.
- **Combine class names with `cn()`** from `src/lib/cn.ts` (tailwind-merge), with `className` last so callers can override defaults.
- **One folder per component and page** (`components/`, `pages/`): `Button/Button.tsx`, its test `Button/Button.test.tsx`, and `Button/index.ts` re-exporting it, so imports stay `components/ui/Button`.
- **Forms:** React Hook Form + a Zod schema via `zodResolver`, with `noValidate` on the `<form>`. On a 400, call `applyFieldErrors(setError, error.fields)` from `src/lib/form.ts`; show other errors with `setError('root', …)` in an `Alert`.
- **API calls** go through `api.get/post` in `src/lib/api.ts`, which throws `ApiError` (`status`, `message`, `fields`).
- **Server data goes through React Query**, not `useEffect` + `useState`. Wrap each endpoint in a hook (`useQuery` for reads, `useMutation` for writes) that calls `api.*`; mutations update or invalidate the affected queries.
- **Auth state** comes from `useCurrentUser()`, `useLogin()` and `useLogout()` in `src/auth/hooks.ts`. The current user lives in the query cache under `['auth', 'me']`, so there's no auth context.
- **Tests** render with `renderApp(path)` from `src/test/render.tsx` (fresh `QueryClient` per test) and stub `fetch` with `mockFetch` from `src/test/fetch.ts`.

## Gotchas

- **MongoDB is on port 27018, not 27017.** A Homebrew MongoDB also runs on this machine on 27017. Connecting to 27017 silently hits the wrong database.
- **The client must run on port 5173.** `vite.config.ts` sets `strictPort: true`, so Vite exits with "Port 5173 is already in use" if another local Vite project has it, instead of moving to 5174. Auth relies on `CLIENT_ORIGIN=http://localhost:5173` for the Origin check. Stop the other project; don't change the port.
- **The client calls the API with relative `/api/...` URLs.** The Vite dev server proxies them to `localhost:3000`, so there's no CORS setup and no API base URL in the client.
- **ES modules everywhere.** Relative imports in `server/` must end in `.js` (`import app from './app.js'`), even though the files are `.ts`.
- **Env loading uses Node's `--env-file-if-exists=.env`** in the `server/package.json` scripts. There's no `dotenv`. `tsx watch` doesn't restart when `.env` changes, so restart it by hand.
- **`server/src/app.ts` builds the app and `index.ts` starts it.** Keep them separate so Supertest can import `app` without opening a port.
- **Express 5** passes errors from async route handlers to the error handler automatically, so no `express-async-errors` or try/catch wrappers are needed.
- **Tailwind v4** is configured through `@tailwindcss/vite` and `@import "tailwindcss";` in `client/src/index.css`. There's no `tailwind.config.js`.
- **Oxlint, not ESLint**, in both packages.
- **TypeScript 7** in both packages.
