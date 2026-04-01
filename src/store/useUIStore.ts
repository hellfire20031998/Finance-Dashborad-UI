import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { DashboardRange } from "@/lib/dashboardFilter"

export type TableDensity = "comfortable" | "compact"
export type AccentPreset = "default" | "emerald" | "blue"

interface UIState {
  sidebarCollapsed: boolean
  dashboardRange: DashboardRange
  tableDensity: TableDensity
  showCategoryColumn: boolean
  showTypeColumn: boolean
  accent: AccentPreset
  toggleSidebarCollapsed: () => void
  setDashboardRange: (r: DashboardRange) => void
  setTableDensity: (d: TableDensity) => void
  setShowCategoryColumn: (v: boolean) => void
  setShowTypeColumn: (v: boolean) => void
  setAccent: (a: AccentPreset) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      dashboardRange: "90d",
      tableDensity: "comfortable",
      showCategoryColumn: true,
      showTypeColumn: true,
      accent: "default",
      toggleSidebarCollapsed: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setDashboardRange: (dashboardRange) => set({ dashboardRange }),
      setTableDensity: (tableDensity) => set({ tableDensity }),
      setShowCategoryColumn: (showCategoryColumn) => set({ showCategoryColumn }),
      setShowTypeColumn: (showTypeColumn) => set({ showTypeColumn }),
      setAccent: (accent) => set({ accent }),
    }),
    { name: "finance-dashboard-ui" },
  ),
)
