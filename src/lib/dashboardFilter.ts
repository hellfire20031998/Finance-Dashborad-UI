import type { Transaction } from "@/lib/data"

export type DashboardRange = "7d" | "30d" | "90d" | "ytd" | "all"

export const DASHBOARD_RANGE_LABELS: Record<DashboardRange, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  ytd: "Year to date",
  all: "All time",
}

export function filterTransactionsByRange(
  transactions: Transaction[],
  range: DashboardRange,
  now = new Date(),
): Transaction[] {
  if (range === "all") return transactions
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  const endMs = end.getTime()
  let startMs: number
  if (range === "7d") startMs = endMs - 7 * 86_400_000
  else if (range === "30d") startMs = endMs - 30 * 86_400_000
  else if (range === "90d") startMs = endMs - 90 * 86_400_000
  else startMs = new Date(now.getFullYear(), 0, 1).getTime()
  return transactions.filter((t) => {
    const ts = new Date(t.date + "T12:00:00").getTime()
    return ts >= startMs && ts <= endMs
  })
}
