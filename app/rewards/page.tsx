import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { RewardsOverview } from "@/components/rewards/rewards-overview"
import { BadgesCollection } from "@/components/rewards/badges-collection"
import { LoyaltyStreak } from "@/components/rewards/loyalty-streak"
import { CommunityPool } from "@/components/rewards/community-pool"
import { RewardsHistory } from "@/components/rewards/rewards-history"

export default function RewardsPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Rewards & Achievements</h1>
          <p className="text-muted-foreground">Track your progress and earn rewards for consistent saving habits.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <RewardsOverview />
            <BadgesCollection />
            <RewardsHistory />
          </div>
          <div className="space-y-6">
            <LoyaltyStreak />
            <CommunityPool />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
