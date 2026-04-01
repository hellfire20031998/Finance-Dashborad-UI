import { useState } from "react"
import type { CategorySpend } from "@/lib/metrics"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CategorySpendBars } from "@/components/charts/CategorySpendBars"
import {
  SpendingPieChartBody,
  SpendingPieChartSkeleton,
} from "@/components/charts/SpendingPieChart"
import { cn } from "@/lib/utils"

type View = "pie" | "bars"

type Props = {
  data: CategorySpend[]
  loading?: boolean
}

function BarsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="flex min-w-0 items-center gap-3 sm:gap-4"
        >
          <Skeleton className="h-4 w-28 shrink-0 sm:w-36" />
          <Skeleton className="h-2 min-w-0 flex-1" />
          <Skeleton className="h-4 w-16 shrink-0 sm:w-24" />
        </div>
      ))}
    </div>
  )
}

function EmptyChartMessage() {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-sm text-muted-foreground">
      No expenses to chart
    </div>
  )
}

export function SpendingByCategoryPanel({ data, loading }: Props) {
  const [view, setView] = useState<View>("pie")

  const description =
    view === "pie"
      ? "Share of total expenses per category."
      : "Expense totals per category in the selected range."

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-1">
            <CardTitle>Spending by category</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div
            className="flex shrink-0 rounded-lg border border-border bg-muted/40 p-0.5"
            role="group"
            aria-label="Chart type"
          >
            <Button
              type="button"
              variant={view === "pie" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-8 rounded-md px-3 text-xs sm:text-sm",
                view === "pie" && "shadow-sm",
              )}
              aria-pressed={view === "pie"}
              onClick={() => setView("pie")}
            >
              Pie
            </Button>
            <Button
              type="button"
              variant={view === "bars" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-8 rounded-md px-3 text-xs sm:text-sm",
                view === "bars" && "shadow-sm",
              )}
              aria-pressed={view === "bars"}
              onClick={() => setView("bars")}
            >
              Bars
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          view === "pie" ? (
            <SpendingPieChartSkeleton />
          ) : (
            <BarsSkeleton />
          )
        ) : data.length === 0 ? (
          <EmptyChartMessage />
        ) : view === "pie" ? (
          <SpendingPieChartBody data={data} />
        ) : (
          <CategorySpendBars data={data} />
        )}
      </CardContent>
    </Card>
  )
}
