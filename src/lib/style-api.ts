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
        image: z.string().nullable().optional(),
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
  await sql`create table if not exists deleted_styles (
    id text primary key,
    deleted_at timestamptz not null default now()
  )`;
  const deletedRows = await sql<{ id: string }>`select id from deleted_styles`;
  const deleted = new Set(deletedRows.map((r) => r.id));
  const existing = await sql<{ id: string; image_front: string | null }>`
    select id, image_front from styles
  `;
  const have = new Map(existing.map((r) => [r.id, r.image_front]));
  const forceIds = new Set(["26C013", "26C018", "26C022", "26C032"]);
  const missing = PRODUCTS.some((p) => !deleted.has(p.id) && !have.has(p.id));
  const needImages = PRODUCTS.some(
    (p) =>
      !deleted.has(p.id) &&
      have.has(p.id) &&
      !have.get(p.id) &&
      Boolean(p.imageFront),
  );
  const needForce = PRODUCTS.some((p) => forceIds.has(p.id) && !deleted.has(p.id));
  if (!missing && !needImages && !needForce) return sql;
  for (const p of PRODUCTS) {
    if (deleted.has(p.id)) continue;
    const v = seedValues(p);
    if (have.has(p.id) && have.get(p.id) && !forceIds.has(p.id)) continue;
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
        image_front = coalesce(styles.image_front, excluded.image_front),
        image_side = coalesce(styles.image_side, excluded.image_side),
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
    await sql`delete from deleted_styles where id = ${data.id}`;
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

export const deleteStyle = createServerFn({ method: "POST" })
  .validator((data: unknown) => z.object({ id: z.string().min(1) }).parse(data))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql`create table if not exists deleted_styles (
      id text primary key,
      deleted_at timestamptz not null default now()
    )`;
    await sql`delete from styles where id = ${data.id}`;
    await sql`insert into deleted_styles (id) values (${data.id})
      on conflict (id) do nothing`;
    return { id: data.id };
  });
