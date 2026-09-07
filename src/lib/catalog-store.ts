import { create } from "zustand";
import { PRODUCTS, type Product } from "@/data/catalog";
import { listStyles } from "@/lib/style-api";

type CatalogState = {
  products: Product[];
  loaded: boolean;
  refresh: () => Promise<void>;
};

export const useCatalog = create<CatalogState>((set) => ({
  products: PRODUCTS,
  loaded: false,
  refresh: async () => {
    try {
      const rows = await listStyles();
      if (rows.length) set({ products: rows, loaded: true });
      else set({ products: PRODUCTS, loaded: true });
    } catch {
      set({ products: PRODUCTS, loaded: true });
    }
  },
}));
