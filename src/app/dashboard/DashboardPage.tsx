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
    <div className="space-y-3">
      {/* Win2K-style page header bar */}
      <div
        className="win-raised flex items-center gap-2 px-3 py-1.5"
        style={{ borderLeft: "4px solid #316ac5" }}
      >
        <span className="text-[11px] font-bold text-foreground">Dashboard</span>
        <span className="text-[10px] text-muted-foreground">— Financial Overview</span>
      </div>

      <SummaryCards summary={summary} loading={loading} />

      <div className="grid gap-3 lg:grid-cols-2">
        <BalanceLineChart data={lineData} loading={loading} />
        <SpendingPieChart data={pieData} loading={loading} />
      </div>
    </div>
  )
}
