import { useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowDownAZ,
  ArrowUpAZ,
  Columns3,
  Download,
  StretchHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { getCategoryColor } from "@/lib/data"
import { downloadCsv, transactionsToCsv } from "@/lib/exportCsv"
import {
  selectFilteredTransactions,
  useFinanceStore,
} from "@/store/useStore"
import { useUIStore } from "@/store/useUIStore"
import { AddTransactionDialog } from "@/components/table/AddTransactionDialog"
import {
  EditTransactionDialog,
  EditTransactionIconButton,
} from "@/components/table/EditTransactionDialog"
import { TransactionsPagination } from "@/components/table/TransactionsPagination"
import { cn } from "@/lib/utils"
import type { Transaction } from "@/lib/data"
import type { TransactionsPageSize } from "@/store/useUIStore"

const formatMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n)

/** Show every row without a vertical scrollbar up to this many rows per page. */
const TABLE_BODY_SCROLL_AFTER_ROWS = 10

/** Max viewport height for the table body area when scrolling (header + 10 data rows). */
function transactionsTableScrollMaxHeight(compact: boolean): string {
  const headerPx = compact ? 40 : 44
  const rowPx = compact ? 38 : 46
  const px = headerPx + TABLE_BODY_SCROLL_AFTER_ROWS * rowPx
  return `min(${px}px, 60vh)`
}

type Props = {
  loading?: boolean
  reducedMotion?: boolean
}

type PagedBodyProps = {
  rows: Transaction[]
  pageSize: TransactionsPageSize
  setPageSize: (n: TransactionsPageSize) => void
  isAdmin: boolean
  setEditTarget: (t: Transaction) => void
  colCount: number
  compact: boolean
  headPad: string
  cellPad: string
  showCategoryColumn: boolean
  showTypeColumn: boolean
  sortBy: "date" | "amount"
  sortDir: "asc" | "desc"
  setSort: (by: "date" | "amount") => void
}

