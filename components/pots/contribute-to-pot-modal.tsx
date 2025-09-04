"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, Users, Target } from "lucide-react"

interface ContributeToPotModalProps {
  isOpen: boolean
  onClose: () => void
  pot: {
    id: number
    name: string
    targetAmount: number
    currentAmount: number
    contributors: number
    beneficiaryType: string
  }
}

export function ContributeToPotModal({ isOpen, onClose, pot }: ContributeToPotModalProps) {
  const [amount, setAmount] = useState("")
  const [isContributing, setIsContributing] = useState(false)

  const contributionAmount = Number.parseFloat(amount) || 0
  const newTotal = pot.currentAmount + contributionAmount
  const newProgress = (newTotal / pot.targetAmount) * 100
  const yourShare = (contributionAmount / newTotal) * 100

  const handleContribute = async () => {
    setIsContributing(true)
    // Simulate transaction
    setTimeout(() => {
      setIsContributing(false)
      onClose()
      setAmount("")
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Contribute to {pot.name}
          </DialogTitle>
          <DialogDescription>Add funds to this community savings pot.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="contribution-amount">Contribution Amount (USDC)</Label>
            <Input
              id="contribution-amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">Available: 2,450.00 USDC</p>
          </div>

          {/* Preview */}
          {contributionAmount > 0 && (
            <Alert>
              <Calculator className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div className="font-medium">Contribution Preview:</div>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Your Contribution:</span>
                      <span>{contributionAmount.toLocaleString()} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>New Pot Total:</span>
                      <span>{newTotal.toLocaleString()} USDC</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progress:</span>
                      <span>{Math.min(newProgress, 100).toFixed(1)}%</span>
                    </div>
                    {pot.beneficiaryType === "split" && (
                      <div className="flex justify-between">
                        <span>Your Share:</span>
                        <span>{yourShare.toFixed(1)}%</span>
                      </div>
                    )}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Beneficiary Info */}
          <Alert>
            <Target className="h-4 w-4" />
            <AlertDescription>
              {pot.beneficiaryType === "split" &&
                "When the pot reaches its target, funds will be split equally among all contributors."}
              {pot.beneficiaryType === "safe" &&
                "Funds will be released to a Safe multisig wallet when the target is reached."}
              {pot.beneficiaryType === "single" && "All funds will go to the pot creator when the target is reached."}
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            Cancel
          </Button>
          <Button
            onClick={handleContribute}
            disabled={!contributionAmount || contributionAmount <= 0 || isContributing}
            className="w-full sm:w-auto"
          >
            {isContributing ? "Contributing..." : `Contribute ${contributionAmount.toLocaleString()} USDC`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
