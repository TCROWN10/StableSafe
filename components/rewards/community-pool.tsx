import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Users, DollarSign, Calendar, Info } from "lucide-react"

const communityPool = {
  totalAmount: 2450,
  contributors: 156,
  lastDistribution: new Date("2024-11-01"),
  nextDistribution: new Date("2024-12-01"),
  yourShare: 0.8, // percentage
  estimatedReward: 19.6,
}

const distributionRules = [
  "Pool funds come from early withdrawal penalties",
  "Distributed monthly to active savers",
  "Share based on total locked amount and streak",
  "Minimum 7-day lock required to qualify",
]

export function CommunityPool() {
  const daysToNext = Math.ceil(
    (communityPool.nextDistribution.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
  )
  const monthProgress = ((30 - daysToNext) / 30) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Community Pool
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pool Stats */}
        <div className="text-center">
          <div className="text-3xl font-bold">${communityPool.totalAmount.toLocaleString()}</div>
          <div className="text-sm text-muted-foreground">Available for distribution</div>
          <div className="text-xs text-muted-foreground mt-1">From {communityPool.contributors} contributors</div>
        </div>

        {/* Your Share */}
        <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Your Estimated Share</span>
            <span className="text-sm text-accent font-bold">{communityPool.yourShare}%</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Next Distribution</span>
            <span className="text-sm font-medium">${communityPool.estimatedReward}</span>
          </div>
        </div>

        {/* Distribution Timeline */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Next Distribution
            </span>
            <span>{daysToNext} days</span>
          </div>
          <Progress value={monthProgress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            {communityPool.nextDistribution.toLocaleDateString()}
          </div>
        </div>

        {/* Distribution Rules */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Info className="h-4 w-4" />
            How it Works
          </div>
          <ul className="text-xs space-y-1 text-muted-foreground">
            {distributionRules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-accent mt-0.5">•</span>
                {rule}
              </li>
            ))}
          </ul>
        </div>

        {/* Last Distribution */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Last Distribution</span>
            <span className="font-medium">$15.20</span>
          </div>
          <div className="text-xs text-muted-foreground">{communityPool.lastDistribution.toLocaleDateString()}</div>
        </div>

        {/* Action Button */}
        <Button variant="outline" className="w-full bg-transparent" disabled>
          <DollarSign className="h-4 w-4 mr-2" />
          Distribution in {daysToNext} days
        </Button>
      </CardContent>
    </Card>
  )
}
