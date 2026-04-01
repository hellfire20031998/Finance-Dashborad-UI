import { motion } from "framer-motion"
import { Skeleton } from "@/components/ui/skeleton"
import { TransactionsTable } from "@/components/table/TransactionsTable"
import { useFinanceStore } from "@/store/useStore"

export function TransactionsPage() {
  const loading = useFinanceStore((s) => s.isBootstrapping)

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full max-w-md" />
        <Skeleton className="h-[360px] w-full" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <TransactionsTable />
    </motion.div>
  )
}
