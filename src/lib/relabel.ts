import type { Product } from "@/data/catalog";

export function mapToQixu(factorySize: string, product: Product): string {
  const i = product.factorySizes.findIndex(
    (s) => normalizeSize(s) === normalizeSize(factorySize),
  );
  if (i >= 0 && product.qixuSizes[i]) return product.qixuSizes[i];
  return factorySize;
}

export function normalizeSize(s: string): string {
  return s.trim().toUpperCase().replace(/^0+/, "");
}

export function shiftQtys(
  qtys: Record<string, number>,
  product: Product,
): Record<string, number> {
  const out: Record<string, number> = {};
  for (const [factorySize, n] of Object.entries(qtys)) {
    if (!n) continue;
    const q = mapToQixu(factorySize, product);
    out[q] = (out[q] ?? 0) + n;
  }
  return out;
}

export function pairLabels(product: Product): string[] {
  const n = Math.max(product.factorySizes.length, product.qixuSizes.length);
  const labels: string[] = [];
  for (let i = 0; i < n; i += 1) {
    const a = product.factorySizes[i] ?? "—";
    const b = product.qixuSizes[i] ?? "—";
    labels.push(a === b ? a : `${a}→${b}`);
  }
  return labels;
}
