import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { CreateLockForm } from "@/components/locks/create-lock-form"
import { ActiveLocks } from "@/components/locks/active-locks"
import { LockHistory } from "@/components/locks/lock-history"

export default function LocksPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Personal Savings Locks</h1>
          <p className="text-muted-foreground">Create time-locked savings goals and track your progress.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <CreateLockForm />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <ActiveLocks />
            <LockHistory />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
