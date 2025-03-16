# gift-list

A gift list app built with Next.js and Material UI.

## Getting Started

start the database

```bash
docker-compose up -d
```

copy the env file

```bash
cp .env.example .env
```

the only thing you need to change is the `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the `.env` file. The database URL is pointing to database you just started in the docker container.

Run the DB migrations

```bash
pnpm install
pnpm exec drizzle-kit push
```

start the app

```bash
pnpm run dev
```
