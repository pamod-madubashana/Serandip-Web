import { Bell, Command, Plus, Search, Sparkles } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { CommandPalette } from "./CommandPalette";

export function TopBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/70 px-3 backdrop-blur-xl">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
      <div className="hidden items-center gap-1 text-xs text-muted-foreground md:flex">
        <span className="rounded bg-muted px-1.5 py-0.5 font-mono">v2.4</span>
        <span>•</span>
        <span>All systems operational</span>
        <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-success" />
      </div>

      <button
        onClick={() => setOpen(true)}
        className="group ml-auto flex w-full max-w-md items-center gap-2 rounded-md border border-border bg-surface-2/60 px-3 py-1.5 text-sm text-muted-foreground transition-smooth hover:bg-surface-2 hover:text-foreground"
      >
        <Search className="h-4 w-4" />
        <span className="flex-1 text-left">Search movies, series, users, requests…</span>
        <kbd className="hidden items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:flex">
          <Command className="h-3 w-3" />K
        </kbd>
      </button>

      <Button variant="outline" size="sm" className="hidden gap-2 md:inline-flex">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        AI Assist
      </Button>
      <Button size="sm" className="gap-2 bg-gradient-primary text-primary-foreground hover:opacity-90">
        <Plus className="h-3.5 w-3.5" /> Add content
      </Button>
      <Button variant="ghost" size="icon" className="relative">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-danger animate-pulse-glow" />
      </Button>

      <CommandPalette open={open} onOpenChange={setOpen} />
    </header>
  );
}
