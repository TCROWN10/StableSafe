"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { WalletConnectButton } from "@/components/ui/wallet-connect-button"
import { Wallet, HelpCircle, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

type ConnectionState = "idle" | "connecting" | "success" | "error"

const walletOptions = [
  {
    name: "MetaMask",
    description: "Connect using browser extension",
    icon: "🦊",
  },
  {
    name: "WalletConnect",
    description: "Scan with mobile wallet",
    icon: "📱",
  },
  {
    name: "Coinbase Wallet",
    description: "Connect with Coinbase",
    icon: "🔵",
  },
]

export function WalletConnectModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [connectionState, setConnectionState] = useState<ConnectionState>("idle")
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  const handleConnect = async (walletName: string) => {
    setSelectedWallet(walletName)
    setConnectionState("connecting")

    // Simulate connection process
    setTimeout(() => {
      if (Math.random() > 0.2) {
        setConnectionState("success")
        setTimeout(() => {
          setIsOpen(false)
          setConnectionState("idle")
          setSelectedWallet(null)
        }, 2000)
      } else {
        setConnectionState("error")
      }
    }, 2000)
  }

  const handleRetry = () => {
    setConnectionState("idle")
    setSelectedWallet(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <WalletConnectButton />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>Choose a wallet to connect to StableSafe and start saving.</DialogDescription>
        </DialogHeader>

        {connectionState === "idle" && (
          <div className="space-y-4">
            <Alert>
              <HelpCircle className="h-4 w-4" />
              <AlertDescription>
                New to wallets? A wallet lets you interact with blockchain apps securely.
                <Button variant="link" className="h-auto p-0 ml-1 text-xs">
                  Learn more
                </Button>
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              {walletOptions.map((wallet) => (
                <Button
                  key={wallet.name}
                  variant="outline"
                  className="w-full justify-start h-auto p-4 bg-transparent"
                  onClick={() => handleConnect(wallet.name)}
                >
                  <span className="text-2xl mr-3">{wallet.icon}</span>
                  <div className="text-left">
                    <div className="font-medium">{wallet.name}</div>
                    <div className="text-xs text-muted-foreground">{wallet.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {connectionState === "connecting" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <div className="text-center">
              <div className="font-medium">Connecting to {selectedWallet}</div>
              <div className="text-sm text-muted-foreground">Check your wallet for connection request</div>
            </div>
          </div>
        )}

        {connectionState === "success" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-center">
              <div className="font-medium">Successfully Connected!</div>
              <div className="text-sm text-muted-foreground">Welcome to StableSafe</div>
            </div>
          </div>
        )}

        {connectionState === "error" && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-center">
              <div className="font-medium">Connection Failed</div>
              <div className="text-sm text-muted-foreground">Please try again or choose a different wallet</div>
            </div>
            <Button onClick={handleRetry} variant="outline">
              Try Again
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
