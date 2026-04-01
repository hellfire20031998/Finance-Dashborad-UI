import type { ReactNode } from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  ListOrdered,
  Lightbulb,
  Wallet,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/transactions", label: "Transactions", icon: ListOrdered },
  { to: "/insights", label: "Insights", icon: Lightbulb },
]

type Props = {
  onNavigate?: () => void
  className?: string
  collapsed?: boolean
}

export function SidebarNav({ onNavigate, className, collapsed }: Props) {
  const wrap = (node: ReactNode, label: string) => {
    if (!collapsed) return node
    return (
      <Tooltip>
        <TooltipTrigger asChild>{node}</TooltipTrigger>
        <TooltipContent side="right" className="font-medium">
          {label}
        </TooltipContent>
      </Tooltip>
    )
  }

  const inner = (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col gap-1",
        collapsed ? "items-center px-0 py-3" : "p-3",
        className,
      )}
    >
      <div
        className={cn(
          "mb-2 flex w-full items-center gap-2 px-1",
          collapsed && "justify-center px-0",
        )}
      >
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Wallet className="size-5" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-tight">Finance</p>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        )}
      </div>
      <Separator
        className={cn("mb-1 opacity-60", collapsed && "mx-auto w-9 shrink-0")}
      />
      <nav
        className={cn(
          "flex w-full flex-1 flex-col gap-1",
          collapsed && "items-center",
        )}
      >
        {links.map(({ to, label, icon: Icon }) => {
          const link = (
            <NavLink
              key={to}
              to={to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md text-sm font-medium transition-colors outline-none",
                  collapsed
                    ? "size-9 shrink-0 justify-center p-0"
                    : "w-full gap-3 px-3 py-2",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                )
              }
            >
              {collapsed ? (
                <Icon className="size-[18px] shrink-0 opacity-90" aria-hidden />
              ) : (
                <>
                  <Icon className="size-4 shrink-0 opacity-80" aria-hidden />
                  {label}
                </>
              )}
            </NavLink>
          )
          return collapsed ? wrap(link, label) : link
        })}
      </nav>
    </div>
  )

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        {inner}
      </TooltipProvider>
    )
  }

  return inner
}
