import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StylePhoto } from "@/components/style-photo";
import {
  KIND_OPTIONS,
  type FactoryName,
  type Product,
  type ProductColor,
} from "@/data/catalog";
import { compressImage } from "@/lib/compress-image";
import { useCatalog } from "@/lib/catalog-store";
import { saveStyle } from "@/lib/style-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({ component: LibraryPage });

function blankProduct(): Product {
  return {
    id: "",
    originalSku: "",
    factory: "冠乔",
    listMonth: "26年-8月",
    colors: [{ name: "", fabric: "" }],
    kind: "s_to_xs",
    ruleLabel: "S变XS（整体降码）",
    factorySizes: ["S", "M", "L", "XL"],
    extraNote: "",
    imageFront: null,
    imageSide: null,
  };
}

function LibraryPage() {
  const products = useCatalog((s) => s.products);
  const refresh = useCatalog((s) => s.refresh);
  const upsertLocal = useCatalog((s) => s.upsertLocal);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Product | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) =>
      `${p.id} ${p.originalSku ?? ""} ${p.colors.map((c) => c.name).join(" ")}`
        .toLowerCase()
        .includes(s),
    );
  }, [products, q]);

  async function onSave(p: Product) {
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
      const saved = await saveStyle({
        data: {
          ...p,
          id: p.id.trim(),
          originalSku: p.originalSku?.trim() ? p.originalSku.trim() : null,
          extraNote: p.extraNote || undefined,
        },
      });
      upsertLocal(saved);
      setEditing(saved);
      toast.success("已写入资料库");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "保存失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl tracking-tight">资料库</h1>
            <p className="mt-1 text-sm text-muted">
              上传正面 / 侧面图，改面料、颜色和改标规则。列表页会读这里的图。
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setEditing(blankProduct())}
          >
            新建款
          </Button>
        </div>

        <Input
          className="mt-6 h-11 max-w-md font-mono"
          placeholder="搜款号或颜色"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <ul className="space-y-2">
            {list.map((p) => {
              const on = editing?.id === p.id && editing.id !== "";
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    onClick={() => setEditing({ ...p })}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg p-2 text-left",
                      on ? "bg-secondary" : "bg-surface hover:bg-secondary/60",
                    )}
                  >
                    <div className="size-14 overflow-hidden rounded-md bg-secondary">
                      <StylePhoto
                        src={p.imageFront}
                        alt={p.originalSku ?? p.id}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-mono text-sm">
                        {p.originalSku ?? "—"}
                        <span className="mx-1.5 text-subtle">→</span>
                        {p.id}
                      </p>
                      <p className="truncate text-xs text-muted">
                        {p.colors.map((c) => c.name).join(" · ")} · {p.ruleLabel}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>

          {editing ? (
            <StyleForm
              key={editing.id || "new"}
              initial={editing}
              busy={busy}
              onCancel={() => setEditing(null)}
              onSave={onSave}
            />
          ) : (
            <p className="rounded-xl border border-dashed border-border-strong bg-surface px-5 py-16 text-center text-sm text-muted">
              点左侧一款开始改图和细节，或新建款。
            </p>
          )}
        </div>
      </main>
    </div>
  );
}

