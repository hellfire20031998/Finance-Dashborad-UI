import type { Transaction } from "@/lib/data"

export interface Summary {
  balance: number
  totalIncome: number
  totalExpenses: number
}

export function computeSummary(transactions: Transaction[]): Summary {
  let totalIncome = 0
  let totalExpenses = 0
  for (const t of transactions) {
    if (t.type === "income") totalIncome += t.amount
    else totalExpenses += t.amount
  }
  return {
    balance: totalIncome - totalExpenses,
    totalIncome,
    totalExpenses,
  }
}

/** (Income − expenses) / income, as 0–100. Null if no income. */
export function savingsRatePercent(totalIncome: number, totalExpenses: number): number | null {
  if (totalIncome <= 0) return null
  const savings = totalIncome - totalExpenses
  return Math.round((savings / totalIncome) * 1000) / 10
}

export function netCashFlow(totalIncome: number, totalExpenses: number): number {
  return totalIncome - totalExpenses
}

export interface BalancePoint {
  date: string
  balance: number
}

/** Daily net deltas, then cumulative balance for line chart. */
export function balanceOverTime(transactions: Transaction[]): BalancePoint[] {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  )
  const dayDelta = new Map<string, number>()
  for (const t of sorted) {
    const day = t.date.slice(0, 10)
    const delta = t.type === "income" ? t.amount : -t.amount
    dayDelta.set(day, (dayDelta.get(day) ?? 0) + delta)
  }
  const days = [...dayDelta.keys()].sort()
  let running = 0
  return days.map((date) => {
    running += dayDelta.get(date) ?? 0
    return { date, balance: running }
  })
}

export interface CategorySpend {
  category: string
  value: number
}

export function spendingByCategory(transactions: Transaction[]): CategorySpend[] {
  const map = new Map<string, number>()
  for (const t of transactions) {
    if (t.type !== "expense") continue
    map.set(t.category, (map.get(t.category) ?? 0) + t.amount)
  }
  return [...map.entries()]
    .map(([category, value]) => ({ category, value }))
    .sort((a, b) => b.value - a.value)
}

export function highestSpendingCategory(
  transactions: Transaction[],
): CategorySpend | null {
  const list = spendingByCategory(transactions)
  return list[0] ?? null
}

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
}

export function expensesInMonth(
  transactions: Transaction[],
  year: number,
  monthIndex: number,
): number {
  return transactions.reduce((sum, t) => {
    if (t.type !== "expense") return sum
    const d = new Date(t.date)
    if (d.getFullYear() === year && d.getMonth() === monthIndex) {
      return sum + t.amount
    }
    return sum
  }, 0)
}

/** Compare current calendar month expenses vs previous month. */
export function monthlyExpenseComparison(transactions: Transaction[], now = new Date()) {
  const cur = now
  const prev = new Date(cur.getFullYear(), cur.getMonth() - 1, 1)
  const currentTotal = expensesInMonth(
    transactions,
    cur.getFullYear(),
    cur.getMonth(),
  )
  const previousTotal = expensesInMonth(
    transactions,
    prev.getFullYear(),
    prev.getMonth(),
  )
  const diff = currentTotal - previousTotal
  const pct =
    previousTotal === 0 ? null : Math.round((diff / previousTotal) * 100)
  return {
    currentMonthLabel: monthKey(cur),
    previousMonthLabel: monthKey(prev),
    currentTotal,
    previousTotal,
    diff,
    pct,
  }
}

/** Simple trend: last 30 days expense sum vs prior 30 days. */
export function spendingTrendMessage(transactions: Transaction[], now = new Date()) {
  const end = now.getTime()
  const day = 24 * 60 * 60 * 1000
  const recentStart = end - 30 * day
  const olderStart = end - 60 * day
  let recent = 0
  let older = 0
  for (const t of transactions) {
    if (t.type !== "expense") continue
    const ts = new Date(t.date).getTime()
    if (ts >= recentStart && ts <= end) recent += t.amount
    else if (ts >= olderStart && ts < recentStart) older += t.amount
  }
  if (older === 0 && recent === 0) {
    return "Not enough history yet to compare rolling spending windows."
  }
  if (older === 0) {
    return "Recent spending is building your first 30-day baseline."
  }
  if (recent > older) {
    return `Last 30 days spending is higher than the prior 30 days (${Math.round(((recent - older) / older) * 100)}% up).`
  }
  if (recent < older) {
    return `Last 30 days spending is lower than the prior 30 days (${Math.round(((older - recent) / older) * 100)}% down).`
  }
  return "Last 30 days spending is in line with the prior period."
}
