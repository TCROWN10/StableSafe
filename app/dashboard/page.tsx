import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BalanceSummary } from "@/components/dashboard/balance-summary"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { ActivityFeed } from "@/components/dashboard/activity-feed"
import { RewardsPreview } from "@/components/dashboard/rewards-preview"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <BalanceSummary />
        <QuickActions />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <div>
            <RewardsPreview />
          </div>
        </div>
      </main>
    </div>
  )
}