function TransactionsTablePagedBody({
  rows,
  pageSize,
  setPageSize,
  isAdmin,
  setEditTarget,
  colCount,
  compact,
  headPad,
  cellPad,
  showCategoryColumn,
  showTypeColumn,
  sortBy,
  sortDir,
  setSort,
}: PagedBodyProps) {
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const pageOffset = safePage * pageSize
  const pageRows =
    rows.length === 0 ? [] : rows.slice(pageOffset, pageOffset + pageSize)

  const scrollVertically = pageRows.length > TABLE_BODY_SCROLL_AFTER_ROWS

  return (
    <div className="rounded-md border border-border bg-card shadow-sm">
      <div
        className={cn(
          "scrollbar-themed relative w-full overflow-x-auto",
          scrollVertically && "overflow-y-auto",
        )}
        style={
          scrollVertically
            ? { maxHeight: transactionsTableScrollMaxHeight(compact) }
            : undefined
        }
      >
        <table className="w-full caption-bottom text-sm">
          <TableHeader className="sticky top-0 z-20 border-b border-border bg-card/95 shadow-sm backdrop-blur-md supports-[backdrop-filter]:bg-card/80 [&_tr]:border-b">
            <TableRow className="border-0 hover:bg-transparent">
              <TableHead
                className={cn(
                  "w-12 min-w-12 text-center tabular-nums text-muted-foreground",
                  headPad,
                )}
              >
                S.No.
              </TableHead>
              <TableHead className={cn("min-w-[120px] whitespace-nowrap", headPad)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("-ml-2 gap-1 font-semibold", compact && "h-7 text-xs")}
                  onClick={() => setSort("date")}
                >
                  Date
                  {sortBy === "date" &&
                    (sortDir === "asc" ? (
                      <ArrowUpAZ className="size-4 opacity-70" />
                    ) : (
                      <ArrowDownAZ className="size-4 opacity-70" />
                    ))}
                </Button>
              </TableHead>
              <TableHead className={cn("min-w-[100px]", headPad)}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn("-ml-2 gap-1 font-semibold", compact && "h-7 text-xs")}
                  onClick={() => setSort("amount")}
                >
                  Amount
                  {sortBy === "amount" &&
                    (sortDir === "asc" ? (
                      <ArrowUpAZ className="size-4 opacity-70" />
                    ) : (
                      <ArrowDownAZ className="size-4 opacity-70" />
                    ))}
                </Button>
              </TableHead>
              {showCategoryColumn && (
                <TableHead className={cn(headPad)}>Category</TableHead>
              )}
              {showTypeColumn && (
                <TableHead className={cn("text-right", headPad)}>Type</TableHead>
              )}
              {isAdmin && (
                <TableHead className={cn("w-[72px] text-right", headPad)}>
                  Actions
                </TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={colCount} className="h-32 text-center">
                  <p className="text-sm text-muted-foreground">
                    No transactions match your filters.
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Try clearing search or switching the type filter.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((t, index) => (
                <TableRow
                  key={t.id}
                  tabIndex={isAdmin ? 0 : undefined}
                  title={
                    isAdmin
                      ? "Double-click or press Enter to edit this transaction"
                      : undefined
                  }
                  className={cn(
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    (pageOffset + index) % 2 === 1 && "bg-muted/25",
                    isAdmin && "cursor-pointer",
                  )}
                  onDoubleClick={
                    isAdmin
                      ? () => {
                          setEditTarget(t)
                        }
                      : undefined
                  }
                  onKeyDown={(e) => {
                    if (!isAdmin || e.key !== "Enter") return
                    if (
                      e.target instanceof HTMLButtonElement ||
                      e.target instanceof HTMLInputElement
                    ) {
                      return
                    }
                    e.preventDefault()
                    setEditTarget(t)
                  }}
                >
                  <TableCell
                    className={cn(
                      "text-center tabular-nums text-muted-foreground",
                      cellPad,
                    )}
                  >
                    {pageOffset + index + 1}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "whitespace-nowrap text-muted-foreground",
                      cellPad,
                    )}
                  >
                    {new Date(t.date).toLocaleDateString()}
                  </TableCell>
                  <TableCell
                    className={cn(
                      "font-medium tabular-nums",
                      cellPad,
                      t.type === "income"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-foreground",
                    )}
                  >
                    {t.type === "income" ? "+" : "−"}
                    {formatMoney(t.amount)}
                  </TableCell>
                  {showCategoryColumn && (
                    <TableCell className={cellPad}>
                      <span className="flex items-center gap-2">
                        <span
                          className="size-2 shrink-0 rounded-full"
                          style={{
                            backgroundColor: getCategoryColor(t.category),
                          }}
                        />
                        {t.category}
                      </span>
                    </TableCell>
                  )}
                  {showTypeColumn && (
                    <TableCell className={cn("text-right", cellPad)}>
                      <Badge
                        variant={
                          t.type === "income" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {t.type}
                      </Badge>
                    </TableCell>
                  )}
                  {isAdmin && (
                    <TableCell className={cn("text-right", cellPad)}>
                      <EditTransactionIconButton
                        transaction={t}
                        onOpen={() => setEditTarget(t)}
                      />
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </table>
      </div>
      <TransactionsPagination
        page={safePage}
        totalPages={totalPages}
        pageSize={pageSize}
        totalItems={rows.length}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </div>
  )
}

export function TransactionsTable({
  loading = false,
  reducedMotion,
}: Props) {
  const isAdmin = useFinanceStore((s) => s.role === "admin")
  const typeFilter = useFinanceStore((s) => s.typeFilter)
  const setTypeFilter = useFinanceStore((s) => s.setTypeFilter)
  const search = useFinanceStore((s) => s.search)
  const setSearch = useFinanceStore((s) => s.setSearch)
  const sortBy = useFinanceStore((s) => s.sortBy)
  const sortDir = useFinanceStore((s) => s.sortDir)
  const setSort = useFinanceStore((s) => s.setSort)
  const state = useFinanceStore()
  const rows = selectFilteredTransactions(state)

  const tableDensity = useUIStore((s) => s.tableDensity)
  const setTableDensity = useUIStore((s) => s.setTableDensity)
  const showCategoryColumn = useUIStore((s) => s.showCategoryColumn)
  const setShowCategoryColumn = useUIStore((s) => s.setShowCategoryColumn)
  const showTypeColumn = useUIStore((s) => s.showTypeColumn)
  const setShowTypeColumn = useUIStore((s) => s.setShowTypeColumn)
  const pageSize = useUIStore((s) => s.transactionsPageSize)
  const setPageSize = useUIStore((s) => s.setTransactionsPageSize)

  const [editTarget, setEditTarget] = useState<Transaction | null>(null)

  const compact = tableDensity === "compact"
  const cellPad = compact ? "px-2 py-1.5 text-xs" : "p-2"
  const headPad = compact ? "h-8 px-2 py-1 text-xs" : "h-10 px-2"

  const colCount =
    1 +
    2 +
    (showCategoryColumn ? 1 : 0) +
    (showTypeColumn ? 1 : 0) +
    (isAdmin ? 1 : 0)

  function exportCsv() {
    const csv = transactionsToCsv(rows)
    downloadCsv(`transactions-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-full max-w-xs" />
          <Skeleton className="h-9 w-40" />
          <Skeleton className="h-9 w-24" />
        </div>
        <div className="rounded-md border">
          <div
            className="scrollbar-themed overflow-x-auto overflow-y-auto"
            style={{ maxHeight: transactionsTableScrollMaxHeight(compact) }}
          >
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <th key={i} className="p-2 text-left">
                      <Skeleton className="h-4 w-16" />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    {[1, 2, 3, 4, 5, 6].map((j) => (
                      <td key={j} className="p-2">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="space-y-4"
      initial={reducedMotion ? false : { opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
    >
      {editTarget && (
        <EditTransactionDialog
          transaction={editTarget}
          open
          onOpenChange={(o) => {
            if (!o) setEditTarget(null)
          }}
        />
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            placeholder="Search by category…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="sm:max-w-xs"
            aria-label="Search by category"
          />
          <Select
            value={typeFilter}
            onValueChange={(v) =>
              setTypeFilter(v as "all" | "income" | "expense")
            }
          >
            <SelectTrigger className="sm:w-[160px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="income">Income</SelectItem>
              <SelectItem value="expense">Expense</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant={tableDensity === "compact" ? "default" : "outline"}
            size="sm"
            className="gap-1.5"
            onClick={() =>
              setTableDensity(
                tableDensity === "compact" ? "comfortable" : "compact",
              )
            }
            aria-pressed={tableDensity === "compact"}
            aria-label="Toggle table density"
          >
            <StretchHorizontal className="size-4" />
            <span className="hidden sm:inline">Density</span>
          </Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Columns3 className="size-4" />
                Columns
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56" align="end">
              <div className="space-y-3">
                <p className="text-sm font-medium">Visible columns</p>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="col-cat"
                    checked={showCategoryColumn}
                    onCheckedChange={(v) =>
                      setShowCategoryColumn(v === true)
                    }
                  />
                  <Label htmlFor="col-cat" className="text-sm font-normal">
                    Category
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="col-type"
                    checked={showTypeColumn}
                    onCheckedChange={(v) => setShowTypeColumn(v === true)}
                  />
                  <Label htmlFor="col-type" className="text-sm font-normal">
                    Type
                  </Label>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={exportCsv}>
            <Download className="size-4" />
            Export CSV
          </Button>
          {isAdmin && <AddTransactionDialog />}
        </div>
      </div>

      <TransactionsTablePagedBody
        key={`${search}|${typeFilter}|${pageSize}`}
        rows={rows}
        pageSize={pageSize}
        setPageSize={setPageSize}
        isAdmin={isAdmin}
        setEditTarget={setEditTarget}
        colCount={colCount}
        compact={compact}
        headPad={headPad}
        cellPad={cellPad}
        showCategoryColumn={showCategoryColumn}
        showTypeColumn={showTypeColumn}
        sortBy={sortBy}
        sortDir={sortDir}
        setSort={setSort}
      />
      {isAdmin && (
        <p className="text-center text-xs text-muted-foreground">
          Tip: Tab to a row and press{" "}
          <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-mono text-[10px]">
            Enter
          </kbd>
          , or double-click a row to edit. Same action for keyboard and pointer
          users.
        </p>
      )}
    </motion.div>
  )
}
