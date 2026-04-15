import React, { createContext, useContext, useMemo, useReducer } from "react";

export type DemoGateState = {
  walletConnected: boolean;
  signedMessage: boolean;
  walletAddress?: string;
  demoBypass: boolean;
  tier1Unlocked: boolean;
  tier2Unlocked: boolean;
  tier3Unlocked: boolean;
};

type Actions = {
  connectWallet: () => Promise<boolean>;
  signMessage: () => Promise<boolean>;
  simulateSignedMessage: () => void;
  unlockTier1: () => void;
  unlockTier2: () => void;
  unlockTier3: () => void;
  toggleTier1: () => void;
  toggleTier2: () => void;
  toggleTier3: () => void;
  resetDemoState: () => void;
  enableBypass: () => void;
};

type Ctx = { state: DemoGateState; actions: Actions };

const initialState: DemoGateState = {
  walletConnected: false,
  signedMessage: false,
  walletAddress: undefined,
  demoBypass: false,
  tier1Unlocked: true,
  tier2Unlocked: true,
  tier3Unlocked: true
};

type Event =
  | { type: "CONNECT_WALLET"; address?: string }
  | { type: "SIGN_MESSAGE" }
  | { type: "SIM_SIGNED" }
  | { type: "UNLOCK_T1" }
  | { type: "UNLOCK_T2" }
  | { type: "UNLOCK_T3" }
  | { type: "TOGGLE_T1" }
  | { type: "TOGGLE_T2" }
  | { type: "TOGGLE_T3" }
  | { type: "RESET" }
  | { type: "BYPASS_ON" };

function reducer(state: DemoGateState, event: Event): DemoGateState {
  switch (event.type) {
    case "CONNECT_WALLET":
      return { ...state, walletConnected: true, walletAddress: event.address ?? state.walletAddress };
    case "SIGN_MESSAGE":
      return { ...state, signedMessage: true };
    case "SIM_SIGNED":
      return { ...state, signedMessage: true };
    case "UNLOCK_T1":
      return { ...state, tier1Unlocked: true };
    case "UNLOCK_T2":
      return { ...state, tier2Unlocked: true };
    case "UNLOCK_T3":
      return { ...state, tier3Unlocked: true };
    case "TOGGLE_T1":
      return { ...state, tier1Unlocked: !state.tier1Unlocked };
    case "TOGGLE_T2":
      return { ...state, tier2Unlocked: !state.tier2Unlocked };
    case "TOGGLE_T3":
      return { ...state, tier3Unlocked: !state.tier3Unlocked };
    case "BYPASS_ON":
      return { ...state, demoBypass: true };
    case "RESET":
      return { ...initialState };
    default:
      return state;
  }
}

const DemoGateContext = createContext<Ctx | null>(null);

export function DemoGateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const actions: Actions = useMemo(
    () => ({
      connectWallet: async () => {
        try {
          const eth = (window as any)?.ethereum;
          if (!eth?.request) {
            dispatch({ type: "CONNECT_WALLET", address: "0xDEMO...WALLET" });
            return true;
          }
          const accs: string[] = await eth.request({ method: "eth_requestAccounts" });
          dispatch({ type: "CONNECT_WALLET", address: accs?.[0] });
          return true;
        } catch {
          // user rejected / unavailable
          return false;
        }
      },
      signMessage: async () => {
        try {
          const eth = (window as any)?.ethereum;
          if (!eth?.request) {
            dispatch({ type: "SIGN_MESSAGE" });
            return true;
          }

          let accounts: string[] = await eth.request({ method: "eth_accounts" });
          if (!accounts?.length) {
            await eth.request({ method: "eth_requestAccounts" });
            accounts = await eth.request({ method: "eth_accounts" });
          }

          const address = accounts?.[0];
          if (!address) return false;

          const msg = "Sign Message to Enter Pages";
          await eth.request({ method: "personal_sign", params: [msg, address] });

          dispatch({ type: "SIGN_MESSAGE" });
          return true;
        } catch {
          // user rejected / unavailable
          return false;
        }
      },
      simulateSignedMessage: () => dispatch({ type: "SIM_SIGNED" }),
      unlockTier1: () => dispatch({ type: "UNLOCK_T1" }),
      unlockTier2: () => dispatch({ type: "UNLOCK_T2" }),
      unlockTier3: () => dispatch({ type: "UNLOCK_T3" }),
      toggleTier1: () => dispatch({ type: "TOGGLE_T1" }),
      toggleTier2: () => dispatch({ type: "TOGGLE_T2" }),
      toggleTier3: () => dispatch({ type: "TOGGLE_T3" }),
      resetDemoState: () => dispatch({ type: "RESET" }),
      enableBypass: () => dispatch({ type: "BYPASS_ON" })
    }),
    [dispatch]
  );


  return <DemoGateContext.Provider value={{ state, actions }}>{children}</DemoGateContext.Provider>;
}

export function useDemoGate(): Ctx {
  const ctx = useContext(DemoGateContext);
  if (!ctx) throw new Error("useDemoGate must be used within DemoGateProvider");
  return ctx;
}
