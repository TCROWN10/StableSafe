import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Flame, Target } from "lucide-react"
import { format, subDays, isToday } from "date-fns"
import { cn } from "@/lib/utils"

const currentStreak = 23
const longestStreak = 45
const streakTarget = 30

// Generate calendar data for the last 30 days
const generateStreakCalendar = () => {
  const days = []
  const today = new Date()

  for (let i = 29; i >= 0; i--) {
    const date = subDays(today, i)
    const hasActivity = i < currentStreak || (i === 29 && isToday(date))
    days.push({
      date,
      hasActivity,
      isToday: isToday(date),
    })
  }

  return days
}

const streakCalendar = generateStreakCalendar()

export function LoyaltyStreak() {
  const streakProgress = (currentStreak / streakTarget) * 100
  const daysToTarget = Math.max(0, streakTarget - currentStreak)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-orange-500" />
          Loyalty Streak
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Streak */}
        <div className="text-center">
          <div className="text-4xl font-bold text-orange-500">{currentStreak}</div>
          <div className="text-sm text-muted-foreground">Days in a row</div>
          <Badge className="mt-2 bg-orange-100 text-orange-800">Active Streak</Badge>
        </div>

        {/* Progress to Target */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              Target: {streakTarget} days
            </span>
            <span>{Math.round(streakProgress)}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-orange-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(streakProgress, 100)}%` }}
            />
          </div>
          {daysToTarget > 0 && (
            <div className="text-xs text-muted-foreground text-center">{daysToTarget} more days to reach target</div>
          )}
        </div>

        {/* Calendar View */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            <span>Last 30 Days</span>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {streakCalendar.map((day, index) => (
              <div
                key={index}
                className={cn(
                  "aspect-square rounded-sm flex items-center justify-center text-xs",
                  day.hasActivity ? "bg-orange-500 text-white" : "bg-muted text-muted-foreground",
                  day.isToday && "ring-2 ring-orange-300",
                )}
                title={format(day.date, "MMM dd, yyyy")}
              >
                {format(day.date, "d")}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>30 days ago</span>
            <span>Today</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-bold">{longestStreak}</div>
            <div className="text-xs text-muted-foreground">Longest Streak</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold">+{currentStreak * 5}</div>
            <div className="text-xs text-muted-foreground">Bonus Points</div>
          </div>
        </div>

        {/* Streak Rewards */}
        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="text-sm font-medium text-orange-800 mb-1">Streak Rewards</div>
          <div className="text-xs text-orange-700">
            • Daily: +5 points per day • Weekly: +50 bonus points • Monthly: +200 bonus points
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
