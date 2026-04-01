export type TransactionType = "income" | "expense"
export type UserRole = "viewer" | "admin"

export interface Transaction {
  id: string
  date: string
  amount: number
  category: string
  type: TransactionType
}

export const CATEGORIES = [
  "Salary",
  "Freelance",
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Health",
  "Other",
] as const

export type CategoryName = (typeof CATEGORIES)[number]

/** Stable hex colors for charts and badges (category color system). */
export const CATEGORY_COLORS: Record<string, string> = {
  Salary: "#22c55e",
  Freelance: "#10b981",
  Food: "#f97316",
  Transport: "#3b82f6",
  Entertainment: "#a855f7",
  Bills: "#ef4444",
  Shopping: "#ec4899",
  Health: "#14b8a6",
  Other: "#64748b",
}

export function getCategoryColor(category: string): string {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: "1",
    date: "2026-01-05",
    amount: 5200,
    category: "Salary",
    type: "income",
  },
  {
    id: "2",
    date: "2026-01-08",
    amount: 120,
    category: "Food",
    type: "expense",
  },
  {
    id: "3",
    date: "2026-01-10",
    amount: 45,
    category: "Transport",
    type: "expense",
  },
  {
    id: "4",
    date: "2026-01-12",
    amount: 850,
    category: "Freelance",
    type: "income",
  },
  {
    id: "5",
    date: "2026-01-15",
    amount: 180,
    category: "Bills",
    type: "expense",
  },
  {
    id: "6",
    date: "2026-01-18",
    amount: 95,
    category: "Food",
    type: "expense",
  },
  {
    id: "7",
    date: "2026-01-22",
    amount: 60,
    category: "Entertainment",
    type: "expense",
  },
  {
    id: "8",
    date: "2026-02-01",
    amount: 5200,
    category: "Salary",
    type: "income",
  },
  {
    id: "9",
    date: "2026-02-04",
    amount: 320,
    category: "Shopping",
    type: "expense",
  },
  {
    id: "10",
    date: "2026-02-07",
    amount: 140,
    category: "Food",
    type: "expense",
  },
  {
    id: "11",
    date: "2026-02-11",
    amount: 200,
    category: "Health",
    type: "expense",
  },
  {
    id: "12",
    date: "2026-02-14",
    amount: 500,
    category: "Freelance",
    type: "income",
  },
  {
    id: "13",
    date: "2026-02-18",
    amount: 210,
    category: "Bills",
    type: "expense",
  },
  {
    id: "14",
    date: "2026-02-22",
    amount: 75,
    category: "Transport",
    type: "expense",
  },
  {
    id: "15",
    date: "2026-03-01",
    amount: 5200,
    category: "Salary",
    type: "income",
  },
  {
    id: "16",
    date: "2026-03-03",
    amount: 165,
    category: "Food",
    type: "expense",
  },
  {
    id: "17",
    date: "2026-03-06",
    amount: 400,
    category: "Shopping",
    type: "expense",
  },
  {
    id: "18",
    date: "2026-03-09",
    amount: 95,
    category: "Entertainment",
    type: "expense",
  },
  {
    id: "19",
    date: "2026-03-12",
    amount: 250,
    category: "Bills",
    type: "expense",
  },
  {
    id: "20",
    date: "2026-03-15",
    amount: 1200,
    category: "Freelance",
    type: "income",
  },
  {
    id: "21",
    date: "2026-03-18",
    amount: 88,
    category: "Food",
    type: "expense",
  },
  {
    id: "22",
    date: "2026-03-22",
    amount: 150,
    category: "Health",
    type: "expense",
  },
  {
    id: "23",
    date: "2026-03-25",
    amount: 55,
    category: "Transport",
    type: "expense",
  },
  {
    id: "24",
    date: "2026-03-28",
    amount: 70,
    category: "Food",
    type: "expense",
  },
  {
    id: "25",
    date: "2026-04-01",
    amount: 5200,
    category: "Salary",
    type: "income",
  },
  {
    id: "26",
    date: "2026-04-01",
    amount: 42,
    category: "Food",
    type: "expense",
  },
]
