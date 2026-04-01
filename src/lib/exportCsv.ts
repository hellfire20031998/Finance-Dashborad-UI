import type { Transaction } from "@/lib/data"

function escapeCsv(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`
  return value
}

export function transactionsToCsv(rows: Transaction[]): string {
  const headers = ["Date", "Amount", "Category", "Type"]
  const lines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        escapeCsv(r.date),
        String(r.amount),
        escapeCsv(r.category),
        escapeCsv(r.type),
      ].join(","),
    ),
  ]
  return lines.join("\n")
}

export function downloadCsv(filename: string, content: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
