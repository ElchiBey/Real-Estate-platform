import React from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RainbowKitProvider, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { wagmiConfig, TARGET_CHAIN } from '../../lib/wagmi';

/**
 * Created once at module scope, not inside the component. A QueryClient built
 * during render would be replaced on every re-render, silently throwing away
 * wagmi's cached account and chain state.
 */
const queryClient = new QueryClient();

/**
 * RainbowKit's modal, themed to the REChain palette so it does not arrive
 * looking like a third-party widget. Terracotta accent matches the primary
 * buttons; `large` radius matches the rounded-xl/2xl used across the cards.
 */
const rechainTheme = lightTheme({
  accentColor: '#D4755B',
  accentColorForeground: '#FFFFFF',
  borderRadius: 'large',
});

interface Web3ProviderProps {
  children: React.ReactNode;
}

/**
 * Wallet providers for the property detail page.
 *
 * Deliberately not mounted at the app root. The property detail page is
 * `React.lazy`'d in App.tsx, so importing this from there keeps wagmi,
 * viem and RainbowKit inside that page's chunk and off the static pages.
 *
 * `initialChain` asks the wallet to connect on Polygon Amoy up front, which
 * avoids the common case of connecting on mainnet and immediately having to
 * switch.
 */
const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={rechainTheme} initialChain={TARGET_CHAIN}>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default Web3Provider;
