import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { BottomNav } from "@/components/navigation/bottom-nav"
import { CreatePotForm } from "@/components/pots/create-pot-form"
import { PotsList } from "@/components/pots/pots-list"
import { MyContributions } from "@/components/pots/my-contributions"

export default function PotsPage() {
  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <DashboardHeader />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Community Savings Pots</h1>
          <p className="text-muted-foreground">Join group savings or create your own community pot (Susu).</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <CreatePotForm />
          </div>
          <div className="lg:col-span-2 space-y-6">
            <PotsList />
            <MyContributions />
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
