import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, ExternalLink, TrendingUp, Clock } from "lucide-react"
import { format } from "date-fns"

const myContributions = [
  {
    id: 1,
    potName: "Emergency Fund Pool",
    myContribution: 1500,
    totalPot: 32500,
    myShare: 4.6,
    status: "active",
    contributionDate: new Date("2024-11-01"),
    unlockDate: new Date("2025-06-15"),
    beneficiaryType: "split",
  },
  {
    id: 2,
    potName: "Local School Fundraiser",
    myContribution: 750,
    totalPot: 18750,
    myShare: 4.0,
    status: "active",
    contributionDate: new Date("2024-10-15"),
    unlockDate: new Date("2025-03-01"),
    beneficiaryType: "safe",
  },
  {
    id: 3,
    potName: "Community Garden Project",
    myContribution: 500,
    totalPot: 10000,
    myShare: 5.0,
    status: "completed",
    contributionDate: new Date("2024-08-01"),
    unlockDate: new Date("2024-11-01"),
    beneficiaryType: "split",
    released: true,
    receivedAmount: 500,
  },
]

const getStatusBadge = (status: string, released?: boolean) => {
  if (status === "completed") {
    return released ? (
      <Badge className="bg-green-100 text-green-800">Released</Badge>
    ) : (
      <Badge className="bg-blue-100 text-blue-800">Ready</Badge>
    )
  }
  return <Badge variant="secondary">Active</Badge>
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <TrendingUp className="h-4 w-4 text-green-600" />
    case "active":
      return <Clock className="h-4 w-4 text-blue-600" />
    default:
      return <Users className="h-4 w-4" />
  }
}

export function MyContributions() {
  const totalContributed = myContributions.reduce((sum, contrib) => sum + contrib.myContribution, 0)
  const activeContributions = myContributions.filter((c) => c.status === "active").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          My Contributions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold">${totalContributed.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Total Contributed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{activeContributions}</div>
              <div className="text-sm text-muted-foreground">Active Pots</div>
            </div>
          </div>

          {/* Contributions List */}
          <div className="space-y-3">
            {myContributions.map((contribution) => (
              <div
                key={contribution.id}
                className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">{getStatusIcon(contribution.status)}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{contribution.potName}</span>
                      {getStatusBadge(contribution.status, contribution.released)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Contributed: ${contribution.myContribution.toLocaleString()} • Share: {contribution.myShare}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(contribution.contributionDate, "MMM dd, yyyy")}
                      {contribution.released && contribution.receivedAmount && (
                        <span className="text-green-600 ml-2">
                          • Received: ${contribution.receivedAmount.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <div className="text-sm font-medium">${contribution.totalPot.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Total Pot</div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
