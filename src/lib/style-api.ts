import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import {
  PRODUCTS,
  type FactoryName,
  type Product,
  type ProductColor,
} from "@/data/catalog";
import type { RelabelKind } from "@/lib/relabel";

const kindSchema = z.enum([
  "s_to_xs",
  "m_to_s",
  "unchanged",
  "numeric",
  "onesize",
]);

const productSchema = z.object({
  id: z.string().min(1).max(40),
  originalSku: z.string().max(40).nullable(),
  factory: z.enum(["冠乔", "拿货"]),
  listMonth: z.string().min(1).max(40),
  colors: z
    .array(
      z.object({
        name: z.string().min(1).max(40),
        fabric: z.string().max(2000),
      }),
    )
    .min(1)
    .max(12),
  kind: kindSchema,
  ruleLabel: z.string().min(1).max(80),
  factorySizes: z.array(z.string().min(1).max(8)).min(1).max(10),
  extraNote: z.string().max(200).optional(),
  imageFront: z.string().nullable().optional(),
  imageSide: z.string().nullable().optional(),
});

type StyleRow = {
  id: string;
  original_sku: string | null;
  factory: string;
  list_month: string;
  colors_json: string;
  kind: string;
  rule_label: string;
  factory_sizes_json: string;
  extra_note: string | null;
  image_front: string | null;
  image_side: string | null;
};

function rowToProduct(r: StyleRow): Product {
  let colors: ProductColor[] = [];
  let factorySizes: string[] = [];
  try {
    colors = JSON.parse(r.colors_json) as ProductColor[];
  } catch {
    colors = [{ name: "未命名", fabric: "" }];
  }
  try {
    factorySizes = JSON.parse(r.factory_sizes_json) as string[];
  } catch {
    factorySizes = ["S", "M", "L", "XL"];
  }
  return {
    id: r.id,
    originalSku: r.original_sku,
    factory: r.factory as FactoryName,
    listMonth: r.list_month,
    colors,
    kind: r.kind as RelabelKind,
    ruleLabel: r.rule_label,
    factorySizes,
    extraNote: r.extra_note ?? undefined,
    imageFront: r.image_front,
    imageSide: r.image_side,
  };
}

function seedValues(p: Product) {
  return {
    id: p.id,
    originalSku: p.originalSku,
    factory: p.factory,
    listMonth: p.listMonth,
    colorsJson: JSON.stringify(p.colors),
    kind: p.kind,
    ruleLabel: p.ruleLabel,
    sizesJson: JSON.stringify(p.factorySizes),
    extraNote: p.extraNote ?? null,
    imageFront: p.imageFront ?? null,
    imageSide: p.imageSide ?? null,
  };
}

async function ensureSeeded() {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  const counts = await sql<{ n: number }>`select count(*)::int as n from styles`;
  const n = counts[0]?.n ?? 0;
  if (n >= PRODUCTS.length) return sql;
  for (const p of PRODUCTS) {
    const v = seedValues(p);
    await sql`
      insert into styles (
        id, original_sku, factory, list_month, colors_json, kind, rule_label,
        factory_sizes_json, extra_note, image_front, image_side
      ) values (
        ${v.id}, ${v.originalSku}, ${v.factory}, ${v.listMonth}, ${v.colorsJson},
        ${v.kind}, ${v.ruleLabel}, ${v.sizesJson}, ${v.extraNote},
        ${v.imageFront}, ${v.imageSide}
      )
      on conflict (id) do update set
        original_sku = excluded.original_sku,
        factory = excluded.factory,
        list_month = excluded.list_month,
        colors_json = excluded.colors_json,
        kind = excluded.kind,
        rule_label = excluded.rule_label,
        factory_sizes_json = excluded.factory_sizes_json,
        extra_note = excluded.extra_note,
        image_front = coalesce(excluded.image_front, styles.image_front),
        image_side = coalesce(excluded.image_side, styles.image_side),
        updated_at = now()
    `;
  }
  return sql;
}

export const listStyles = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => {
    const sql = await ensureSeeded();
    const rows = await sql<StyleRow>`
      select id, original_sku, factory, list_month, colors_json, kind, rule_label,
             factory_sizes_json, extra_note, image_front, image_side
      from styles
      order by list_month, id
    `;
    return rows.map(rowToProduct);
  },
);

export const saveStyle = createServerFn({ method: "POST" })
  .validator((data: unknown) => productSchema.parse(data))
  .handler(async ({ data }): Promise<Product> => {
    const sql = await ensureSeeded();
    const colorsJson = JSON.stringify(data.colors);
    const sizesJson = JSON.stringify(data.factorySizes);
    const extra = data.extraNote?.trim() ? data.extraNote.trim() : null;
    const front = data.imageFront ?? null;
    const side = data.imageSide ?? null;
    await sql`
      insert into styles (
        id, original_sku, factory, list_month, colors_json, kind, rule_label,
        factory_sizes_json, extra_note, image_front, image_side, updated_at
      ) values (
        ${data.id}, ${data.originalSku}, ${data.factory}, ${data.listMonth},
        ${colorsJson}, ${data.kind}, ${data.ruleLabel}, ${sizesJson}, ${extra},
        ${front}, ${side}, now()
      )
      on conflict (id) do update set
        original_sku = excluded.original_sku,
        factory = excluded.factory,
        list_month = excluded.list_month,
        colors_json = excluded.colors_json,
        kind = excluded.kind,
        rule_label = excluded.rule_label,
        factory_sizes_json = excluded.factory_sizes_json,
        extra_note = excluded.extra_note,
        image_front = excluded.image_front,
        image_side = excluded.image_side,
        updated_at = now()
    `;
    return {
      id: data.id,
      originalSku: data.originalSku,
      factory: data.factory,
      listMonth: data.listMonth,
      colors: data.colors,
      kind: data.kind,
      ruleLabel: data.ruleLabel,
      factorySizes: data.factorySizes,
      extraNote: extra ?? undefined,
      imageFront: front,
      imageSide: side,
    };
  });
