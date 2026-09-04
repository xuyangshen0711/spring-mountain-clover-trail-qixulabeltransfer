import { o as __toESM } from "../_runtime.mjs";
import { n as KIND_OPTIONS } from "./catalog-CMqfDHyC.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as saveStyle, n as Button, o as useCatalog, r as cn, t as AppHeader } from "./catalog-store-C94N0p7p.mjs";
import { t as Input } from "./input-Df2mnIZW.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as StylePhoto } from "./style-photo-DFLOP63p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-yMnxnsOI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
async function compressImage(file, maxEdge = 900, quality = .72) {
	const url = URL.createObjectURL(file);
	try {
		const img = await new Promise((resolve, reject) => {
			const el = new Image();
			el.onload = () => resolve(el);
			el.onerror = () => reject(/* @__PURE__ */ new Error("图片无法读取"));
			el.src = url;
		});
		const scale = Math.min(1, maxEdge / Math.max(img.width, img.height));
		const w = Math.max(1, Math.round(img.width * scale));
		const h = Math.max(1, Math.round(img.height * scale));
		const canvas = document.createElement("canvas");
		canvas.width = w;
		canvas.height = h;
		const ctx = canvas.getContext("2d");
		if (!ctx) throw new Error("无法压缩图片");
		ctx.fillStyle = "#f4efe6";
		ctx.fillRect(0, 0, w, h);
		ctx.drawImage(img, 0, 0, w, h);
		return canvas.toDataURL("image/jpeg", quality);
	} finally {
		URL.revokeObjectURL(url);
	}
}
function blankProduct() {
	return {
		id: "",
		originalSku: "",
		factory: "冠乔",
		listMonth: "26年-8月",
		colors: [{
			name: "",
			fabric: ""
		}],
		kind: "s_to_xs",
		ruleLabel: "S变XS（整体降码）",
		factorySizes: [
			"S",
			"M",
			"L",
			"XL"
		],
		extraNote: "",
		imageFront: null,
		imageSide: null
	};
}
function LibraryPage() {
	const products = useCatalog((s) => s.products);
	const refresh = useCatalog((s) => s.refresh);
	const upsertLocal = useCatalog((s) => s.upsertLocal);
	const [q, setQ] = (0, import_react.useState)("");
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		refresh();
	}, [refresh]);
	const list = (0, import_react.useMemo)(() => {
		const s = q.trim().toLowerCase();
		if (!s) return products;
		return products.filter((p) => `${p.id} ${p.originalSku ?? ""} ${p.colors.map((c) => c.name).join(" ")}`.toLowerCase().includes(s));
	}, [products, q]);
	async function onSave(p) {
		if (!p.id.trim()) {
			toast.error("请填写启序款号");
			return;
		}
		if (p.colors.some((c) => !c.name.trim())) {
			toast.error("颜色名不能为空");
			return;
		}
		setBusy(true);
		try {
			const saved = await saveStyle({ data: {
				...p,
				id: p.id.trim(),
				originalSku: p.originalSku?.trim() ? p.originalSku.trim() : null,
				extraNote: p.extraNote || void 0
			} });
			upsertLocal(saved);
			setEditing(saved);
			toast.success("已写入资料库");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "保存失败");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppHeader, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto max-w-6xl px-4 pb-24 pt-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-end justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-3xl tracking-tight",
						children: "资料库"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "上传正面 / 侧面图，改面料、颜色和改标规则。列表页会读这里的图。"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setEditing(blankProduct()),
						children: "新建款"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-6 h-11 max-w-md font-mono",
					placeholder: "搜款号或颜色",
					value: q,
					onChange: (e) => setQ(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-2",
						children: list.map((p) => {
							const on = editing?.id === p.id && editing.id !== "";
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setEditing({ ...p }),
								className: cn("flex w-full items-center gap-3 rounded-lg p-2 text-left", on ? "bg-secondary" : "bg-surface hover:bg-secondary/60"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "size-14 overflow-hidden rounded-md bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StylePhoto, {
										src: p.imageFront,
										alt: p.originalSku ?? p.id
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "min-w-0",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-sm",
										children: [
											p.originalSku ?? "—",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "mx-1.5 text-subtle",
												children: "→"
											}),
											p.id
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "truncate text-xs text-muted",
										children: [
											p.colors.map((c) => c.name).join(" · "),
											" · ",
											p.ruleLabel
										]
									})]
								})]
							}) }, p.id);
						})
					}), editing ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StyleForm, {
						initial: editing,
						busy,
						onCancel: () => setEditing(null),
						onSave
					}, editing.id || "new") : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "rounded-xl border border-dashed border-border-strong bg-surface px-5 py-16 text-center text-sm text-muted",
						children: "点左侧一款开始改图和细节，或新建款。"
					})]
				})
			]
		})]
	});
}
function StyleForm({ initial, busy, onCancel, onSave }) {
	const [form, setForm] = (0, import_react.useState)(initial);
	const isNew = !initial.id;
	async function onFile(field, file) {
		if (!file) return;
		try {
			const data = await compressImage(file);
			setForm((f) => ({
				...f,
				[field]: data
			}));
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "图片读取失败");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		className: "space-y-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5",
		onSubmit: (e) => {
			e.preventDefault();
			onSave(form);
		},
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["原款号", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono",
							value: form.originalSku ?? "",
							onChange: (e) => setForm((f) => ({
								...f,
								originalSku: e.target.value || null
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["启序款号", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1 font-mono",
							value: form.id,
							disabled: !isNew,
							onChange: (e) => setForm((f) => ({
								...f,
								id: e.target.value
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["工厂", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							className: "mt-1 h-11 w-full rounded-md border border-input bg-bg-elevated px-3 text-sm text-fg",
							value: form.factory,
							onChange: (e) => setForm((f) => ({
								...f,
								factory: e.target.value
							})),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "冠乔",
								children: "冠乔"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "拿货",
								children: "拿货"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "block text-xs text-muted",
						children: ["上架月份", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							className: "mt-1",
							value: form.listMonth,
							onChange: (e) => setForm((f) => ({
								...f,
								listMonth: e.target.value
							}))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs text-muted",
				children: ["改标规则", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
					className: "mt-1 h-11 w-full rounded-md border border-input bg-bg-elevated px-3 text-sm text-fg",
					value: form.kind,
					onChange: (e) => {
						const kind = e.target.value;
						const opt = KIND_OPTIONS.find((k) => k.kind === kind);
						setForm((f) => ({
							...f,
							kind,
							ruleLabel: opt?.label ?? f.ruleLabel,
							factorySizes: kind === "onesize" ? ["F"] : kind === "numeric" ? [
								"26",
								"27",
								"28",
								"29"
							] : kind === "m_to_s" ? [
								"M",
								"L",
								"XL"
							] : [
								"S",
								"M",
								"L",
								"XL"
							]
						}));
					},
					children: KIND_OPTIONS.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: k.kind,
						children: k.label
					}, k.kind))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs text-muted",
				children: ["改标说明（可改文案）", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1",
					value: form.ruleLabel,
					onChange: (e) => setForm((f) => ({
						...f,
						ruleLabel: e.target.value
					}))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs text-muted",
				children: ["工厂尺码（空格分隔）", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1 font-mono",
					value: form.factorySizes.join(" "),
					onChange: (e) => setForm((f) => ({
						...f,
						factorySizes: e.target.value.split(/[\s,，]+/).map((s) => s.trim()).filter(Boolean)
					}))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "block text-xs text-muted",
				children: ["备注", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mt-1",
					value: form.extraNote ?? "",
					onChange: (e) => setForm((f) => ({
						...f,
						extraNote: e.target.value
					}))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-2 gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageSlot, {
					label: "正面图",
					src: form.imageFront,
					onFile: (f) => void onFile("imageFront", f),
					onClear: () => setForm((x) => ({
						...x,
						imageFront: null
					}))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImageSlot, {
					label: "侧面 / 多色",
					src: form.imageSide,
					onFile: (f) => void onFile("imageSide", f),
					onClear: () => setForm((x) => ({
						...x,
						imageSide: null
					}))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-2 text-xs text-muted",
					children: "颜色与面料"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-3",
					children: form.colors.map((c, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-md border border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								placeholder: "颜色名",
								value: c.name,
								onChange: (e) => setForm((f) => ({
									...f,
									colors: f.colors.map((x, j) => j === i ? {
										...x,
										name: e.target.value
									} : x)
								}))
							}), form.colors.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => setForm((f) => ({
									...f,
									colors: f.colors.filter((_, j) => j !== i)
								})),
								children: "删"
							}) : null]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							className: "mt-2 min-h-16 w-full rounded-md border border-input bg-bg-elevated px-3 py-2 text-sm",
							placeholder: "面料",
							value: c.fabric,
							onChange: (e) => setForm((f) => ({
								...f,
								colors: f.colors.map((x, j) => j === i ? {
									...x,
									fabric: e.target.value
								} : x)
							}))
						})]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					className: "mt-2",
					onClick: () => setForm((f) => ({
						...f,
						colors: [...f.colors, {
							name: "",
							fabric: f.colors[0]?.fabric ?? ""
						}]
					})),
					children: "加颜色"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					children: busy ? "保存中…" : "保存到资料库"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "ghost",
					onClick: onCancel,
					children: "取消"
				})]
			})
		]
	});
}
function ImageSlot({ label, src, onFile, onClear }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block text-xs text-muted",
		children: [
			label,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 aspect-[5/6] overflow-hidden rounded-md bg-secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StylePhoto, {
					src,
					alt: label
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "file",
				accept: "image/*",
				className: "mt-2 block w-full text-xs",
				onChange: (e) => onFile(e.target.files?.[0])
			}),
			src ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "mt-1 text-xs text-muted underline-offset-2 hover:underline",
				onClick: onClear,
				children: "清除图片"
			}) : null
		]
	});
}
//#endregion
export { LibraryPage as component };
