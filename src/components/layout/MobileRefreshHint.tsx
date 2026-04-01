import { RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { useFinanceStore } from "@/store/useStore"

export function MobileRefreshHint() {
  const reloadFromStorage = useFinanceStore((s) => s.reloadFromStorage)

  function handleRefresh() {
    reloadFromStorage()
    toast.success("Reloaded from local storage")
  }

  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-dashed border-border bg-muted/40 px-3 py-2 md:hidden">
      <p className="text-xs text-muted-foreground">
        Tip: pull-style refresh — reloads stored transactions.
      </p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        className="h-8 shrink-0 gap-1.5 px-2 text-xs"
        onClick={handleRefresh}
      >
        <RefreshCw className="size-3.5" />
        Refresh
      </Button>
    </div>
  )
}
