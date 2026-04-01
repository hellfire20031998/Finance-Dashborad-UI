import { Link, useLocation } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useFinanceStore } from "@/store/useStore"
import type { TypeFilter } from "@/store/useStore"

const CRUMB_NAMES: Record<string, string> = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  insights: "Insights",
}

function filterCrumbLabel(typeFilter: TypeFilter, search: string) {
  const parts: string[] = []
  if (typeFilter !== "all") parts.push(typeFilter)
  if (search.trim()) parts.push(`“${search.trim()}”`)
  if (parts.length === 0) return null
  return `Filtered (${parts.join(", ")})`
}

export function AppBreadcrumbs() {
  const location = useLocation()
  const typeFilter = useFinanceStore((s) => s.typeFilter)
  const search = useFinanceStore((s) => s.search)

  const segments = location.pathname.split("/").filter(Boolean)
  if (segments.length === 0) return null

  const section = segments[0] ?? "dashboard"
  const sectionName = CRUMB_NAMES[section] ?? section

  const filterLabel =
    section === "transactions"
      ? filterCrumbLabel(typeFilter, search)
      : null

  return (
    <Breadcrumb className="text-muted-foreground">
      <BreadcrumbList className="flex-wrap sm:flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/dashboard">Home</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          {filterLabel ? (
            <BreadcrumbLink asChild>
              <Link to={`/${section}`}>{sectionName}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage>{sectionName}</BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {filterLabel && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate font-normal">
                {filterLabel}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
