import type { Product } from "@/data/catalog";
import { StylePhoto } from "@/components/style-photo";

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
      <button
        type="button"
        className="block w-full text-left"
        onClick={() => onPick(product)}
      >
        <div className="aspect-[5/6] w-full overflow-hidden bg-secondary">
          <StylePhoto src={product.imageFront} alt="" />
        </div>
        <div className="px-3 pt-3">
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
        </div>
      </button>
      <div className="p-3 pt-2">
        <button
          type="button"
          onClick={() => onPick(product)}
          className="flex h-11 w-full items-center justify-center rounded-md border border-border text-sm text-fg hover:bg-secondary"
        >
          选颜色加入检录
        </button>
      </div>
    </article>
  );
}
