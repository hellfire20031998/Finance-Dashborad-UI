import { motion } from "framer-motion"
import { TransactionsTable } from "@/components/table/TransactionsTable"
import { useReducedMotion } from "@/hooks/useReducedMotion"
import { useFinanceStore } from "@/store/useStore"

export function TransactionsPage() {
  const loading = useFinanceStore((s) => s.isBootstrapping)
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      initial={reducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reducedMotion ? 0 : 0.2 }}
    >
      <TransactionsTable loading={loading} reducedMotion={reducedMotion} />
    </motion.div>
  )
}
