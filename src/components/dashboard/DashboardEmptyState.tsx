import { Link } from "react-router-dom"
import { CheckCircle2, Circle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { UserRole } from "@/lib/data"

type Props = {
  role: UserRole
}

export function DashboardEmptyState({ role }: Props) {
  const isAdmin = role === "admin"

  return (
    <Card className="border-dashed bg-muted/30">
      <CardHeader>
        <CardTitle>Welcome to your finance dashboard</CardTitle>
        <CardDescription>
          You do not have any transactions yet. Here is how to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>Open Transactions to review the table layout and filters.</span>
          </li>
          <li className="flex items-start gap-2">
            {isAdmin ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
            ) : (
              <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            )}
            <span>
              {isAdmin
                ? "Use Add transaction to record your first income or expense."
                : "Switch role to Admin if you need to add or edit data."}
            </span>
          </li>
          <li className="flex items-start gap-2">
            <Circle className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <span>Visit Insights for spending summaries once data exists.</span>
          </li>
        </ul>
        <div className="flex flex-wrap gap-2">
          {isAdmin ? (
            <Button asChild size="sm">
              <Link to="/transactions">Add your first transaction</Link>
            </Button>
          ) : (
            <Button asChild variant="secondary" size="sm">
              <Link to="/transactions">Go to Transactions</Link>
            </Button>
          )}
          <Button asChild variant="outline" size="sm">
            <Link to="/insights">View Insights</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
