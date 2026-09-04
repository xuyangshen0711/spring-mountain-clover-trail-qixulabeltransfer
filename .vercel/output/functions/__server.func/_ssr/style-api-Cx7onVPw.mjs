import { r as PRODUCTS } from "./catalog-CMqfDHyC.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as object, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/style-api-Cx7onVPw.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var kindSchema = _enum([
	"s_to_xs",
	"m_to_s",
	"unchanged",
	"numeric",
	"onesize"
]);
var productSchema = object({
	id: string().min(1).max(40),
	originalSku: string().max(40).nullable(),
	factory: _enum(["冠乔", "拿货"]),
	listMonth: string().min(1).max(40),
	colors: array(object({
		name: string().min(1).max(40),
		fabric: string().max(2e3)
	})).min(1).max(12),
	kind: kindSchema,
	ruleLabel: string().min(1).max(80),
	factorySizes: array(string().min(1).max(8)).min(1).max(10),
	extraNote: string().max(200).optional(),
	imageFront: string().nullable().optional(),
	imageSide: string().nullable().optional()
});
function rowToProduct(r) {
	let colors = [];
	let factorySizes = [];
	try {
		colors = JSON.parse(r.colors_json);
	} catch {
		colors = [{
			name: "未命名",
			fabric: ""
		}];
	}
	try {
		factorySizes = JSON.parse(r.factory_sizes_json);
	} catch {
		factorySizes = [
			"S",
			"M",
			"L",
			"XL"
		];
	}
	return {
		id: r.id,
		originalSku: r.original_sku,
		factory: r.factory,
		listMonth: r.list_month,
		colors,
		kind: r.kind,
		ruleLabel: r.rule_label,
		factorySizes,
		extraNote: r.extra_note ?? void 0,
		imageFront: r.image_front,
		imageSide: r.image_side
	};
}
function seedValues(p) {
	return {
		id: p.id,
		originalSku: p.originalSku,
		factory: p.factory,
		listMonth: p.listMonth,
		colorsJson: JSON.stringify(p.colors),
		kind: p.kind,
		ruleLabel: p.ruleLabel,
		sizesJson: JSON.stringify(p.factorySizes),
		extraNote: p.extraNote ?? null
	};
}
async function ensureSeeded() {
	const { getSql } = await import("./db-DS-37MeL.mjs");
	const sql = await getSql();
	if (((await sql`select count(*)::int as n from styles`)[0]?.n ?? 0) >= PRODUCTS.length) return sql;
	for (const p of PRODUCTS) {
		const v = seedValues(p);
		await sql`
      insert into styles (
        id, original_sku, factory, list_month, colors_json, kind, rule_label,
        factory_sizes_json, extra_note
      ) values (
        ${v.id}, ${v.originalSku}, ${v.factory}, ${v.listMonth}, ${v.colorsJson},
        ${v.kind}, ${v.ruleLabel}, ${v.sizesJson}, ${v.extraNote}
      )
      on conflict (id) do nothing
    `;
	}
	return sql;
}
var listStyles_createServerFn_handler = createServerRpc({
	id: "eb76b2539c3eb1a49ee3705aa772922ba6be1cc4142808685cd2d17eb6becdc7",
	name: "listStyles",
	filename: "src/lib/style-api.ts"
}, (opts) => listStyles.__executeServer(opts));
var listStyles = createServerFn({ method: "GET" }).handler(listStyles_createServerFn_handler, async () => {
	return (await (await ensureSeeded())`
      select id, original_sku, factory, list_month, colors_json, kind, rule_label,
             factory_sizes_json, extra_note, image_front, image_side
      from styles
      order by list_month, id
    `).map(rowToProduct);
});
var saveStyle_createServerFn_handler = createServerRpc({
	id: "d2423199665ddae46ba54e458c4e7522c9bdf0734de4ddaf305489537f0e4855",
	name: "saveStyle",
	filename: "src/lib/style-api.ts"
}, (opts) => saveStyle.__executeServer(opts));
var saveStyle = createServerFn({ method: "POST" }).validator((data) => productSchema.parse(data)).handler(saveStyle_createServerFn_handler, async ({ data }) => {
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
		extraNote: extra ?? void 0,
		imageFront: front,
		imageSide: side
	};
});
//#endregion
export { listStyles_createServerFn_handler, saveStyle_createServerFn_handler };
