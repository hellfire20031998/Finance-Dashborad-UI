# Finance Dashboard

A single-page finance dashboard for viewing income and expenses: summaries, charts, a transactions workspace, and lightweight insights. Built as a **frontend-only** demo with **local persistence** (no backend API).

## Stack

- **React 19** + **TypeScript**
- **Vite** (build + dev server)
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives)
- **React Router** (client-side routes)
- **Zustand** (state)
- **Recharts** (charts)
- **Framer Motion** (subtle page motion, respects reduced motion)
- **Sonner** (toasts)

## Prerequisites

- Node.js 18+ (or 20+ recommended)
- npm

## Setup & scripts

```bash
npm install
npm run dev      # http://localhost:5173 (default Vite port)
npm run build    # TypeScript check + production bundle → dist/
npm run preview  # Serve dist/ locally
npm run lint     # ESLint
```

No `.env` file is required: there are no API keys or remote services.

## How data works

1. On first load, the app reads **`localStorage`** key `finance-dashboard-transactions`.
2. If nothing is stored, it **seeds** from mock data in `src/lib/data.ts` and saves it.
3. `fetchTransactions` / `syncPersist` in `src/lib/api.ts` **simulate network delay** (milliseconds) before resolving; all reads and writes still go through **localStorage**.

Transactions are plain objects: `id`, `date`, `amount`, `category`, `type` (`income` | `expense`).

## Roles (RBAC) — important

- **Viewer** and **Admin** are selected in the top bar and stored under **`finance-dashboard-role`** in `localStorage`.
- This is **UI-level behavior only**: hide add/edit on transactions for viewers, show them for admins. There is **no authentication**, **no server**, and **no enforcement** against someone changing role or storage in the browser.
- Suitable for demonstrating role-based **layouts and actions** in a portfolio or assignment; not a security model for production.

## Project structure

| Path | Purpose |
|------|--------|
| `src/app/` | Route-level pages (`dashboard`, `transactions`, `insights`) |
| `src/components/` | Layout, cards, charts, table, dashboard widgets, UI primitives |
| `src/lib/` | Metrics, filters, CSV export, mock data, simulated API |
| `src/store/` | `useFinanceStore` (transactions, role, table filters/sort), `useUIStore` (persisted UI: sidebar, date range, table options, accent) |
| `src/hooks/` | e.g. `useReducedMotion` |

## Features by area

### Dashboard (`/dashboard`)

- Date range chips (filters charts and summary metrics).
- Summary cards with sparklines, savings rate and net cash flow (with prior-period comparison when range allows).
- Balance over time (line chart), spending by category (pie), horizontal category bar section.
- Empty state when there are no transactions (copy differs slightly for admin vs viewer).

### Transactions (`/transactions`)

- Search (by **category** substring), filter by type, sort by date or amount.
- Pagination with configurable page size (persisted).
- Optional columns (category, type), comfortable/compact density.
- CSV export of the **current filtered** list.
- **Admin:** add transaction dialog; edit via row control, **Enter** on focused row, or double-click.
- **Viewer:** read-only table (no add/edit).

### Insights (`/insights`)

- Highest spending category (expenses).
- Current calendar month vs previous month (expenses), with tone and trend hints.
- Rolling 30-day vs prior 30-day expense message (handles little or no history).

### Global UX

- Sidebar navigation (collapsible on desktop); slide-out menu on small screens.
- Breadcrumbs; filter state reflected in crumbs on Transactions.
- Light / dark theme and accent presets (default, emerald, blue).
- Toasts for actions like mobile “reload from storage” (`MobileRefreshHint`).

## Deployment (e.g. Vercel)

This is a static SPA. `vercel.json` rewrites all routes to `index.html` so refreshes on `/transactions` or `/insights` do not 404.

```bash
npm run build
# Deploy the `dist/` output (or connect the repo and set build command to npm run build, output dist)
```

## Repository

[Finance-Dashborad-UI](https://github.com/hellfire20031998/Finance-Dashborad-UI) on GitHub.
