import { Hero } from "@/components/landing/hero"
import { Features } from "@/components/landing/features"
import { DemoWidget } from "@/components/landing/demo-widget"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <Hero />
      <Features />
      <DemoWidget />
      <Footer />
    </main>
  )
}
