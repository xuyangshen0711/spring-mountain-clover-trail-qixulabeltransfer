import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { StylePhoto } from "@/components/style-photo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  hexForColor,
  joinSizes,
  parseSizeList,
  type FactoryName,
  type Product,
  type ProductColor,
} from "@/data/catalog";
import { useCatalog } from "@/lib/catalog-store";
import { useDraft } from "@/lib/draft-store";
import { compressImage } from "@/lib/compress-image";
import { deleteStyle, putAsset, saveStyle } from "@/lib/style-api";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({ component: LibraryPage });

function emptyProduct(): Product {
  return {
    id: "",
    originalSku: "",
    factory: "冠乔",
    listMonth: "26年-9月",
    colors: [{ name: "", hex: "#8A8178", image: null }],
    fabric: "",
    factorySizes: ["S", "M", "L", "XL"],
    qixuSizes: ["XS", "S", "M", "L"],
    ruleLabel: "S变XS （整体降码）",
    extraNote: "",
    imageFront: null,
    imageSide: null,
  };
}

function errMsg(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message.slice(0, 180);
  if (typeof err === "object" && err && "message" in err) {
    const m = (err as { message: unknown }).message;
    if (typeof m === "string" && m.trim()) return m.slice(0, 180);
  }
  return fallback;
}

async function persistIfNeeded(url: string | null | undefined): Promise<string | null> {
  if (!url) return null;
  if (!url.startsWith("data:")) return url;
  const res = await putAsset({ data: { dataUrl: url } });
  return res.url;
}

