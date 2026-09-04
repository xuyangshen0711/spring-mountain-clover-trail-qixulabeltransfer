import { COLOR_HEX } from "@/data/catalog";
import { cn } from "@/lib/utils";

export function ColorDot({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const hex = COLOR_HEX[name] ?? "#CFC4B3";
  return (
    <span
      title={name}
      className={cn(
        "inline-block size-3.5 shrink-0 rounded-full border border-border-strong",
        className,
      )}
      style={{ background: hex }}
    />
  );
}
