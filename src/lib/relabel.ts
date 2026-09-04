export const LETTER_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type LetterSize = (typeof LETTER_SIZES)[number];
export const QTY_COLS = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type QtyCol = (typeof QTY_COLS)[number];

export type RelabelKind =
  | "s_to_xs"
  | "m_to_s"
  | "unchanged"
  | "numeric"
  | "onesize";

const NUMERIC_TO_LETTER: Record<string, LetterSize> = {
  "26": "S",
  "27": "M",
  "28": "L",
  "29": "XL",
};

export function isLetterSize(size: string): size is LetterSize {
  return (LETTER_SIZES as readonly string[]).includes(size);
}

/** Map factory 26/27/28/29 onto the S/M/L/XL columns used in the log sheet. */
export function factorySizeToCol(factorySize: string): QtyCol | "F" {
  if (factorySize === "F") return "F";
  if (NUMERIC_TO_LETTER[factorySize]) return NUMERIC_TO_LETTER[factorySize];
  if (isLetterSize(factorySize)) return factorySize;
  return "S";
}

export function mapFactoryToQixu(
  kind: RelabelKind,
  factorySize: string,
): string {
  if (kind === "onesize") return "F";
  if (kind === "numeric") {
    return NUMERIC_TO_LETTER[factorySize] ?? factorySize;
  }
  if (kind === "unchanged") return factorySize;
  if (!isLetterSize(factorySize)) return factorySize;
  const i = LETTER_SIZES.indexOf(factorySize);
  if (i <= 0) return factorySize;
  return LETTER_SIZES[i - 1];
}

export function qixuSizesFor(kind: RelabelKind, factorySizes: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of factorySizes) {
    const q = mapFactoryToQixu(kind, s);
    if (!seen.has(q)) {
      seen.add(q);
      out.push(q);
    }
  }
  return out;
}

export function afterRangeLabel(qixuSizes: string[]): string {
  if (qixuSizes.length === 0) return "";
  if (qixuSizes.length === 1) return qixuSizes[0] ?? "";
  const first = qixuSizes[0] ?? "";
  const last = qixuSizes[qixuSizes.length - 1] ?? "";
  return `${first}-${last}`;
}

export function emptyQty(): Record<string, number> {
  return {};
}

export function qtyTotal(qtys: Record<string, number>): number {
  return Object.values(qtys).reduce((a, b) => a + (Number(b) || 0), 0);
}

export function shiftFactoryQtysToQixu(
  kind: RelabelKind,
  factoryQtys: Record<string, number>,
): Record<QtyCol, number> {
  const out: Record<string, number> = {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  };
  for (const [size, raw] of Object.entries(factoryQtys)) {
    const n = Number(raw) || 0;
    if (n <= 0) continue;
    const qixu = mapFactoryToQixu(kind, size);
    const col = factorySizeToCol(qixu === "F" ? "F" : qixu);
    if (col === "F") continue;
    out[col] = (out[col] ?? 0) + n;
  }
  return out as Record<QtyCol, number>;
}

export function factoryQtysToCols(
  factoryQtys: Record<string, number>,
): Record<QtyCol, number> {
  const out: Record<string, number> = {
    XS: 0,
    S: 0,
    M: 0,
    L: 0,
    XL: 0,
    XXL: 0,
  };
  for (const [size, raw] of Object.entries(factoryQtys)) {
    const n = Number(raw) || 0;
    if (n <= 0) continue;
    const col = factorySizeToCol(size);
    if (col === "F") continue;
    out[col] = (out[col] ?? 0) + n;
  }
  return out as Record<QtyCol, number>;
}

export function formatRelabelDate(d = new Date()): string {
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}
