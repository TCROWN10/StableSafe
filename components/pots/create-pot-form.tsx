"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Users, Plus, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

export function CreatePotForm() {
  const [potName, setPotName] = useState("")
  const [description, setDescription] = useState("")
  const [targetAmount, setTargetAmount] = useState("")
  const [unlockDate, setUnlockDate] = useState<Date>()
  const [beneficiaryType, setBeneficiaryType] = useState("")
  const [members, setMembers] = useState<string[]>([])
  const [newMember, setNewMember] = useState("")

  const addMember = () => {
    if (newMember && !members.includes(newMember)) {
      setMembers([...members, newMember])
      setNewMember("")
    }
  }

  const removeMember = (address: string) => {
    setMembers(members.filter((m) => m !== address))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Create Community Pot
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Pot Name */}
        <div className="space-y-2">
          <Label htmlFor="pot-name">Pot Name</Label>
          <Input
            id="pot-name"
            placeholder="e.g., Family Vacation Fund"
            value={potName}
            onChange={(e) => setPotName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description (Optional)</Label>
          <Textarea
            id="description"
            placeholder="What is this pot for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        {/* Target Amount */}
        <div className="space-y-2">
          <Label htmlFor="target">Target Amount (USDC)</Label>
          <Input
            id="target"
            type="number"
            placeholder="10000"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
          />
        </div>

        {/* Unlock Date */}
        <div className="space-y-2">
          <Label>Unlock Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn("w-full justify-start text-left font-normal", !unlockDate && "text-muted-foreground")}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {unlockDate ? format(unlockDate, "PPP") : "Select unlock date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={unlockDate}
                onSelect={setUnlockDate}
                disabled={(date) => date < new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Beneficiary Type */}
        <div className="space-y-2">
          <Label>Beneficiary Type</Label>
          <Select value={beneficiaryType} onValueChange={setBeneficiaryType}>
            <SelectTrigger>
              <SelectValue placeholder="Select beneficiary type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="safe">Safe Multisig</SelectItem>
              <SelectItem value="split">Equal Split</SelectItem>
              <SelectItem value="single">Single Beneficiary</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {beneficiaryType === "safe" && "Funds released to a Safe multisig wallet"}
            {beneficiaryType === "split" && "Funds split equally among all contributors"}
            {beneficiaryType === "single" && "All funds go to pot creator"}
          </p>
        </div>

        {/* Members */}
        <div className="space-y-2">
          <Label>Invite Members (Optional)</Label>
          <div className="flex gap-2">
            <Input
              placeholder="0x... wallet address"
              value={newMember}
              onChange={(e) => setNewMember(e.target.value)}
            />
            <Button type="button" size="sm" onClick={addMember}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {members.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Invited Members:</p>
              {members.map((member) => (
                <div key={member} className="flex items-center justify-between bg-muted/50 p-2 rounded">
                  <span className="text-sm font-mono">
                    {member.slice(0, 10)}...{member.slice(-4)}
                  </span>
                  <Button variant="ghost" size="sm" onClick={() => removeMember(member)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Create Button */}
        <Button className="w-full" disabled={!potName || !targetAmount || !unlockDate || !beneficiaryType}>
          Create Community Pot
        </Button>
      </CardContent>
    </Card>
  )
}