function LibraryPage() {
  const products = useCatalog((s) => s.products);
  const refresh = useCatalog((s) => s.refresh);
  const [activeId, setActiveId] = useState<string | "new" | null>(null);
  const [q, setQ] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const removeProduct = useDraft((s) => s.removeProduct);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function reallyDelete(id: string) {
    try {
      await deleteStyle({ data: { id } });
      removeProduct(id);
      toast.success(`已删除 ${id}`);
      setPendingDelete(null);
      await refresh();
      if (activeId === id) setActiveId(null);
    } catch (err) {
      console.error(err);
      toast.error(errMsg(err, "删除失败"));
    }
  }

  async function removeStyle(id: string) {
    if (pendingDelete !== id) {
      setPendingDelete(id);
      return;
    }
    await reallyDelete(id);
  }

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return products;
    return products.filter((p) =>
      [p.id, p.originalSku ?? "", p.factory, ...p.colors.map((c) => c.name)]
        .join(" ")
        .toLowerCase()
        .includes(s),
    );
  }, [products, q]);

  const editing =
    activeId === "new"
      ? emptyProduct()
      : products.find((p) => p.id === activeId) ?? null;

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <p className="text-xs tracking-[0.18em] text-muted">LIBRARY</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <h1 className="font-display text-3xl tracking-tight">资料库</h1>
          <Button onClick={() => setActiveId("new")}>新建款式</Button>
        </div>
        <p className="mt-2 max-w-xl text-sm text-muted">
          正面、侧面是整款图；每种颜色也可以单独挂一张。列表页轮播会读到这些图。
        </p>
        <Input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="搜款号"
          className="mt-6 max-w-sm font-mono"
        />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <ul className="space-y-2">
            {list.map((p) => (
              <li key={p.id}>
                <div
                  className={cn(
                    "flex w-full items-center gap-2 rounded-lg border px-2 py-2",
                    activeId === p.id
                      ? "border-fg bg-surface"
                      : "border-border bg-bg-elevated",
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setActiveId(p.id)}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <StylePhoto
                      src={p.imageFront || p.colors[0]?.image}
                      alt=""
                      className="size-12 rounded-md"
                    />
                    <span className="min-w-0">
                      <span className="block font-mono text-sm">{p.id}</span>
                      <span className="block truncate text-xs text-muted">
                        {p.originalSku ?? (p.factory === "拿货" ? "拿货" : "")}
                        {p.originalSku || p.factory === "拿货" ? " · " : ""}
                        {p.colors.map((c) => c.name).join(" / ")}
                      </span>
                    </span>
                  </button>
                  <button
                    type="button"
                    aria-label={`删除 ${p.id}`}
                    className={cn(
                      "h-9 shrink-0 rounded-full px-2.5 text-xs",
                      pendingDelete === p.id
                        ? "bg-stamp text-stamp-fg"
                        : "text-muted hover:bg-secondary hover:text-stamp",
                    )}
                    onClick={() => void removeStyle(p.id)}
                  >
                    {pendingDelete === p.id ? "确认删" : <Trash2 className="size-4" />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {editing ? (
            <StyleForm
              key={activeId ?? "x"}
              initial={editing}
              isNew={activeId === "new"}
              onSaved={async (p) => {
                await refresh();
                setActiveId(p.id);
              }}
              onDeleted={() => void reallyDelete(editing.id)}
            />
          ) : (
            <p className="text-sm text-muted">点左边一款开始改，或新建。</p>
          )}
        </div>
      </main>
    </div>
  );
}

function StyleForm({
  initial,
  isNew,
  onSaved,
  onDeleted,
}: {
  initial: Product;
  isNew: boolean;
  onSaved: (p: Product) => Promise<void>;
  onDeleted: () => void | Promise<void>;
}) {
  const [id, setId] = useState(initial.id);
  const [originalSku, setOriginalSku] = useState(initial.originalSku ?? "");
  const [factory, setFactory] = useState<FactoryName>(initial.factory);
  const [listMonth, setListMonth] = useState(initial.listMonth);
  const [fabric, setFabric] = useState(initial.fabric);
  const [ruleLabel, setRuleLabel] = useState(initial.ruleLabel);
  const [extraNote, setExtraNote] = useState(initial.extraNote);
  const [factorySizes, setFactorySizes] = useState(joinSizes(initial.factorySizes));
  const [qixuSizes, setQixuSizes] = useState(joinSizes(initial.qixuSizes));
  const [colors, setColors] = useState<ProductColor[]>(
    initial.colors.length ? initial.colors : [{ name: "", hex: "#8A8178", image: null }],
  );
  const [imageFront, setImageFront] = useState(initial.imageFront);
  const [imageSide, setImageSide] = useState(initial.imageSide);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function onFile(
    file: File | undefined,
    setter: (url: string) => void,
  ) {
    if (!file) return;
    try {
      const url = await compressImage(file);
      setter(url);
    } catch (err) {
      toast.error(errMsg(err, "图片处理失败，试试 JPG / PNG"));
    }
  }

  async function onColorFile(index: number, file: File | undefined) {
    if (!file) return;
    try {
      const url = await compressImage(file);
      setColors((prev) =>
        prev.map((c, i) => (i === index ? { ...c, image: url } : c)),
      );
    } catch (err) {
      toast.error(errMsg(err, "图片处理失败，试试 JPG / PNG"));
    }
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!id.trim()) {
      toast.error("款号不能空");
      return;
    }
    const fs = parseSizeList(factorySizes);
    const qs = parseSizeList(qixuSizes);
    if (!fs.length || !qs.length) {
      toast.error("尺码两边都要填");
      return;
    }
    const cleaned = colors
      .map((c) => ({
        ...c,
        name: c.name.trim(),
        hex: hexForColor(c.name.trim()),
      }))
      .filter((c) => c.name);
    if (!cleaned.length) {
      toast.error("至少一种颜色");
      return;
    }
    setBusy(true);
    try {
      const persistedColors: ProductColor[] = [];
      for (const c of cleaned) {
        persistedColors.push({
          ...c,
          image: await persistIfNeeded(c.image),
        });
      }
      const payload: Product = {
        id: id.trim(),
        originalSku: factory === "拿货" ? originalSku.trim() || null : originalSku.trim() || null,
        factory,
        listMonth: listMonth.trim() || "26年-9月",
        colors: persistedColors,
        fabric,
        factorySizes: fs,
        qixuSizes: qs,
        ruleLabel,
        extraNote,
        imageFront: await persistIfNeeded(imageFront),
        imageSide: await persistIfNeeded(imageSide),
      };
      const saved = await saveStyle({ data: payload });
      setImageFront(saved.imageFront);
      setImageSide(saved.imageSide);
      setColors(saved.colors);
      toast.success("已写入资料库");
      await onSaved(saved);
    } catch (err) {
      console.error(err);
      toast.error(errMsg(err, "保存失败"));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form
      onSubmit={(e) => void onSubmit(e)}
      className="space-y-4 rounded-lg border border-border bg-surface p-4"
    >
      <div className="grid grid-cols-2 gap-3">
        <ImageSlot
          label="正面图"
          src={imageFront}
          disabled={busy}
          onFile={(f) => void onFile(f, setImageFront)}
          onClear={() => setImageFront(null)}
        />
        <ImageSlot
          label="侧面图"
          src={imageSide}
          disabled={busy}
          onFile={(f) => void onFile(f, setImageSide)}
          onClear={() => setImageSide(null)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="启序款号">
          <Input
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="font-mono"
            disabled={!isNew && Boolean(initial.id)}
          />
        </Field>
        <Field label="冠乔原款号">
          <Input
            value={originalSku}
            onChange={(e) => setOriginalSku(e.target.value)}
            className="font-mono"
            placeholder="拿货可空"
          />
        </Field>
        <Field label="工厂">
          <select
            value={factory}
            onChange={(e) => setFactory(e.target.value as FactoryName)}
            className="h-10 w-full rounded-md border border-input bg-surface px-3 text-sm"
          >
            <option value="冠乔">冠乔</option>
            <option value="拿货">拿货</option>
          </select>
        </Field>
        <Field label="上架月份">
          <Input
            value={listMonth}
            onChange={(e) => setListMonth(e.target.value)}
            placeholder="26年-9月"
          />
        </Field>
      </div>
      <div className="space-y-1.5">
        <Label>颜色 · 每种一张图</Label>
        <ul className="space-y-2">
          {colors.map((c, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-lg border border-border bg-bg-elevated p-2"
            >
              <ImageSlot
                label={c.name.trim() || `颜色 ${i + 1}`}
                src={c.image}
                compact
                disabled={busy}
                onFile={(f) => void onColorFile(i, f)}
                onClear={() =>
                  setColors((prev) =>
                    prev.map((row, j) => (j === i ? { ...row, image: null } : row)),
                  )
                }
              />
              <div className="min-w-0 flex-1 space-y-2 pt-5">
                <Input
                  value={c.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setColors((prev) =>
                      prev.map((row, j) =>
                        j === i
                          ? { ...row, name, hex: hexForColor(name.trim()) }
                          : row,
                      ),
                    );
                  }}
                  placeholder="颜色名，如 深焙棕"
                />
                <div className="flex items-center justify-between">
                  <span
                    className="size-4 rounded-full border border-border-strong"
                    style={{ background: c.hex || hexForColor(c.name.trim()) }}
                    aria-hidden
                  />
                  <button
                    type="button"
                    disabled={colors.length <= 1 || busy}
                    onClick={() =>
                      setColors((prev) => prev.filter((_, j) => j !== i))
                    }
                    className="inline-flex h-8 items-center gap-1 rounded-full px-2 text-xs text-muted hover:bg-secondary hover:text-stamp disabled:opacity-40"
                  >
                    <Trash2 className="size-3.5" />
                    去掉这色
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          disabled={busy}
          onClick={() =>
            setColors((prev) => [
              ...prev,
              { name: "", hex: "#8A8178", image: null },
            ])
          }
          className="inline-flex h-9 items-center gap-1.5 rounded-full border border-border bg-surface px-3 text-sm text-muted hover:bg-secondary hover:text-fg"
        >
          <Plus className="size-3.5" />
          添加颜色
        </button>
      </div>
      <Field label="面料">
        <Textarea value={fabric} onChange={(e) => setFabric(e.target.value)} />
      </Field>
      <Field label="改标要求">
        <Input
          value={ruleLabel}
          onChange={(e) => setRuleLabel(e.target.value)}
          placeholder="S变XS （整体降码）"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="改标前（工厂尺码，用 / 分隔）">
          <Input
            value={factorySizes}
            onChange={(e) => setFactorySizes(e.target.value)}
            className="font-mono"
          />
        </Field>
        <Field label="改标后（启序尺码）">
          <Input
            value={qixuSizes}
            onChange={(e) => setQixuSizes(e.target.value)}
            className="font-mono"
          />
        </Field>
      </div>
      <Field label="备注">
        <Input value={extraNote} onChange={(e) => setExtraNote(e.target.value)} />
      </Field>
      <div className="flex gap-2">
        <Button type="submit" disabled={busy} className="flex-1">
          {busy ? "保存中…" : "保存到资料库"}
        </Button>
        {!isNew && initial.id ? (
          <Button
            type="button"
            variant={confirmDelete ? "stamp" : "outline"}
            disabled={busy}
            onClick={() => {
              if (!confirmDelete) {
                setConfirmDelete(true);
                return;
              }
              void onDeleted();
            }}
          >
            {confirmDelete ? "确认删除" : "删除"}
          </Button>
        ) : null}
      </div>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <Label>{label}</Label>
      {children}
    </label>
  );
}

function ImageSlot({
  label,
  src,
  compact,
  disabled,
  onFile,
  onClear,
}: {
  label: string;
  src?: string | null;
  compact?: boolean;
  disabled?: boolean;
  onFile: (file: File | undefined) => void;
  onClear?: () => void;
}) {
  return (
    <div className={cn("block", compact ? "w-20 shrink-0" : "")}>
      <span className="mb-1.5 block truncate text-xs font-medium tracking-wide text-muted">
        {label}
      </span>
      <span className="relative block">
        <label
          className={cn(
            "block cursor-pointer overflow-hidden rounded-md border border-dashed border-border-strong bg-bg-elevated",
            disabled && "pointer-events-none opacity-60",
          )}
        >
          <StylePhoto src={src} alt="" className="aspect-[4/5] w-full" />
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/*"
            className="hidden"
            disabled={disabled}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              onFile(file);
            }}
          />
        </label>
        {src && onClear ? (
          <button
            type="button"
            aria-label={`去掉${label}`}
            disabled={disabled}
            onClick={onClear}
            className="absolute right-1 top-1 grid size-7 place-items-center rounded-full bg-surface/90 text-muted shadow-[var(--shadow-border)] hover:text-stamp"
          >
            <X className="size-3.5" />
          </button>
        ) : null}
      </span>
    </div>
  );
}
