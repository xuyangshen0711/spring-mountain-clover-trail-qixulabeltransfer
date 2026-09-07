import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { hexForColor, PRODUCTS, type FactoryName, type Product } from "@/data/catalog";
import type { Sql } from "@/lib/db";

const SEED_VERSION = "xlsx-2026-09-06-c019-green-black";

const CORE_SCHEMA = [
  `create table if not exists styles (
    id             text primary key,
    original_sku   text,
    factory        text not null,
    list_month     text not null,
    colors         jsonb not null default '[]'::jsonb,
    fabric         text not null default '',
    factory_sizes  jsonb not null default '[]'::jsonb,
    qixu_sizes     jsonb not null default '[]'::jsonb,
    rule_label     text not null default '',
    extra_note     text not null default '',
    image_front    text,
    image_side     text,
    updated_at     timestamptz not null default now()
  )`,
  `create table if not exists app_meta (
    key   text primary key,
    value text not null
  )`,
  `create table if not exists style_assets (
    id         text primary key,
    mime       text not null default 'image/jpeg',
    body       text not null,
    created_at timestamptz not null default now()
  )`,
  `create index if not exists styles_month_idx on styles (list_month)`,
  `create index if not exists styles_original_idx on styles (original_sku)`,
];

const colorSchema = z.object({
  name: z.string(),
  hex: z.string().optional(),
  image: z.string().nullable().optional(),
});

const styleSchema = z.object({
  id: z.string().min(1),
  originalSku: z.string().nullable().optional(),
  factory: z.enum(["冠乔", "拿货"]),
  listMonth: z.string().min(1),
  colors: z.array(colorSchema).min(1),
  fabric: z.string(),
  factorySizes: z.array(z.string()).min(1),
  qixuSizes: z.array(z.string()).min(1),
  ruleLabel: z.string(),
  extraNote: z.string(),
  imageFront: z.string().nullable().optional(),
  imageSide: z.string().nullable().optional(),
});

type StyleRow = {
  id: string;
  original_sku: string | null;
  factory: string;
  list_month: string;
  colors: unknown;
  fabric: string;
  factory_sizes: unknown;
  qixu_sizes: unknown;
  rule_label: string;
  extra_note: string;
  image_front: string | null;
  image_side: string | null;
};

function parseJson<T>(value: unknown, fallback: T): T {
  if (value == null) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value as T;
}

function rowToProduct(row: StyleRow): Product {
  return {
    id: row.id,
    originalSku: row.original_sku,
    factory: (row.factory === "拿货" ? "拿货" : "冠乔") as FactoryName,
    listMonth: row.list_month,
    colors: parseJson(row.colors, []),
    fabric: row.fabric ?? "",
    factorySizes: parseJson(row.factory_sizes, []),
    qixuSizes: parseJson(row.qixu_sizes, []),
    ruleLabel: row.rule_label ?? "",
    extraNote: row.extra_note ?? "",
    imageFront: row.image_front,
    imageSide: row.image_side,
  };
}

function parseDataUrl(dataUrl: string): { mime: string; body: string } | null {
  const m = dataUrl.match(
    /^data:(image\/[a-zA-Z0-9.+-]+);base64,([A-Za-z0-9+/=\s]+)$/,
  );
  if (!m) return null;
  return { mime: m[1], body: m[2].replace(/\s+/g, "") };
}

async function ensureCoreSchema(sql: Sql) {
  for (const stmt of CORE_SCHEMA) {
    await sql.query(stmt);
  }
}

async function persistImage(
  sql: Sql,
  value: string | null | undefined,
): Promise<string | null> {
  if (!value) return null;
  if (!value.startsWith("data:")) return value;
  const parsed = parseDataUrl(value);
  if (!parsed) throw new Error("图片格式不对，请用 JPG 或 PNG");
  if (parsed.body.length > 1_200_000) throw new Error("图片太大，换一张小一点的");
  await ensureCoreSchema(sql);
  const id = crypto.randomUUID();
  await sql.query(
    `insert into style_assets (id, mime, body) values ($1, $2, $3)`,
    [id, parsed.mime, parsed.body],
  );
  return `/api/asset/${id}`;
}

function failMsg(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err ?? "");
  console.error("[style-api]", message);
  if (/too large|payload|413|body/i.test(message)) {
    return "图片太大，换一张小一点的再试";
  }
  if (/heic|heif/i.test(message)) {
    return "这张是 iPhone 实况/HEIC，先转成 JPG 再传";
  }
  return (message || "保存失败").slice(0, 180);
}

async function ensureSeeded() {
  const { getSql } = await import("@/lib/db");
  const sql = await getSql();
  await ensureCoreSchema(sql);
  const meta = await sql<{ value: string }>`
    select value from app_meta where key = 'seed_version'
  `;
  if (meta[0]?.value === SEED_VERSION) return sql;

  const deleted = new Set(await readDeletedIds(sql));
  for (const p of PRODUCTS) {
    if (deleted.has(p.id)) continue;
    await sql.query(
      `insert into styles (
         id, original_sku, factory, list_month, colors, fabric,
         factory_sizes, qixu_sizes, rule_label, extra_note, image_front, image_side
       ) values (
         $1,$2,$3,$4,$5::jsonb,$6,$7::jsonb,$8::jsonb,$9,$10,$11,$12
       )
       on conflict (id) do update set
         original_sku = excluded.original_sku,
         factory = excluded.factory,
         list_month = excluded.list_month,
         colors = excluded.colors,
         fabric = excluded.fabric,
         factory_sizes = excluded.factory_sizes,
         qixu_sizes = excluded.qixu_sizes,
         rule_label = excluded.rule_label,
         extra_note = excluded.extra_note,
         image_front = excluded.image_front,
         image_side = excluded.image_side,
         updated_at = now()`,
      [
        p.id,
        p.originalSku,
        p.factory,
        p.listMonth,
        JSON.stringify(p.colors),
        p.fabric,
        JSON.stringify(p.factorySizes),
        JSON.stringify(p.qixuSizes),
        p.ruleLabel,
        p.extraNote,
        p.imageFront,
        p.imageSide,
      ],
    );
  }
  await sql.query(
    `insert into app_meta(key, value) values ('seed_version', $1)
     on conflict (key) do update set value = excluded.value`,
    [SEED_VERSION],
  );
  return sql;
}

