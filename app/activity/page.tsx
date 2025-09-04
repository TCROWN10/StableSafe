import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { TransactionFilters } from "@/components/transactions/transaction-filters"
import { TransactionList } from "@/components/transactions/transaction-list"
import { TransactionSummary } from "@/components/transactions/transaction-summary"

export default function ActivityPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction Activity</h1>
          <p className="text-muted-foreground">View and manage all your StableSafe transactions.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="space-y-6">
              <TransactionSummary />
              <TransactionFilters />
            </div>
          </div>
          <div className="lg:col-span-3">
            <TransactionList />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
