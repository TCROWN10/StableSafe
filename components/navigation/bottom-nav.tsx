"use client"

import { Button } from "@/components/ui/button"
import { Home, Lock, Users, Activity, Trophy } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Locks", href: "/locks", icon: Lock },
  { name: "Pots", href: "/pots", icon: Users },
  { name: "Activity", href: "/activity", icon: Activity },
  { name: "Rewards", href: "/rewards", icon: Trophy },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border md:hidden">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.name} href={item.href} className="flex-1">
              <Button
                variant="ghost"
                size="sm"
                className={cn("w-full flex-col gap-1 h-auto py-2", isActive && "text-accent bg-accent/10")}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs">{item.name}</span>
              </Button>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
