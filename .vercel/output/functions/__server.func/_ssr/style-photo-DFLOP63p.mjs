import { b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as cn } from "./catalog-store-C94N0p7p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/style-photo-DFLOP63p.js
var import_jsx_runtime = require_jsx_runtime();
function StylePhoto({ src, alt, className }) {
	if (src) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src,
		alt,
		className: cn("h-full w-full object-cover outline outline-1 -outline-offset-1 outline-black/10", className)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex h-full w-full items-center justify-center bg-secondary text-subtle", className),
		"aria-label": alt,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
			viewBox: "0 0 64 80",
			className: "h-16 w-12 opacity-50",
			fill: "none",
			"aria-hidden": true,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M32 6c3 0 6 2.4 6 6v4h10l4 10v44H12V26l4-10h10v-4c0-3.6 3-6 6-6Z",
				stroke: "currentColor",
				strokeWidth: "1.6"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M22 26h20",
				stroke: "currentColor",
				strokeWidth: "1.6"
			})]
		})
	});
}
//#endregion
export { StylePhoto as t };
