import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { CategorySpend } from "@/lib/metrics"
import { getCategoryColor } from "@/lib/data"

type Props = {
  data: CategorySpend[]
  loading?: boolean
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

export function SpendingPieChart({ data, loading }: Props) {
  if (loading) {
    return (
      <Win2KWindow title="Spending By Category">
        <div className="win-sunken m-2 p-2 flex items-center justify-center" style={{ height: 300 }}>
          <div className="text-[11px] text-muted-foreground">Loading chart data...</div>
        </div>
      </Win2KWindow>
    )
  }

  if (data.length === 0) {
    return (
      <Win2KWindow title="Spending By Category">
        <div className="win-sunken m-2 p-2 flex items-center justify-center" style={{ height: 300 }}>
          <div className="text-[11px] text-muted-foreground">
            No expenses to chart. Add expense transactions to see the breakdown.
          </div>
        </div>
      </Win2KWindow>
    )
  }

  return (
    <Win2KWindow title="Spending By Category - Pie Chart">
      <div className="win-sunken m-2 p-1" style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="category"
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={88}
              paddingAngle={1}
              strokeWidth={1}
              stroke="#808080"
            >
              {data.map((entry) => (
                <Cell
                  key={entry.category}
                  fill={getCategoryColor(entry.category)}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [formatMoney(Number(value)), String(name)]}
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend as classic Win2K list */}
      <div className="win-sunken mx-2 mb-1 p-1" style={{ maxHeight: 80, overflowY: "auto" }}>
        <table className="w-full" style={{ borderCollapse: "collapse", fontSize: 10 }}>
          <thead>
            <tr style={{ background: "#0a246a", color: "#ffffff" }}>
              <th className="px-2 py-0.5 text-left font-bold text-[10px]">Category</th>
              <th className="px-2 py-0.5 text-right font-bold text-[10px]">Amount</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d, i) => (
              <tr
                key={d.category}
                style={{ background: i % 2 === 0 ? "#ffffff" : "#f0ece0" }}
              >
                <td className="px-2 py-0.5 flex items-center gap-1.5 text-[10px]">
                  <span
                    className="inline-block"
                    style={{
                      width: 10,
                      height: 10,
                      background: getCategoryColor(d.category),
                      border: "1px solid #808080",
                      flexShrink: 0,
                    }}
                  />
                  {d.category}
                </td>
                <td className="px-2 py-0.5 text-right text-[10px]">
                  {formatMoney(d.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Status strip */}
      <div className="win-statusbar mx-2 mb-2 text-[10px]">
        <div className="win-statusbar-panel">Share of total expenses per category</div>
      </div>
    </Win2KWindow>
  )
}
