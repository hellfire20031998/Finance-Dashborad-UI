import { motion } from "framer-motion"
import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const formatMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)

type Summary = {
  balance: number
  totalIncome: number
  totalExpenses: number
}

type Props = {
  summary: Summary
  loading?: boolean
}

export function SummaryCards({ summary, loading }: Props) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-36" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const items = [
    {
      title: "Total balance",
      value: summary.balance,
      icon: Wallet,
      tone: summary.balance >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
    },
    {
      title: "Total income",
      value: summary.totalIncome,
      icon: ArrowUpRight,
      tone: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Total expenses",
      value: summary.totalExpenses,
      icon: ArrowDownRight,
      tone: "text-rose-600 dark:text-rose-400",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.25 }}
        >
          <Card className="overflow-hidden border-border/80 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {item.title}
              </CardTitle>
              <item.icon className={cn("size-4", item.tone)} />
            </CardHeader>
            <CardContent>
              <p className={cn("text-2xl font-semibold tracking-tight", item.tone)}>
                {formatMoney(item.value)}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
