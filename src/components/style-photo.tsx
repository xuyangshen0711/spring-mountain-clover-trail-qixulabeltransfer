import { cn } from "@/lib/utils";

export function StylePhoto({
  src,
  alt = "",
  className,
}: {
  src?: string | null;
  alt?: string;
  className?: string;
}) {
  if (!src) {
    return (
      <div
        className={cn(
          "flex items-center justify-center bg-secondary text-subtle",
          className,
        )}
      >
        <svg viewBox="0 0 64 64" className="size-10" aria-hidden>
          <path
            d="M20 18c0-6 5-10 12-10s12 4 12 10c8 2 10 8 10 14v4H10v-4c0-6 2-12 10-14z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path d="M16 36v18h32V36" fill="none" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={cn("object-cover object-top", className)}
      draggable={false}
    />
  );
}
