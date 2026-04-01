import { useLocation } from "react-router-dom"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ThemeToggle } from "@/components/theme/ThemeToggle"
import { useFinanceStore } from "@/store/useStore"
import type { UserRole } from "@/lib/data"
import { Badge } from "@/components/ui/badge"

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
  onThemeToggle,
  onThemeLight,
  onThemeDark,
}: Props) {
  const location = useLocation()
  const role = useFinanceStore((s) => s.role)
  const setRole = useFinanceStore((s) => s.setRole)

  const title = titles[location.pathname] ?? "Finance"

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-3">
      <h1 className="text-lg font-semibold tracking-tight md:text-xl">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Role
          </span>
          <Select
            value={role}
            onValueChange={(v) => setRole(v as UserRole)}
          >
            <SelectTrigger className="h-9 w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Viewer</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>
          <Badge variant="secondary" className="hidden font-normal sm:inline-flex">
            {role === "admin" ? "Can add data" : "Read-only"}
          </Badge>
        </div>
        <ThemeToggle
          dark={dark}
          onToggle={onThemeToggle}
          onLight={onThemeLight}
          onDark={onThemeDark}
        />
      </div>
    </div>
  )
}
