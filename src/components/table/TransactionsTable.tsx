import { motion } from "framer-motion"
import { ArrowDownAZ, ArrowUpAZ, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { getCategoryColor } from "@/lib/data"
import { downloadCsv, transactionsToCsv } from "@/lib/exportCsv"
import {
  selectFilteredTransactions,
  useFinanceStore,
} from "@/store/useStore"
import { AddTransactionDialog } from "@/components/table/AddTransactionDialog"
import { cn } from "@/lib/utils"

const formatMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(n)

export function TransactionsTable() {
  const role = useFinanceStore((s) => s.role)
  const typeFilter = useFinanceStore((s) => s.typeFilter)
  const setTypeFilter = useFinanceStore((s) => s.setTypeFilter)
  const search = useFinanceStore((s) => s.search)
  const setSearch = useFinanceStore((s) => s.setSearch)
  const sortBy = useFinanceStore((s) => s.sortBy)
  const sortDir = useFinanceStore((s) => s.sortDir)
  const setSort = useFinanceStore((s) => s.setSort)
  const state = useFinanceStore()
  const rows = selectFilteredTransactions(state)

  function exportCsv() {
    const csv = transactionsToCsv(rows)
    downloadCsv(`transactions-${new Date().toISOString().slice(0, 10)}.csv`, csv)
  }

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
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
          <Button variant="outline" size="sm" className="gap-1.5" onClick={exportCsv}>
            <Download className="size-4" />
            Export CSV
          </Button>
          {role === "admin" && <AddTransactionDialog />}
        </div>
      </div>

      <div className="rounded-md border border-border bg-card shadow-sm">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2 gap-1 font-semibold"
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
                <TableHead className="min-w-[100px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="-ml-2 gap-1 font-semibold"
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
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center">
                    <p className="text-sm text-muted-foreground">
                      No transactions match your filters.
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Try clearing search or switching the type filter.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                rows.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {new Date(t.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "font-medium tabular-nums",
                        t.type === "income"
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-foreground",
                      )}
                    >
                      {t.type === "income" ? "+" : "−"}
                      {formatMoney(t.amount)}
                    </TableCell>
                    <TableCell>
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
                    <TableCell className="text-right">
                      <Badge
                        variant={t.type === "income" ? "default" : "secondary"}
                        className="capitalize"
                      >
                        {t.type}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </motion.div>
  )
}
