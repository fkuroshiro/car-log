# Car Log

A minimal app for keeping track of your cars and their maintenance history. Add your cars to a garage, log every service with the date and odometer reading, and see the full maintenance timeline of each car at a glance.

> **Status:** early development — building in public, one feature at a time.

## Features (planned)

- [x] Project scaffold (Expo + TypeScript + Expo Router)
- [x] Light / dark theme (off-white & dark-grey palettes, warm amber accent)
- [ ] Accounts (Supabase Auth)
- [ ] Garage: add, edit and remove cars
- [ ] Service log: maintenance records with date, odometer (km), category, notes and cost
- [ ] Per-car maintenance timeline
- [ ] Web deployment
- [ ] Native iOS / Android builds

### Someday

Service reminders by km or date interval, fuel log, photo attachments, CSV export.

## Tech stack

| Concern  | Choice                                     |
| -------- | ------------------------------------------ |
| App      | [Expo](https://expo.dev) (React Native + React Native Web), TypeScript |
| Routing  | [Expo Router](https://docs.expo.dev/router/introduction/) — file-based, URL-friendly on web |
| Backend  | [Supabase](https://supabase.com) — Postgres, Auth, Row Level Security |
| Schema   | SQL migrations via the Supabase CLI (`supabase/migrations/`) |

The app is developed **web-first** from a single codebase; the same code will later ship as native mobile apps.

## Getting started

With Docker (recommended — this is how the project is run in development):

```bash
docker compose up -d --build
```

The dev server listens on port `8081`. The source directory is bind-mounted
into the container, so edits reload live without rebuilding the image.

Or directly with Node:

```bash
npm install
npm run web        # start the dev server for web
```

Backend configuration lives in a local `.env` file — copy `.env.example` and fill it in. `.env` is never committed.

## Project structure

```
src/
  app/          # screens (file-based routes)
  components/   # reusable UI components
  constants/    # theme tokens, config
  hooks/        # shared hooks
supabase/
  migrations/   # versioned SQL schema
```

## License

[MIT](LICENSE)
