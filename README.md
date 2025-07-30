# gift-list

A gift list app built with Next.js and Material UI. This project delivers a robust application designed to streamline and manage gift exchange events, ensuring fair and customized participant assignments.

Key Features Include:

- Comprehensive Participant Management:
- Full CRUD capabilities for managing participant profiles.
- Efficient listing and preference management for each participant.
- Intelligent Gift Assignment Engine:
- Ability to define and enforce exclusion rules (e.g., preventing certain participants from exchanging gifts).
- A random assignment algorithm that strictly adheres to all set rules, ensuring each participant gives and receives exactly one gift.
- Exchange History & Tracking:
- Secure storage of past exchange results.
- Quick access to the last 5 exchange outcomes for historical reference.

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
