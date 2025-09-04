"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Star, Lock, CheckCircle } from "lucide-react"
import { cn } from "@/lib/utils"

const badges = [
  {
    id: 1,
    name: "First Steps",
    description: "Complete your first savings lock",
    icon: "🔒",
    earned: true,
    earnedDate: new Date("2024-11-01"),
    rarity: "common",
    points: 50,
  },
  {
    id: 2,
    name: "Community Helper",
    description: "Contribute to 3 community pots",
    icon: "🤝",
    earned: true,
    earnedDate: new Date("2024-11-15"),
    rarity: "uncommon",
    points: 100,
  },
  {
    id: 3,
    name: "Streak Master",
    description: "Maintain a 30-day saving streak",
    icon: "🔥",
    earned: false,
    progress: 23,
    target: 30,
    rarity: "rare",
    points: 200,
  },
  {
    id: 4,
    name: "Big Saver",
    description: "Lock 10,000 USDC in total",
    icon: "💰",
    earned: false,
    progress: 7500,
    target: 10000,
    rarity: "rare",
    points: 300,
  },
  {
    id: 5,
    name: "Diamond Hands",
    description: "Complete 10 locks without early withdrawal",
    icon: "💎",
    earned: false,
    progress: 6,
    target: 10,
    rarity: "epic",
    points: 500,
  },
  {
    id: 6,
    name: "Community Leader",
    description: "Create 5 successful community pots",
    icon: "👑",
    earned: false,
    progress: 2,
    target: 5,
    rarity: "legendary",
    points: 1000,
  },
]

const rarityColors = {
  common: "bg-gray-100 text-gray-800 border-gray-200",
  uncommon: "bg-green-100 text-green-800 border-green-200",
  rare: "bg-blue-100 text-blue-800 border-blue-200",
  epic: "bg-purple-100 text-purple-800 border-purple-200",
  legendary: "bg-yellow-100 text-yellow-800 border-yellow-200",
}

function BadgeCard({ badge }: { badge: (typeof badges)[0] }) {
  const progressPercentage = badge.progress && badge.target ? (badge.progress / badge.target) * 100 : 0

  return (
    <Card className={cn("relative overflow-hidden", badge.earned ? "bg-accent/5 border-accent/20" : "opacity-75")}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{badge.icon}</div>
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                {badge.name}
                {badge.earned && <CheckCircle className="h-4 w-4 text-green-600" />}
                {!badge.earned && <Lock className="h-4 w-4 text-muted-foreground" />}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{badge.description}</p>
            </div>
          </div>
          <Badge className={rarityColors[badge.rarity]} variant="outline">
            {badge.rarity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {badge.earned ? (
          <div className="flex items-center justify-between">
            <span className="text-sm text-green-600 font-medium">Earned {badge.earnedDate?.toLocaleDateString()}</span>
            <span className="text-sm font-medium text-accent">+{badge.points} pts</span>
          </div>
        ) : (
          <>
            {badge.progress !== undefined && badge.target && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span>
                    {badge.progress.toLocaleString()} / {badge.target.toLocaleString()}
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reward</span>
              <span className="text-sm font-medium">+{badge.points} pts</span>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export function BadgesCollection() {
  const [filter, setFilter] = useState<string>("all")

  const earnedBadges = badges.filter((b) => b.earned)
  const totalBadges = badges.length

  const filteredBadges = badges.filter((badge) => {
    if (filter === "earned") return badge.earned
    if (filter === "locked") return !badge.earned
    return true
  })

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Badge Collection
          </CardTitle>
          <Badge variant="secondary">
            {earnedBadges.length} / {totalBadges} earned
          </Badge>
        </div>
        <div className="flex gap-2">
          <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
            All
          </Button>
          <Button variant={filter === "earned" ? "default" : "outline"} size="sm" onClick={() => setFilter("earned")}>
            Earned ({earnedBadges.length})
          </Button>
          <Button variant={filter === "locked" ? "default" : "outline"} size="sm" onClick={() => setFilter("locked")}>
            Locked ({totalBadges - earnedBadges.length})
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {filteredBadges.map((badge) => (
            <BadgeCard key={badge.id} badge={badge} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
