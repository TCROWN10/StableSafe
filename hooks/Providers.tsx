"use client";

import { PrivyProvider } from "@privy-io/react-auth";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId="cmf5futnw00c8kz0cj27cr8k1"
      config={{
        loginMethods: ["email", "wallet", "google", "sms", "passkey", "apple"],

        embeddedWallets: {
          createOnLogin: "users-without-wallets",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
