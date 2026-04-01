import type { Transaction } from "@/lib/data"
import { MOCK_TRANSACTIONS } from "@/lib/data"

const STORAGE_KEY = "finance-dashboard-transactions"
const ROLE_STORAGE_KEY = "finance-dashboard-role"

const SIMULATED_LATENCY_MS = 480

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

export function loadTransactionsFromStorage(): Transaction[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Transaction[]
    return Array.isArray(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveTransactionsToStorage(transactions: Transaction[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
}

export function loadRoleFromStorage(): string | null {
  return localStorage.getItem(ROLE_STORAGE_KEY)
}

export function saveRoleToStorage(role: string) {
  localStorage.setItem(ROLE_STORAGE_KEY, role)
}

/** Simulated API: loads from localStorage or seeds mock data, persists seed on first run. */
export async function fetchTransactions(): Promise<Transaction[]> {
  await delay(SIMULATED_LATENCY_MS)
  const existing = loadTransactionsFromStorage()
  if (existing && existing.length > 0) return existing
  const seed = [...MOCK_TRANSACTIONS]
  saveTransactionsToStorage(seed)
  return seed
}

export async function syncPersist(transactions: Transaction[]): Promise<void> {
  await delay(120)
  saveTransactionsToStorage(transactions)
}
