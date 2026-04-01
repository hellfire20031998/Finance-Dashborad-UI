import { Button } from "@/components/ui/button"
import {
  DASHBOARD_RANGE_LABELS,
  type DashboardRange,
} from "@/lib/dashboardFilter"
import { useUIStore } from "@/store/useUIStore"

const ORDER: DashboardRange[] = ["7d", "30d", "90d", "ytd", "all"]

export function DateRangeChips() {
  const range = useUIStore((s) => s.dashboardRange)
  const setRange = useUIStore((s) => s.setDashboardRange)

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Range</span>
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Dashboard date range">
        {ORDER.map((r) => (
          <Button
            key={r}
            type="button"
            size="sm"
            variant={range === r ? "default" : "outline"}
            className="h-8 rounded-full px-3 text-xs"
            onClick={() => setRange(r)}
          >
            {DASHBOARD_RANGE_LABELS[r]}
          </Button>
        ))}
      </div>
    </div>
  )
}
