"use client"

import { cn } from "@/lib/utils"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProgressCircle } from "@/components/ui/progress-circle"
import { Lock, AlertTriangle, ExternalLink } from "lucide-react"
import { format, differenceInDays, differenceInHours } from "date-fns"

const activeLocks = [
  {
    id: 1,
    amount: 5000,
    token: "USDC",
    unlockDate: new Date("2024-12-15"),
    createdDate: new Date("2024-11-15"),
    duration: 30,
    rewardPoints: 500,
    txHash: "0x1234...5678",
  },
  {
    id: 2,
    amount: 2500,
    token: "USDC",
    unlockDate: new Date("2024-12-25"),
    createdDate: new Date("2024-12-18"),
    duration: 7,
    rewardPoints: 250,
    txHash: "0x2345...6789",
  },
  {
    id: 3,
    amount: 10000,
    token: "USDC",
    unlockDate: new Date("2025-03-15"),
    createdDate: new Date("2024-12-15"),
    duration: 90,
    rewardPoints: 1000,
    txHash: "0x3456...7890",
  },
]

function LockCard({ lock }: { lock: (typeof activeLocks)[0] }) {
  const now = new Date()
  const totalDuration = differenceInDays(lock.unlockDate, lock.createdDate)
  const elapsed = differenceInDays(now, lock.createdDate)
  const remaining = differenceInDays(lock.unlockDate, now)
  const progress = Math.min((elapsed / totalDuration) * 100, 100)
  const isUnlocked = now >= lock.unlockDate

  const formatTimeRemaining = () => {
    if (isUnlocked) return "Unlocked"
    if (remaining > 0) return `${remaining} days`
    const hours = differenceInHours(lock.unlockDate, now)
    return `${hours} hours`
  }

  const calculatePenalty = () => {
    return lock.amount * 0.03
  }

  return (
    <Card className={cn("", isUnlocked && "border-green-200 bg-green-50/50")}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-4 w-4" />
            {lock.amount.toLocaleString()} {lock.token}
          </CardTitle>
          <Badge
            variant={isUnlocked ? "secondary" : "outline"}
            className={isUnlocked ? "bg-green-100 text-green-800" : ""}
          >
            {isUnlocked ? "Ready" : formatTimeRemaining()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress */}
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          <ProgressCircle progress={progress} size="sm">
            <span className="text-xs font-medium">{Math.round(progress)}%</span>
          </ProgressCircle>
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Unlock Date</span>
            <div className="font-medium">{format(lock.unlockDate, "MMM dd, yyyy")}</div>
          </div>
          <div>
            <span className="text-muted-foreground">Reward Points</span>
            <div className="font-medium text-accent">+{lock.rewardPoints} pts</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {isUnlocked ? (
            <Button className="flex-1">
              Withdraw {lock.amount.toLocaleString()} {lock.token}
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                className="flex-1 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground bg-transparent"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Early Withdraw
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>

        {/* Early Withdrawal Warning */}
        {!isUnlocked && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
            Early withdrawal penalty: {calculatePenalty().toLocaleString()} {lock.token} (3%)
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function ActiveLocks() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Active Locks</h2>
        <Badge variant="secondary">{activeLocks.length} active</Badge>
      </div>

      <div className="grid gap-4">
        {activeLocks.map((lock) => (
          <LockCard key={lock.id} lock={lock} />
        ))}
      </div>
    </div>
  )
}
