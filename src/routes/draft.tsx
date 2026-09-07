import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Download, Trash2 } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCatalog } from "@/lib/catalog-store";
import { useDraft, draftCount } from "@/lib/draft-store";
import { PRODUCT_BY_ID } from "@/data/catalog";
import { toast } from "sonner";

export const Route = createFileRoute("/draft")({ component: DraftPage });

function DraftPage() {
  const lines = useDraft((s) => s.lines);
  const setQty = useDraft((s) => s.setQty);
  const remove = useDraft((s) => s.remove);
  const clear = useDraft((s) => s.clear);
  const products = useCatalog((s) => s.products);
  const refresh = useCatalog((s) => s.refresh);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const productMap = useMemo(() => {
    const map = new Map(PRODUCT_BY_ID);
    for (const p of products) map.set(p.id, p);
    return map;
  }, [products]);

  const total = draftCount(lines);

  async function onExport() {
    if (!lines.length) {
      toast.error("草稿是空的");
      return;
    }
    setBusy(true);
    try {
      const { downloadDraftExcel } = await import("@/lib/excel");
      await downloadDraftExcel({ lines, productMap });
      clear();
      toast.success("已生成改标 Excel（含图片），草稿已清空");
    } catch (err) {
      console.error(err);
      toast.error("Excel 生成失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-4xl px-4 pb-24 pt-8">
        <p className="text-xs tracking-[0.18em] text-muted">DRAFT</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-3xl tracking-tight">检录草稿</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => clear()} disabled={!lines.length}>
              清空
            </Button>
            <Button onClick={() => void onExport()} disabled={!lines.length || busy}>
              <Download className="size-4" />
              导出 Excel
            </Button>
          </div>
        </div>
        <p className="mt-2 text-sm text-muted">
          共 {total} 件 · 数量按改标前（工厂）尺码填写，右边会标出对应的启序尺码。
        </p>

        {lines.length === 0 ? (
          <p className="mt-10 text-sm text-muted">
            还没有款。去{" "}
            <Link to="/" className="underline">
              列表
            </Link>{" "}
            搜原款号加入。
          </p>
        ) : (
          <ul className="mt-8 divide-y divide-border rounded-lg border border-border bg-surface">
            {lines.map((line) => (
              <li
                key={line.key}
                className="flex flex-wrap items-center gap-3 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-mono text-sm">
                    {line.originalSku ?? line.productId}
                    <span className="text-muted"> → {line.productId}</span>
                  </p>
                  <p className="text-sm text-muted">
                    {line.color} · {line.factorySize} → {line.qixuSize}
                  </p>
                </div>
                <Input
                  type="number"
                  min={0}
                  value={line.qty}
                  onChange={(e) => setQty(line.key, Number(e.target.value) || 0)}
                  className="h-9 w-20 font-mono"
                />
                <button
                  type="button"
                  onClick={() => remove(line.key)}
                  className="grid size-9 place-items-center rounded-full text-muted hover:bg-secondary hover:text-stamp"
                >
                  <Trash2 className="size-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
