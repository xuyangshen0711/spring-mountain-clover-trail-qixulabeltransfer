import { create } from "zustand";
import { persist } from "zustand/middleware";

export type DraftLine = {
  key: string;
  productId: string;
  originalSku: string | null;
  factory: string;
  color: string;
  fabric: string;
  ruleLabel: string;
  factorySize: string;
  qixuSize: string;
  qty: number;
};

type DraftState = {
  lines: DraftLine[];
  hydrated: boolean;
  setHydrated: () => void;
  addLines: (incoming: DraftLine[]) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  removeProduct: (productId: string) => void;
  clear: () => void;
};

function mergeLines(current: DraftLine[], incoming: DraftLine[]): DraftLine[] {
  const map = new Map(current.map((l) => [l.key, l]));
  for (const line of incoming) {
    const prev = map.get(line.key);
    if (prev) map.set(line.key, { ...prev, qty: prev.qty + line.qty });
    else map.set(line.key, line);
  }
  return [...map.values()].filter((l) => l.qty > 0);
}

export const useDraft = create<DraftState>()(
  persist(
    (set, get) => ({
      lines: [],
      hydrated: false,
      setHydrated: () => set({ hydrated: true }),
      addLines: (incoming) =>
        set({ lines: mergeLines(get().lines, incoming) }),
      setQty: (key, qty) =>
        set({
          lines: get()
            .lines.map((l) => (l.key === key ? { ...l, qty } : l))
            .filter((l) => l.qty > 0),
        }),
      remove: (key) => set({ lines: get().lines.filter((l) => l.key !== key) }),
      removeProduct: (productId) =>
        set({ lines: get().lines.filter((l) => l.productId !== productId) }),
      clear: () => set({ lines: [] }),
    }),
    {
      name: "qixu-relabel-draft",
      skipHydration: true,
      partialize: (s) => ({ lines: s.lines }),
    },
  ),
);

export function draftCount(lines: DraftLine[]): number {
  return lines.reduce((n, l) => n + l.qty, 0);
}
