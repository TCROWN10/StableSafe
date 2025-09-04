import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatCard } from "@/components/ui/stat-card"
import { ProgressCircle } from "@/components/ui/progress-circle"
import { Wallet, TrendingUp, Users, Lock } from "lucide-react"

export function DemoWidget() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8 bg-muted/20">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            See StableSafe in Action
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Preview how your savings dashboard would look with active locks and community pots.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Wallet Balance */}
          <StatCard
            title="Total Balance"
            value="$12,450.00"
            subtitle="Available: $2,450.00 • Locked: $10,000.00"
            icon={<Wallet className="h-4 w-4" />}
            trend={{ value: "12.5%", isPositive: true }}
          />

          {/* Active Locks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Lock className="h-4 w-4" />
                Active Savings Lock
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">$5,000</div>
                <div className="text-xs text-muted-foreground">Unlocks in 23 days</div>
              </div>
              <ProgressCircle progress={65} size="md">
                <span className="text-xs font-medium">65%</span>
              </ProgressCircle>
            </CardContent>
          </Card>

          {/* Community Pot */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                <Users className="h-4 w-4" />
                Community Pot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$8,750</div>
              <div className="text-xs text-muted-foreground">12 contributors • Target: $10,000</div>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent rounded-full" style={{ width: "87.5%" }} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  <span className="text-sm">Deposited $1,000 to 30-day lock</span>
                </div>
                <span className="text-xs text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full" />
                  <span className="text-sm">Contributed $500 to Community Pot #3</span>
                </div>
                <span className="text-xs text-muted-foreground">1 day ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm">Earned 50 reward points</span>
                </div>
                <span className="text-xs text-muted-foreground">3 days ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
