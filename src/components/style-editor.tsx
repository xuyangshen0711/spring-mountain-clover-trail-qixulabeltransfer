import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import type { Product } from "@/data/catalog";
import { productAfterRange } from "@/data/catalog";
import {
  mapFactoryToQixu,
  qtyTotal,
  qixuSizesFor,
} from "@/lib/relabel";
import { useDraft } from "@/lib/draft-store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColorDot } from "@/components/color-dot";
import { SizeStepper } from "@/components/size-stepper";
import { cn } from "@/lib/utils";

export function StyleEditor({ product }: { product: Product }) {
  const [color, setColor] = useState(product.colors[0]?.name ?? "");
  const [qtys, setQtys] = useState<Record<string, number>>({});
  const upsert = useDraft((s) => s.upsert);
  const relabelDate = useDraft((s) => s.relabelDate);
  const colorMeta =
    product.colors.find((c) => c.name === color) ?? product.colors[0];
  const qixu = qixuSizesFor(product.kind, product.factorySizes);
  const total = qtyTotal(qtys);
  const preview = useMemo(
    () =>
      product.factorySizes
        .filter((s) => (qtys[s] ?? 0) > 0)
        .map((s) => ({
          factory: s,
          qixu: mapFactoryToQixu(product.kind, s),
          qty: qtys[s] ?? 0,
        })),
    [product, qtys],
  );

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
      note: "",
    });
    toast.success(
      `已加入草稿 · ${product.originalSku ?? product.id} ${color} × ${total}`,
    );
    setQtys({});
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={product.factory === "冠乔" ? "stamp" : "outline"}>
            {product.factory}
          </Badge>
          <span className="text-xs text-subtle">{product.listMonth}</span>
        </div>
        <h1 className="mt-3 font-display text-3xl tracking-tight">
          {product.originalSku ?? product.id}
        </h1>
        <p className="mt-1 flex items-center gap-2 font-mono text-sm text-muted">
          启序款号
          <ArrowRight className="size-3.5" />
          <span className="text-fg">{product.id}</span>
        </p>
        <p className="mt-3 text-sm text-fg">
          {product.ruleLabel}
          <span className="mx-2 text-subtle">·</span>
          改标后 {productAfterRange(product)}
          {product.extraNote ? (
            <span className="text-muted">（{product.extraNote}）</span>
          ) : null}
        </p>

        <div className="mt-6">
          <p className="mb-2 text-xs font-medium tracking-wide text-muted">
            颜色
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colors.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => setColor(c.name)}
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-md border px-3 text-sm",
                  color === c.name
                    ? "border-fg bg-secondary"
                    : "border-border bg-surface",
                )}
              >
                <ColorDot name={c.name} />
                {c.name}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-4 whitespace-pre-wrap text-xs leading-relaxed text-muted">
          {colorMeta?.fabric}
        </p>

        <div className="mt-8">
          <p className="mb-3 text-xs font-medium tracking-wide text-muted">
            工厂尺码数量（按原标填写）
          </p>
          <ul className="divide-y divide-border rounded-lg border border-border bg-surface">
            {product.factorySizes.map((size) => {
              const mapped = mapFactoryToQixu(product.kind, size);
              const shifted = mapped !== size;
              return (
                <li
                  key={size}
                  className="flex flex-wrap items-center gap-3 px-4 py-3"
                >
                  <div className="w-16 font-mono text-sm">{size}</div>
                  <SizeStepper
                    label={`工厂 ${size}`}
                    value={qtys[size] ?? 0}
                    onChange={(n) => setQtys((q) => ({ ...q, [size]: n }))}
                  />
                  <div className="ml-auto flex items-center gap-2 text-sm">
                    <span className="text-subtle">启序</span>
                    <span
                      className={cn(
                        "rounded-sm px-2 py-1 font-mono text-sm",
                        shifted ? "bg-secondary text-fg" : "text-muted",
                      )}
                    >
                      {mapped}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Button onClick={add} className="sm:min-w-40">
            加入草稿
          </Button>
          <p className="text-sm text-muted">
            该标日期 {relabelDate} · 本单{" "}
            <span className="tabular-nums text-fg">{total}</span> 件
          </p>
        </div>
      </div>

      <aside className="h-fit rounded-xl border border-border bg-bg-elevated p-5">
        <p className="text-xs font-medium tracking-wide text-muted">
          换算预览
        </p>
        <p className="mt-1 font-display text-lg">
          {color} · {productAfterRange(product)}
        </p>
        {preview.length === 0 ? (
          <p className="mt-4 text-sm text-subtle">
            填写左侧数量后，这里会显示工厂尺码如何变成启序尺码。
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {preview.map((p) => (
              <li
                key={p.factory}
                className="flex items-center justify-between font-mono text-sm"
              >
                <span>
                  {p.factory}
                  <span className="mx-1.5 text-subtle">→</span>
                  {p.qixu}
                </span>
                <span className="tabular-nums">×{p.qty}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-5 text-xs leading-relaxed text-subtle">
          启序尺码：{qixu.join(" / ")}
          。图片稍后可补，不影响换算与导出。
        </p>
      </aside>
    </div>
  );
}
