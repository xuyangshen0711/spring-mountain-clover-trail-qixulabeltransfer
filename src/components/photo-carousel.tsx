import { useRef, useState } from "react";
import { StylePhoto } from "@/components/style-photo";
import { cn } from "@/lib/utils";

export function PhotoCarousel({
  images,
  onOpen,
  className,
}: {
  images: string[];
  onOpen?: () => void;
  className?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const startX = useRef(0);
  const moved = useRef(false);

  if (images.length <= 1) {
    return (
      <button type="button" className={cn("block w-full", className)} onClick={onOpen}>
        <div className="aspect-[5/6] w-full overflow-hidden bg-secondary">
          <StylePhoto src={images[0] ?? null} alt="" />
        </div>
      </button>
    );
  }

  function onScroll() {
    const el = scroller.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / Math.max(el.clientWidth, 1));
    setIndex(Math.max(0, Math.min(images.length - 1, i)));
  }

  function go(i: number) {
    const el = scroller.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scroller}
        onScroll={onScroll}
        onPointerDown={(e) => {
          startX.current = e.clientX;
          moved.current = false;
        }}
        onPointerMove={(e) => {
          if (Math.abs(e.clientX - startX.current) > 8) moved.current = true;
        }}
        onClick={() => {
          if (!moved.current) onOpen?.();
        }}
        className="flex aspect-[5/6] snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src) => (
          <div key={src} className="aspect-[5/6] w-full shrink-0 snap-center overflow-hidden bg-secondary">
            <StylePhoto src={src} alt="" />
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center">
        <div className="flex items-center gap-1.5 rounded-full bg-surface/85 px-2 py-1 shadow-[var(--shadow-border)] backdrop-blur-sm">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              aria-label={`第 ${i + 1} 张`}
              onClick={(e) => {
                e.stopPropagation();
                go(i);
              }}
              className={cn(
                "pointer-events-auto size-1.5 rounded-full transition",
                i === index ? "bg-fg" : "bg-fg/30",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
