import { motion } from "framer-motion"
import { ArrowRightLeft, Percent, TrendingDown, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CountUpCurrency } from "@/components/cards/CountUpCurrency"
import { cn } from "@/lib/utils"
import type { DashboardRange } from "@/lib/dashboardFilter"

const formatSignedMoney = (n: number) => {
  const abs = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Math.abs(n))
  if (n > 0) return `+${abs}`
  if (n < 0) return `−${abs}`
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(0)
}

type Props = {
  range: DashboardRange
  savingsRatePct: number | null
  savingsRatePrevPct: number | null
  /** Delta vs prior period (percentage points); null when not comparable. */
  savingsDeltaPctPoints: number | null
  canComparePeriod: boolean
  netCashFlow: number
  loading?: boolean
  reducedMotion?: boolean
}

export function SavingsAndFlowCards({
  range,
  savingsRatePct,
  savingsRatePrevPct,
  savingsDeltaPctPoints,
  canComparePeriod,
  netCashFlow,
  loading,
  reducedMotion,
}: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-24" />
              <Skeleton className="mt-2 h-4 w-40" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const showDeltaRow =
    canComparePeriod &&
    savingsRatePct !== null &&
    savingsRatePrevPct !== null &&
    savingsDeltaPctPoints !== null

  const deltaPositive =
    savingsDeltaPctPoints !== null && savingsDeltaPctPoints > 0
  const deltaNegative =
    savingsDeltaPctPoints !== null && savingsDeltaPctPoints < 0

  const cards = [
    {
      key: "savings",
      title: "Savings rate",
      icon: Percent,
      main: (
        <span className="tabular-nums">
          {savingsRatePct !== null ? (
            <>
              {Math.round(savingsRatePct)}
              <span className="text-xl font-semibold">%</span>
            </>
          ) : (
            "—"
          )}
        </span>
      ),
      mainClass: "text-2xl font-semibold tracking-tight text-foreground",
      footer: !canComparePeriod ? (
        <p className="text-sm text-muted-foreground">
          Prior-period comparison is available when a date range is selected.
        </p>
      ) : savingsRatePct === null ? (
        <p className="text-sm text-muted-foreground">
          Add income in this period to calculate savings rate.
        </p>
      ) : showDeltaRow ? (
        <p
          className={cn(
            "flex flex-wrap items-center gap-1 text-sm font-medium",
            deltaPositive && "text-emerald-600 dark:text-emerald-400",
            deltaNegative && "text-rose-600 dark:text-rose-400",
            !deltaPositive && !deltaNegative && "text-muted-foreground",
          )}
        >
          {deltaPositive && <TrendingUp className="size-4 shrink-0" />}
          {deltaNegative && <TrendingDown className="size-4 shrink-0" />}
          {deltaPositive && <span aria-hidden>↑</span>}
          {deltaNegative && <span aria-hidden>↓</span>}
          <span>
            {savingsDeltaPctPoints !== null && savingsDeltaPctPoints > 0 ? "+" : ""}
            {savingsDeltaPctPoints}% vs last period
          </span>
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Not enough data in the prior period to compare.
        </p>
      ),
    },
    {
      key: "flow",
      title: "Net cash flow",
      icon: ArrowRightLeft,
      main: (
        <CountUpCurrency
          value={netCashFlow}
          format={formatSignedMoney}
          skipAnimation={reducedMotion}
        />
      ),
      mainClass: cn(
        "text-2xl font-semibold tracking-tight tabular-nums",
        netCashFlow >= 0
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-rose-600 dark:text-rose-400",
      ),
      footer: (
        <p className="text-sm text-muted-foreground">
          Income minus expenses
          {range !== "all" ? ` · ${range === "ytd" ? "year to date" : "selected range"}` : ""}
          .
        </p>
      ),
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {cards.map((item, i) => (
        <motion.div
          key={item.key}
          initial={reducedMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            reducedMotion
              ? { duration: 0 }
              : { delay: 0.15 + i * 0.05, duration: 0.25 }
          }
        >
          <Card className="overflow-hidden border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-2">
              <p className={item.mainClass}>{item.main}</p>
              {item.footer}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
