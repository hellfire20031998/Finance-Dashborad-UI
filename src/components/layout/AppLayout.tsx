import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { TopBar } from "@/components/layout/TopBar"
import { useFinanceStore } from "@/store/useStore"
import { useTheme } from "@/components/theme/useTheme"

export function AppLayout() {
  const bootstrap = useFinanceStore((s) => s.bootstrap)
  const { dark, toggle, setDark } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return (
    <div className="min-h-svh flex flex-col bg-background">
      {/* Desktop layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex md:flex-col w-[180px] flex-shrink-0 win-panel border-r-0 border-l-0 border-t-0">
          <SidebarNav />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="relative z-50 flex h-full w-[min(220px,85vw)] flex-col win-panel shadow-xl">
              <div className="win-titlebar justify-between">
                <span>Navigation</span>
                <button
                  type="button"
                  className="win-chrome-btn"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                >
                  ×
                </button>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main content area */}
        <div className="flex flex-1 flex-col min-w-0">
          {/* Top toolbar bar */}
          <header className="win-toolbar border-b-2 border-b-[#808080] sticky top-0 z-30">
            <button
              type="button"
              className="win-chrome-btn md:hidden w-auto px-2"
              style={{ width: "auto", minWidth: 28 }}
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={12} />
            </button>
            <TopBar
              dark={dark}
              onThemeToggle={toggle}
              onThemeLight={() => setDark(false)}
              onThemeDark={() => setDark(true)}
            />
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-3">
            <Outlet />
          </main>

          {/* Windows 2000 status bar */}
          <div className="win-statusbar">
            <div className="win-statusbar-panel">Ready</div>
            <div className="win-statusbar-panel flex-none w-40">Finance Dashboard v1.0</div>
            <div className="win-statusbar-panel flex-none w-24">
              {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
