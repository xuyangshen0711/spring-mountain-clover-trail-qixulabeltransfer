import seed from "./seed.json";

export type FactoryName = "冠乔" | "拿货";

export type ProductColor = {
  name: string;
  hex: string;
  image?: string | null;
};

export type Product = {
  id: string;
  originalSku: string | null;
  factory: FactoryName;
  listMonth: string;
  colors: ProductColor[];
  fabric: string;
  factorySizes: string[];
  qixuSizes: string[];
  ruleLabel: string;
  extraNote: string;
  imageFront: string | null;
  imageSide: string | null;
};

function correctSeed(list: Product[]): Product[] {
  return list.map((p) => {
    if (p.id !== "26C006") return p;
    return {
      ...p,
      imageFront: "/catalog/26C006-c1.jpg",
      colors: p.colors.map((c) => {
        if (c.name === "英伦卡") return { ...c, image: "/catalog/26C006-c1.jpg" };
        if (c.name === "深焙棕") return { ...c, image: "/catalog/26C006-c0.jpg" };
        return c;
      }),
    };
  });
}

export const PRODUCTS: Product[] = correctSeed(seed as Product[]);
export const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export const COLOR_HEX: Record<string, string> = {
  深焙棕: "#5C3A2E",
  英伦卡: "#C4A574",
  布拉格灰: "#8B9196",
  焦糖咖: "#8B5A2B",
  藏青: "#1B365D",
  米色: "#E8D9C4",
  燕麦灰: "#C5BFB3",
  白色: "#F4F1EA",
  高级灰: "#6E7173",
  棕色: "#6B3F2A",
  黑色: "#1A1A1A",
  绿色: "#4A5C38",
  茶褐色: "#8A5A32",
  深卡其: "#5C4A32",
};

export function hexForColor(name: string): string {
  return COLOR_HEX[name] ?? "#8A8178";
}

export function styleImages(p: Product): string[] {
  const out: string[] = [];
  const add = (src?: string | null) => {
    if (src && !out.includes(src)) out.push(src);
  };
  add(p.imageFront);
  add(p.imageSide);
  for (const c of p.colors) add(c.image);
  return out;
}

export function monthSortKey(label: string): number {
  const m = label.match(/(\d+)\s*年\s*[-–]?\s*(\d+)\s*月/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Number(m[1]) * 12 + Number(m[2]);
}

export function searchKey(p: Product): string {
  return [
    p.id,
    p.originalSku ?? "",
    p.factory,
    p.ruleLabel,
    p.fabric,
    ...p.colors.map((c) => c.name),
  ]
    .join(" ")
    .toLowerCase();
}

export function filterProducts(
  query: string,
  month: string | "全部" = "全部",
  list: Product[] = PRODUCTS,
) {
  const q = query.trim().toLowerCase().replace(/\s+/g, "");
  return list.filter((p) => {
    if (month && month !== "全部" && p.listMonth !== month) return false;
    if (!q) return true;
    return searchKey(p).replace(/\s+/g, "").includes(q);
  });
}

export function findByOriginalSku(
  sku: string,
  list: Product[] = PRODUCTS,
): Product | undefined {
  const s = sku.trim().toUpperCase();
  if (!s) return undefined;
  return list.find(
    (p) =>
      (p.originalSku && p.originalSku.toUpperCase() === s) ||
      p.id.toUpperCase() === s,
  );
}

export function parseSizeList(s: string): string[] {
  const core = s
    .replace(/（[^）]*）/g, "")
    .replace(/\([^)]*\)/g, "")
    .trim();
  if (!core) return [];
  if (core === "均码" || core === "F" || core.toLowerCase() === "free") {
    return ["F"];
  }
  return core
    .split(/[/\uff0f、]/)
    .map((x) => x.trim())
    .filter(Boolean);
}

export function joinSizes(sizes: string[]): string {
  return sizes.join("/");
}
