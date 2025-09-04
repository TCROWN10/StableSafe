"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Lock, AlertTriangle } from "lucide-react"
import { format, addDays } from "date-fns"
import { cn } from "@/lib/utils"

const presetDurations = [
  { label: "7 Days", days: 7 },
  { label: "30 Days", days: 30 },
  { label: "90 Days", days: 90 },
  { label: "1 Year", days: 365 },
]

export function CreateLockForm() {
  const [amount, setAmount] = useState("")
  const [selectedToken, setSelectedToken] = useState("USDC")
  const [duration, setDuration] = useState<number | null>(null)
  const [customDate, setCustomDate] = useState<Date>()
  const [isCustomDate, setIsCustomDate] = useState(false)

  const calculateUnlockDate = () => {
    if (isCustomDate && customDate) return customDate
    if (duration) return addDays(new Date(), duration)
    return null
  }

  const calculatePenalty = () => {
    const lockAmount = Number.parseFloat(amount) || 0
    return lockAmount * 0.03 // 3% penalty
  }

  const unlockDate = calculateUnlockDate()
  const penalty = calculatePenalty()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lock className="h-5 w-5" />
          Create New Lock
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount</Label>
          <div className="flex gap-2">
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
            />
            <Select value={selectedToken} onValueChange={setSelectedToken}>
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USDC">USDC</SelectItem>
                <SelectItem value="USDT">USDT</SelectItem>
                <SelectItem value="DAI">DAI</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground">Available: 2,450.00 USDC</p>
        </div>

        {/* Duration Selection */}
        <div className="space-y-2">
          <Label>Lock Duration</Label>
          <div className="grid grid-cols-2 gap-2">
            {presetDurations.map((preset) => (
              <Button
                key={preset.days}
                variant={duration === preset.days && !isCustomDate ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setDuration(preset.days)
                  setIsCustomDate(false)
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>

          {/* Custom Date Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={isCustomDate ? "default" : "outline"}
                className={cn("w-full justify-start text-left font-normal", !customDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {customDate && isCustomDate ? format(customDate, "PPP") : "Custom Date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={customDate}
                onSelect={(date) => {
                  setCustomDate(date)
                  setIsCustomDate(true)
                  setDuration(null)
                }}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Preview Panel */}
        {unlockDate && amount && (
          <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium text-sm">Lock Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unlock Date:</span>
                <span>{format(unlockDate, "PPP")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Early Withdrawal Penalty:</span>
                <span className="text-destructive">
                  3% ({penalty.toFixed(2)} {selectedToken})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reward Points:</span>
                <span className="text-accent">+{Math.floor(Number.parseFloat(amount) * 0.1)} pts</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <AlertTriangle className="h-3 w-3 text-yellow-600 mt-0.5 flex-shrink-0" />
              <span className="text-yellow-800">
                Early withdrawal incurs a 3% penalty that goes to the community pool.
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button className="w-full" disabled={!amount || !unlockDate}>
            Create Lock
          </Button>
          <p className="text-xs text-muted-foreground text-center">You'll need to approve USDC spending first</p>
        </div>
      </CardContent>
    </Card>
  )
}
