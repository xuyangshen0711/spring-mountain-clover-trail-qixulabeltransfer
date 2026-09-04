import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ClipboardList, Library } from "lucide-react";
import { draftPieceCount, useDraft } from "@/lib/draft-store";

export function AppHeader({ right }: { right?: ReactNode }) {
  const rows = useDraft((s) => s.rows);
  const count = draftPieceCount(rows);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex min-w-0 items-center gap-2.5">
          <span className="flex h-9 items-center rounded-md bg-primary px-2.5 font-display text-[1.05rem] italic leading-none tracking-tight text-primary-fg">
            The&nbsp;Q
          </span>
          <span className="min-w-0">
            <span className="block font-display text-base leading-tight tracking-tight">
              启序改标
            </span>
            <span className="block text-xs text-muted">工厂尺码 → 启序尺码</span>
          </span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          {right}
          <Link
            to="/library"
            className="inline-flex h-11 items-center gap-2 rounded-md px-2 text-sm text-muted hover:bg-secondary hover:text-fg sm:px-3"
          >
            <Library className="size-4" />
            <span className="hidden sm:inline">资料库</span>
          </Link>
          <Link
            to="/draft"
            className="relative inline-flex h-11 items-center gap-2 rounded-md border border-border-strong bg-surface px-3 text-sm font-medium"
          >
            <ClipboardList className="size-4" />
            <span className="hidden sm:inline">草稿</span>
            <span className="tabular-nums text-muted">{rows.length}</span>
            {count > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-stamp px-1 text-[10px] text-stamp-fg tabular-nums">
                {count}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
