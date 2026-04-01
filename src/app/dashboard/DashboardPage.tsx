import { motion } from "framer-motion"
import { useMemo } from "react"
import { SummaryCards } from "@/components/cards/SummaryCards"
import { BalanceLineChart } from "@/components/charts/BalanceLineChart"
import { SpendingPieChart } from "@/components/charts/SpendingPieChart"
import {
  balanceOverTime,
  computeSummary,
  spendingByCategory,
} from "@/lib/metrics"
import { useFinanceStore } from "@/store/useStore"

export function DashboardPage() {
  const transactions = useFinanceStore((s) => s.transactions)
  const loading = useFinanceStore((s) => s.isBootstrapping)

  const summary = useMemo(
    () => computeSummary(transactions),
    [transactions],
  )
  const lineData = useMemo(
    () => balanceOverTime(transactions),
    [transactions],
  )
  const pieData = useMemo(
    () => spendingByCategory(transactions),
    [transactions],
  )

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <SummaryCards summary={summary} loading={loading} />
      <div className="grid gap-6 lg:grid-cols-2">
        <BalanceLineChart data={lineData} loading={loading} />
        <SpendingPieChart data={pieData} loading={loading} />
      </div>
    </motion.div>
  )
}
