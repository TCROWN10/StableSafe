import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Lock, Users, Eye, DollarSign } from "lucide-react"

const features = [
  {
    icon: Lock,
    title: "Lockable Savings",
    description:
      "Set savings goals with time-locked deposits. Early withdrawal penalties go to the community pool, encouraging discipline.",
  },
  {
    icon: Users,
    title: "Group Susu Pots",
    description:
      "Join or create community savings groups. Pool funds together and release to beneficiaries through secure multi-signature wallets.",
  },
  {
    icon: Eye,
    title: "Transparent Rules",
    description:
      "Every transaction, penalty, and reward is visible on-chain. No hidden fees or surprise changes to your savings.",
  },
  {
    icon: DollarSign,
    title: "Low Fees",
    description:
      "Minimal gas costs and no platform fees. Your savings grow without being eaten away by excessive charges.",
  },
]

export function Features() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Why Choose StableSafe?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Built for savers who want transparency, community, and control over their financial future.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="relative overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:bg-card/80 hover:shadow-lg"
            >
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <feature.icon className="h-6 w-6 text-accent" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
