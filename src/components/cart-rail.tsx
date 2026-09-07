import { useEffect, useMemo, useRef, useState } from "react";
import { Download, Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StylePhoto } from "@/components/style-photo";
import { PRODUCT_BY_ID } from "@/data/catalog";
import { useCatalog } from "@/lib/catalog-store";
import { useDraft, draftCount, type DraftLine } from "@/lib/draft-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Group = {
  key: string;
  productId: string;
  originalSku: string | null;
  color: string;
  photo: string | null;
  lines: DraftLine[];
  qty: number;
};

function groupLines(
  lines: DraftLine[],
  photoOf: (productId: string, color: string) => string | null,
): Group[] {
  const map = new Map<string, Group>();
  for (const line of lines) {
    const key = `${line.productId}||${line.color}`;
    const prev = map.get(key);
    if (prev) {
      prev.lines.push(line);
      prev.qty += line.qty;
    } else {
      map.set(key, {
        key,
        productId: line.productId,
        originalSku: line.originalSku,
        color: line.color,
        photo: photoOf(line.productId, line.color),
        lines: [line],
        qty: line.qty,
      });
    }
  }
  return [...map.values()];
}

function CartBody({
  onClose,
  compact,
}: {
  onClose?: () => void;
  compact?: boolean;
}) {
  const lines = useDraft((s) => s.lines);
  const setQty = useDraft((s) => s.setQty);
  const remove = useDraft((s) => s.remove);
  const clear = useDraft((s) => s.clear);
  const products = useCatalog((s) => s.products);
  const [busy, setBusy] = useState(false);

  const productMap = useMemo(() => {
    const map = new Map(PRODUCT_BY_ID);
    for (const p of products) map.set(p.id, p);
    return map;
  }, [products]);

  const groups = useMemo(
    () =>
      groupLines(lines, (id, color) => {
        const p = productMap.get(id);
        return (
          p?.colors.find((c) => c.name === color)?.image ||
          p?.imageFront ||
          p?.imageSide ||
          null
        );
      }),
    [lines, productMap],
  );

  const total = draftCount(lines);

  async function onExport() {
    if (!lines.length) {
      toast.error("购物车是空的");
      return;
    }
    setBusy(true);
    try {
      const { downloadDraftExcel } = await import("@/lib/excel");
      await downloadDraftExcel({ lines, productMap });
      clear();
      toast.success("已生成改标 Excel，购物车已清空");
      onClose?.();
    } catch (err) {
      console.error(err);
      toast.error("Excel 生成失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <header className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
        <div>
          <p className="font-display text-lg tracking-tight">购物车</p>
          <p className="text-xs text-muted tabular-nums">
            {groups.length} 款 · {total} 件
          </p>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid size-9 place-items-center rounded-full hover:bg-secondary"
          >
            <X className="size-4" />
          </button>
        ) : (
          <ShoppingBag className="size-4 text-subtle" />
        )}
      </header>

      {groups.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 px-6 py-12 text-center">
          <ShoppingBag className="size-8 text-subtle" />
          <p className="text-sm text-muted">还没加入衣服</p>
          <p className="text-xs text-subtle">点卡片选色填数量，会马上出现在这里</p>
        </div>
      ) : (
        <ul className="min-h-0 flex-1 space-y-3 overflow-auto px-3 py-3">
          {groups.map((g) => (
            <li
              key={g.key}
              className="overflow-hidden rounded-lg border border-border bg-bg-elevated"
            >
              <div className="flex gap-2.5 p-2">
                <StylePhoto
                  src={g.photo}
                  alt=""
                  className="size-16 shrink-0 rounded-md"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm">{g.productId}</p>
                  <p className="truncate text-xs text-muted">
                    {g.originalSku ?? "—"} · {g.color}
                  </p>
                  <p className="mt-0.5 text-xs tabular-nums text-subtle">
                    {g.qty} 件
                  </p>
                </div>
              </div>
              <ul className={cn("border-t border-border", compact && "text-sm")}>
                {g.lines.map((line) => (
                  <li
                    key={line.key}
                    className="flex items-center justify-between gap-2 px-2 py-1.5"
                  >
                    <p className="min-w-0 font-mono text-xs">
                      <span>{line.factorySize}</span>
                      <span className="mx-1 text-subtle">→</span>
                      <span className="text-primary">{line.qixuSize}</span>
                    </p>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-full border border-border bg-surface"
                        onClick={() => setQty(line.key, line.qty - 1)}
                      >
                        <Minus className="size-3" />
                      </button>
                      <span className="w-6 text-center font-mono text-sm tabular-nums">
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-full bg-fg text-bg"
                        onClick={() => setQty(line.key, line.qty + 1)}
                      >
                        <Plus className="size-3" />
                      </button>
                      <button
                        type="button"
                        className="grid size-8 place-items-center rounded-full text-subtle hover:bg-secondary hover:text-stamp"
                        onClick={() => remove(line.key)}
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}

      <footer className="space-y-2 border-t border-border px-3 py-3">
        <Button
          className="w-full"
          onClick={() => void onExport()}
          disabled={!lines.length || busy}
        >
          <Download className="size-4" />
          导出 Excel
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => clear()}
          disabled={!lines.length}
        >
          清空
        </Button>
      </footer>
    </div>
  );
}

export function CartRail() {
  const lines = useDraft((s) => s.lines);
  const hydrated = useDraft((s) => s.hydrated);
  const total = hydrated ? draftCount(lines) : 0;
  const [open, setOpen] = useState(false);
  const prev = useRef(0);
  const skip = useRef(true);

  useEffect(() => {
    if (!hydrated) return;
    const n = draftCount(lines);
    if (skip.current) {
      skip.current = false;
      prev.current = n;
      return;
    }
    if (n > prev.current) setOpen(true);
    prev.current = n;
  }, [lines, hydrated]);

  return (
    <>
      <aside className="sticky top-20 hidden h-[calc(100dvh-6.5rem)] flex-col overflow-hidden rounded-xl bg-surface shadow-[var(--shadow-border)] lg:flex">
        <CartBody />
      </aside>

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-20 flex h-12 items-center gap-2 rounded-full bg-fg px-4 text-sm text-bg shadow-[var(--shadow-border-hover)] lg:hidden"
      >
        <ShoppingBag className="size-4" />
        购物车
        {total > 0 ? (
          <span className="inline-flex min-w-5 justify-center rounded-full bg-stamp px-1.5 text-[11px] text-stamp-fg tabular-nums">
            {total}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-fg/40"
            aria-label="关闭购物车"
            onClick={() => setOpen(false)}
          />
          <section className="absolute inset-x-0 bottom-0 flex max-h-[82dvh] flex-col overflow-hidden rounded-t-xl bg-surface shadow-[var(--shadow-border-hover)]">
            <CartBody compact onClose={() => setOpen(false)} />
          </section>
        </div>
      ) : null}
    </>
  );
}
