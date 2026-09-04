import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SizeStepper } from "@/components/size-stepper";
import { ColorDot } from "@/components/color-dot";
import { downloadDraftExcel } from "@/lib/excel";
import { useCatalog } from "@/lib/catalog-store";
import {
  draftPieceCount,
  useDraft,
  type DraftRow,
} from "@/lib/draft-store";
import {
  mapFactoryToQixu,
  qtyTotal,
} from "@/lib/relabel";

export const Route = createFileRoute("/draft")({ component: DraftPage });

function DraftPage() {
  const rows = useDraft((s) => s.rows);
  const relabelDate = useDraft((s) => s.relabelDate);
  const setRelabelDate = useDraft((s) => s.setRelabelDate);
  const setQty = useDraft((s) => s.setQty);
  const setNote = useDraft((s) => s.setNote);
  const setRowDate = useDraft((s) => s.setRowDate);
  const remove = useDraft((s) => s.remove);
  const clear = useDraft((s) => s.clear);
  const products = useCatalog((s) => s.products);
  const refresh = useCatalog((s) => s.refresh);
  const [busy, setBusy] = useState(false);
  const pieces = draftPieceCount(rows);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function exportXlsx() {
    if (rows.length === 0) {
      toast.error("草稿是空的");
      return;
    }
    setBusy(true);
    try {
      await downloadDraftExcel(rows, products);
      toast.success("Excel 已下载");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "导出失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-28 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl tracking-tight">草稿 / 检录</h1>
            <p className="mt-1 text-sm text-muted">
              {rows.length} 行 · {pieces} 件 · 导出含「工作表1」工厂数量和「改标计算」启序数量
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-muted">
              默认该标日期
              <Input
                className="h-11 w-36 font-mono"
                value={relabelDate}
                onChange={(e) => setRelabelDate(e.target.value)}
              />
            </label>
            <Button onClick={() => void exportXlsx()} disabled={busy}>
              <Download className="size-4" />
              导出 Excel
            </Button>
          </div>
        </div>

        {rows.length === 0 ? (
          <div className="mt-12 rounded-xl border border-dashed border-border-strong bg-surface px-6 py-16 text-center">
            <p className="font-display text-xl">还没有检录</p>
            <p className="mt-2 text-sm text-muted">
              先用原款号找到款式，填工厂尺码再加入草稿。
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex h-11 items-center rounded-md bg-primary px-4 text-sm text-primary-fg"
            >
              去检索
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-4">
            {rows.map((row) => (
              <DraftCard
                key={row.id}
                row={row}
                onQty={setQty}
                onNote={setNote}
                onDate={setRowDate}
                onRemove={remove}
              />
            ))}
          </ul>
        )}

        {rows.length > 0 ? (
          <button
            type="button"
            className="mt-8 text-sm text-muted underline-offset-4 hover:underline"
            onClick={() => {
              clear();
              toast.message("草稿已清空");
            }}
          >
            清空草稿
          </button>
        ) : null}
      </main>
    </div>
  );
}

function DraftCard({
  row,
  onQty,
  onNote,
  onDate,
  onRemove,
}: {
  row: DraftRow;
  onQty: (id: string, size: string, qty: number) => void;
  onNote: (id: string, note: string) => void;
  onDate: (id: string, date: string) => void;
  onRemove: (id: string) => void;
}) {
  const p = useCatalog((s) => s.products.find((x) => x.id === row.productId));
  if (!p) return null;
  const total = qtyTotal(row.qtys);
  return (
    <li className="rounded-xl border border-border bg-surface p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-mono text-base">
            {p.originalSku ?? "—"}
            <span className="mx-2 text-subtle">→</span>
            {p.id}
          </p>
          <p className="mt-1 inline-flex items-center gap-2 text-sm text-muted">
            <ColorDot name={row.color} />
            {row.color}
            <span className="text-subtle">·</span>
            {p.ruleLabel}
            <span className="text-subtle">·</span>
            {total} 件
          </p>
        </div>
        <button
          type="button"
          className="flex size-11 items-center justify-center rounded-md text-muted hover:bg-secondary hover:text-stamp"
          aria-label="删除"
          onClick={() => onRemove(row.id)}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {p.factorySizes.map((size) => (
          <div key={size} className="flex items-center justify-between gap-3">
            <span className="w-28 font-mono text-sm">
              {size}
              <span className="mx-1 text-subtle">→</span>
              {mapFactoryToQixu(p.kind, size)}
            </span>
            <SizeStepper
              label={`${p.id} ${size}`}
              value={row.qtys[size] ?? 0}
              onChange={(n) => onQty(row.id, size, n)}
            />
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <Input
          className="sm:w-40 font-mono"
          value={row.relabelDate}
          onChange={(e) => onDate(row.id, e.target.value)}
          aria-label="该标日期"
        />
        <Input
          placeholder="备注"
          value={row.note}
          onChange={(e) => onNote(row.id, e.target.value)}
        />
      </div>
    </li>
  );
}
