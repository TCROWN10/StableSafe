"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { TransactionDetailModal } from "./transaction-detail-modal"
import {
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  Users,
  Gift,
  AlertTriangle,
  ExternalLink,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { format } from "date-fns"

const transactions = [
  {
    id: "tx_001",
    type: "deposit",
    description: "Deposited USDC to wallet",
    amount: 5000,
    token: "USDC",
    status: "confirmed",
    timestamp: new Date("2024-12-01T10:30:00"),
    txHash: "0x1234567890abcdef1234567890abcdef12345678",
    gasUsed: "21000",
    gasFee: "0.0025",
    blockNumber: 18500000,
    from: "0x1111...2222",
    to: "0x3333...4444",
  },
  {
    id: "tx_002",
    type: "lock",
    description: "Created 30-day savings lock",
    amount: 2500,
    token: "USDC",
    status: "confirmed",
    timestamp: new Date("2024-12-01T14:15:00"),
    txHash: "0x2345678901bcdef12345678901bcdef123456789",
    gasUsed: "45000",
    gasFee: "0.0055",
    blockNumber: 18500125,
    from: "0x3333...4444",
    to: "0x5555...6666",
  },
  {
    id: "tx_003",
    type: "contribution",
    description: "Contributed to Emergency Fund Pool",
    amount: 1000,
    token: "USDC",
    status: "pending",
    timestamp: new Date("2024-12-01T16:45:00"),
    txHash: "0x3456789012cdef123456789012cdef1234567890",
    gasUsed: "35000",
    gasFee: "0.0042",
    blockNumber: null,
    from: "0x3333...4444",
    to: "0x7777...8888",
  },
  {
    id: "tx_004",
    type: "withdrawal",
    description: "Early withdrawal from 7-day lock",
    amount: 750,
    token: "USDC",
    status: "confirmed",
    timestamp: new Date("2024-11-30T09:20:00"),
    txHash: "0x4567890123def1234567890123def12345678901",
    gasUsed: "28000",
    gasFee: "0.0034",
    blockNumber: 18499800,
    from: "0x5555...6666",
    to: "0x3333...4444",
    penalty: 22.5,
  },
  {
    id: "tx_005",
    type: "reward",
    description: "Earned loyalty rewards",
    amount: 50,
    token: "points",
    status: "confirmed",
    timestamp: new Date("2024-11-29T18:10:00"),
    txHash: "0x5678901234ef12345678901234ef123456789012",
    gasUsed: "15000",
    gasFee: "0.0018",
    blockNumber: 18499500,
    from: "0x9999...0000",
    to: "0x3333...4444",
  },
  {
    id: "tx_006",
    type: "deposit",
    description: "Failed deposit transaction",
    amount: 1500,
    token: "USDC",
    status: "failed",
    timestamp: new Date("2024-11-28T12:30:00"),
    txHash: "0x6789012345f123456789012345f1234567890123",
    gasUsed: "21000",
    gasFee: "0.0025",
    blockNumber: null,
    from: "0x1111...2222",
    to: "0x3333...4444",
    error: "Insufficient gas limit",
  },
]

const getTransactionIcon = (type: string) => {
  switch (type) {
    case "deposit":
      return <ArrowDownLeft className="h-4 w-4 text-green-600" />
    case "withdrawal":
      return <ArrowUpRight className="h-4 w-4 text-red-600" />
    case "lock":
      return <Lock className="h-4 w-4 text-blue-600" />
    case "contribution":
      return <Users className="h-4 w-4 text-purple-600" />
    case "reward":
      return <Gift className="h-4 w-4 text-yellow-600" />
    case "penalty":
      return <AlertTriangle className="h-4 w-4 text-orange-600" />
    default:
      return <ArrowUpRight className="h-4 w-4" />
  }
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

function TransactionRow({ transaction }: { transaction: (typeof transactions)[0] }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)

  return (
    <>
      <div className="border border-border/50 rounded-lg hover:bg-muted/50 transition-colors">
        {/* Main Row */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex-shrink-0">{getTransactionIcon(transaction.type)}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{transaction.description}</span>
                {getStatusBadge(transaction.status)}
              </div>
              <div className="text-sm text-muted-foreground">
                {format(transaction.timestamp, "MMM dd, yyyy 'at' HH:mm")}
                {transaction.penalty && (
                  <span className="text-destructive ml-2">
                    • Penalty: {transaction.penalty} {transaction.token}
                  </span>
                )}
                {transaction.error && <span className="text-destructive ml-2">• {transaction.error}</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-right">
              <div className="font-medium">
                {transaction.type === "withdrawal" || transaction.type === "penalty" ? "-" : "+"}
                {transaction.amount.toLocaleString()} {transaction.token}
              </div>
              <div className="text-xs text-muted-foreground">Gas: {transaction.gasFee} ETH</div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-border/50 bg-muted/20">
            <div className="grid grid-cols-2 gap-4 py-3 text-sm">
              <div>
                <span className="text-muted-foreground">Transaction Hash:</span>
                <div className="font-mono text-xs break-all">{transaction.txHash}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Block Number:</span>
                <div>{transaction.blockNumber || "Pending"}</div>
              </div>
              <div>
                <span className="text-muted-foreground">From:</span>
                <div className="font-mono text-xs">{transaction.from}</div>
              </div>
              <div>
                <span className="text-muted-foreground">To:</span>
                <div className="font-mono text-xs">{transaction.to}</div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowDetailModal(true)}>
                View Details
              </Button>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Explorer
              </Button>
            </div>
          </div>
        )}
      </div>

      <TransactionDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        transaction={transaction}
      />
    </>
  )
}

export function TransactionList() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.type.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>All Transactions</CardTitle>
          <Badge variant="secondary">{filteredTransactions.length} transactions</Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {filteredTransactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))}
        </div>

        {filteredTransactions.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No transactions found matching your search.</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
