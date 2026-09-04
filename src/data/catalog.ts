import {
  afterRangeLabel,
  qixuSizesFor,
  type RelabelKind,
} from "@/lib/relabel";

export type FactoryName = "冠乔" | "拿货";

export type ProductColor = {
  name: string;
  fabric: string;
};

export type Product = {
  id: string;
  originalSku: string | null;
  factory: FactoryName;
  listMonth: string;
  colors: ProductColor[];
  kind: RelabelKind;
  ruleLabel: string;
  factorySizes: string[];
  extraNote?: string;
  imageFront?: string | null;
  imageSide?: string | null;
};

export const COLOR_HEX: Record<string, string> = {
  深焙棕: "#4A2C22",
  英伦卡: "#C4A882",
  布拉格灰: "#8A8E8A",
  焦糖咖: "#8B5A2B",
  藏青: "#1E3A5F",
  米色: "#E8DCC8",
  燕麦灰: "#C5C0B5",
  白色: "#F6F3EC",
  黑色: "#1A1A1A",
  高级灰: "#9AA0A6",
  棕色: "#6B3F2A",
  茶褐色: "#8A5A32",
  深卡其: "#5C4A32",
  琥珀黄: "#C9922A",
  热颂红: "#B33A3A",
  西梅紫: "#6B3A55",
};

export const KIND_OPTIONS: Array<{ kind: RelabelKind; label: string }> = [
  { kind: "s_to_xs", label: "S变XS（整体降码）" },
  { kind: "m_to_s", label: "M变S（整体降码）" },
  { kind: "unchanged", label: "不变" },
  { kind: "numeric", label: "数字码（26对应S）" },
  { kind: "onesize", label: "均码" },
];

const SMLXL = ["S", "M", "L", "XL"];
const MLXL = ["M", "L", "XL"];
const SML = ["S", "M", "L"];
const NUM = ["26", "27", "28", "29"];
const MLXLXXL = ["M", "L", "XL", "XXL"];

