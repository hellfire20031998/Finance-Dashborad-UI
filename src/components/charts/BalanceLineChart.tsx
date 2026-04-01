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

function Win2KWindow({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="win-raised bg-card flex flex-col">
      <div className="win-titlebar gap-1.5">
        <span className="text-[11px] font-bold flex-1">{title}</span>
        <span className="win-chrome-btn">_</span>
        <span className="win-chrome-btn">□</span>
        <span className="win-chrome-btn">×</span>
      </div>
      {/* Menu bar */}
      <div className="win-menubar text-[11px] border-b border-[#808080]">
        <span className="win-menubar-item">File</span>
        <span className="win-menubar-item">View</span>
        <span className="win-menubar-item">Help</span>
      </div>
      {children}
    </div>
  )
}

export function BalanceLineChart({ data, loading }: Props) {
  if (loading) {
    return (
      <Win2KWindow title="Balance Over Time">
        <div className="win-sunken m-2 p-2 flex items-center justify-center" style={{ height: 300 }}>
          <div className="text-[11px] text-muted-foreground">Loading chart data...</div>
        </div>
      </Win2KWindow>
    )
  }

  const chartData = data.map((d) => ({
    ...d,
    label: formatShortDate(d.date),
  }))

  if (chartData.length === 0) {
    return (
      <Win2KWindow title="Balance Over Time">
        <div className="win-sunken m-2 p-2 flex items-center justify-center" style={{ height: 300 }}>
          <div className="text-[11px] text-muted-foreground">
            No data yet. Add transactions to see your running balance.
          </div>
        </div>
      </Win2KWindow>
    )
  }

  return (
    <Win2KWindow title="Balance Over Time - Line Chart">
      <div className="win-sunken m-2 p-1" style={{ height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ left: 4, right: 8, top: 8, bottom: 4 }}>
            <CartesianGrid
              strokeDasharray="1 0"
              stroke="#c0c0c0"
              strokeOpacity={0.8}
            />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fontFamily: "Tahoma, Arial, sans-serif", fill: "#000000" }}
              tickLine={{ stroke: "#808080" }}
              axisLine={{ stroke: "#808080" }}
            />
            <YAxis
              tick={{ fontSize: 10, fontFamily: "Tahoma, Arial, sans-serif", fill: "#000000" }}
              tickLine={{ stroke: "#808080" }}
              axisLine={{ stroke: "#808080" }}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip
              formatter={(value) => [formatMoney(Number(value)), "Balance"]}
              labelFormatter={(_, payload) =>
                payload[0]?.payload?.date
                  ? new Date(String(payload[0].payload.date)).toLocaleDateString()
                  : ""
              }
              contentStyle={{
                borderRadius: 0,
                border: "2px solid",
                borderColor: "#ffffff #808080 #808080 #ffffff",
                background: "#d4d0c8",
                color: "#000000",
                fontFamily: "Tahoma, Arial, sans-serif",
                fontSize: 11,
                boxShadow: "inset -1px -1px 0 #404040, inset 1px 1px 0 #dfdfdf",
              }}
            />
            <Line
              type="linear"
              dataKey="balance"
              stroke="#316ac5"
              strokeWidth={1.5}
              dot={{ r: 2, fill: "#316ac5", stroke: "#316ac5" }}
              activeDot={{ r: 4, fill: "#0a246a" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Status strip */}
      <div className="win-statusbar mx-2 mb-2 text-[10px]">
        <div className="win-statusbar-panel">Cumulative balance by day</div>
      </div>
    </Win2KWindow>
  )
}
