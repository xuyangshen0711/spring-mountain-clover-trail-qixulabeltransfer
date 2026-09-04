import { create } from "zustand";
import { persist } from "zustand/middleware";
import { formatRelabelDate, qtyTotal } from "@/lib/relabel";

export type DraftRow = {
  id: string;
  productId: string;
  color: string;
  relabelDate: string;
  qtys: Record<string, number>;
  note: string;
};

type DraftState = {
  relabelDate: string;
  rows: DraftRow[];
  setRelabelDate: (d: string) => void;
  upsert: (row: Omit<DraftRow, "id">) => void;
  setQty: (id: string, size: string, qty: number) => void;
  setNote: (id: string, note: string) => void;
  setRowDate: (id: string, date: string) => void;
  remove: (id: string) => void;
  clear: () => void;
};

function newId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useDraft = create<DraftState>()(
  persist(
    (set, get) => ({
      relabelDate: formatRelabelDate(),
      rows: [],
      setRelabelDate: (d) => set({ relabelDate: d }),
      upsert: (row) => {
        const existing = get().rows.find(
          (r) =>
            r.productId === row.productId &&
            r.color === row.color &&
            r.relabelDate === row.relabelDate,
        );
        if (existing) {
          const qtys = { ...existing.qtys };
          for (const [k, v] of Object.entries(row.qtys)) {
            qtys[k] = (qtys[k] ?? 0) + (Number(v) || 0);
          }
          set({
            rows: get().rows.map((r) =>
              r.id === existing.id
                ? { ...r, qtys, note: row.note || r.note }
                : r,
            ),
          });
          return;
        }
        set({ rows: [...get().rows, { ...row, id: newId() }] });
      },
      setQty: (id, size, qty) =>
        set({
          rows: get().rows.map((r) =>
            r.id === id
              ? {
                  ...r,
                  qtys: {
                    ...r.qtys,
                    [size]: Math.max(0, Math.floor(qty) || 0),
                  },
                }
              : r,
          ),
        }),
      setNote: (id, note) =>
        set({
          rows: get().rows.map((r) => (r.id === id ? { ...r, note } : r)),
        }),
      setRowDate: (id, date) =>
        set({
          rows: get().rows.map((r) =>
            r.id === id ? { ...r, relabelDate: date } : r,
          ),
        }),
      remove: (id) => set({ rows: get().rows.filter((r) => r.id !== id) }),
      clear: () => set({ rows: [] }),
    }),
    { name: "qixu-relabel-draft" },
  ),
);

export function draftPieceCount(rows: DraftRow[]): number {
  return rows.reduce((n, r) => n + qtyTotal(r.qtys), 0);
}