export const PRODUCTS: Product[] = [
  { id: "26C001", originalSku: "886C001", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "深焙棕", fabric: "面料：100%聚酯纤维\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C002", originalSku: "886C002", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "深焙棕", fabric: "面料：100%聚酯纤维\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C003", originalSku: "886C020", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "英伦卡", fabric: "面料A：51.8%聚酯纤维 48.2%检\n面料B：100%检\n里料：100%聚酯纤维" }, { name: "深焙棕", fabric: "面料A：51.8%聚酯纤维 48.2%检\n面料B：100%检\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C005", originalSku: "886C021", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "英伦卡", fabric: "面料：48.2%检 51.8%聚酯纤维\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C006", originalSku: "886C022", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "英伦卡", fabric: "面料：51.8%聚酯纤维 48.2%检\n里料：100%聚酯纤维" }, { name: "深焙棕", fabric: "面料：51.8%聚酯纤维 48.2%检\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C007", originalSku: "886C035", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "布拉格灰", fabric: "面料：44.8%绵羊毛 53.5%聚酯纤维 1.7%其他纤维\n里料：100%聚酯纤维" }], kind: "m_to_s", ruleLabel: "上衣M变S（整体降码）", factorySizes: MLXL },
  { id: "26C008", originalSku: "886C232K", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "布拉格灰", fabric: "面料：44.8%绵羊毛 53.5%聚酯纤维 1.7%其他纤维\n里料：100%聚酯纤维" }], kind: "unchanged", ruleLabel: "裤子不变", factorySizes: SML },
  { id: "26C009", originalSku: "886C036", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "布拉格灰", fabric: "面料：53.5%聚酯纤维 44.8%绵羊毛 1.7%其他纤维\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C010", originalSku: "886C060", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "英伦卡", fabric: "面料：51.2%莱赛尔 48.8%检\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C011", originalSku: "886C062", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "英伦卡", fabric: "面料：51.2%莱赛尔 48.8%检\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C012", originalSku: "886C065", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "深焙棕", fabric: "面料A：51.2%莱赛尔 48.8%检\n面料B：100%检\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C013", originalSku: "886C066", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "英伦卡", fabric: "面料：51.8%聚酯纤维 48.2%检\n里料：100%聚酯纤维" }, { name: "布拉格灰", fabric: "面料：51.8%聚酯纤维 48.2%检\n里料：100%聚酯纤维" }], kind: "unchanged", ruleLabel: "不变", factorySizes: SML, imageFront: "/catalog/26C013-front.jpg" },
  { id: "26C015", originalSku: "886C091", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "焦糖咖", fabric: "面料：91.0%聚酯纤维 9.0%氨纶\n里料：100%聚酯纤维" }, { name: "深焙棕", fabric: "面料：91.0%聚酯纤维 9.0%氨纶\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C016", originalSku: "886C092", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "焦糖咖", fabric: "面料：91.0%聚酯纤维 9.0%氨纶\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C017", originalSku: "886C093", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "深焙棕", fabric: "面料：91.0%聚酯纤维 9.0%氨纶\n里料：100%聚酯纤维" }, { name: "藏青", fabric: "面料：91.0%聚酯纤维 9.0%氨纶\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C018", originalSku: "886C095", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "焦糖咖", fabric: "面料：91.0%聚酯纤维 9.0%氨纶\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL, imageFront: "/catalog/26C018-front.jpg" },
  { id: "26C019", originalSku: "886C100", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "黑色", fabric: "面料表层：聚氨酯(PU)\n面料基布：70.6%粘纤 16.7%聚酯纤维 8.5%检 4.2%金属纤维（含胶）\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C020", originalSku: "886C105", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "深焙棕", fabric: "面料表层：聚氨酯(PU)\n面料基布：70.2%粘纤 16.7%聚酯纤维 8.7%检 4.4%金属纤维(含胶)\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C021", originalSku: "886C107", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "黑色", fabric: "面料表层：聚氨酯（PU）面料基布：72.5%粘纤 16.4%聚酯纤维 7.4%检 3.7%金属纤维（含胶）\n里料：100%聚酯纤维" }], kind: "s_to_xs", ruleLabel: "S变XS（整体降码）", factorySizes: SMLXL },
  { id: "26C022", originalSku: "886C108", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "黑色", fabric: "面料表层：聚氨酯（PU）面料基布：72.5%粘纤 16.4%聚酯纤维 7.4%检 3.7%金属纤维（含胶）\n里料：100%聚酯纤维" }], kind: "unchanged", ruleLabel: "不变", factorySizes: SMLXL, imageFront: "/catalog/26C022-front.jpg" },
  { id: "26C023TQ", originalSku: "886C110TQ", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "米色", fabric: "针织面料：97.1%聚酯纤维 2.9%氨纶 裙子面料：85.5%粘纤 11.3%聚酯纤维 3.2%锦纶 裙子里料：100%聚酯纤维" }], kind: "m_to_s", ruleLabel: "M变S（整体降码）", factorySizes: MLXL },
  { id: "26C025TQ", originalSku: "886C112TQ", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "燕麦灰", fabric: "针织面料：97.1%聚酯纤维 2.9%氨纶 裙子面料：85.5%粘纤 11.3%聚酯纤维 3.2%锦纶 裙子里料：100%聚酯纤维" }], kind: "unchanged", ruleLabel: "不变", factorySizes: SMLXL },
  { id: "26C026TQ", originalSku: "886C116TQ", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "深焙棕", fabric: "面料：79.8%莱赛尔 17.7%绵羊毛 2.5%氨纶" }], kind: "unchanged", ruleLabel: "不变", factorySizes: MLXLXXL },
  { id: "26C029", originalSku: "83K012", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "深焙棕", fabric: "面料：55.2%粘纤 44.8%检 里料：100%聚酯纤维" }], kind: "numeric", ruleLabel: "不变", factorySizes: NUM, extraNote: "26对应S" },
  { id: "26C030", originalSku: "886B208K", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "白色", fabric: "面料：78.2%莱赛尔 21.8%亚麻\n里料：100%聚酯纤维" }], kind: "numeric", ruleLabel: "不变", factorySizes: NUM, extraNote: "26对应S" },
  { id: "26C031", originalSku: "886A202K", factory: "冠乔", listMonth: "26年-8月", colors: [{ name: "白色", fabric: "100%检" }], kind: "numeric", ruleLabel: "不变", factorySizes: NUM, extraNote: "26对应S" },
  { id: "26C032", originalSku: "886C361T", factory: "冠乔", listMonth: "26年-9月", colors: [{ name: "茶褐色", fabric: "面料：38.0%粘纤 29.5%检 27.1%腋纶 5.4%氨纶" }, { name: "深卡其", fabric: "面料：38.0%粘纤 29.5%检 27.1%腋纶 5.4%氨纶" }, { name: "藏青", fabric: "面料：38.0%粘纤 29.5%检 27.1%腋纶 5.4%氨纶" }], kind: "unchanged", ruleLabel: "不变", factorySizes: SMLXL, imageFront: "/catalog/26C032-front.jpg" },
  { id: "26C035", originalSku: null, factory: "拿货", listMonth: "26年-8月", colors: [{ name: "高级灰", fabric: "面布：5.2%氨纶 1.6%亚麻 62%聚酯纤维 31.2%粘胶＋莱赛尔 里布：95.4%聚酯纤维 4.6%氨纶" }], kind: "unchanged", ruleLabel: "不变", factorySizes: SMLXL },
  { id: "26C036", originalSku: null, factory: "拿货", listMonth: "26年-8月", colors: [{ name: "燕麦灰", fabric: "54%腋纶 39%莱赛尔 7%桑蚕丝" }], kind: "onesize", ruleLabel: "均码", factorySizes: ["F"] },
  { id: "26C038", originalSku: null, factory: "拿货", listMonth: "26年-8月", colors: [{ name: "棕色", fabric: "12%粘胶纤维 88%聚酯纤维" }], kind: "unchanged", ruleLabel: "不变", factorySizes: SML },
  { id: "26C039", originalSku: null, factory: "拿货", listMonth: "26年-8月", colors: [{ name: "白色", fabric: "95%醋酸 5%氨纶" }], kind: "onesize", ruleLabel: "均码", factorySizes: ["F"] },
];

