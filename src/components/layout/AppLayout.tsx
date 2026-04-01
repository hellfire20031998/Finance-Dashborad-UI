import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AppBreadcrumbs } from "@/components/layout/AppBreadcrumbs"
import { MobileRefreshHint } from "@/components/layout/MobileRefreshHint"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { TopBar } from "@/components/layout/TopBar"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { useFinanceStore } from "@/store/useStore"
import { useUIStore } from "@/store/useUIStore"
import { useTheme } from "@/components/theme/useTheme"
import { cn } from "@/lib/utils"

export function AppLayout() {
  const bootstrap = useFinanceStore((s) => s.bootstrap)
  const { dark, toggle, setDark } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed)
  const toggleSidebarCollapsed = useUIStore((s) => s.toggleSidebarCollapsed)
  const accent = useUIStore((s) => s.accent)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  useEffect(() => {
    const root = document.documentElement
    if (accent === "default") root.removeAttribute("data-accent")
    else root.setAttribute("data-accent", accent)
  }, [accent])

  const spring = reducedMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 320, damping: 32 }

  return (
    <div className="min-h-svh bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-sidebar-border bg-sidebar transition-[width] duration-200 ease-out md:flex md:flex-col",
          sidebarCollapsed ? "w-[72px]" : "w-60",
        )}
      >
        <SidebarNav collapsed={sidebarCollapsed} />
        <div className="mt-auto border-t border-sidebar-border p-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="w-full"
            onClick={toggleSidebarCollapsed}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="size-4" />
            ) : (
              <ChevronLeft className="size-4" />
            )}
          </Button>
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reducedMotion ? undefined : { opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={reducedMotion ? false : { x: -280 }}
              animate={{ x: 0 }}
              exit={reducedMotion ? undefined : { x: -280 }}
              transition={spring}
              className="relative z-50 flex h-full w-[min(280px,85vw)] flex-col border-r border-sidebar-border bg-sidebar shadow-lg"
            >
              <div className="flex justify-end p-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close navigation"
                >
                  <X className="size-5" />
                </Button>
              </div>
              <SidebarNav onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={cn(
          "transition-[padding] duration-200 ease-out",
          sidebarCollapsed ? "md:pl-[72px]" : "md:pl-60",
        )}
      >
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex flex-col gap-1 px-4 py-2 md:px-6">
            <div className="flex min-h-10 items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="size-5" />
              </Button>
              <TopBar
                dark={dark}
                onThemeToggle={toggle}
                onThemeLight={() => setDark(false)}
                onThemeDark={() => setDark(true)}
              />
            </div>
            <AppBreadcrumbs />
          </div>
        </header>
        <main className="p-4 md:p-6">
          <MobileRefreshHint />
          <Outlet />
        </main>
      </div>
    </div>
  )
}
