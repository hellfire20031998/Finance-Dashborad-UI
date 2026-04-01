import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TRANSACTIONS_PAGE_SIZES,
  type TransactionsPageSize,
} from "@/store/useUIStore"

type Props = {
  page: number
  totalPages: number
  pageSize: TransactionsPageSize
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: TransactionsPageSize) => void
}

export function TransactionsPagination({
  page,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: Props) {
  if (totalItems === 0) return null

  const start = page * pageSize + 1
  const end = Math.min((page + 1) * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-3 border-t border-border bg-card/50 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium tabular-nums text-foreground">{start}</span>
        –
        <span className="font-medium tabular-nums text-foreground">{end}</span>{" "}
        of{" "}
        <span className="font-medium tabular-nums text-foreground">
          {totalItems}
        </span>
      </p>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2">
          <span className="hidden text-sm text-muted-foreground sm:inline">
            Rows
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) =>
              onPageSizeChange(Number(v) as TransactionsPageSize)
            }
          >
            <SelectTrigger className="h-8 w-[118px]" aria-label="Rows per page">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TRANSACTIONS_PAGE_SIZES.map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-2"
            disabled={page <= 0}
            onClick={() => onPageChange(page - 1)}
            aria-label="Previous page"
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          <span className="min-w-[5.5rem] text-center text-sm tabular-nums text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">{page + 1}</span> of{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-8 gap-1 px-2"
            disabled={page >= totalPages - 1}
            onClick={() => onPageChange(page + 1)}
            aria-label="Next page"
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
