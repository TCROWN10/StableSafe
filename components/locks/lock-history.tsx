import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Calendar, ExternalLink, TrendingUp } from "lucide-react"
import { format } from "date-fns"

const lockHistory = [
  {
    id: 1,
    amount: 1000,
    token: "USDC",
    createdDate: new Date("2024-10-15"),
    unlockDate: new Date("2024-11-15"),
    completedDate: new Date("2024-11-15"),
    duration: 30,
    rewardPoints: 100,
    status: "completed",
    txHash: "0x1111...2222",
  },
  {
    id: 2,
    amount: 750,
    token: "USDC",
    createdDate: new Date("2024-09-20"),
    unlockDate: new Date("2024-10-20"),
    completedDate: new Date("2024-10-18"),
    duration: 30,
    rewardPoints: 60,
    penalty: 22.5,
    status: "early_withdrawal",
    txHash: "0x2222...3333",
  },
  {
    id: 3,
    amount: 2000,
    token: "USDC",
    createdDate: new Date("2024-08-01"),
    unlockDate: new Date("2024-11-01"),
    completedDate: new Date("2024-11-01"),
    duration: 90,
    rewardPoints: 300,
    status: "completed",
    txHash: "0x3333...4444",
  },
]

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>
    case "early_withdrawal":
      return <Badge variant="destructive">Early Withdrawal</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <TrendingUp className="h-4 w-4 text-green-600" />
    case "early_withdrawal":
      return <Lock className="h-4 w-4 text-red-600" />
    default:
      return <Lock className="h-4 w-4" />
  }
}

export function LockHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Lock History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {lockHistory.map((lock) => (
            <div
              key={lock.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{getStatusIcon(lock.status)}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">
                      {lock.amount.toLocaleString()} {lock.token}
                    </span>
                    {getStatusBadge(lock.status)}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {format(lock.createdDate, "MMM dd")} - {format(lock.unlockDate, "MMM dd, yyyy")}
                    {lock.penalty && (
                      <span className="text-destructive ml-2">
                        • Penalty: {lock.penalty} {lock.token}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="text-right">
                  <div className="text-sm font-medium text-accent">+{lock.rewardPoints} pts</div>
                  <div className="text-xs text-muted-foreground">{lock.duration} days</div>
                </div>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div>
              <div className="font-medium text-lg">3</div>
              <div className="text-muted-foreground">Total Locks</div>
            </div>
            <div>
              <div className="font-medium text-lg text-accent">460 pts</div>
              <div className="text-muted-foreground">Points Earned</div>
            </div>
            <div>
              <div className="font-medium text-lg">$3,750</div>
              <div className="text-muted-foreground">Total Saved</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
