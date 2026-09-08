import { createConfig, http } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const TARGET_CHAIN = polygonAmoy;

/**
 * Wagmi configuration for the property detail page's wallet connection.
 *
 * Built with `createConfig` rather than RainbowKit's `getDefaultConfig` because
 * that helper requires a WalletConnect Project ID. We support injected browser
 * wallets only, so there is no credential to hold and nothing that can fail at
 * runtime for the lack of one.
 *
 * `injected()` plus wagmi's default EIP-6963 discovery picks up whichever
 * wallets the browser actually has (MetaMask, Rabby, Brave, ...), and RainbowKit
 * renders them in its modal.
 */
export const wagmiConfig = createConfig({
  chains: [TARGET_CHAIN],
  connectors: [injected()],
  transports: {
    [TARGET_CHAIN.id]: http(),
  },
});

/**
 * Registers the config with wagmi's type system so hooks infer this app's
 * chains — `useSwitchChain` will only accept 80002, for instance, catching
 * a wrong chain id at compile time instead of at runtime.
 */
declare module 'wagmi' {
  interface Register {
    config: typeof wagmiConfig;
  }
}
