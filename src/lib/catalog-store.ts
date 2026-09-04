import { create } from "zustand";
import { PRODUCTS, type Product } from "@/data/catalog";
import { listStyles } from "@/lib/style-api";

type CatalogState = {
  products: Product[];
  loaded: boolean;
  loading: boolean;
  refresh: () => Promise<void>;
  upsertLocal: (p: Product) => void;
  byId: (id: string) => Product | undefined;
};

export const useCatalog = create<CatalogState>((set, get) => ({
  products: PRODUCTS,
  loaded: false,
  loading: false,
  refresh: async () => {
    if (get().loading) return;
    set({ loading: true });
    try {
      const rows = await listStyles();
      if (rows.length > 0) set({ products: rows, loaded: true, loading: false });
      else set({ loaded: true, loading: false });
    } catch {
      set({ loaded: true, loading: false });
    }
  },
  upsertLocal: (p) =>
    set({
      products: get().products.some((x) => x.id === p.id)
        ? get().products.map((x) => (x.id === p.id ? p : x))
        : [...get().products, p],
    }),
  byId: (id) => get().products.find((p) => p.id === id),
}));
