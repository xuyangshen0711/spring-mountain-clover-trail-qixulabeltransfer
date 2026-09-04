import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function SizeStepper({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  label: string;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        aria-label={`减少 ${label}`}
        className={cn(
          "flex size-11 items-center justify-center rounded-sm border border-border bg-surface text-fg",
          "hover:bg-secondary disabled:opacity-30",
        )}
        disabled={value <= 0}
        onClick={() => onChange(Math.max(0, value - 1))}
      >
        <Minus className="size-4" />
      </button>
      <input
        inputMode="numeric"
        aria-label={label}
        className="h-11 w-14 rounded-sm border border-border bg-bg-elevated text-center font-mono text-sm tabular-nums focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        value={value || ""}
        placeholder="0"
        onChange={(e) => {
          const v = e.target.value.replace(/\D/g, "");
          onChange(v === "" ? 0 : Number(v));
        }}
      />
      <button
        type="button"
        aria-label={`增加 ${label}`}
        className="flex size-11 items-center justify-center rounded-sm border border-border bg-surface text-fg hover:bg-secondary"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
