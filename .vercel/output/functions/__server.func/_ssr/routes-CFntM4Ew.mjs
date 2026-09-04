import { o as __toESM } from "../_runtime.mjs";
import { c as findByOriginalSku, d as productAfterRange, p as qtyTotal, s as filterProducts, u as mapFactoryToQixu } from "./catalog-CMqfDHyC.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as Search } from "../_libs/lucide-react.mjs";
import { n as Button, o as useCatalog, r as cn, s as useDraft, t as AppHeader } from "./catalog-store-C94N0p7p.mjs";
import { t as Input } from "./input-Df2mnIZW.mjs";
import { n as SizeStepper, t as ColorDot } from "./color-dot-kJuom3qK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as StylePhoto } from "./style-photo-DFLOP63p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CFntM4Ew.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product, onPick }) {
	const sku = product.originalSku ?? product.id;
	const colorCount = product.colors.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			className: "block w-full text-left",
			onClick: () => onPick(product),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "aspect-[5/6] w-full overflow-hidden bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StylePhoto, {
					src: product.imageFront,
					alt: ""
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-3 pt-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-base font-medium tracking-tight",
					children: sku
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 text-xs text-muted",
					children: product.originalSku ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						product.id,
						" · ",
						colorCount,
						" 色"
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						"拿货 · ",
						colorCount,
						" 色"
					] })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "p-3 pt-2",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onPick(product),
				className: "flex h-11 w-full items-center justify-center rounded-md border border-border text-sm text-fg hover:bg-secondary",
				children: "选颜色加入检录"
			})
		})]
	});
}
function AddSheet({ product, onClose }) {
	const [step, setStep] = (0, import_react.useState)("colors");
	const [picked, setPicked] = (0, import_react.useState)([]);
	const [activeColor, setActiveColor] = (0, import_react.useState)("");
	const [qtysByColor, setQtysByColor] = (0, import_react.useState)({});
	const upsert = useDraft((s) => s.upsert);
	const relabelDate = useDraft((s) => s.relabelDate);
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [onClose]);
	function toggleColor(name) {
		setPicked((cur) => cur.includes(name) ? cur.filter((x) => x !== name) : [...cur, name]);
	}
	function goSizes() {
		if (picked.length === 0) return;
		setActiveColor(picked[0] ?? "");
		setStep("sizes");
	}
	const activeQtys = qtysByColor[activeColor] ?? {};
	const previewTotal = (0, import_react.useMemo)(() => picked.reduce((n, c) => n + qtyTotal(qtysByColor[c] ?? {}), 0), [picked, qtysByColor]);
	function addToDraft() {
		const ready = picked.filter((c) => qtyTotal(qtysByColor[c] ?? {}) > 0);
		if (ready.length === 0) {
			toast.error("请先按颜色填写工厂尺码数量");
			return;
		}
		for (const color of ready) upsert({
			productId: product.id,
			color,
			relabelDate,
			qtys: { ...qtysByColor[color] ?? {} },
			note: ""
		});
		toast.success(`已加入草稿 · ${product.originalSku ?? product.id} ${ready.length} 色 ${previewTotal} 件`);
		onClose();
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			className: "absolute inset-0 bg-fg/40",
			"aria-label": "关闭",
			onClick: onClose
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "add-sheet-title",
			className: "relative z-10 flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-xl bg-surface shadow-[var(--shadow-border-hover)] sm:rounded-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 border-b border-border p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-16 overflow-hidden rounded-md bg-secondary",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StylePhoto, {
							src: product.imageFront,
							alt: ""
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "add-sheet-title",
								className: "font-mono text-lg tracking-tight",
								children: product.originalSku ?? product.id
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-0.5 font-mono text-sm text-muted",
								children: ["→ ", product.id]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-subtle",
								children: [
									product.ruleLabel,
									" · 改标后 ",
									productAfterRange(product)
								]
							})
						]
					})]
				}),
				step === "colors" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "选要加入检录的颜色，不会一次加全色"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: product.colors.map((c) => {
							const on = picked.includes(c.name);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => toggleColor(c.name),
								className: cn("inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm", on ? "border-fg bg-secondary text-fg" : "border-border bg-bg-elevated text-muted"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorDot, { name: c.name }), c.name]
							}, c.name);
						})
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 overflow-y-auto p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 flex flex-wrap gap-2",
							children: picked.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setActiveColor(c),
								className: cn("inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm", activeColor === c ? "border-fg bg-secondary" : "border-border bg-bg-elevated text-muted"),
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorDot, { name: c }),
									c,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "tabular-nums text-subtle",
										children: qtyTotal(qtysByColor[c] ?? {})
									})
								]
							}, c))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-xs font-medium tracking-wide text-muted",
							children: "工厂尺码数量（按原标填写）"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "divide-y divide-border rounded-lg border border-border bg-bg-elevated",
							children: product.factorySizes.map((size) => {
								const mapped = mapFactoryToQixu(product.kind, size);
								const shifted = mapped !== size;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap items-center gap-3 px-3 py-2.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "w-12 font-mono text-sm",
											children: size
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeStepper, {
											label: `工厂 ${size}`,
											value: activeQtys[size] ?? 0,
											onChange: (n) => setQtysByColor((q) => ({
												...q,
												[activeColor]: {
													...q[activeColor] ?? {},
													[size]: n
												}
											}))
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "ml-auto flex items-center gap-2 text-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-subtle",
												children: "启序"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: cn("rounded-sm px-2 py-1 font-mono text-sm", shifted ? "bg-secondary text-fg" : "text-muted"),
												children: mapped
											})]
										})
									]
								}, size);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-xs text-subtle",
							children: [
								"该标日期 ",
								relabelDate,
								" · 本单 ",
								previewTotal,
								" 件"
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-3 border-t border-border p-4",
					children: step === "colors" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: onClose,
						children: "取消"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "secondary",
						disabled: picked.length === 0,
						onClick: goSizes,
						children: [
							"加入 ",
							picked.length,
							" 色"
						]
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setStep("colors"),
						children: "上一步"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: addToDraft,
						disabled: previewTotal <= 0,
						children: "加入草稿"
					})] })
				})
			]
		})]
	});
}
var FACTORIES = [
	"全部",
	"冠乔",
	"拿货"
];
function Home() {
	const [q, setQ] = (0, import_react.useState)("");
	const [factory, setFactory] = (0, import_react.useState)("全部");
	const [active, setActive] = (0, import_react.useState)(null);
	const products = useCatalog((s) => s.products);
	const refresh = useCatalog((s) => s.refresh);
	const loaded = useCatalog((s) => s.loaded);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const list = (0, import_react.useMemo)(() => filterProducts(q, factory, products), [
		q,
		factory,
		products
	]);
	const groups = (0, import_react.useMemo)(() => {
		const map = /* @__PURE__ */ new Map();
		for (const p of list) {
			const arr = map.get(p.listMonth) ?? [];
			arr.push(p);
			map.set(p.listMonth, arr);
		}
		return [...map.entries()];
	}, [list]);
	function onSearchSubmit(e) {
		e.preventDefault();
		const hit = findByOriginalSku(q, products);
		if (hit) setActive(hit);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-6xl px-4 pb-24 pt-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-[0.18em] text-muted",
						children: "QIXU · RELABEL"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 max-w-xl font-display text-4xl leading-tight tracking-tight",
						children: "用冠乔原款号检录，尺码自动换成启序。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 max-w-xl text-sm leading-relaxed text-muted",
						children: "点卡片选颜色，再按工厂尺码填数量。系统当场换成启序尺码，写入草稿后导出 Excel。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: onSearchSubmit,
						className: "relative mt-8 max-w-xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: q,
							onChange: (e) => setQ(e.target.value),
							placeholder: "搜索冠乔原款号，例如 886C001",
							className: "h-12 pl-10 font-mono",
							autoFocus: true
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: FACTORIES.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setFactory(f),
							className: cn("h-9 rounded-full px-3 text-sm", factory === f ? "bg-fg text-bg" : "border border-border bg-surface text-muted"),
							children: f
						}, f))
					}),
					list.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-10 text-sm text-muted",
						children: loaded ? "没有匹配的款号，换一个原款号试试。" : "正在读取资料库…"
					}) : groups.map(([month, items]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "flex items-baseline gap-2 font-display text-xl tracking-tight text-primary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: month }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-sans text-sm text-muted",
								children: [items.length, " 款"]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3",
							children: items.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, {
								product: p,
								onPick: setActive
							}, p.id))
						})]
					}, month))
				]
			}),
			active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddSheet, {
				product: active,
				onClose: () => setActive(null)
			}) : null
		]
	});
}
//#endregion
export { Home as component };
