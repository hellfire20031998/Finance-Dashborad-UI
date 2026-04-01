import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import type { BalancePoint } from "@/lib/metrics"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

type Props = {
  data: BalancePoint[]
  loading?: boolean
}

function formatShortDate(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" })
}

const formatMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)

export function BalanceLineChart({ data, loading }: Props) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[280px] w-full" />
        </CardContent>
      </Card>
    )
  }

  const chartData = data.map((d) => ({
    ...d,
    label: formatShortDate(d.date),
  }))

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Balance over time</CardTitle>
          <CardDescription>Add transactions to see your running balance.</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
          No data yet
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Balance over time</CardTitle>
        <CardDescription>Cumulative balance by day from your history.</CardDescription>
      </CardHeader>
      <CardContent className="pt-2">
        {/*
          Recharts ResponsiveContainer needs a parent with explicit pixel height.
          In CSS grid, height: 100% often collapses; min-w-0 avoids overflow clipping.
        */}
        <div className="h-[280px] w-full min-h-[280px] min-w-0">
          <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 8, right: 12, top: 8, bottom: 4 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="var(--border)"
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              formatter={(value) => [
                formatMoney(Number(value)),
                "Balance",
              ]}
              labelFormatter={(_, payload) =>
                payload[0]?.payload?.date
                  ? new Date(
                      String(payload[0].payload.date),
                    ).toLocaleDateString()
                  : ""
              }
              contentStyle={{
                borderRadius: "8px",
                border: "1px solid var(--border)",
                background: "var(--popover)",
                color: "var(--popover-foreground)",
              }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--primary)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "var(--primary)" }}
            />
          </LineChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
