# picklecebu API

Hono + Bun backend for picklecebu.com.

## Prerequisites

- [Bun](https://bun.sh) (runtime + package manager)

## Install

```sh
bun install
```

## Environment

Create `.env` in `apps/api/`:

| Var                       | Notes                                         |
| ------------------------- | --------------------------------------------- |
| `JWT_SECRET`              | min 32 chars                                  |
| `PAYMONGO_SECRET_KEY`     | PayMongo secret key                           |
| `PAYMONGO_PUBLIC_KEY`     | PayMongo public key                           |
| `PAYMONGO_WEBHOOK_SECRET` | PayMongo webhook secret                       |
| `RESEND_API_KEY`          | Resend API key                                |
| `RESEND_FROM_EMAIL`       | sender email address                          |
| `ADMIN_EMAIL`             | admin login email                             |
| `ADMIN_PASSWORD_HASH`     | bcrypt hash of admin password                 |
| `DATABASE_URL`            | optional, defaults to `./picklecebu.sqlite`   |
| `WEB_URL`                 | optional, defaults to `http://localhost:3000` |
| `PORT`                    | optional, defaults to `4000`                  |

Generate `ADMIN_PASSWORD_HASH`:

```sh
bun -e "import {hash} from 'bcryptjs'; console.log(await hash('yourpassword', 12))"
```

## Database

Migrations run automatically on `bun run dev`.

Optional seed for local dev:

```sh
bun run src/db/seed.ts
```

Seed creates: 2 courts, 1 owner (`owner@test.com` / `password123`).

## Dev server

```sh
bun run dev
```

Runs on `http://localhost:4000` with hot reload.

## Routes

- `GET /health`
- `/api/courts`
- `/api/bookings`
- `/api/auth`
- `/api/dashboard`
- `/api/admin`
- `/api/webhooks` — PayMongo

## Other scripts

- `bun run typecheck` — type check
- `bun run check` — lint
- `bun run fix` — lint + format fix
