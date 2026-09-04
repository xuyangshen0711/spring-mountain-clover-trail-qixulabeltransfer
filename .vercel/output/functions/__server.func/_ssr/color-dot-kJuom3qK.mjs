import { t as COLOR_HEX } from "./catalog-CMqfDHyC.mjs";
import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Minus, i as Plus } from "../_libs/lucide-react.mjs";
import { r as cn } from "./catalog-store-C94N0p7p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/color-dot-kJuom3qK.js
var import_jsx_runtime = require_jsx_runtime();
function SizeStepper({ value, onChange, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `减少 ${label}`,
				className: cn("flex size-11 items-center justify-center rounded-sm border border-border bg-surface text-fg", "hover:bg-secondary disabled:opacity-30"),
				disabled: value <= 0,
				onClick: () => onChange(Math.max(0, value - 1)),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-4" })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				inputMode: "numeric",
				"aria-label": label,
				className: "h-11 w-14 rounded-sm border border-border bg-bg-elevated text-center font-mono text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				value: value || "",
				placeholder: "0",
				onChange: (e) => {
					const v = e.target.value.replace(/\D/g, "");
					onChange(v === "" ? 0 : Number(v));
				}
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				"aria-label": `增加 ${label}`,
				className: "flex size-11 items-center justify-center rounded-sm border border-border bg-surface text-fg hover:bg-secondary",
				onClick: () => onChange(value + 1),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" })
			})
		]
	});
}
function ColorDot({ name, className }) {
	const hex = COLOR_HEX[name] ?? "#CFC4B3";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		title: name,
		className: cn("inline-block size-3.5 shrink-0 rounded-full border border-border-strong", className),
		style: { background: hex }
	});
}
//#endregion
export { SizeStepper as n, ColorDot as t };