export const listStyles = createServerFn({ method: "GET" }).handler(
  async (): Promise<Product[]> => {
    try {
      const sql = await ensureSeeded();
      const rows = await sql<StyleRow>`
        select id, original_sku, factory, list_month, colors, fabric,
               factory_sizes, qixu_sizes, rule_label, extra_note,
               image_front, image_side
        from styles
        order by list_month, id
      `;
      return rows.map(rowToProduct);
    } catch (err) {
      console.error("[listStyles]", err);
      return PRODUCTS;
    }
  },
);

export const putAsset = createServerFn({ method: "POST" })
  .validator((input) => {
    const parsed = z
      .object({
        dataUrl: z.string().min(20).max(400_000),
      })
      .safeParse(input);
    if (!parsed.success) throw new Error("图片数据不对，请重新选一张");
    return parsed.data;
  })
  .handler(async ({ data }): Promise<{ url: string }> => {
    try {
      const sql = await ensureSeeded();
      const url = await persistImage(sql, data.dataUrl);
      if (!url) throw new Error("图片没写进去");
      return { url };
    } catch (err) {
      throw new Error(failMsg(err));
    }
  });

export const saveStyle = createServerFn({ method: "POST" })
  .validator((input) => {
    const parsed = styleSchema.safeParse(input);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      const path = issue?.path?.length ? issue.path.join(".") : "";
      throw new Error(path ? `资料不完整：${path}` : "资料格式不对");
    }
    return parsed.data;
  })
  .handler(async ({ data }): Promise<Product> => {
    try {
      const sql = await ensureSeeded();
      const colors = [];
      for (const c of data.colors) {
        const name = c.name.trim();
        colors.push({
          name,
          hex: c.hex || hexForColor(name),
          image: await persistImage(sql, c.image ?? null),
        });
      }
      const product: Product = {
        id: data.id.trim(),
        originalSku: data.originalSku?.trim() || null,
        factory: data.factory,
        listMonth: data.listMonth.trim() || "26年-9月",
        colors,
        fabric: data.fabric,
        factorySizes: data.factorySizes,
        qixuSizes: data.qixuSizes,
        ruleLabel: data.ruleLabel,
        extraNote: data.extraNote,
        imageFront: await persistImage(sql, data.imageFront ?? null),
        imageSide: await persistImage(sql, data.imageSide ?? null),
      };
      await sql.query(
        `insert into styles (
           id, original_sku, factory, list_month, colors, fabric,
           factory_sizes, qixu_sizes, rule_label, extra_note, image_front, image_side
         ) values (
           $1,$2,$3,$4,$5::jsonb,$6,$7::jsonb,$8::jsonb,$9,$10,$11,$12
         )
         on conflict (id) do update set
           original_sku = excluded.original_sku,
           factory = excluded.factory,
           list_month = excluded.list_month,
           colors = excluded.colors,
           fabric = excluded.fabric,
           factory_sizes = excluded.factory_sizes,
           qixu_sizes = excluded.qixu_sizes,
           rule_label = excluded.rule_label,
           extra_note = excluded.extra_note,
           image_front = excluded.image_front,
           image_side = excluded.image_side,
           updated_at = now()`,
        [
          product.id,
          product.originalSku,
          product.factory,
          product.listMonth,
          JSON.stringify(product.colors),
          product.fabric,
          JSON.stringify(product.factorySizes),
          JSON.stringify(product.qixuSizes),
          product.ruleLabel,
          product.extraNote,
          product.imageFront,
          product.imageSide,
        ],
      );
      const deleted = await readDeletedIds(sql);
      if (deleted.includes(product.id)) {
        await writeDeletedIds(
          sql,
          deleted.filter((id) => id !== product.id),
        );
      }
      return product;
    } catch (err) {
      throw new Error(failMsg(err));
    }
  });

async function readDeletedIds(sql: Sql): Promise<string[]> {
  const rows = await sql<{ value: string }>`
    select value from app_meta where key = 'deleted_ids'
  `;
  try {
    const parsed = JSON.parse(rows[0]?.value || "[]");
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

async function writeDeletedIds(sql: Sql, ids: string[]) {
  await sql.query(
    `insert into app_meta(key, value) values ('deleted_ids', $1)
     on conflict (key) do update set value = excluded.value`,
    [JSON.stringify([...new Set(ids)])],
  );
}

export const deleteStyle = createServerFn({ method: "POST" })
  .validator((input) => z.object({ id: z.string().min(1) }).parse(input))
  .handler(async ({ data }): Promise<{ id: string }> => {
    const { getSql } = await import("@/lib/db");
    const sql = await getSql();
    await sql.query(`delete from styles where id = $1`, [data.id]);
    const deleted = await readDeletedIds(sql);
    if (!deleted.includes(data.id)) deleted.push(data.id);
    await writeDeletedIds(sql, deleted);
    return { id: data.id };
  });
