import { useEffect } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { StyleEditor } from "@/components/style-editor";
import { useCatalog } from "@/lib/catalog-store";

export const Route = createFileRoute("/style/$id")({
  component: StylePage,
});

function StylePage() {
  const { id } = Route.useParams();
  const refresh = useCatalog((s) => s.refresh);
  const product = useCatalog((s) => s.products.find((p) => p.id === id));

  useEffect(() => {
    void refresh();
  }, [refresh]);

  if (!product) {
    return (
      <div className="min-h-dvh">
        <AppHeader />
        <main className="mx-auto max-w-6xl px-4 py-16">
          <p className="font-display text-2xl">没有这款</p>
          <p className="mt-2 text-sm text-muted">款号 {id} 不在当前改标表里。</p>
          <Link to="/" className="mt-6 inline-flex text-sm text-primary">
            返回检索
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-dvh">
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-6">
        <Link
          to="/"
          className="inline-flex h-11 items-center gap-1 text-sm text-muted"
        >
          <ChevronLeft className="size-4" />
          全部款号
        </Link>
        <div className="mt-4">
          <StyleEditor product={product} />
        </div>
      </main>
    </div>
  );
}
