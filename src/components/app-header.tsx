import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useDraft, draftCount } from "@/lib/draft-store";

export function AppHeader() {
  const lines = useDraft((s) => s.lines);
  const hydrated = useDraft((s) => s.hydrated);
  const count = hydrated ? draftCount(lines) : 0;

  useEffect(() => {
    void useDraft.persist.rehydrate();
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/90 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-baseline gap-2.5">
          <span className="font-brand text-[1.35rem] italic leading-none tracking-tight text-fg">
            The&nbsp;Q
          </span>
          <span className="text-sm text-muted">启序改标</span>
          <span className="hidden text-xs text-subtle sm:inline">
            工厂尺码 → 启序尺码
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            to="/library"
            className="rounded-full px-3 py-1.5 text-sm text-muted hover:bg-secondary hover:text-fg"
          >
            资料库
          </Link>
          <Link
            to="/draft"
            className="rounded-full px-3 py-1.5 text-sm text-muted hover:bg-secondary hover:text-fg"
          >
            草稿
            {count > 0 ? (
              <span className="ml-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-stamp px-1.5 text-[11px] text-stamp-fg tabular-nums">
                {count}
              </span>
            ) : null}
          </Link>
        </nav>
      </div>
    </header>
  );
}
