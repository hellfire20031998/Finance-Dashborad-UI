# Finance Dashboard

Frontend-only finance UI: summaries, Recharts, transactions workspace, insights. **Data:** `localStorage` (mock seed in `src/lib/data.ts`), simulated delay in `src/lib/api.ts`. **Stack:** React 19, TypeScript, Vite, Tailwind v4, shadcn/ui, React Router, Zustand, Framer Motion, Sonner.

## Setup

```bash
npm install && npm run dev   # http://localhost:5173
npm run build                # tsc + Vite → dist/
npm run lint
npm run preview              # optional: serve dist/
```

No `.env` required.

## RBAC (demo only)

**Viewer / Admin** in the top bar → `finance-dashboard-role` in `localStorage`. Controls add/edit on Transactions only; **not** authentication or server enforcement.

## Layout

`src/app/` pages · `src/components/` UI · `src/lib/` metrics, filters, CSV, API shim · `src/store/` finance + persisted UI (sidebar, range, table prefs, accent) · `src/hooks/`

## Features

- **Dashboard:** date range, summary + sparklines, savings / cash flow, balance line, category pie + horizontal bars, empty state.
- **Transactions:** category search, type filter, sort, pagination, column toggles, density, CSV (filtered). Admin: add + edit (row / Enter / double-click). Viewer: read-only.
- **Insights:** top expense category, month vs month, rolling 30-day trend.
- **Shell:** responsive sidebar / mobile drawer, breadcrumbs, theme + accents, toasts.

## Deploy

Static SPA. `vercel.json` rewrites to `index.html`. Build output: **`dist/`**.

**Repo:** [Finance-Dashborad-UI](https://github.com/hellfire20031998/Finance-Dashborad-UI)
