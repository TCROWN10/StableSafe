"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProgressCircle } from "@/components/ui/progress-circle"
import { Users, Calendar, Target, ExternalLink, Plus } from "lucide-react"
import { differenceInDays } from "date-fns"
import { ContributeToPotModal } from "./contribute-to-pot-modal"

const communityPots = [
  {
    id: 1,
    name: "Emergency Fund Pool",
    description: "Community emergency fund for unexpected expenses",
    targetAmount: 50000,
    currentAmount: 32500,
    contributors: 24,
    unlockDate: new Date("2025-06-15"),
    creator: "0x1234...5678",
    beneficiaryType: "split",
    isPublic: true,
    safeAddress: null,
  },
  {
    id: 2,
    name: "Local School Fundraiser",
    description: "Raising funds for new playground equipment",
    targetAmount: 25000,
    currentAmount: 18750,
    contributors: 15,
    unlockDate: new Date("2025-03-01"),
    creator: "0x2345...6789",
    beneficiaryType: "safe",
    isPublic: true,
    safeAddress: "0xSafe...1234",
  },
  {
    id: 3,
    name: "Family Vacation Fund",
    description: "Saving for our annual family trip",
    targetAmount: 15000,
    currentAmount: 8250,
    contributors: 6,
    unlockDate: new Date("2025-07-01"),
    creator: "0x3456...7890",
    beneficiaryType: "single",
    isPublic: false,
    safeAddress: null,
  },
]

function PotCard({ pot }: { pot: (typeof communityPots)[0] }) {
  const [showContributeModal, setShowContributeModal] = useState(false)
  const progress = (pot.currentAmount / pot.targetAmount) * 100
  const daysRemaining = differenceInDays(pot.unlockDate, new Date())
  const isExpired = daysRemaining <= 0

  const getBeneficiaryBadge = (type: string) => {
    switch (type) {
      case "safe":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            Safe Multisig
          </Badge>
        )
      case "split":
        return (
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Equal Split
          </Badge>
        )
      case "single":
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-800">
            Single Beneficiary
          </Badge>
        )
      default:
        return <Badge variant="secondary">{type}</Badge>
    }
  }

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                {pot.name}
                {!pot.isPublic && (
                  <Badge variant="outline" className="text-xs">
                    Private
                  </Badge>
                )}
              </CardTitle>
              {pot.description && <p className="text-sm text-muted-foreground mt-1">{pot.description}</p>}
            </div>
            <ProgressCircle progress={progress} size="sm">
              <span className="text-xs font-medium">{Math.round(progress)}%</span>
            </ProgressCircle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                ${pot.currentAmount.toLocaleString()} / ${pot.targetAmount.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span>{pot.contributors} contributors</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{isExpired ? "Expired" : `${daysRemaining} days left`}</span>
            </div>
          </div>

          {/* Beneficiary & Safe */}
          <div className="flex items-center justify-between">
            {getBeneficiaryBadge(pot.beneficiaryType)}
            {pot.safeAddress && (
              <Button variant="ghost" size="sm" className="h-6 text-xs">
                <ExternalLink className="h-3 w-3 mr-1" />
                Safe
              </Button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!isExpired && progress < 100 ? (
              <Button className="flex-1" onClick={() => setShowContributeModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Contribute
              </Button>
            ) : (
              <Button className="flex-1 bg-transparent" variant="outline" disabled>
                {progress >= 100 ? "Target Reached" : "Expired"}
              </Button>
            )}
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>

          {/* Release Button for Eligible Pots */}
          {(progress >= 100 || isExpired) && (
            <Button variant="secondary" className="w-full">
              <Target className="h-4 w-4 mr-2" />
              Release Funds
            </Button>
          )}
        </CardContent>
      </Card>

      <ContributeToPotModal isOpen={showContributeModal} onClose={() => setShowContributeModal(false)} pot={pot} />
    </>
  )
}

export function PotsList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Available Pots</h2>
        <Badge variant="secondary">{communityPots.length} active</Badge>
      </div>

      <div className="grid gap-4">
        {communityPots.map((pot) => (
          <PotCard key={pot.id} pot={pot} />
        ))}
      </div>
    </div>
  )
}
