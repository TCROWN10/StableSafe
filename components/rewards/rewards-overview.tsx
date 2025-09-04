import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Trophy, Star, Target, TrendingUp } from "lucide-react"

const currentLevel = {
  level: 5,
  name: "Dedicated Saver",
  currentPoints: 1250,
  nextLevelPoints: 2000,
  benefits: ["5% bonus rewards", "Early access to new features", "Priority support"],
}

const nextLevel = {
  level: 6,
  name: "Master Saver",
  benefits: ["10% bonus rewards", "Exclusive community access", "Custom badges"],
}

export function RewardsOverview() {
  const progressToNext = (currentLevel.currentPoints / currentLevel.nextLevelPoints) * 100
  const pointsNeeded = currentLevel.nextLevelPoints - currentLevel.currentPoints

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Current Level */}
      <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Current Level
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold">Level {currentLevel.level}</div>
            <div className="text-lg text-accent font-medium">{currentLevel.name}</div>
            <div className="text-sm text-muted-foreground mt-1">
              {currentLevel.currentPoints.toLocaleString()} points
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {nextLevel.level}</span>
              <span>{Math.round(progressToNext)}%</span>
            </div>
            <Progress value={progressToNext} className="h-2" />
            <div className="text-xs text-muted-foreground text-center">
              {pointsNeeded.toLocaleString()} points to {nextLevel.name}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Current Benefits:</div>
            <ul className="text-xs space-y-1">
              {currentLevel.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-accent" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Next Level Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Next Level
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-muted-foreground">Level {nextLevel.level}</div>
            <div className="text-lg font-medium">{nextLevel.name}</div>
            <div className="text-sm text-muted-foreground mt-1">
              Unlock at {currentLevel.nextLevelPoints.toLocaleString()} points
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Unlock Benefits:</div>
            <ul className="text-xs space-y-1">
              {nextLevel.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center gap-2">
                  <Star className="h-3 w-3 text-muted-foreground" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <Button className="w-full bg-transparent" variant="outline" disabled>
            <TrendingUp className="h-4 w-4 mr-2" />
            {pointsNeeded.toLocaleString()} points needed
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
