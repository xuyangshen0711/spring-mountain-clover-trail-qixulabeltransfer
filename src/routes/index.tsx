import { useEffect, useMemo, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { ProductCard } from "@/components/product-card";
import { AddSheet } from "@/components/add-sheet";
import { Input } from "@/components/ui/input";
import {
  filterProducts,
  findByOriginalSku,
  monthSortKey,
  type Product,
} from "@/data/catalog";
import { useCatalog } from "@/lib/catalog-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [q, setQ] = useState("");
  const [month, setMonth] = useState<string | "全部">("全部");
  const [active, setActive] = useState<Product | null>(null);
  const products = useCatalog((s) => s.products);
  const refresh = useCatalog((s) => s.refresh);
  const loaded = useCatalog((s) => s.loaded);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const months = useMemo(() => {
    const set = new Set(products.map((p) => p.listMonth));
    return [...set].sort((a, b) => monthSortKey(a) - monthSortKey(b));
  }, [products]);

  const list = useMemo(
    () => filterProducts(q, month, products),
    [q, month, products],
  );

  const groups = useMemo(() => {
    const map = new Map<string, Product[]>();
    for (const p of list) {
      const arr = map.get(p.listMonth) ?? [];
      arr.push(p);
      map.set(p.listMonth, arr);
    }
    return [...map.entries()].sort(
      (a, b) => monthSortKey(a[0]) - monthSortKey(b[0]),
    );
  }, [list]);

  function onSearchSubmit(e: FormEvent) {
    e.preventDefault();
    const hit = findByOriginalSku(q, products);
    if (hit) setActive(hit);
  }

  const ticks = ["全部", ...months] as const;

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <p className="text-xs tracking-[0.18em] text-muted">QIXU · RELABEL</p>
        <h1 className="mt-2 max-w-xl font-display text-4xl leading-tight tracking-tight">
          用冠乔原款号检录，尺码自动换成启序。
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          点卡片选颜色，再按工厂尺码填数量。系统当场换成启序尺码，写入草稿后导出
          Excel。
        </p>

        <form onSubmit={onSearchSubmit} className="relative mt-8 max-w-xl">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-subtle" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索冠乔原款号，例如 886C001"
            className="h-12 pl-10 font-mono"
            autoFocus
          />
        </form>

        <div className="sticky top-14 z-20 -mx-4 mt-6 border-y border-border bg-bg/90 px-4 py-3 backdrop-blur-sm">
          <p className="mb-2 text-xs tracking-wide text-subtle">时间轴</p>
          <div className="flex items-center gap-0 overflow-x-auto pb-1">
            {ticks.map((t, i) => {
              const on = month === t;
              const count =
                t === "全部"
                  ? products.length
                  : products.filter((p) => p.listMonth === t).length;
              return (
                <div key={t} className="flex items-center">
                  {i > 0 ? (
                    <span
                      className="mx-1 h-px w-6 shrink-0 bg-border-strong sm:w-10"
                      aria-hidden
                    />
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setMonth(t)}
                    className={cn(
                      "inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-sm",
                      on
                        ? "bg-fg text-bg"
                        : "border border-border bg-surface text-muted",
                    )}
                  >
                    <span>{t}</span>
                    <span
                      className={cn(
                        "tabular-nums text-xs",
                        on ? "text-bg/70" : "text-subtle",
                      )}
                    >
                      {count}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {list.length === 0 ? (
          <p className="mt-10 text-sm text-muted">
            {loaded ? "没有匹配的款号，换一个原款号试试。" : "正在读取资料库…"}
          </p>
        ) : (
          groups.map(([label, items]) => (
            <section key={label} className="mt-10">
              <h2 className="flex items-baseline gap-2 font-display text-xl tracking-tight text-primary">
                <span>{label}</span>
                <span className="font-sans text-sm text-muted">
                  {items.length} 款
                </span>
              </h2>
              <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-3">
                {items.map((p) => (
                  <ProductCard key={p.id} product={p} onPick={setActive} />
                ))}
              </div>
            </section>
          ))
        )}
      </main>
      {active ? (
        <AddSheet product={active} onClose={() => setActive(null)} />
      ) : null}
    </div>
  );
}
