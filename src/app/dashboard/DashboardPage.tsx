import { motion } from "framer-motion"
import { useMemo } from "react"
import { SummaryCards } from "@/components/cards/SummaryCards"
import { BalanceLineChart } from "@/components/charts/BalanceLineChart"
import { SpendingPieChart } from "@/components/charts/SpendingPieChart"
import { DateRangeChips } from "@/components/dashboard/DateRangeChips"
import { DashboardEmptyState } from "@/components/dashboard/DashboardEmptyState"
import { filterTransactionsByRange } from "@/lib/dashboardFilter"
import {
  balanceOverTime,
  computeSummary,
  spendingByCategory,
} from "@/lib/metrics"
import {
  balanceSparklineSeries,
  expenseSparklineSeries,
  incomeSparklineSeries,
} from "@/lib/sparklineData"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { useFinanceStore } from "@/store/useStore"
import { useUIStore } from "@/store/useUIStore"

export function DashboardPage() {
  const transactions = useFinanceStore((s) => s.transactions)
  const role = useFinanceStore((s) => s.role)
  const loading = useFinanceStore((s) => s.isBootstrapping)
  const range = useUIStore((s) => s.dashboardRange)
  const reducedMotion = useReducedMotion()

  const filtered = useMemo(
    () => filterTransactionsByRange(transactions, range),
    [transactions, range],
  )

  const summary = useMemo(() => computeSummary(filtered), [filtered])
  const lineData = useMemo(() => balanceOverTime(filtered), [filtered])
  const pieData = useMemo(
    () => spendingByCategory(filtered),
    [filtered],
  )

  const sparkBalance = useMemo(
    () => balanceSparklineSeries(filtered),
    [filtered],
  )
  const sparkIncome = useMemo(
    () => incomeSparklineSeries(filtered),
    [filtered],
  )
  const sparkExpense = useMemo(
    () => expenseSparklineSeries(filtered),
    [filtered],
  )

  const showEmpty = !loading && transactions.length === 0

  return (
    <motion.div
      className="space-y-6"
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
    >
      <DateRangeChips />
      {showEmpty ? (
        <DashboardEmptyState role={role} />
      ) : (
        <>
          <SummaryCards
            summary={summary}
            sparkBalance={sparkBalance}
            sparkIncome={sparkIncome}
            sparkExpense={sparkExpense}
            loading={loading}
            reducedMotion={reducedMotion}
          />
          <div className="grid min-w-0 gap-6 lg:grid-cols-2 *:min-w-0">
            <BalanceLineChart data={lineData} loading={loading} />
            <SpendingPieChart data={pieData} loading={loading} />
          </div>
        </>
      )}
    </motion.div>
  )
}
