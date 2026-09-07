import { useEffect, useMemo, useState } from "react";
import { Minus, Plus, X } from "lucide-react";
import type { Product } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { StylePhoto } from "@/components/style-photo";
import { useDraft, type DraftLine } from "@/lib/draft-store";
import { mapToQixu } from "@/lib/relabel";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [qtys, setQtys] = useState<Record<string, Record<string, number>>>({});
  const addLines = useDraft((s) => s.addLines);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const photoFor = (name: string) =>
    product.colors.find((c) => c.name === name)?.image ||
    product.imageFront ||
    product.imageSide;

  function toggleColor(name: string) {
    setPicked((prev) => {
      const next = prev.includes(name)
        ? prev.filter((n) => n !== name)
        : [...prev, name];
      setActiveColor((cur) => {
        if (next.includes(name) && !prev.includes(name)) return name;
        if (!next.includes(cur)) return next[0] ?? "";
        return cur;
      });
      return next;
    });
  }

  function setQty(color: string, size: string, n: number) {
    if (!color) return;
    const next = Math.max(0, n);
    setQtys((prev) => ({
      ...prev,
      [color]: { ...(prev[color] ?? {}), [size]: next },
    }));
  }

  const total = useMemo(() => {
    let n = 0;
    for (const color of picked) {
      for (const size of product.factorySizes) {
        n += qtys[color]?.[size] ?? 0;
      }
    }
    return n;
  }, [picked, product.factorySizes, qtys]);

  function commit() {
    const lines: DraftLine[] = [];
    for (const color of picked) {
      for (const factorySize of product.factorySizes) {
        const qty = qtys[color]?.[factorySize] ?? 0;
        if (!qty) continue;
        lines.push({
          key: `${product.id}|${color}|${factorySize}`,
          productId: product.id,
          originalSku: product.originalSku,
          factory: product.factory,
          color,
          fabric: product.fabric,
          ruleLabel: product.ruleLabel,
          factorySize,
          qixuSize: mapToQixu(factorySize, product),
          qty,
        });
      }
    }
    if (!lines.length) {
      toast.error("还没填数量");
      return;
    }
    addLines(lines);
    toast.success(`已加入 ${lines.reduce((s, l) => s + l.qty, 0)} 件`);
    onClose();
  }

  const headerPhoto = photoFor(activeColor || picked[0] || product.colors[0]?.name);

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-fg/40 p-3 sm:items-center">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <section className="relative z-10 flex max-h-[92dvh] w-full max-w-lg flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border-hover)]">
        <header className="flex items-start gap-3 border-b border-border px-4 py-3">
          <StylePhoto
            src={headerPhoto}
            alt=""
            className="size-14 shrink-0 rounded-md"
          />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-sm">{product.id}</p>
            <p className="text-sm text-muted">
              {product.originalSku ??
                (product.factory === "拿货" ? "拿货" : product.id)}{" "}
              · {product.ruleLabel || "尺码对照"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="flex-1 overflow-auto px-4 py-4">
          <p className="font-display text-lg">选要加入检录的颜色</p>
          <p className="mt-1 text-sm text-muted">可多选，不会一次加全色。勾选后直接在下面填工厂尺码。</p>
          <div
            className={cn(
              "mt-3 grid gap-2",
              product.colors.length === 1 ? "grid-cols-1" : "grid-cols-2",
            )}
          >
            {product.colors.map((c) => {
              const on = picked.includes(c.name);
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => toggleColor(c.name)}
                  className={cn(
                    "overflow-hidden rounded-lg border text-left text-sm",
                    on ? "border-fg ring-2 ring-fg/20" : "border-border",
                  )}
                >
                  <StylePhoto
                    src={c.image || product.imageFront}
                    alt=""
                    className="aspect-[4/5] w-full"
                  />
                  <span className="flex items-center gap-2 px-2 py-2">
                    <span
                      className="size-3.5 shrink-0 rounded-full border border-border-strong"
                      style={{ background: c.hex }}
                    />
                    <span className="min-w-0 truncate">{c.name}</span>
                  </span>
                </button>
              );
            })}
          </div>

          <p className="mt-6 font-display text-lg">工厂尺码数量</p>
          <p className="mt-1 text-sm text-muted">
            左边工厂尺码，右边自动换成启序尺码。
          </p>

          {!picked.length ? (
            <p className="mt-4 rounded-lg border border-dashed border-border px-3 py-6 text-center text-sm text-muted">
              先勾选颜色，再填数量
            </p>
          ) : (
            <>
              {picked.length > 1 ? (
                <div className="mt-3 flex gap-2 overflow-x-auto">
                  {picked.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setActiveColor(name)}
                      className={cn(
                        "h-8 shrink-0 rounded-full px-3 text-sm",
                        activeColor === name
                          ? "bg-fg text-bg"
                          : "border border-border bg-bg-elevated text-muted",
                      )}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              ) : null}
              <ul className="mt-4 space-y-2">
                {product.factorySizes.map((fs, i) => {
                  const qs = product.qixuSizes[i] ?? mapToQixu(fs, product);
                  const n = qtys[activeColor]?.[fs] ?? 0;
                  return (
                    <li
                      key={fs}
                      className="flex items-center justify-between rounded-lg border border-border bg-bg-elevated px-3 py-2"
                    >
                      <div className="flex min-w-0 flex-wrap items-baseline gap-2">
                        <span className="font-mono text-sm">{fs}</span>
                        <span className="text-xs text-subtle">工厂</span>
                        <span className="text-subtle">→</span>
                        <span className="font-mono text-sm text-primary">{qs}</span>
                        <span className="text-xs text-subtle">启序</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          className="grid size-9 place-items-center rounded-full border border-border bg-surface"
                          onClick={() => setQty(activeColor, fs, n - 1)}
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="w-8 text-center font-mono tabular-nums">
                          {n}
                        </span>
                        <button
                          type="button"
                          className="grid size-9 place-items-center rounded-full bg-fg text-bg"
                          onClick={() => setQty(activeColor, fs, n + 1)}
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <footer className="flex items-center justify-between gap-2 border-t border-border px-4 py-3">
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          <Button onClick={commit} disabled={!total}>
            加入购物车 · {total}
          </Button>
        </footer>
      </section>
    </div>
  );
}
