import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { TopBar } from "@/components/layout/TopBar"
import { useFinanceStore } from "@/store/useStore"
import { useTheme } from "@/components/theme/useTheme"
import { cn } from "@/lib/utils"

export function AppLayout() {
  const bootstrap = useFinanceStore((s) => s.bootstrap)
  const { dark, toggle, setDark } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    void bootstrap()
  }, [bootstrap])

  return (
    <div className="min-h-svh bg-background">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-sidebar-border bg-sidebar md:flex md:flex-col",
        )}
      >
        <SidebarNav />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              type="button"
              className="absolute inset-0 bg-black/40"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
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

      <div className="md:pl-60">
        <header className="sticky top-0 z-30 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex h-14 items-center gap-2 px-4 md:px-6">
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
        </header>
        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
