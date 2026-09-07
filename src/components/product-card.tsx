import type { Product } from "@/data/catalog";
import { styleImages } from "@/data/catalog";
import { PhotoCarousel } from "@/components/photo-carousel";

export function ProductCard({
  product,
  onPick,
}: {
  product: Product;
  onPick: (p: Product) => void;
}) {
  const images = styleImages(product);
  const below =
    product.originalSku ?? (product.factory === "拿货" ? "拿货" : "");
  return (
    <article className="overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)] transition hover:shadow-[var(--shadow-border-hover)]">
      <PhotoCarousel images={images} onOpen={() => onPick(product)} />
      <button
        type="button"
        onClick={() => onPick(product)}
        className="block w-full px-3 pb-2 pt-3 text-left"
      >
        <p className="font-mono text-sm tracking-tight">{product.id}</p>
        <p className="mt-0.5 text-sm text-muted">
          {below}
          <span className="text-subtle"> · {product.colors.length} 色</span>
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {product.colors.map((c) => (
            <span
              key={c.name}
              className="inline-flex items-center gap-1 rounded-full border border-border bg-bg-elevated pr-2 text-xs text-muted"
            >
              {c.image ? (
                <img
                  src={c.image}
                  alt=""
                  className="size-5 rounded-full object-cover object-top"
                />
              ) : (
                <span
                  className="size-5 rounded-full border border-border-strong"
                  style={{ background: c.hex }}
                />
              )}
              {c.name}
            </span>
          ))}
        </div>
      </button>
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={() => onPick(product)}
          className="h-9 w-full rounded-full bg-fg text-sm text-bg"
        >
          选颜色加入检录
        </button>
      </div>
    </article>
  );
}
