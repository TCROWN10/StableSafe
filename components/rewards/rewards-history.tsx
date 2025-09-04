import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Gift, TrendingUp, Users, Lock, Calendar, ExternalLink } from "lucide-react"
import { format } from "date-fns"

const rewardsHistory = [
  {
    id: 1,
    type: "badge",
    title: "Community Helper Badge Earned",
    description: "Contributed to 3 community pots",
    points: 100,
    date: new Date("2024-11-15"),
    icon: "🤝",
  },
  {
    id: 2,
    type: "streak",
    title: "Weekly Streak Bonus",
    description: "Maintained 7-day saving streak",
    points: 50,
    date: new Date("2024-11-10"),
    icon: "🔥",
  },
  {
    id: 3,
    type: "distribution",
    title: "Community Pool Distribution",
    description: "Monthly reward from penalty pool",
    points: 0,
    amount: 15.2,
    token: "USDC",
    date: new Date("2024-11-01"),
    icon: "💰",
  },
  {
    id: 4,
    type: "lock",
    title: "Lock Completion Bonus",
    description: "Completed 30-day savings lock",
    points: 75,
    date: new Date("2024-10-28"),
    icon: "🔒",
  },
  {
    id: 5,
    type: "badge",
    title: "First Steps Badge Earned",
    description: "Completed your first savings lock",
    points: 50,
    date: new Date("2024-10-15"),
    icon: "🏆",
  },
  {
    id: 6,
    type: "referral",
    title: "Referral Bonus",
    description: "Friend completed their first lock",
    points: 25,
    date: new Date("2024-10-10"),
    icon: "👥",
  },
]

const getRewardIcon = (type: string) => {
  switch (type) {
    case "badge":
      return <Gift className="h-4 w-4 text-purple-600" />
    case "streak":
      return <TrendingUp className="h-4 w-4 text-orange-600" />
    case "distribution":
      return <Users className="h-4 w-4 text-green-600" />
    case "lock":
      return <Lock className="h-4 w-4 text-blue-600" />
    case "referral":
      return <Users className="h-4 w-4 text-pink-600" />
    default:
      return <Gift className="h-4 w-4" />
  }
}

const getRewardBadge = (type: string) => {
  switch (type) {
    case "badge":
      return <Badge className="bg-purple-100 text-purple-800">Badge</Badge>
    case "streak":
      return <Badge className="bg-orange-100 text-orange-800">Streak</Badge>
    case "distribution":
      return <Badge className="bg-green-100 text-green-800">Distribution</Badge>
    case "lock":
      return <Badge className="bg-blue-100 text-blue-800">Lock Bonus</Badge>
    case "referral":
      return <Badge className="bg-pink-100 text-pink-800">Referral</Badge>
    default:
      return <Badge variant="secondary">{type}</Badge>
  }
}

export function RewardsHistory() {
  const totalPointsEarned = rewardsHistory.reduce((sum, reward) => sum + reward.points, 0)
  const totalUSDCEarned = rewardsHistory.filter((r) => r.amount).reduce((sum, reward) => sum + (reward.amount || 0), 0)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Rewards History
          </CardTitle>
          <Badge variant="secondary">{rewardsHistory.length} rewards</Badge>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-accent">{totalPointsEarned}</div>
            <div className="text-xs text-muted-foreground">Total Points</div>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <div className="text-lg font-bold text-green-600">${totalUSDCEarned}</div>
            <div className="text-xs text-muted-foreground">Total USDC</div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {rewardsHistory.map((reward) => (
            <div
              key={reward.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 text-2xl">{reward.icon}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">{reward.title}</span>
                    {getRewardBadge(reward.type)}
                  </div>
                  <div className="text-sm text-muted-foreground">{reward.description}</div>
                  <div className="text-xs text-muted-foreground">{format(reward.date, "MMM dd, yyyy")}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  {reward.points > 0 && <div className="text-sm font-medium text-accent">+{reward.points} pts</div>}
                  {reward.amount && (
                    <div className="text-sm font-medium text-green-600">
                      +${reward.amount} {reward.token}
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border text-center">
          <Button variant="outline" className="bg-transparent">
            Load More History
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
