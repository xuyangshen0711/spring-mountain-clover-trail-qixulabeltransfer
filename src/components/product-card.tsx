import type { Product } from "@/data/catalog";
import { PhotoCarousel } from "@/components/photo-carousel";

function styleImages(p: Product): string[] {
  const out: string[] = [];
  const add = (src?: string | null) => {
    if (src && !out.includes(src)) out.push(src);
  };
  add(p.imageFront);
  add(p.imageSide);
  for (const c of p.colors) add(c.image);
  return out;
}

export function ProductCard({
  product,
  onPick,
}: {
  product: Product;
  onPick: (p: Product) => void;
}) {
  const sku = product.originalSku ?? product.id;
  const colorCount = product.colors.length;
  return (
    <article className="overflow-hidden rounded-lg bg-surface shadow-[var(--shadow-border)] transition-[box-shadow,transform] duration-150 hover:-translate-y-0.5 hover:shadow-[var(--shadow-border-hover)]">
      <PhotoCarousel images={styleImages(product)} onOpen={() => onPick(product)} />
      <button
        type="button"
        className="block w-full px-3 pt-3 text-left"
        onClick={() => onPick(product)}
      >
        <p className="font-mono text-base font-medium tracking-tight">{sku}</p>
        <p className="mt-0.5 text-xs text-muted">
          {product.originalSku ? (
            <>
              {product.id} · {colorCount} 色
            </>
          ) : (
            <>拿货 · {colorCount} 色</>
          )}
        </p>
      </button>
      <div className="p-3 pt-2">
        <button
          type="button"
          onClick={() => onPick(product)}
          className="flex h-11 w-full items-center justify-center rounded-md border border-border text-sm text-fg hover:bg-secondary"
        >
          选颜色加入草稿
        </button>
      </div>
    </article>
  );
}
