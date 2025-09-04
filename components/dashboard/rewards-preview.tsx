import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProgressCircle } from "@/components/ui/progress-circle"
import { Trophy, Star, Target, ArrowRight } from "lucide-react"

const badges = [
  { name: "First Lock", earned: true, icon: "🔒" },
  { name: "Community Helper", earned: true, icon: "🤝" },
  { name: "Streak Master", earned: false, icon: "🔥" },
]

export function RewardsPreview() {
  return (
    <div className="space-y-6">
      {/* Points Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Rewards
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold">1,250</div>
            <div className="text-sm text-muted-foreground">Total Points</div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm">Next Badge</span>
            <ProgressCircle progress={75} size="sm">
              <span className="text-xs">75%</span>
            </ProgressCircle>
          </div>

          <Button className="w-full bg-transparent" variant="outline">
            View All Rewards
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {badges.map((badge) => (
              <div key={badge.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-sm font-medium">{badge.name}</span>
                </div>
                {badge.earned ? (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Earned
                  </Badge>
                ) : (
                  <Badge variant="outline">Locked</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Pool */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Community Pool
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="text-center">
              <div className="text-2xl font-bold">$2,450</div>
              <div className="text-sm text-muted-foreground">From penalties</div>
            </div>
            <div className="text-xs text-muted-foreground text-center">
              Pool funds are distributed to active savers monthly
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
