# Bashaar AI CRM

Premium AI-powered CRM frontend. Mock data lives in `lib/data.ts`. Imported CSV leads land in `lib/generated-data.ts`.

## Stack

Next.js (App Router) + TypeScript + React. Styles are in `app/globals.css` (no Tailwind). Charts use Recharts. Kanban drag-and-drop uses `@dnd-kit`.

## Run

```bash
npm install
npm run dev
```

Production:

```bash
npm run build
npm start
```

## Swap the backend

All data access goes through `lib/api.ts`. Every function already returns a `Promise`. Replace the in-memory implementations with `fetch()` (or your SDK) and keep the same signatures. UI hooks in `lib/hooks/` do not need to change.

## Import leads

```bash
cp incoming/leads-template.csv incoming/leads.csv
# edit incoming/leads.csv
npm run import-leads
```

See `incoming/README.md` for columns.

## Demo login

Any active team email with password `demo`. Default session is Sarah Malik (`sarah@bashar.ai`).
