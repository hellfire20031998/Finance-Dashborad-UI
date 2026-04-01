import type { Transaction } from "@/lib/data"
import { balanceOverTime } from "@/lib/metrics"

function padSeries(values: number[]): number[] {
  if (values.length === 0) return [0, 0]
  if (values.length === 1) return [values[0]!, values[0]!]
  return values
}

/** Last N balance points for mini chart. */
export function balanceSparklineSeries(
  transactions: Transaction[],
  maxPoints = 24,
): number[] {
  const pts = balanceOverTime(transactions).map((p) => p.balance)
  const slice = pts.slice(-maxPoints)
  return padSeries(slice)
}

/** Cumulative income by transaction order (within filtered set). */
export function incomeSparklineSeries(transactions: Transaction[]): number[] {
  const sorted = [...transactions]
    .filter((t) => t.type === "income")
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  let run = 0
  const vals = sorted.map((t) => {
    run += t.amount
    return run
  })
  return padSeries(vals.slice(-24))
}

/** Cumulative expenses by transaction order. */
export function expenseSparklineSeries(transactions: Transaction[]): number[] {
  const sorted = [...transactions]
    .filter((t) => t.type === "expense")
    .sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    )
  let run = 0
  const vals = sorted.map((t) => {
    run += t.amount
    return run
  })
  return padSeries(vals.slice(-24))
}
