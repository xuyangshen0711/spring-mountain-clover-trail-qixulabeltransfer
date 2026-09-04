import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { Product } from "@/data/catalog";
import { productAfterRange } from "@/data/catalog";
import { mapFactoryToQixu, qtyTotal } from "@/lib/relabel";
import { useDraft } from "@/lib/draft-store";
import { Button } from "@/components/ui/button";
import { ColorDot } from "@/components/color-dot";
import { SizeStepper } from "@/components/size-stepper";
import { StylePhoto } from "@/components/style-photo";
import { cn } from "@/lib/utils";

export function AddSheet({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) {
  const only = product.colors[0]?.name ?? "";
  const [picked, setPicked] = useState<string[]>(
    product.colors.length === 1 ? [only] : [],
  );
  const [activeColor, setActiveColor] = useState(
    product.colors.length === 1 ? only : "",
  );
  const [qtysByColor, setQtysByColor] = useState<
    Record<string, Record<string, number>>
  >({});
  const upsert = useDraft((s) => s.upsert);
  const relabelDate = useDraft((s) => s.relabelDate);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function toggleColor(name: string) {
    setPicked((cur) => {
      const next = cur.includes(name)
        ? cur.filter((x) => x !== name)
        : [...cur, name];
      setActiveColor((now) => {
        if (!cur.includes(name)) return name;
        if (!next.includes(now)) return next[0] ?? "";
        return now;
      });
      return next;
    });
  }

  const previewTotal = useMemo(
    () => picked.reduce((n, c) => n + qtyTotal(qtysByColor[c] ?? {}), 0),
    [picked, qtysByColor],
  );

  function addToDraft() {
    const ready = picked.filter((c) => qtyTotal(qtysByColor[c] ?? {}) > 0);
    if (ready.length === 0) {
      toast.error("请先按颜色填写工厂尺码数量");
      return;
    }
    for (const color of ready) {
      upsert({
        productId: product.id,
        color,
        relabelDate,
        qtys: { ...(qtysByColor[color] ?? {}) },
        note: "",
      });
    }
    toast.success(
      `已加入草稿 · ${product.originalSku ?? product.id} ${ready.length} 色 ${previewTotal} 件`,
    );
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-fg/40"
        aria-label="关闭"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-sheet-title"
        className="relative z-10 flex max-h-[92dvh] w-full max-w-md flex-col overflow-hidden rounded-t-xl bg-surface shadow-[var(--shadow-border-hover)] sm:rounded-xl"
      >
        <div className="flex gap-3 border-b border-border p-4">
          <div className="size-16 overflow-hidden rounded-md bg-secondary">
            <StylePhoto src={product.imageFront} alt="" />
          </div>
          <div className="min-w-0">
            <h2 id="add-sheet-title" className="font-mono text-lg tracking-tight">
              {product.originalSku ?? product.id}
            </h2>
            <p className="mt-0.5 font-mono text-sm text-muted">→ {product.id}</p>
            <p className="mt-1 text-xs text-subtle">
              {product.ruleLabel} · 改标后 {productAfterRange(product)}
            </p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm text-muted">
            选要加入草稿的颜色，勾选后直接在下面填工厂尺码
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {product.colors.map((c) => {
              const on = picked.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleColor(c.name)}
                  className={cn(
                    "inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm",
                    on ? "border-fg bg-secondary text-fg" : "border-border bg-bg-elevated text-muted",
                  )}
                >
                  <ColorDot name={c.name} />
                  {c.name}
                </button>
              );
            })}
          </div>

          <p className="mt-6 mb-3 text-xs font-medium tracking-wide text-muted">
            工厂尺码数量（按原标填写）
          </p>
          {!picked.length ? (
            <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted">
              先勾选颜色，再填数量
            </p>
          ) : (
            <>
              {picked.length > 1 ? (
                <div className="mb-4 flex flex-wrap gap-2">
                  {picked.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setActiveColor(c)}
                      className={cn(
                        "inline-flex h-10 items-center gap-2 rounded-full border px-3 text-sm",
                        activeColor === c ? "border-fg bg-secondary" : "border-border bg-bg-elevated text-muted",
                      )}
                    >
                      <ColorDot name={c} />
                      {c}
                      <span className="tabular-nums text-subtle">
                        {qtyTotal(qtysByColor[c] ?? {})}
                      </span>
                    </button>
                  ))}
                </div>
              ) : null}
              <ul className="divide-y divide-border rounded-lg border border-border bg-bg-elevated">
                {product.factorySizes.map((size) => {
                  const mapped = mapFactoryToQixu(product.kind, size);
                  const shifted = mapped !== size;
                  return (
                    <li key={size} className="flex flex-wrap items-center gap-3 px-3 py-2.5">
                      <div className="w-12 font-mono text-sm">{size}</div>
                      <SizeStepper
                        label={`工厂 ${size}`}
                        value={(qtysByColor[activeColor] ?? {})[size] ?? 0}
                        onChange={(n) =>
                          setQtysByColor((q) => ({
                            ...q,
                            [activeColor]: { ...(q[activeColor] ?? {}), [size]: n },
                          }))
                        }
                      />
                      <div className="ml-auto flex items-center gap-2 text-sm">
                        <span className="text-subtle">启序</span>
                        <span className={cn("rounded-sm px-2 py-1 font-mono text-sm", shifted ? "bg-secondary text-fg" : "text-muted")}>
                          {mapped}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-3 text-xs text-subtle">
                该标日期 {relabelDate} · 本单 {previewTotal} 件
              </p>
            </>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-border p-4">
          <Button variant="outline" onClick={onClose}>
            取消
          </Button>
          <Button onClick={addToDraft} disabled={previewTotal <= 0}>
            写入草稿 · {previewTotal}
          </Button>
        </div>
      </div>
    </div>
  );
}
