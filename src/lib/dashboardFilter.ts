import type { Transaction } from "@/lib/data"

export type DashboardRange = "7d" | "30d" | "90d" | "ytd" | "all"

export const DASHBOARD_RANGE_LABELS: Record<DashboardRange, string> = {
  "7d": "7 days",
  "30d": "30 days",
  "90d": "90 days",
  ytd: "Year to date",
  all: "All time",
}

/** Inclusive transaction timestamp filter (date at noon). */
function txTime(t: Transaction) {
  return new Date(t.date + "T12:00:00").getTime()
}

export function getDashboardRangeBounds(
  range: DashboardRange,
  now = new Date(),
): { startMs: number; endMs: number } | null {
  if (range === "all") return null
  const end = new Date(now)
  end.setHours(23, 59, 59, 999)
  const endMs = end.getTime()
  let startMs: number
  if (range === "7d") startMs = endMs - 7 * 86_400_000
  else if (range === "30d") startMs = endMs - 30 * 86_400_000
  else if (range === "90d") startMs = endMs - 90 * 86_400_000
  else startMs = new Date(now.getFullYear(), 0, 1).setHours(0, 0, 0, 0)
  return { startMs, endMs }
}

export function filterTransactionsByRange(
  transactions: Transaction[],
  range: DashboardRange,
  now = new Date(),
): Transaction[] {
  if (range === "all") return transactions
  const b = getDashboardRangeBounds(range, now)
  if (!b) return transactions
  const { startMs, endMs } = b
  return transactions.filter((t) => {
    const ts = txTime(t)
    return ts >= startMs && ts <= endMs
  })
}

/** Same-length window immediately before the current dashboard range (for comparisons). */
export function filterTransactionsByPreviousRange(
  transactions: Transaction[],
  range: DashboardRange,
  now = new Date(),
): Transaction[] {
  if (range === "all") return []

  if (range === "ytd") {
    const y = now.getFullYear()
    const startPrev = new Date(y - 1, 0, 1)
    startPrev.setHours(0, 0, 0, 0)
    const endPrev = new Date(y - 1, now.getMonth(), now.getDate())
    endPrev.setHours(23, 59, 59, 999)
    const a = startPrev.getTime()
    const b = endPrev.getTime()
    return transactions.filter((t) => {
      const ts = txTime(t)
      return ts >= a && ts <= b
    })
  }

  const cur = getDashboardRangeBounds(range, now)
  if (!cur) return []
  const { startMs, endMs } = cur
  const duration = endMs - startMs
  const prevEndMs = startMs - 1
  const prevStartMs = startMs - duration
  return transactions.filter((t) => {
    const ts = txTime(t)
    return ts >= prevStartMs && ts <= prevEndMs
  })
}
