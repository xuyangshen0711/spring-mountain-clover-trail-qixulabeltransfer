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

  if (images.length === 0) {
    return (
      <button type="button" className={cn("block w-full", className)} onClick={onOpen}>
        <StylePhoto src={null} alt="" className="aspect-[4/5] w-full" />
      </button>
    );
  }

  if (images.length === 1) {
    return (
      <button type="button" className={cn("block w-full", className)} onClick={onOpen}>
        <StylePhoto src={images[0]} alt="" className="aspect-[4/5] w-full" />
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
        className="flex aspect-[4/5] snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {images.map((src) => (
          <StylePhoto
            key={src}
            src={src}
            alt=""
            className="aspect-[4/5] w-full shrink-0 snap-center pointer-events-none"
          />
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
