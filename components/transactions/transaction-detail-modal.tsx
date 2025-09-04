"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Copy, ExternalLink, Receipt } from "lucide-react"
import { format } from "date-fns"

interface TransactionDetailModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: {
    id: string
    type: string
    description: string
    amount: number
    token: string
    status: string
    timestamp: Date
    txHash: string
    gasUsed: string
    gasFee: string
    blockNumber: number | null
    from: string
    to: string
    penalty?: number
    error?: string
  }
}

export function TransactionDetailModal({ isOpen, onClose, transaction }: TransactionDetailModalProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Transaction Details
          </DialogTitle>
          <DialogDescription>{transaction.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status and Amount */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <div className="text-2xl font-bold">
                {transaction.type === "withdrawal" || transaction.type === "penalty" ? "-" : "+"}
                {transaction.amount.toLocaleString()} {transaction.token}
              </div>
              <div className="text-sm text-muted-foreground">{format(transaction.timestamp, "PPpp")}</div>
            </div>
            {getStatusBadge(transaction.status)}
          </div>

          {/* Transaction Details */}
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Type</span>
                <div className="font-medium capitalize">{transaction.type}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Gas Used</span>
                <div className="font-medium">{transaction.gasUsed}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Gas Fee</span>
                <div className="font-medium">{transaction.gasFee} ETH</div>
              </div>
            </div>

            <Separator />

            {/* Addresses */}
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">From Address</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transaction.from)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="font-mono text-xs bg-muted/50 p-2 rounded break-all">{transaction.from}</div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-muted-foreground">To Address</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transaction.to)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                <div className="font-mono text-xs bg-muted/50 p-2 rounded break-all">{transaction.to}</div>
              </div>
            </div>

            <Separator />

            {/* Transaction Hash */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-muted-foreground">Transaction Hash</span>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(transaction.txHash)}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <div className="font-mono text-xs bg-muted/50 p-2 rounded break-all">{transaction.txHash}</div>
            </div>

            {/* Block Number */}
            {transaction.blockNumber && (
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Block Number</span>
                  <div className="font-medium">{transaction.blockNumber.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Transaction ID</span>
                  <div className="font-medium">{transaction.id}</div>
                </div>
              </div>
            )}

            {/* Additional Info */}
            {transaction.penalty && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                <div className="font-medium text-red-800">Early Withdrawal Penalty</div>
                <div className="text-red-600">
                  {transaction.penalty} {transaction.token} was deducted and sent to the community pool
                </div>
              </div>
            )}

            {transaction.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded text-sm">
                <div className="font-medium text-red-800">Transaction Failed</div>
                <div className="text-red-600">{transaction.error}</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              View on Explorer
            </Button>
            <Button variant="ghost" onClick={() => copyToClipboard(transaction.txHash)}>
              <Copy className="h-4 w-4 mr-2" />
              Copy Hash
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
