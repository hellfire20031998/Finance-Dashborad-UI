import { useLocation } from "react-router-dom"
import { useFinanceStore } from "@/store/useStore"
import type { UserRole } from "@/lib/data"
import { Moon, Sun } from "lucide-react"

const titles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/transactions": "Transactions",
  "/insights": "Insights",
}

type Props = {
  dark: boolean
  onThemeToggle: () => void
  onThemeLight: () => void
  onThemeDark: () => void
}

export function TopBar({
  dark,
  onThemeLight,
  onThemeDark,
}: Props) {
  const location = useLocation()
  const role = useFinanceStore((s) => s.role)
  const setRole = useFinanceStore((s) => s.setRole)

  const title = titles[location.pathname] ?? "Finance"

  return (
    <div className="flex w-full items-center justify-between gap-2 flex-wrap">
      {/* Page title area */}
      <div className="flex items-center gap-3">
        {/* Toolbar separator */}
        <div className="win-toolbar-sep hidden sm:block" />
        <span className="text-[11px] font-bold text-foreground">{title}</span>
        <div className="win-toolbar-sep hidden sm:block" />
      </div>

      {/* Controls */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Role label */}
        <span className="text-[11px] text-muted-foreground hidden sm:inline">Role:</span>

        {/* Role selector - Win2K style select */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="win-field text-[11px] h-[22px] min-w-[100px] cursor-default"
          aria-label="Select role"
          style={{ fontFamily: "Tahoma, Arial, sans-serif" }}
        >
          <option value="viewer">Viewer</option>
          <option value="admin">Admin</option>
        </select>

        {/* Role badge */}
        <span
          className="win-sunken text-[10px] px-2 py-0.5 text-muted-foreground hidden sm:inline"
        >
          {role === "admin" ? "Can add data" : "Read-only"}
        </span>

        <div className="win-toolbar-sep" />

        {/* Theme toggle buttons */}
        <button
          type="button"
          onClick={onThemeLight}
          className="win-btn flex items-center gap-1 px-2 py-0.5 min-w-0 text-[11px]"
          aria-label="Light theme"
          style={{ minWidth: "auto" }}
        >
          <Sun size={11} />
          <span className="hidden sm:inline">Light</span>
        </button>
        <button
          type="button"
          onClick={onThemeDark}
          className="win-btn flex items-center gap-1 px-2 py-0.5 min-w-0 text-[11px]"
          aria-label="Dark theme"
          style={{ minWidth: "auto" }}
        >
          <Moon size={11} />
          <span className="hidden sm:inline">Dark</span>
        </button>
      </div>
    </div>
  )
}
