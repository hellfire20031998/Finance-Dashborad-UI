import { create } from "zustand"
import type { Transaction, TransactionType, UserRole } from "@/lib/data"
import {
  fetchTransactions,
  loadRoleFromStorage,
  loadTransactionsFromStorage,
  saveRoleToStorage,
  syncPersist,
} from "@/lib/api"

export type TypeFilter = "all" | TransactionType

interface FinanceState {
  transactions: Transaction[]
  role: UserRole
  typeFilter: TypeFilter
  search: string
  sortBy: "date" | "amount"
  sortDir: "asc" | "desc"
  isBootstrapping: boolean

  bootstrap: () => Promise<void>
  /** Re-read transactions from localStorage without full loading screen. */
  reloadFromStorage: () => void
  setRole: (role: UserRole) => void
  setTypeFilter: (f: TypeFilter) => void
  setSearch: (s: string) => void
  setSort: (by: "date" | "amount") => void
  addTransaction: (t: Omit<Transaction, "id">) => Promise<void>
  updateTransaction: (
    id: string,
    patch: Omit<Transaction, "id">,
  ) => Promise<void>
}

function parseRole(raw: string | null): UserRole {
  return raw === "admin" ? "admin" : "viewer"
}

function newId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return `tx-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useFinanceStore = create<FinanceState>((set, get) => ({
  transactions: [],
  role: "viewer",
  typeFilter: "all",
  search: "",
  sortBy: "date",
  sortDir: "desc",
  isBootstrapping: true,

  bootstrap: async () => {
    set({ isBootstrapping: true })
    const transactions = await fetchTransactions()
    const role = parseRole(loadRoleFromStorage())
    set({ transactions, role, isBootstrapping: false })
  },

  reloadFromStorage: () => {
    const txs = loadTransactionsFromStorage()
    if (txs && txs.length > 0) set({ transactions: txs })
  },

  setRole: (role) => {
    saveRoleToStorage(role)
    set({ role })
  },

  setTypeFilter: (typeFilter) => set({ typeFilter }),

  setSearch: (search) => set({ search }),

  setSort: (sortBy) =>
    set((s) =>
      s.sortBy !== sortBy
        ? { sortBy, sortDir: "desc" }
        : { sortDir: s.sortDir === "asc" ? "desc" : "asc" },
    ),

  addTransaction: async (payload) => {
    const transaction: Transaction = { ...payload, id: newId() }
    const transactions = [transaction, ...get().transactions]
    set({ transactions })
    await syncPersist(transactions)
  },

  updateTransaction: async (id, patch) => {
    const transactions = get().transactions.map((t) =>
      t.id === id ? { ...t, ...patch } : t,
    )
    set({ transactions })
    await syncPersist(transactions)
  },
}))

export function selectFilteredTransactions(state: FinanceState): Transaction[] {
  const { transactions, typeFilter, search, sortBy, sortDir } = state
  const q = search.trim().toLowerCase()
  let list = transactions.filter((t) => {
    if (typeFilter !== "all" && t.type !== typeFilter) return false
    if (q && !t.category.toLowerCase().includes(q)) return false
    return true
  })
  list = [...list].sort((a, b) => {
    const mul = sortDir === "asc" ? 1 : -1
    if (sortBy === "amount") {
      return (a.amount - b.amount) * mul
    }
    return (
      (new Date(a.date).getTime() - new Date(b.date).getTime()) * mul
    )
  })
  return list
}
