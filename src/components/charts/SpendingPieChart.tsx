import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { CategorySpend } from "@/lib/metrics"
import { getCategoryColor } from "@/lib/data"
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

export function SpendingPieChartSkeleton() {
  return <Skeleton className="mx-auto h-[280px] w-[280px] rounded-full" />
}

/** Pie + legend only (no card). Assumes `data.length > 0`. */
export function SpendingPieChartBody({ data }: Props) {
  return (
    <div className="space-y-2">
      <div className="h-[280px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={56}
              outerRadius={96}
              paddingAngle={2}
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={getCategoryColor(entry.category)}
                  stroke="transparent"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                formatMoney(Number(value)),
                String(name),
              ]}
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--popover)",
                color: "var(--popover-foreground)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {data.map((d) => (
          <li key={d.category} className="flex items-center gap-1.5">
            <span
              className="size-2 rounded-full"
              style={{ backgroundColor: getCategoryColor(d.category) }}
            />
            {d.category}
          </li>
        ))}
      </ul>
    </div>
  )
}
