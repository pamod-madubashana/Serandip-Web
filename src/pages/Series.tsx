import { useState } from "react";
import { ChevronDown, GripVertical, Plus, Tv } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { series } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function Series() {
  const [active, setActive] = useState(series[0].id);
  const [openSeasons, setOpenSeasons] = useState<Record<string, boolean>>({ [series[0].seasons[0].id]: true });

  const current = series.find((s) => s.id === active)!;

  return (
    <div>
      <PageHeader
        title="TV Series"
        subtitle={`${series.length} series • ${series.reduce((a, s) => a + s.seasons.length, 0)} seasons`}
        actions={<Button size="sm" className="gap-1.5 bg-gradient-primary text-primary-foreground"><Plus className="h-3.5 w-3.5" />New series</Button>}
      />

      <div className="grid gap-0 lg:grid-cols-[280px_1fr]">
        {/* Left: series list */}
        <aside className="border-b border-border lg:border-b-0 lg:border-r">
          <div className="px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Series</div>
          <ul className="max-h-[70vh] overflow-y-auto scrollbar-thin pb-3">
            {series.map((s) => (
              <li key={s.id}>
                <button
                  onClick={() => setActive(s.id)}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-smooth hover:bg-surface-2",
                    active === s.id && "bg-surface-2 shadow-[inset_2px_0_0_hsl(var(--primary))]",
                  )}
                >
                  <img src={s.poster} alt="" className="h-10 w-7 rounded object-cover border border-border" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium">{s.title}</p>
                    <p className="truncate text-[10px] text-muted-foreground">{s.network} • {s.seasons.length} seasons</p>
                  </div>
                  <StatusBadge status={s.status} />
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right: details */}
        <section>
          <div className="relative h-36 overflow-hidden border-b border-border">
            <img src={current.poster} alt="" className="h-full w-full object-cover blur-2xl opacity-40" />
            <div className="absolute inset-0 bg-gradient-to-t from-background to-background/40" />
            <div className="absolute inset-0 flex items-end gap-4 p-5">
              <img src={current.poster} alt={current.title} className="h-28 w-20 rounded-md border border-border object-cover shadow-elegant" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <Tv className="h-3 w-3" /> {current.network} • {current.year}
                  <StatusBadge status={current.status} />
                </div>
                <h2 className="mt-1 text-xl font-semibold tracking-tight">{current.title}</h2>
                <p className="text-xs text-muted-foreground">{current.genre.join(" • ")}</p>
              </div>
              <div className="ml-auto flex gap-2">
                <Button size="sm" variant="outline">Edit metadata</Button>
                <Button size="sm" className="gap-1.5 bg-gradient-primary text-primary-foreground"><Plus className="h-3.5 w-3.5" />Add season</Button>
              </div>
            </div>
          </div>

          {/* Seasons accordion */}
          <div className="space-y-3 p-5">
            {current.seasons.map((season) => {
              const open = openSeasons[season.id] ?? false;
              return (
                <div key={season.id} className="card-elevated rounded-lg">
                  <button
                    onClick={() => setOpenSeasons((s) => ({ ...s, [season.id]: !open }))}
                    className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-smooth hover:bg-surface-2/40"
                  >
                    <div className="flex items-center gap-3">
                      <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", !open && "-rotate-90")} />
                      <div>
                        <p className="text-sm font-semibold">Season {season.number}</p>
                        <p className="text-[11px] text-muted-foreground">{season.episodes.length} episodes</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="ghost" className="text-xs">Batch edit</Button>
                      <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Plus className="h-3 w-3" />Episode</Button>
                    </div>
                  </button>
                  {open && (
                    <div className="border-t border-border p-3">
                      <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                        {season.episodes.map((ep) => (
                          <div key={ep.id} className="group flex items-center gap-3 rounded-md border border-border bg-surface-2/40 p-2.5 transition-smooth hover:border-primary/40 hover:bg-surface-2">
                            <GripVertical className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 cursor-grab" />
                            <div className="flex h-9 w-9 items-center justify-center rounded bg-gradient-primary/20 font-mono text-xs font-semibold text-primary">
                              E{String(ep.number).padStart(2, "0")}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-medium">{ep.title}</p>
                              <p className="truncate text-[10px] text-muted-foreground">{ep.runtime}m • {ep.variants} variants • {ep.air}</p>
                            </div>
                            <StatusBadge status={ep.status} />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
