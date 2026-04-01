import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react"
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

function Win2KCard({
  title,
  value,
  icon: Icon,
  tone,
}: {
  title: string
  value: number
  icon: React.ElementType
  tone: string
}) {
  return (
    <div className="win-raised bg-card flex flex-col" style={{ minHeight: 80 }}>
      {/* Window title bar */}
      <div className="win-titlebar gap-1.5">
        <Icon size={11} className="shrink-0" />
        <span className="text-[11px] font-bold truncate">{title}</span>
        <div className="flex-1" />
        <span className="win-chrome-btn">_</span>
        <span className="win-chrome-btn">□</span>
        <span className="win-chrome-btn">×</span>
      </div>
      {/* Content area - sunken */}
      <div className="win-sunken m-2 p-2 flex flex-col gap-0.5 flex-1">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{title}</p>
        <p className={cn("text-xl font-bold tracking-tight", tone)}>
          {formatMoney(value)}
        </p>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div className="win-raised bg-card" style={{ minHeight: 80 }}>
      <div className="win-titlebar">
        <span className="text-[11px]">Loading...</span>
      </div>
      <div className="win-sunken m-2 p-2">
        <div
          className="h-3 w-24 rounded-none animate-pulse"
          style={{ background: "#c0c0c0" }}
        />
        <div
          className="h-6 w-32 rounded-none animate-pulse mt-2"
          style={{ background: "#c0c0c0" }}
        />
      </div>
    </div>
  )
}

export function SummaryCards({ summary, loading }: Props) {
  if (loading) {
    return (
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
      </div>
    )
  }

  const items = [
    {
      title: "Total Balance",
      value: summary.balance,
      icon: Wallet,
      tone: summary.balance >= 0 ? "text-[#008000]" : "text-destructive",
    },
    {
      title: "Total Income",
      value: summary.totalIncome,
      icon: ArrowUpRight,
      tone: "text-[#008000]",
    },
    {
      title: "Total Expenses",
      value: summary.totalExpenses,
      icon: ArrowDownRight,
      tone: "text-destructive",
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Win2KCard key={item.title} {...item} />
      ))}
    </div>
  )
}