function StyleForm({
  initial,
  busy,
  onCancel,
  onSave,
}: {
  initial: Product;
  busy: boolean;
  onCancel: () => void;
  onSave: (p: Product) => void;
}) {
  const [form, setForm] = useState<Product>(initial);
  const isNew = !initial.id;

  async function onFile(
    field: "imageFront" | "imageSide",
    file: File | undefined,
  ) {
    if (!file) return;
    try {
      const data = await compressImage(file);
      setForm((f) => ({ ...f, [field]: data }));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "图片读取失败");
    }
  }

  return (
    <form
      className="space-y-4 rounded-xl bg-surface p-4 shadow-[var(--shadow-border)] sm:p-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSave(form);
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <label className="block text-xs text-muted">
          原款号
          <Input
            className="mt-1 font-mono"
            value={form.originalSku ?? ""}
            onChange={(e) =>
              setForm((f) => ({ ...f, originalSku: e.target.value || null }))
            }
          />
        </label>
        <label className="block text-xs text-muted">
          启序款号
          <Input
            className="mt-1 font-mono"
            value={form.id}
            disabled={!isNew}
            onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
          />
        </label>
        <label className="block text-xs text-muted">
          工厂
          <select
            className="mt-1 h-11 w-full rounded-md border border-input bg-bg-elevated px-3 text-sm text-fg"
            value={form.factory}
            onChange={(e) =>
              setForm((f) => ({ ...f, factory: e.target.value as FactoryName }))
            }
          >
            <option value="冠乔">冠乔</option>
            <option value="拿货">拿货</option>
          </select>
        </label>
        <label className="block text-xs text-muted">
          上架月份
          <Input
            className="mt-1"
            value={form.listMonth}
            onChange={(e) => setForm((f) => ({ ...f, listMonth: e.target.value }))}
          />
        </label>
      </div>

      <label className="block text-xs text-muted">
        改标规则
        <select
          className="mt-1 h-11 w-full rounded-md border border-input bg-bg-elevated px-3 text-sm text-fg"
          value={form.kind}
          onChange={(e) => {
            const kind = e.target.value as Product["kind"];
            const opt = KIND_OPTIONS.find((k) => k.kind === kind);
            setForm((f) => ({
              ...f,
              kind,
              ruleLabel: opt?.label ?? f.ruleLabel,
              factorySizes:
                kind === "onesize"
                  ? ["F"]
                  : kind === "numeric"
                    ? ["26", "27", "28", "29"]
                    : kind === "m_to_s"
                      ? ["M", "L", "XL"]
                      : ["S", "M", "L", "XL"],
            }));
          }}
        >
          {KIND_OPTIONS.map((k) => (
            <option key={k.kind} value={k.kind}>
              {k.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-xs text-muted">
        改标说明（可改文案）
        <Input
          className="mt-1"
          value={form.ruleLabel}
          onChange={(e) => setForm((f) => ({ ...f, ruleLabel: e.target.value }))}
        />
      </label>

      <label className="block text-xs text-muted">
        工厂尺码（空格分隔）
        <Input
          className="mt-1 font-mono"
          value={form.factorySizes.join(" ")}
          onChange={(e) =>
            setForm((f) => ({
              ...f,
              factorySizes: e.target.value
                .split(/[\s,，]+/)
                .map((s) => s.trim())
                .filter(Boolean),
            }))
          }
        />
      </label>

      <label className="block text-xs text-muted">
        备注
        <Input
          className="mt-1"
          value={form.extraNote ?? ""}
          onChange={(e) => setForm((f) => ({ ...f, extraNote: e.target.value }))}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <ImageSlot
          label="正面图"
          src={form.imageFront}
          onFile={(f) => void onFile("imageFront", f)}
          onClear={() => setForm((x) => ({ ...x, imageFront: null }))}
        />
        <ImageSlot
          label="侧面 / 多色"
          src={form.imageSide}
          onFile={(f) => void onFile("imageSide", f)}
          onClear={() => setForm((x) => ({ ...x, imageSide: null }))}
        />
      </div>

      <div>
        <p className="mb-2 text-xs text-muted">颜色与面料</p>
        <ul className="space-y-3">
          {form.colors.map((c, i) => (
            <li key={i} className="rounded-md border border-border p-3">
              <div className="flex gap-2">
                <Input
                  placeholder="颜色名"
                  value={c.name}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      colors: f.colors.map((x, j) =>
                        j === i ? { ...x, name: e.target.value } : x,
                      ),
                    }))
                  }
                />
                {form.colors.length > 1 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      setForm((f) => ({
                        ...f,
                        colors: f.colors.filter((_, j) => j !== i),
                      }))
                    }
                  >
                    删
                  </Button>
                ) : null}
              </div>
              <textarea
                className="mt-2 min-h-16 w-full rounded-md border border-input bg-bg-elevated px-3 py-2 text-sm"
                placeholder="面料"
                value={c.fabric}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    colors: f.colors.map((x, j) =>
                      j === i ? { ...x, fabric: e.target.value } : x,
                    ),
                  }))
                }
              />
            </li>
          ))}
        </ul>
        <Button
          type="button"
          variant="outline"
          className="mt-2"
          onClick={() =>
            setForm((f) => ({
              ...f,
              colors: [...f.colors, { name: "", fabric: f.colors[0]?.fabric ?? "" } satisfies ProductColor],
            }))
          }
        >
          加颜色
        </Button>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={busy}>
          {busy ? "保存中…" : "保存到资料库"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          取消
        </Button>
      </div>
    </form>
  );
}

function ImageSlot({
  label,
  src,
  onFile,
  onClear,
}: {
  label: string;
  src?: string | null;
  onFile: (f: File | undefined) => void;
  onClear: () => void;
}) {
  return (
    <label className="block text-xs text-muted">
      {label}
      <div className="mt-1 aspect-[5/6] overflow-hidden rounded-md bg-secondary">
        <StylePhoto src={src} alt={label} />
      </div>
      <input
        type="file"
        accept="image/*"
        className="mt-2 block w-full text-xs"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
      {src ? (
        <button
          type="button"
          className="mt-1 text-xs text-muted underline-offset-2 hover:underline"
          onClick={onClear}
        >
          清除图片
        </button>
      ) : null}
    </label>
  );
}
