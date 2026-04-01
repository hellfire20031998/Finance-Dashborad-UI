import { Line, LineChart, ResponsiveContainer } from "recharts"
import { cn } from "@/lib/utils"

type Props = {
  data: number[]
  className?: string
  strokeClass?: string
}

export function StatSparkline({ data, className, strokeClass }: Props) {
  const chartData = data.map((v, i) => ({ i, v }))
  if (chartData.length < 2) return null

  return (
    <div className={cn("h-10 w-full opacity-90", className)}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
          <Line
            type="monotone"
            dataKey="v"
            stroke="var(--primary)"
            className={strokeClass}
            strokeWidth={1.5}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
