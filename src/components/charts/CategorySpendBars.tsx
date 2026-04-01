import { getCategoryColor } from "@/lib/data"
import type { CategorySpend } from "@/lib/metrics"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  data: CategorySpend[]
}

const formatMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)

/** Bar list only (no card chrome). */
export function CategorySpendBars({ data }: Props) {
  if (data.length === 0) return null
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <ul className="space-y-3">
      {data.slice(0, 12).map((row) => {
        const pct = (row.value / max) * 100
        const color = getCategoryColor(row.category)
        return (
          <li
            key={row.category}
            className="flex min-w-0 items-center gap-3 sm:gap-4"
          >
            <span className="flex min-w-0 max-w-[42%] shrink-0 items-center gap-2 text-sm font-medium sm:max-w-[11rem]">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="truncate">{row.category}</span>
            </span>
            <div className="h-2 min-w-0 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${pct}%`, backgroundColor: color }}
              />
            </div>
            <span className="w-[4.5rem] shrink-0 text-right text-sm tabular-nums text-muted-foreground sm:w-24">
              {formatMoney(row.value)}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

type SectionProps = {
  data: CategorySpend[]
  loading?: boolean
}

/** Full-width dashboard section with horizontal bars per row. */
export function CategorySpendBarsSection({ data, loading }: SectionProps) {
  if (loading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-72 max-w-full" />
        </CardHeader>
        <CardContent className="space-y-3">
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
        </CardContent>
      </Card>
    )
  }

  if (data.length === 0) return null

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Spending by category (bars)</CardTitle>
        <CardDescription>
          Expense totals per category in the selected range.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CategorySpendBars data={data} />
      </CardContent>
    </Card>
  )
}
