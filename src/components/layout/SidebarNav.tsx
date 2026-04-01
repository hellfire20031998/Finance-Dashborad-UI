import { NavLink } from "react-router-dom"
import { LayoutDashboard, ListOrdered, Lightbulb, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ListOrdered },
  { to: "/insights", label: "Insights", icon: Lightbulb },
]

type Props = {
  onNavigate?: () => void
  className?: string
}

export function SidebarNav({ onNavigate, className }: Props) {
  return (
    <div className={cn("flex h-full flex-col gap-1 p-4", className)}>
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight">Finance Dashboard</p>
          <p className="text-xs text-muted-foreground">Overview & insights</p>
        </div>
      </div>
      <Separator className="mb-2 opacity-60" />
      <nav className="flex flex-1 flex-col gap-0.5">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
              )
            }
          >
            <Icon className="size-4 shrink-0 opacity-80" />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
