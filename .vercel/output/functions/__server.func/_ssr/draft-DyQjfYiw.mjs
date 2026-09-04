import { o as __toESM } from "../_runtime.mjs";
import { a as QTY_COLS, d as productAfterRange, i as PRODUCT_BY_ID, m as shiftFactoryQtysToQixu, o as factoryQtysToCols, p as qtyTotal, u as mapFactoryToQixu } from "./catalog-CMqfDHyC.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Trash2, s as Download } from "../_libs/lucide-react.mjs";
import { i as draftPieceCount, n as Button, o as useCatalog, s as useDraft, t as AppHeader } from "./catalog-store-C94N0p7p.mjs";
import { t as Input } from "./input-Df2mnIZW.mjs";
import { n as SizeStepper, t as ColorDot } from "./color-dot-kJuom3qK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/draft-DyQjfYiw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var HEADER_FILL = "F4C430";
var BODY_FILL = "E2EFDA";
var SKU_FILL = "C6E0B4";
var HEADER_FONT = {
	name: "微软雅黑",
	size: 10,
	bold: true,
	color: { argb: "FF1C1916" }
};
var BODY_FONT = {
	name: "微软雅黑",
	size: 10,
	color: { argb: "FF1C1916" }
};
var MONO_FONT = {
	name: "Consolas",
	size: 10,
	bold: true,
	color: { argb: "FF1C1916" }
};
var THIN = {
	style: "thin",
	color: { argb: "FFB7C4B0" }
};
var BOX = {
	top: THIN,
	left: THIN,
	bottom: THIN,
	right: THIN
};
var COLS = [
	{
		key: "listMonth",
		width: 12
	},
	{
		key: "relabelDate",
		width: 12
	},
	{
		key: "factory",
		width: 10
	},
	{
		key: "originalSku",
		width: 14
	},
	{
		key: "sku",
		width: 14
	},
	{
		key: "color",
		width: 12
	},
	{
		key: "fabric",
		width: 28
	},
	{
		key: "imgFront",
		width: 12
	},
	{
		key: "imgSide",
		width: 14
	},
	{
		key: "XS",
		width: 8
	},
	{
		key: "S",
		width: 10
	},
	{
		key: "M",
		width: 10
	},
	{
		key: "L",
		width: 10
	},
	{
		key: "XL",
		width: 8
	},
	{
		key: "XXL",
		width: 8
	},
	{
		key: "total",
		width: 8
	},
	{
		key: "rule",
		width: 22
	},
	{
		key: "after",
		width: 22
	},
	{
		key: "note",
		width: 16
	}
];
function paintHeader(cell) {
	cell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: `FF${HEADER_FILL}` }
	};
	cell.font = HEADER_FONT;
	cell.alignment = {
		horizontal: "center",
		vertical: "middle",
		wrapText: true
	};
	cell.border = BOX;
}
function paintBody(cell, kind) {
	cell.fill = {
		type: "pattern",
		pattern: "solid",
		fgColor: { argb: `FF${kind === "sku" ? SKU_FILL : BODY_FILL}` }
	};
	cell.font = kind === "sku" ? MONO_FONT : BODY_FONT;
	cell.alignment = {
		horizontal: kind === "num" || kind === "sku" ? "center" : "center",
		vertical: "middle",
		wrapText: true
	};
	cell.border = BOX;
}
function toLines(rows, mode, byId) {
	const out = [];
	for (const row of rows) {
		const product = byId.get(row.productId);
		if (!product) continue;
		const color = product.colors.find((c) => c.name === row.color) ?? product.colors[0];
		const qtys = mode === "factory" ? factoryQtysToCols(row.qtys) : shiftFactoryQtysToQixu(product.kind, row.qtys);
		const onesize = product.kind === "onesize" ? qtyTotal(row.qtys) : 0;
		const total = product.kind === "onesize" ? onesize : QTY_COLS.reduce((a, k) => a + (qtys[k] ?? 0), 0);
		const after = productAfterRange(product);
		const notes = [];
		if (product.kind === "onesize" && onesize) notes.push(`均码 ${onesize}`);
		if (row.note) notes.push(row.note);
		out.push({
			product,
			row,
			qtys,
			total,
			after: product.kind === "numeric" && product.extraNote ? `${after}（改标尺码） ${product.extraNote}` : after,
			note: notes.join("；"),
			fabric: (color?.fabric ?? "").replace(/\n/g, " ").replace(/\s+/g, " ").trim()
		});
	}
	return out;
}
function fillSheet(ws, mode, lines) {
	ws.properties.defaultRowHeight = 18;
	ws.views = [{
		state: "frozen",
		ySplit: 2,
		activeCell: "A3",
		showGridLines: true
	}];
	COLS.forEach((c, i) => {
		ws.getColumn(i + 1).width = c.width;
	});
	const lastCol = 19;
	const lastRow = Math.max(2, lines.length + 2);
	ws.mergeCells("A1:A2");
	ws.mergeCells("B1:B2");
	ws.mergeCells("C1:C2");
	ws.mergeCells("D1:D2");
	ws.mergeCells("E1:E2");
	ws.mergeCells("F1:F2");
	ws.mergeCells("G1:G2");
	ws.mergeCells("H1:H2");
	ws.mergeCells("I1:I2");
	ws.mergeCells("J1:O1");
	ws.mergeCells("P1:P2");
	ws.mergeCells("Q1:Q2");
	ws.mergeCells("R1:R2");
	ws.mergeCells("S1:S2");
	for (const [ref, label] of [
		["A1", "上架日期"],
		["B1", "该标日期"],
		["C1", "工厂"],
		["D1", "原款号"],
		["E1", "款号"],
		["F1", "颜色"],
		["G1", "面料"],
		["H1", "图片（正面）"],
		["I1", "图片（侧面/多色）"],
		["J1", "数量"],
		["P1", "总"],
		["Q1", "改标要求"],
		["R1", "改标后尺码"],
		["S1", "备注"]
	]) {
		const cell = ws.getCell(ref);
		cell.value = label;
		paintHeader(cell);
	}
	[
		"xs",
		"S (26)",
		"M (27)",
		"L (28)",
		"XL",
		"XXL"
	].forEach((label, i) => {
		const cell = ws.getCell(2, 10 + i);
		cell.value = label;
		paintHeader(cell);
	});
	for (const col of [
		1,
		2,
		3,
		4,
		5,
		6,
		7,
		8,
		9,
		16,
		17,
		18,
		19
	]) paintHeader(ws.getCell(2, col));
	for (let c = 11; c <= 15; c++) paintHeader(ws.getCell(1, c));
	ws.getRow(1).height = 20;
	ws.getRow(2).height = 20;
	lines.forEach((line, idx) => {
		const r = idx + 3;
		const row = ws.getRow(r);
		row.height = 52;
		[
			line.product.listMonth,
			line.row.relabelDate,
			line.product.factory,
			line.product.originalSku ?? "",
			line.product.id,
			line.row.color,
			line.fabric,
			null,
			null,
			line.qtys.XS || null,
			line.qtys.S || null,
			line.qtys.M || null,
			line.qtys.L || null,
			line.qtys.XL || null,
			line.qtys.XXL || null,
			line.total || null,
			line.product.ruleLabel,
			line.after,
			line.note
		].forEach((v, i) => {
			const cell = row.getCell(i + 1);
			if (v !== null && v !== "") cell.value = v;
			paintBody(cell, i === 3 || i === 4 ? "sku" : i >= 9 && i <= 15 ? "num" : "body");
		});
	});
	let i = 0;
	while (i < lines.length) {
		let j = i;
		while (j + 1 < lines.length && lines[j].product.id === lines[j + 1].product.id && lines[j].row.relabelDate === lines[j + 1].row.relabelDate) j += 1;
		if (j > i) {
			const r1 = i + 3;
			const r2 = j + 3;
			for (const col of [
				1,
				3,
				4,
				5,
				7,
				17,
				18
			]) try {
				ws.mergeCells(r1, col, r2, col);
			} catch {}
		}
		i = j + 1;
	}
	if (lines.length > 0) ws.autoFilter = {
		from: {
			row: 2,
			column: 1
		},
		to: {
			row: lastRow,
			column: lastCol
		}
	};
}
async function downloadDraftExcel(rows, products) {
	const byId = /* @__PURE__ */ new Map();
	for (const p of PRODUCT_BY_ID.values()) byId.set(p.id, p);
	for (const p of products) byId.set(p.id, p);
	const wb = new (await (import("../_libs/exceljs+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t())))).default.Workbook();
	wb.creator = "启序改标";
	wb.created = /* @__PURE__ */ new Date();
	const factoryLines = toLines(rows, "factory", byId);
	const qixuLines = toLines(rows, "qixu", byId);
	fillSheet(wb.addWorksheet("工作表1", { pageSetup: {
		orientation: "landscape",
		fitToPage: true,
		fitToWidth: 1,
		fitToHeight: 1,
		paperSize: 9,
		horizontalDpi: 96,
		verticalDpi: 96
	} }), "factory", factoryLines);
	fillSheet(wb.addWorksheet("改标计算", { pageSetup: {
		orientation: "landscape",
		fitToPage: true,
		fitToWidth: 1,
		fitToHeight: 1,
		paperSize: 9,
		horizontalDpi: 96,
		verticalDpi: 96
	} }), "qixu", qixuLines);
	const buffer = await wb.xlsx.writeBuffer();
	const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
	const blob = new Blob([bytes], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
	const today = /* @__PURE__ */ new Date();
	const name = `启序改标_${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}.xlsx`;
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = name;
	document.body.appendChild(a);
	a.click();
	a.remove();
	URL.revokeObjectURL(url);
}
function DraftPage() {
	const rows = useDraft((s) => s.rows);
	const relabelDate = useDraft((s) => s.relabelDate);
	const setRelabelDate = useDraft((s) => s.setRelabelDate);
	const setQty = useDraft((s) => s.setQty);
	const setNote = useDraft((s) => s.setNote);
	const setRowDate = useDraft((s) => s.setRowDate);
	const remove = useDraft((s) => s.remove);
	const clear = useDraft((s) => s.clear);
	const products = useCatalog((s) => s.products);
	const refresh = useCatalog((s) => s.refresh);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const pieces = draftPieceCount(rows);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	async function exportXlsx() {
		if (rows.length === 0) {
			toast.error("草稿是空的");
			return;
		}
		setBusy(true);
		try {
			await downloadDraftExcel(rows, products);
			toast.success("Excel 已下载");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "导出失败");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 pb-28 pt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight",
						children: "草稿 / 检录"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm text-muted",
						children: [
							rows.length,
							" 行 · ",
							pieces,
							" 件 · 导出含「工作表1」工厂数量和「改标计算」启序数量"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex items-center gap-2 text-sm text-muted",
							children: ["默认该标日期", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								className: "h-11 w-36 font-mono",
								value: relabelDate,
								onChange: (e) => setRelabelDate(e.target.value)
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							onClick: () => void exportXlsx(),
							disabled: busy,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "导出 Excel"]
						})]
					})]
				}),
				rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-12 rounded-xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: "还没有检录"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-muted",
							children: "先用原款号找到款式，填工厂尺码再加入草稿。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "mt-6 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm text-primary-fg",
							children: "去检索"
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-8 space-y-4",
					children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DraftCard, {
						row,
						onQty: setQty,
						onNote: setNote,
						onDate: setRowDate,
						onRemove: remove
					}, row.id))
				}),
				rows.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "mt-8 text-sm text-muted underline-offset-4 hover:underline",
					onClick: () => {
						clear();
						toast.message("草稿已清空");
					},
					children: "清空草稿"
				}) : null
			]
		})]
	});
}
function DraftCard({ row, onQty, onNote, onDate, onRemove }) {
	const p = useCatalog((s) => s.products.find((x) => x.id === row.productId));
	if (!p) return null;
	const total = qtyTotal(row.qtys);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
		className: "rounded-xl border border-border bg-surface p-4 sm:p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-base",
					children: [
						p.originalSku ?? "—",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mx-2 text-subtle",
							children: "→"
						}),
						p.id
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 inline-flex items-center gap-2 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorDot, { name: row.color }),
						row.color,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: "·"
						}),
						p.ruleLabel,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-subtle",
							children: "·"
						}),
						total,
						" 件"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "flex size-11 items-center justify-center rounded-md text-muted hover:bg-secondary hover:text-stamp",
					"aria-label": "删除",
					onClick: () => onRemove(row.id),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 grid gap-3 sm:grid-cols-2",
				children: p.factorySizes.map((size) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "w-28 font-mono text-sm",
						children: [
							size,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-1 text-subtle",
								children: "→"
							}),
							mapFactoryToQixu(p.kind, size)
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeStepper, {
						label: `${p.id} ${size}`,
						value: row.qtys[size] ?? 0,
						onChange: (n) => onQty(row.id, size, n)
					})]
				}, size))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex flex-col gap-2 sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "sm:w-40 font-mono",
					value: row.relabelDate,
					onChange: (e) => onDate(row.id, e.target.value),
					"aria-label": "该标日期"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					placeholder: "备注",
					value: row.note,
					onChange: (e) => onNote(row.id, e.target.value)
				})]
			})
		]
	});
}
//#endregion
export { DraftPage as component };
