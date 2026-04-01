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
