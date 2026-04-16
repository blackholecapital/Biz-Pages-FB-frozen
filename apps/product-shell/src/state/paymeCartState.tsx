import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";

type PayMeCartContextValue = {
  open: boolean;
  toggle: () => void;
  show: () => void;
  hide: () => void;
};

const PayMeCartContext = createContext<PayMeCartContextValue | null>(null);

export function PayMeCartProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  const value = useMemo<PayMeCartContextValue>(
    () => ({ open, toggle, show, hide }),
    [open, toggle, show, hide]
  );

  return <PayMeCartContext.Provider value={value}>{children}</PayMeCartContext.Provider>;
}

export function usePayMeCart(): PayMeCartContextValue {
  const ctx = useContext(PayMeCartContext);
  if (!ctx) {
    return {
      open: false,
      toggle: () => {},
      show: () => {},
      hide: () => {},
    };
  }
  return ctx;
}
