import { o as __toESM } from "../_runtime.mjs";
import { d as productAfterRange, f as qixuSizesFor, p as qtyTotal, u as mapFactoryToQixu } from "./catalog-CMqfDHyC.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { l as ChevronLeft, u as ArrowRight } from "../_libs/lucide-react.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { n as Button, o as useCatalog, r as cn, s as useDraft, t as AppHeader } from "./catalog-store-C94N0p7p.mjs";
import { n as SizeStepper, t as ColorDot } from "./color-dot-kJuom3qK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as Route } from "./router-B6864OJh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/style._id-C7wzInAJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "border-transparent bg-secondary text-fg",
		primary: "border-transparent bg-primary text-primary-fg",
		stamp: "border-transparent bg-stamp text-stamp-fg",
		outline: "border-border-strong text-muted"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function StyleEditor({ product }) {
	const [color, setColor] = (0, import_react.useState)(product.colors[0]?.name ?? "");
	const [qtys, setQtys] = (0, import_react.useState)({});
	const upsert = useDraft((s) => s.upsert);
	const relabelDate = useDraft((s) => s.relabelDate);
	const colorMeta = product.colors.find((c) => c.name === color) ?? product.colors[0];
	const qixu = qixuSizesFor(product.kind, product.factorySizes);
	const total = qtyTotal(qtys);
	const preview = (0, import_react.useMemo)(() => product.factorySizes.filter((s) => (qtys[s] ?? 0) > 0).map((s) => ({
		factory: s,
		qixu: mapFactoryToQixu(product.kind, s),
		qty: qtys[s] ?? 0
	})), [product, qtys]);
	function add() {
		if (total <= 0) {
			toast.error("请先填写工厂尺码数量");
			return;
		}
		upsert({
			productId: product.id,
			color,
			relabelDate,
			qtys: { ...qtys },
			note: ""
		});
		toast.success(`已加入草稿 · ${product.originalSku ?? product.id} ${color} × ${total}`);
		setQtys({});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-8 lg:grid-cols-[1fr_280px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: product.factory === "冠乔" ? "stamp" : "outline",
					children: product.factory
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-subtle",
					children: product.listMonth
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-3xl tracking-tight",
				children: product.originalSku ?? product.id
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 flex items-center gap-2 font-mono text-sm text-muted",
				children: [
					"启序款号",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: product.id
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-sm text-fg",
				children: [
					product.ruleLabel,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mx-2 text-subtle",
						children: "·"
					}),
					"改标后 ",
					productAfterRange(product),
					product.extraNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted",
						children: [
							"（",
							product.extraNote,
							"）"
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs font-medium tracking-wide text-muted",
					children: "颜色"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap gap-2",
					children: product.colors.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setColor(c.name),
						className: cn("inline-flex h-11 items-center gap-2 rounded-md border px-3 text-sm", color === c.name ? "border-fg bg-secondary" : "border-border bg-surface"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ColorDot, { name: c.name }), c.name]
					}, c.name))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 whitespace-pre-wrap text-xs leading-relaxed text-muted",
				children: colorMeta?.fabric
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-xs font-medium tracking-wide text-muted",
					children: "工厂尺码数量（按原标填写）"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border rounded-lg border border-border bg-surface",
					children: product.factorySizes.map((size) => {
						const mapped = mapFactoryToQixu(product.kind, size);
						const shifted = mapped !== size;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex flex-wrap items-center gap-3 px-4 py-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "w-16 font-mono text-sm",
									children: size
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SizeStepper, {
									label: `工厂 ${size}`,
									value: qtys[size] ?? 0,
									onChange: (n) => setQtys((q) => ({
										...q,
										[size]: n
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
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-col gap-3 sm:flex-row sm:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: add,
					className: "sm:min-w-40",
					children: "加入草稿"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"该标日期 ",
						relabelDate,
						" · 本单",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "tabular-nums text-fg",
							children: total
						}),
						" 件"
					]
				})]
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "h-fit rounded-xl border border-border bg-bg-elevated p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-wide text-muted",
					children: "换算预览"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-display text-lg",
					children: [
						color,
						" · ",
						productAfterRange(product)
					]
				}),
				preview.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-subtle",
					children: "填写左侧数量后，这里会显示工厂尺码如何变成启序尺码。"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-2",
					children: preview.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex items-center justify-between font-mono text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							p.factory,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-1.5 text-subtle",
								children: "→"
							}),
							p.qixu
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "tabular-nums",
							children: ["×", p.qty]
						})]
					}, p.factory))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-5 text-xs leading-relaxed text-subtle",
					children: [
						"启序尺码：",
						qixu.join(" / "),
						"。图片稍后可补，不影响换算与导出。"
					]
				})
			]
		})]
	});
}
function StylePage() {
	const { id } = Route.useParams();
	const refresh = useCatalog((s) => s.refresh);
	const product = useCatalog((s) => s.products.find((p) => p.id === id));
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	if (!product) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 py-16",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl",
					children: "没有这款"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [
						"款号 ",
						id,
						" 不在当前改标表里。"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "mt-6 inline-flex text-sm text-primary",
					children: "返回检索"
				})
			]
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 pb-24 pt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/",
				className: "inline-flex h-11 items-center gap-1 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), "全部款号"]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleEditor, { product })
			})]
		})]
	});
}
//#endregion
export { StylePage as component };
