import { StatCard } from "@/components/ui/stat-card"
import { Wallet, Lock, TrendingUp, DollarSign } from "lucide-react"

export function BalanceSummary() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your savings overview.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Balance"
          value="$12,450.00"
          subtitle="≈ 12,450 USDC"
          icon={<Wallet className="h-4 w-4" />}
          trend={{ value: "12.5%", isPositive: true }}
        />

        <StatCard
          title="Available"
          value="$2,450.00"
          subtitle="Ready to use"
          icon={<DollarSign className="h-4 w-4" />}
          className="border-green-200 bg-green-50/50"
        />

        <StatCard
          title="Locked Savings"
          value="$10,000.00"
          subtitle="3 active locks"
          icon={<Lock className="h-4 w-4" />}
          className="border-blue-200 bg-blue-50/50"
        />

        <StatCard
          title="Rewards Earned"
          value="1,250 pts"
          subtitle="This month"
          icon={<TrendingUp className="h-4 w-4" />}
          trend={{ value: "25%", isPositive: true }}
          className="border-yellow-200 bg-yellow-50/50"
        />
      </div>
    </div>
  )
}
