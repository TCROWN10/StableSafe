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
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2, ExternalLink, Wallet } from "lucide-react"

interface TransactionModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: {
    title: string
    description: string
    amount?: string
    token?: string
    estimatedGas?: string
    steps: string[]
  }
}

type TransactionState = "idle" | "approving" | "pending" | "confirmed" | "failed"

export function TransactionModal({ isOpen, onClose, transaction }: TransactionModalProps) {
  const [state, setState] = useState<TransactionState>("idle")
  const [currentStep, setCurrentStep] = useState(0)
  const [txHash, setTxHash] = useState("")

  const handleTransaction = async () => {
    setState("approving")
    setCurrentStep(0)

    // Simulate approval step
    setTimeout(() => {
      setState("pending")
      setCurrentStep(1)
      setTxHash("0x1234567890abcdef1234567890abcdef12345678")

      // Simulate confirmation
      setTimeout(() => {
        if (Math.random() > 0.1) {
          setState("confirmed")
          setCurrentStep(2)
        } else {
          setState("failed")
        }
      }, 3000)
    }, 2000)
  }

  const handleClose = () => {
    setState("idle")
    setCurrentStep(0)
    setTxHash("")
    onClose()
  }

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return "completed"
    if (stepIndex === currentStep) return "active"
    return "pending"
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{transaction.title}</DialogTitle>
          <DialogDescription>{transaction.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Details */}
          {transaction.amount && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  {transaction.amount} {transaction.token}
                </span>
              </div>
              {transaction.estimatedGas && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-muted-foreground">Estimated Gas</span>
                  <span className="text-sm">{transaction.estimatedGas} ETH</span>
                </div>
              )}
            </div>
          )}

          {/* Transaction Steps */}
          {state !== "idle" && (
            <div className="space-y-3">
              {transaction.steps.map((step, index) => {
                const status = getStepStatus(index)
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {status === "completed" ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : status === "active" ? (
                        <Loader2 className="h-5 w-5 animate-spin text-accent" />
                      ) : (
                        <div className="h-5 w-5 rounded-full border-2 border-muted" />
                      )}
                    </div>
                    <span className={`text-sm ${status === "completed" ? "text-muted-foreground" : ""}`}>{step}</span>
                  </div>
                )
              })}
            </div>
          )}

          {/* Status Messages */}
          {state === "approving" && (
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>Please approve the transaction in your wallet.</AlertDescription>
            </Alert>
          )}

          {state === "pending" && (
            <Alert>
              <Loader2 className="h-4 w-4 animate-spin" />
              <AlertDescription>
                Transaction submitted. Waiting for confirmation...
                {txHash && (
                  <Button variant="link" className="h-auto p-0 ml-2 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View on Explorer
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {state === "confirmed" && (
            <Alert>
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Transaction confirmed successfully!
                {txHash && (
                  <Button variant="link" className="h-auto p-0 ml-2 text-xs">
                    <ExternalLink className="h-3 w-3 mr-1" />
                    View Transaction
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {state === "failed" && (
            <Alert>
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">
                Transaction failed. Please try again or check your wallet.
              </AlertDescription>
            </Alert>
          )}

          {/* Progress Bar */}
          {state !== "idle" && state !== "failed" && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(((currentStep + 1) / transaction.steps.length) * 100)}%</span>
              </div>
              <Progress value={((currentStep + 1) / transaction.steps.length) * 100} />
            </div>
          )}
        </div>

        <DialogFooter>
          {state === "idle" && (
            <>
              <Button variant="outline" onClick={handleClose} className="bg-transparent">
                Cancel
              </Button>
              <Button onClick={handleTransaction}>Confirm Transaction</Button>
            </>
          )}
          {(state === "confirmed" || state === "failed") && (
            <Button onClick={handleClose} className="w-full">
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
