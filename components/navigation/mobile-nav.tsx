"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Home, Lock, Users, Activity, Trophy, Settings, Menu } from "lucide-react"
import Link from "next/link"

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "My Locks", href: "/locks", icon: Lock },
  { name: "Community Pots", href: "/pots", icon: Users },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Rewards", href: "/rewards", icon: Trophy },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function MobileNav() {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="flex flex-col gap-4 mt-8">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  )
}
