import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Lock, Users, ArrowUpRight } from "lucide-react"

const actions = [
  {
    title: "Deposit Funds",
    description: "Add USDC to your wallet",
    icon: Plus,
    variant: "default" as const,
  },
  {
    title: "Create Lock",
    description: "Start a new savings goal",
    icon: Lock,
    variant: "secondary" as const,
  },
  {
    title: "Join Pot",
    description: "Contribute to community savings",
    icon: Users,
    variant: "outline" as const,
  },
  {
    title: "Withdraw",
    description: "Access available funds",
    icon: ArrowUpRight,
    variant: "ghost" as const,
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((action) => (
            <Button key={action.title} variant={action.variant} className="h-auto flex-col gap-2 p-4 text-left">
              <action.icon className="h-5 w-5" />
              <div>
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs opacity-70">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
