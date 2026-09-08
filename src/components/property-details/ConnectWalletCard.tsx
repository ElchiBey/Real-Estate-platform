import React, { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useSwitchChain } from "wagmi";
import { toast } from "sonner";
import { TARGET_CHAIN } from "../../lib/wagmi";
import { truncateAddress } from "../../utils/truncateAddress";
import { getWalletErrorMessage } from "../../utils/walletErrors";
import Button from "../reusable/Button";
import {
  DETAIL_ROW,
  FIELD_LABEL,
  HELPER_TEXT,
  PRIMARY_ACTION,
  SECONDARY_ACTION,
} from "@/constants";

/**
 * Whether the browser has an injected wallet at all.
 *
 * Checked after mount rather than during render: the provider is injected by an
 * extension, so reading it while rendering can race. Defaults to `true` so the
 * install prompt never flashes for users who do have a wallet.
 */
function useHasInjectedWallet(): boolean {
  const [hasWallet, setHasWallet] = useState(true);

  useEffect(() => {
    setHasWallet(typeof window !== "undefined" && "ethereum" in window);
  }, []);

  return hasWallet;
}

const WalletCardShell: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <div className="bg-white border border-[#E6E0DA] rounded-2xl p-8 shadow-lg mb-8">
    <div className="flex items-center gap-2 mb-6">
      <span className="material-icons text-[#D4755B] text-xl">
        account_balance_wallet
      </span>
      <h3 className="font-syne text-xl text-[#0F172A]">Wallet</h3>
    </div>
    {children}
  </div>
);

const WalletDetailRow: React.FC<{
  label: string;
  children: React.ReactNode;
}> = ({ label, children }) => (
  <div className={DETAIL_ROW}>
    <p className={FIELD_LABEL}>{label}</p>
    {children}
  </div>
);

/**
 * Wallet connection for the property detail page.
 *
 * Wraps RainbowKit's `ConnectButton.Custom` render prop, which drives the
 * connect and account modals while the markup stays in the site's own design
 * language. Chain switching is handled directly through wagmi's `useSwitchChain`
 * instead of RainbowKit's chain modal: it is one click rather than two, and it
 * lets us own the rejection and "network not added" paths explicitly.
 *
 * Must be rendered inside Web3Provider.
 */
const ConnectWalletCard: React.FC = () => {
  const { status } = useAccount();
  const { disconnect } = useDisconnect();
  const { switchChain, isPending: isSwitching } = useSwitchChain();
  const hasInjectedWallet = useHasInjectedWallet();

  const isConnecting = status === "connecting" || status === "reconnecting";

  const handleSwitchNetwork = () => {
    switchChain(
      { chainId: TARGET_CHAIN.id },
      {
        onError: (error) => {
          const message = getWalletErrorMessage(
            error,
            "Could not switch network. Please try again from your wallet.",
          );
          // getWalletErrorMessage returns null for user rejections — the user
          // just cancelled deliberately, so the card simply stays put.
          if (message) {
            toast.error("Network switch failed", { description: message });
          }
        },
      },
    );
  };

  return (
    <ConnectButton.Custom>
      {({ account, chain, openAccountModal, openConnectModal, mounted }) => {
        // `mounted` guards RainbowKit's own async wallet detection. Rendering a
        // "Connect" button before it resolves causes a visible flash for users
        // who are already connected.
        if (!mounted) {
          return (
            <WalletCardShell>
              <div className="animate-pulse space-y-3">
                <div className="h-3 w-24 bg-[#F5F1E8] rounded" />
                <div className="h-12 w-full bg-[#F5F1E8] rounded-xl" />
              </div>
            </WalletCardShell>
          );
        }

        // Checked together rather than via an `isConnected` boolean so
        // TypeScript narrows both for the connected branches below.
        if (!account || !chain) {
          if (!hasInjectedWallet) {
            return (
              <WalletCardShell>
                <p className={`${HELPER_TEXT} mb-4`}>
                  No browser wallet detected. Install MetaMask or another
                  injected wallet to connect.
                </p>
                <Button asChild {...PRIMARY_ACTION}>
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Install MetaMask
                  </a>
                </Button>
              </WalletCardShell>
            );
          }

          return (
            <WalletCardShell>
              <p className={`${HELPER_TEXT} mb-4`}>
                Connect a wallet to view this listing's on-chain details.
              </p>
              <Button
                {...PRIMARY_ACTION}
                onClick={openConnectModal}
                isLoading={isConnecting}
              >
                {isConnecting ? "Connecting..." : "Connect Wallet"}
              </Button>
            </WalletCardShell>
          );
        }

        // different chain than POlygon Amoy
        if (chain.unsupported) {
          return (
            <WalletCardShell>
              <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-xl p-4 mb-4">
                <div className="flex gap-3">
                  <span className="material-icons text-[#D97706] text-xl shrink-0">
                    warning_amber
                  </span>
                  <div>
                    <p className="font-manrope font-semibold text-sm text-[#92400E] mb-1">
                      Wrong network
                    </p>
                    <p className="font-manrope font-extralight text-xs text-[#B45309]">
                      This page requires {TARGET_CHAIN.name}. Switch networks to
                      continue.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                {...PRIMARY_ACTION}
                onClick={handleSwitchNetwork}
                isLoading={isSwitching}
              >
                {isSwitching
                  ? "Switching..."
                  : `Switch to ${TARGET_CHAIN.name}`}
              </Button>

              <Button
                {...SECONDARY_ACTION}
                onClick={() => disconnect()}
                className="mt-3"
              >
                Disconnect
              </Button>
            </WalletCardShell>
          );
        }

        /* ── Connected on Polygon Amoy ─────────────────────── */
        const detailRows = [
          {
            label: "Network",
            value: (
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full bg-[#22C55E] shrink-0"
                  aria-hidden="true"
                />
                <span className="font-manrope text-sm text-[#0F172A]">
                  {chain.name}
                </span>
              </div>
            ),
          },
          {
            label: "Wallet",
            // Space Mono is the design system's face for values and numerics.
            // Opens RainbowKit's account modal; `title` carries the full address
            // for anyone who needs to read or copy it.
            value: (
              <button
                onClick={openAccountModal}
                title={account.address}
                className="font-space-mono text-sm text-[#0F172A] hover:text-[#D4755B] transition-colors"
              >
                {truncateAddress(account.address)}
              </button>
            ),
          },
        ];

        return (
          <WalletCardShell>
            <div className="space-y-3 mb-4">
              {detailRows.map(({ label, value }) => (
                <WalletDetailRow key={label} label={label}>
                  {value}
                </WalletDetailRow>
              ))}
            </div>

            <Button {...SECONDARY_ACTION} onClick={() => disconnect()}>
              Disconnect
            </Button>
          </WalletCardShell>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletCard;
