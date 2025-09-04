"use client";

import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";
import { toast } from "sonner";
import { usePrivy, useLogin } from "@privy-io/react-auth";
import { useRouter } from "next/router";

export function WalletConnectButton({ className }: { className?: string }) {
  const { ready, authenticated, user } = usePrivy();
  const { login } = useLogin();
  const router = useRouter();

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleClick = () => {
    if (!ready) return;

    if (authenticated) {
      toast.success("✅User already logged in: ");
      router.push("/dashboard");
    } else {
      login();
    }
  };

  return (
    <Button
      onClick={handleClick}
      variant={authenticated ? "secondary" : "default"}
      className={className}
    >
      <Wallet className="w-4 h-4 mr-2" />
      {authenticated && user?.wallet?.address
        ? truncateAddress(user.wallet.address)
        : "Get Started"}
    </Button>
  );
}
