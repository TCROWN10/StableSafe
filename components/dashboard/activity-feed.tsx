import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownLeft, Users, Lock, ExternalLink } from "lucide-react"

const activities = [
  {
    id: 1,
    type: "deposit",
    description: "Deposited $1,000 to 30-day lock",
    amount: "+$1,000",
    status: "confirmed",
    timestamp: "2 hours ago",
    txHash: "0x1234...5678",
  },
  {
    id: 2,
    type: "contribution",
    description: "Contributed to Community Pot #3",
    amount: "+$500",
    status: "pending",
    timestamp: "1 day ago",
    txHash: "0x2345...6789",
  },
  {
    id: 3,
    type: "reward",
    description: "Earned loyalty rewards",
    amount: "+50 pts",
    status: "confirmed",
    timestamp: "3 days ago",
    txHash: "0x3456...7890",
  },
  {
    id: 4,
    type: "withdrawal",
    description: "Early withdrawal from 7-day lock",
    amount: "-$750",
    status: "confirmed",
    timestamp: "1 week ago",
    txHash: "0x4567...8901",
  },
]

const getActivityIcon = (type: string) => {
  switch (type) {
    case "deposit":
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />
    case "withdrawal":
      return <ArrowUpRight className="h-4 w-4 text-red-600" />
    case "contribution":
      return <Users className="h-4 w-4 text-blue-600" />
    case "reward":
      return <Lock className="h-4 w-4 text-yellow-600" />
    default:
      return <ArrowUpRight className="h-4 w-4" />
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "confirmed":
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          Confirmed
        </Badge>
      )
    case "pending":
      return (
        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
          Pending
        </Badge>
      )
    case "failed":
      return <Badge variant="destructive">Failed</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export function ActivityFeed() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Recent Activity</CardTitle>
        <Button variant="ghost" size="sm">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">{getActivityIcon(activity.type)}</div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">{activity.amount}</span>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
