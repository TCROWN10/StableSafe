"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Calendar, ExternalLink, Copy } from "lucide-react"
import { format } from "date-fns"

interface PotDetailModalProps {
  isOpen: boolean
  onClose: () => void
  pot: {
    id: number
    name: string
    description?: string
    targetAmount: number
    currentAmount: number
    contributors: number
    unlockDate: Date
    creator: string
    beneficiaryType: string
    safeAddress?: string | null
  }
}

const contributors = [
  { address: "0x1234...5678", amount: 5000, date: new Date("2024-11-01") },
  { address: "0x2345...6789", amount: 3500, date: new Date("2024-11-05") },
  { address: "0x3456...7890", amount: 2000, date: new Date("2024-11-10") },
  { address: "0x4567...8901", amount: 1500, date: new Date("2024-11-15") },
]

const timeline = [
  { event: "Pot Created", date: new Date("2024-10-15"), description: "Emergency Fund Pool created" },
  { event: "First Contribution", date: new Date("2024-11-01"), description: "5,000 USDC contributed" },
  { event: "Milestone Reached", date: new Date("2024-11-10"), description: "50% of target reached" },
  { event: "Recent Activity", date: new Date("2024-11-15"), description: "New contributor joined" },
]

export function PotDetailModal({ isOpen, onClose, pot }: PotDetailModalProps) {
  const progress = (pot.currentAmount / pot.targetAmount) * 100

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            {pot.name}
          </DialogTitle>
          {pot.description && <DialogDescription>{pot.description}</DialogDescription>}
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-3" />
            <div className="flex justify-between text-sm">
              <span>${pot.currentAmount.toLocaleString()} raised</span>
              <span>${pot.targetAmount.toLocaleString()} target</span>
            </div>
          </div>

          {/* Key Details */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{pot.contributors} contributors</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{format(pot.unlockDate, "MMM dd, yyyy")}</span>
            </div>
          </div>

          {/* Safe Address */}
          {pot.safeAddress && (
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Safe Multisig Address</div>
                  <div className="text-xs text-muted-foreground font-mono">{pot.safeAddress}</div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(pot.safeAddress!)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Contributors List */}
          <div className="space-y-3">
            <h4 className="font-medium">Contributors</h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {contributors.map((contributor, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {contributor.address.slice(2, 4).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-mono">{contributor.address}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">${contributor.amount.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">{format(contributor.date, "MMM dd")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <h4 className="font-medium">Activity Timeline</h4>
            <div className="space-y-3 max-h-32 overflow-y-auto">
              {timeline.map((event, index) => (
                <div key={index} className="flex gap-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-accent rounded-full mt-2" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{event.event}</div>
                    <div className="text-xs text-muted-foreground">{event.description}</div>
                    <div className="text-xs text-muted-foreground">{format(event.date, "MMM dd, yyyy")}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
