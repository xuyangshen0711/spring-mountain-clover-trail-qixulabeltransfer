import { cn } from "@/lib/utils";

export function StylePhoto({
  src,
  alt,
  className,
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className={cn(
          "h-full w-full object-cover outline outline-1 -outline-offset-1 outline-black/10",
          className,
        )}
      />
    );
  }
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center bg-secondary text-subtle",
        className,
      )}
      aria-label={alt}
    >
      <svg
        viewBox="0 0 64 80"
        className="h-16 w-12 opacity-50"
        fill="none"
        aria-hidden
      >
        <path
          d="M32 6c3 0 6 2.4 6 6v4h10l4 10v44H12V26l4-10h10v-4c0-3.6 3-6 6-6Z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M22 26h20" stroke="currentColor" strokeWidth="1.6" />
      </svg>
    </div>
  );
}
