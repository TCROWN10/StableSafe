"use client";

import { Button } from "@/components/ui/button";
import { WalletConnectButton } from "@/components/ui/wallet-connect-button";
import { ArrowRight, Shield, Users, Zap } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/20 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <div className="mb-8 flex justify-center">
            <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Shield className="h-4 w-4" />
              Decentralized & Secure
            </div>
          </div>

          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            Save smarter with{" "}
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              StableSafe
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground text-pretty">
            Lock stablecoins, join community savings pots, and see every
            transaction on-chain. Build your financial future with transparent,
            decentralized savings.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <WalletConnectButton className="w-full sm:w-auto cursor-pointer" />
            <Button
              variant="outline"
              className="w-full sm:w-auto group bg-transparent cursor-pointer"
            >
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>

          <div className="mt-16 flex items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Community Driven</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Fully Audited</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              <span>Low Fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
