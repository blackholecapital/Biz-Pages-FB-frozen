// Canonical wagmi config for iframe module surfaces (engage, payme).
// Single source of truth for the wagmi chain list and connector choices.
// Do NOT copy or fork this file per-module; re-export from here.
//
// Consumed by:
//   - apps/modules/engage/src/lib/wagmi.js  → `export { wagmiConfig } from '.../wagmiConfig.shared.js'`
//   - apps/modules/payme/src/lib/wagmi.js   → same
//
// Product-shell itself does NOT depend on wagmi; it uses the EIP-1193 paths
// in `./connectWallet.ts`, `./signMessage.ts`, `./sendUsdcOnBase.ts`.
// This file is only pulled in by a module build that has wagmi/viem installed.

import { createConfig, http } from 'wagmi'
import { mainnet, polygon, arbitrum, optimism, base } from 'wagmi/chains'
import { injected, walletConnect } from 'wagmi/connectors'

export const WC_PROJECT_ID_ENV_KEY = 'VITE_WC_PROJECT_ID'
export const WALLET_CHAINS = [mainnet, polygon, arbitrum, optimism, base]

function readProjectId() {
  try {
    return import.meta.env?.[WC_PROJECT_ID_ENV_KEY]
  } catch {
    return undefined
  }
}

export function buildWagmiConfig({ projectId } = {}) {
  const pid = projectId ?? readProjectId()
  return createConfig({
    chains: WALLET_CHAINS,
    transports: {
      [mainnet.id]: http(),
      [polygon.id]: http(),
      [arbitrum.id]: http(),
      [optimism.id]: http(),
      [base.id]: http(),
    },
    connectors: [
      injected({ shimDisconnect: true }),
      ...(pid ? [walletConnect({ projectId: pid, showQrModal: true })] : []),
    ],
  })
}

// Eager singleton for modules that just want the default shape.
export const wagmiConfig = buildWagmiConfig()
