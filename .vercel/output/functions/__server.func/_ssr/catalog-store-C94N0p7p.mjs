import "../_runtime.mjs";
import { l as formatRelabelDate, p as qtyTotal, r as PRODUCTS } from "./catalog-CMqfDHyC.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as object, n as array, o as string, t as _enum } from "../_libs/zod.mjs";
import { c as ClipboardList, o as Library } from "../_libs/lucide-react.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as Slot } from "../_libs/radix-ui__react-slot.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
require_react();
var import_jsx_runtime = require_jsx_runtime();
function newId() {
	return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
var useDraft = create()(persist((set, get) => ({
	relabelDate: formatRelabelDate(),
	rows: [],
	setRelabelDate: (d) => set({ relabelDate: d }),
	upsert: (row) => {
		const existing = get().rows.find((r) => r.productId === row.productId && r.color === row.color && r.relabelDate === row.relabelDate);
		if (existing) {
			const qtys = { ...existing.qtys };
			for (const [k, v] of Object.entries(row.qtys)) qtys[k] = (qtys[k] ?? 0) + (Number(v) || 0);
			set({ rows: get().rows.map((r) => r.id === existing.id ? {
				...r,
				qtys,
				note: row.note || r.note
			} : r) });
			return;
		}
		set({ rows: [...get().rows, {
			...row,
			id: newId()
		}] });
	},
	setQty: (id, size, qty) => set({ rows: get().rows.map((r) => r.id === id ? {
		...r,
		qtys: {
			...r.qtys,
			[size]: Math.max(0, Math.floor(qty) || 0)
		}
	} : r) }),
	setNote: (id, note) => set({ rows: get().rows.map((r) => r.id === id ? {
		...r,
		note
	} : r) }),
	setRowDate: (id, date) => set({ rows: get().rows.map((r) => r.id === id ? {
		...r,
		relabelDate: date
	} : r) }),
	remove: (id) => set({ rows: get().rows.filter((r) => r.id !== id) }),
	clear: () => set({ rows: [] })
}), { name: "qixu-relabel-draft" }));
function draftPieceCount(rows) {
	return rows.reduce((n, r) => n + qtyTotal(r.qtys), 0);
}
function AppHeader({ right }) {
	const rows = useDraft((s) => s.rows);
	const count = draftPieceCount(rows);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl items-center gap-3 px-4 py-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "flex min-w-0 items-center gap-2.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-9 items-center justify-center rounded-md bg-primary font-display text-lg text-primary-fg",
					children: "序"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-display text-base leading-tight tracking-tight",
						children: "启序改标"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block text-xs text-muted",
						children: "工厂尺码 → 启序尺码"
					})]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto flex items-center gap-2",
				children: [
					right,
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/library",
						className: "inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm text-muted hover:bg-secondary hover:text-fg sm:px-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Library, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "资料库"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/draft",
						className: "relative inline-flex h-11 items-center gap-2 rounded-md border border-border-strong bg-surface px-3 text-sm font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClipboardList, { className: "size-4" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "hidden sm:inline",
								children: "草稿"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums text-muted",
								children: rows.length
							}),
							count > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-stamp px-1 text-[10px] text-stamp-fg tabular-nums",
								children: count
							}) : null
						]
					})
				]
			})]
		})
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-opacity duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-secondary text-fg hover:bg-border",
			outline: "border border-border-strong bg-surface text-fg hover:bg-secondary",
			ghost: "text-fg hover:bg-secondary",
			stamp: "bg-stamp text-stamp-fg hover:opacity-90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		...props
	});
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
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
var listStyles = createServerFn({ method: "GET" }).handler(createSsrRpc("eb76b2539c3eb1a49ee3705aa772922ba6be1cc4142808685cd2d17eb6becdc7"));
var saveStyle = createServerFn({ method: "POST" }).validator((data) => productSchema.parse(data)).handler(createSsrRpc("d2423199665ddae46ba54e458c4e7522c9bdf0734de4ddaf305489537f0e4855"));
var useCatalog = create((set, get) => ({
	products: PRODUCTS,
	loaded: false,
	loading: false,
	refresh: async () => {
		if (get().loading) return;
		set({ loading: true });
		try {
			const rows = await listStyles();
			if (rows.length > 0) set({
				products: rows,
				loaded: true,
				loading: false
			});
			else set({
				loaded: true,
				loading: false
			});
		} catch {
			set({
				loaded: true,
				loading: false
			});
		}
	},
	upsertLocal: (p) => set({ products: get().products.some((x) => x.id === p.id) ? get().products.map((x) => x.id === p.id ? p : x) : [...get().products, p] }),
	byId: (id) => get().products.find((p) => p.id === id)
}));
//#endregion
export { saveStyle as a, draftPieceCount as i, Button as n, useCatalog as o, cn as r, useDraft as s, AppHeader as t };
