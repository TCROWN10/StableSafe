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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Calculator } from "lucide-react"

interface EarlyWithdrawalModalProps {
  isOpen: boolean
  onClose: () => void
  lockAmount: number
  token: string
  unlockDate: Date
}

export function EarlyWithdrawalModal({ isOpen, onClose, lockAmount, token, unlockDate }: EarlyWithdrawalModalProps) {
  const [isConfirming, setIsConfirming] = useState(false)

  const penaltyAmount = lockAmount * 0.03
  const receiveAmount = lockAmount - penaltyAmount

  const handleConfirm = async () => {
    setIsConfirming(true)
    // Simulate transaction
    setTimeout(() => {
      setIsConfirming(false)
      onClose()
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Early Withdrawal
          </DialogTitle>
          <DialogDescription>You're about to withdraw your locked savings before the unlock date.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert>
            <Calculator className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <div className="font-medium">Withdrawal Calculation:</div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Locked Amount:</span>
                    <span>
                      {lockAmount.toLocaleString()} {token}
                    </span>
                  </div>
                  <div className="flex justify-between text-destructive">
                    <span>Penalty (3%):</span>
                    <span>
                      -{penaltyAmount.toLocaleString()} {token}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium border-t pt-1">
                    <span>You'll Receive:</span>
                    <span>
                      {receiveAmount.toLocaleString()} {token}
                    </span>
                  </div>
                </div>
              </div>
            </AlertDescription>
          </Alert>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              The penalty amount goes to the community pool and is distributed to other savers. This action cannot be
              undone.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto bg-transparent">
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleConfirm} disabled={isConfirming} className="w-full sm:w-auto">
            {isConfirming ? "Processing..." : `Withdraw ${receiveAmount.toLocaleString()} ${token}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
