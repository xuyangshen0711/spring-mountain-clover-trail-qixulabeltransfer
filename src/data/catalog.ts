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
