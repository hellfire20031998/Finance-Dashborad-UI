import { getCategoryColor } from "@/lib/data"
import type { CategorySpend } from "@/lib/metrics"

type Props = {
  data: CategorySpend[]
}

const formatMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)

export function CategorySpendBars({ data }: Props) {
  if (data.length === 0) return null
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="mt-4 space-y-3 border-t border-border pt-4">
      <p className="text-xs font-medium text-muted-foreground">
        Spending by category (bars)
      </p>
      <ul className="space-y-2.5">
        {data.slice(0, 8).map((row) => {
          const pct = (row.value / max) * 100
          const color = getCategoryColor(row.category)
          return (
            <li key={row.category} className="space-y-1">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="flex items-center gap-1.5 truncate font-medium">
                  <span
                    className="size-2 shrink-0 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  {row.category}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {formatMoney(row.value)}
                </span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