export const PRODUCT_BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));

export function searchKey(p: Product): string {
  return [p.id, p.originalSku ?? "", p.factory, p.ruleLabel, ...p.colors.map((c) => c.name)].join(" ").toLowerCase();
}

export function monthSortKey(label: string): number {
  const m = label.match(/(\d+)\s*年\s*[-–]?\s*(\d+)\s*月/);
  if (!m) return Number.MAX_SAFE_INTEGER;
  return Number(m[1]) * 12 + Number(m[2]);
}

export function filterProducts(query: string, month: string | "全部" = "全部", list: Product[] = PRODUCTS) {
  const q = query.trim().toLowerCase().replace(/\s+/g, "");
  return list.filter((p) => {
    if (month && month !== "全部" && p.listMonth !== month) return false;
    if (!q) return true;
    return searchKey(p).replace(/\s+/g, "").includes(q);
  });
}

export function productAfterRange(p: Product): string {
  return afterRangeLabel(qixuSizesFor(p.kind, p.factorySizes));
}

export function findByOriginalSku(sku: string, list: Product[] = PRODUCTS): Product | undefined {
  const s = sku.trim().toUpperCase();
  return list.find((p) => (p.originalSku && p.originalSku.toUpperCase() === s) || p.id.toUpperCase() === s);
}
