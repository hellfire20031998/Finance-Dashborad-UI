import type { Transaction } from "@/lib/data"
import { MOCK_TRANSACTIONS } from "@/lib/data"
import { toast } from "sonner"

const STORAGE_KEY = "finance-dashboard-transactions"
const ROLE_STORAGE_KEY = "finance-dashboard-role"

const SIMULATED_LATENCY_MS = 480

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

function storageErrorMessage(e: unknown, fallback: string): string {
  if (e instanceof DOMException) {
    if (e.name === "QuotaExceededError") {
      return "Browser storage is full — changes may be lost after refresh."
    }
    if (e.name === "SecurityError") {
      return "Storage is blocked (private mode or permissions)."
    }
  }
  return fallback
}

export function loadTransactionsFromStorage(): Transaction[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Transaction[]
    if (!Array.isArray(parsed)) {
      toast.warning("Stored transactions were invalid; using a fresh dataset.")
      return null
    }
    return parsed
  } catch {
    toast.warning("Could not read stored transactions; using a fresh dataset.")
    return null
  }
}

export function saveTransactionsToStorage(transactions: Transaction[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    return true
  } catch (e) {
    toast.error(
      storageErrorMessage(
        e,
        "Could not save transactions. Your edits stay in memory until you refresh.",
      ),
    )
    return false
  }
}

export function loadRoleFromStorage(): string | null {
  try {
    return localStorage.getItem(ROLE_STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveRoleToStorage(role: string): boolean {
  try {
    localStorage.setItem(ROLE_STORAGE_KEY, role)
    return true
  } catch (e) {
    toast.error(storageErrorMessage(e, "Could not save role preference."))
    return false
  }
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

export async function syncPersist(transactions: Transaction[]): Promise<boolean> {
  await delay(120)
  return saveTransactionsToStorage(transactions)
}
