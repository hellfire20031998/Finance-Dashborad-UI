import { NavLink } from "react-router-dom"
import { LayoutDashboard, ListOrdered, Lightbulb, Wallet } from "lucide-react"
import { cn } from "@/lib/utils"

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
    <div className={cn("flex h-full flex-col", className)}>
      {/* App title bar */}
      <div className="win-titlebar gap-1.5">
        <Wallet size={12} className="shrink-0" />
        <span className="text-[11px] font-bold truncate">Finance Dashboard</span>
      </div>

      {/* Nav section label */}
      <div
        className="px-2 py-1 text-[10px] uppercase tracking-widest text-muted-foreground"
        style={{ background: "#c0c0c0", borderBottom: "1px solid #808080" }}
      >
        Navigation
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-0 flex-1 py-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2 px-3 py-1.5 text-[11px] cursor-default transition-none",
                isActive
                  ? "win-nav-selected"
                  : "text-foreground hover:bg-[#0a246a] hover:text-white",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={14} className={cn("shrink-0", isActive ? "text-white" : "")} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom info panel */}
      <div className="win-sunken m-2 p-2 text-[10px] text-muted-foreground">
        <p className="font-bold text-foreground">Finance Dashboard</p>
        <p>Overview &amp; Insights</p>
        <p className="mt-1 text-[10px]">© 2000 v0.dev</p>
      </div>
    </div>
  )
}
