import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react"

const summaryStats = [
  {
    title: "Total Inflow",
    value: "$8,750",
    change: "+12.5%",
    isPositive: true,
    icon: TrendingUp,
  },
  {
    title: "Total Outflow",
    value: "$2,250",
    change: "-5.2%",
    isPositive: false,
    icon: TrendingDown,
  },
  {
    title: "This Month",
    value: "24 txns",
    change: "+8 from last month",
    isPositive: true,
    icon: Activity,
  },
  {
    title: "Pending",
    value: "3 txns",
    change: "Awaiting confirmation",
    isPositive: null,
    icon: Clock,
  },
]

export function TransactionSummary() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {summaryStats.map((stat) => (
            <div key={stat.title} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <stat.icon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{stat.title}</span>
              </div>
              <div className="text-right">
                <div className="font-medium">{stat.value}</div>
                <div
                  className={`text-xs ${
                    stat.isPositive === true
                      ? "text-green-600"
                      : stat.isPositive === false
                        ? "text-red-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
