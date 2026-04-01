import { motion } from "framer-motion"
import { useMemo } from "react"
import { TrendingDown, TrendingUp, PieChart as PieIcon, CalendarDays } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryColor } from "@/lib/data"
import {
  highestSpendingCategory,
  monthlyExpenseComparison,
  spendingTrendMessage,
} from "@/lib/metrics"
import { useFinanceStore } from "@/store/useStore"

const formatMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)

export function InsightsPage() {
  const transactions = useFinanceStore((s) => s.transactions)
  const loading = useFinanceStore((s) => s.isBootstrapping)

  const top = useMemo(
    () => highestSpendingCategory(transactions),
    [transactions],
  )
  const monthly = useMemo(
    () => monthlyExpenseComparison(transactions),
    [transactions],
  )
  const trend = useMemo(
    () => spendingTrendMessage(transactions),
    [transactions],
  )

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      className="grid gap-4 md:grid-cols-2"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <div
            className="mt-0.5 flex size-9 items-center justify-center rounded-lg"
            style={{
              backgroundColor: top
                ? `${getCategoryColor(top.category)}22`
                : "var(--muted)",
            }}
          >
            <PieIcon
              className="size-5"
              style={{ color: top ? getCategoryColor(top.category) : undefined }}
            />
          </div>
          <div>
            <CardTitle>Highest spending category</CardTitle>
            <CardDescription>Based on total expenses in your data.</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          {top ? (
            <>
              <p className="text-2xl font-semibold tracking-tight">
                {top.category}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatMoney(top.value)} total expenses
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No expense data yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-start gap-3 space-y-0">
          <div className="mt-0.5 flex size-9 items-center justify-center rounded-lg bg-muted">
            <CalendarDays className="size-5 text-muted-foreground" />
          </div>
          <div>
            <CardTitle>Monthly comparison</CardTitle>
            <CardDescription>
              {monthly.currentMonthLabel} vs {monthly.previousMonthLabel}{" "}
              (expenses)
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-2xl font-semibold tabular-nums">
              {formatMoney(monthly.currentTotal)}
            </span>
            <span className="text-sm text-muted-foreground">this month</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>Previous: {formatMoney(monthly.previousTotal)}</span>
            {monthly.pct !== null && (
              <span
                className={
                  monthly.diff > 0
                    ? "text-rose-600 dark:text-rose-400"
                    : monthly.diff < 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : ""
                }
              >
                {monthly.diff > 0 ? "+" : ""}
                {monthly.pct}% vs last month
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 pt-1 text-sm font-medium">
            {monthly.diff > 0 ? (
              <>
                <TrendingUp className="size-4 text-rose-500" />
                Spending is up from last month.
              </>
            ) : monthly.diff < 0 ? (
              <>
                <TrendingDown className="size-4 text-emerald-500" />
                Spending is down from last month.
              </>
            ) : (
              <span className="text-muted-foreground">
                Flat vs last month.
              </span>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Spending trend</CardTitle>
          <CardDescription>Rolling 30-day window vs the prior 30 days.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-foreground/90">{trend}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
