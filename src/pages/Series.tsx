import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Plus, Search, Star, Tv } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { dashboardApi, type DashboardSeries } from "@/lib/dashboard-api";
import { cn } from "@/lib/utils";

export default function Series() {
  const [query, setQuery] = useState("");
  const [series, setSeries] = useState<DashboardSeries[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [details, setDetails] = useState<DashboardSeries | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openSeasons, setOpenSeasons] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let cancelled = false;

    setLoading(true);
    setError(null);

    dashboardApi.series(query)
      .then((payload) => {
        if (cancelled) return;
        setSeries(payload.series);
        setActive((current) => {
          if (current && payload.series.some((item) => item.id === current)) {
            return current;
          }
          return payload.series[0]?.id ?? null;
        });
      })
      .catch(() => {
        if (!cancelled) {
          setSeries([]);
          setActive(null);
          setError("Could not load TV series from the live dashboard API.");
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  useEffect(() => {
    if (!active) {
      setDetails(null);
      return;
    }

    let cancelled = false;
    setDetailsLoading(true);

    dashboardApi.seriesDetails(active)
      .then((payload) => {
        if (cancelled) return;
        setDetails(payload);
        setOpenSeasons((current) => {
          if (Object.keys(current).length > 0) {
            return current;
          }
          const firstSeason = payload.seasons[0]?.id;
          return firstSeason ? { [firstSeason]: true } : {};
        });
      })
      .catch(() => {
        if (!cancelled) {
          setDetails(null);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setDetailsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [active]);

  const stats = useMemo(() => {
    return series.reduce(
      (acc, item) => {
        acc.seasons += item.total_seasons ?? item.seasons.length;
        acc.episodes += item.episode_count;
        acc.variants += item.total_variants ?? 0;
        return acc;
      },
      { seasons: 0, episodes: 0, variants: 0 },
    );
  }, [series]);

  const current = details ?? series.find((item) => item.id === active) ?? null;

  return (
    <div>
      <PageHeader
        title="TV Series"
        subtitle={`${series.length} series • ${stats.seasons} seasons • ${stats.episodes} episodes • ${stats.variants} variants`}
        actions={<Button size="sm" className="gap-1.5 bg-gradient-primary text-primary-foreground"><Plus className="h-3.5 w-3.5" />New series</Button>}
      />

      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search live series..." className="h-8 bg-surface-2/60 pl-8 text-xs" />
        </div>
        <div className="ml-auto text-[11px] text-muted-foreground">{loading ? "Loading..." : `${series.length} results`}</div>
      </div>

      {error ? (
        <div className="px-5 py-6 text-sm text-destructive">{error}</div>
      ) : (
        <div className="grid gap-0 lg:grid-cols-[300px_1fr]">
          <aside className="border-b border-border lg:border-b-0 lg:border-r">
            <div className="px-3 py-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Series</div>
            <ul className="max-h-[72vh] overflow-y-auto scrollbar-thin pb-3">
              {series.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => setActive(item.id)}
                    className={cn(
                      "flex w-full items-center gap-2.5 px-3 py-2 text-left transition-smooth hover:bg-surface-2",
                      active === item.id && "bg-surface-2 shadow-[inset_2px_0_0_hsl(var(--primary))]",
                    )}
                  >
                    <div className="h-11 w-8 overflow-hidden rounded border border-border bg-surface-2">
                      {item.poster ? <img src={item.poster} alt="" className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-medium">{item.title}</p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {item.network} • {item.total_seasons ?? item.seasons.length} seasons • {item.episode_count} episodes
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </button>
                </li>
              ))}
              {!loading && series.length === 0 ? (
                <li className="px-3 py-6 text-xs text-muted-foreground">No series matched this search.</li>
              ) : null}
            </ul>
          </aside>

          <section>
            {!current ? (
              <div className="px-5 py-8 text-sm text-muted-foreground">Select a series to inspect seasons, episodes, and synced variants.</div>
            ) : (
              <>
                <div className="relative h-44 overflow-hidden border-b border-border">
                  <img src={current.backdrop || current.poster} alt="" className="h-full w-full object-cover blur-2xl opacity-40" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/85 to-background/35" />
                  <div className="absolute inset-0 flex items-end gap-4 p-5">
                    <div className="h-28 w-20 overflow-hidden rounded-md border border-border bg-surface-2 shadow-elegant">
                      {current.poster ? <img src={current.poster} alt={current.title} className="h-full w-full object-cover" /> : null}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                        <Tv className="h-3 w-3" />
                        <span>{current.network}</span>
                        <span>{current.year ?? "Unknown year"}</span>
                        <StatusBadge status={current.status} />
                        <span className="flex items-center gap-1 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white">
                          <Star className="h-2.5 w-2.5 fill-warning text-warning" />
                          {current.rating?.toFixed(1) ?? "0.0"}
                        </span>
                      </div>
                      <h2 className="mt-1 text-xl font-semibold tracking-tight">{current.title}</h2>
                      <p className="text-xs text-muted-foreground">{current.genre.join(" • ") || "No genres yet"}</p>
                      <p className="mt-2 text-[11px] text-muted-foreground">
                        {current.total_seasons ?? current.seasons.length} seasons • {current.total_episodes ?? current.episode_count} episodes • {current.total_variants ?? 0} variants • {current.total_sources ?? 0} sources
                      </p>
                    </div>
                    <div className="ml-auto flex gap-2">
                      <Button size="sm" variant="outline">Edit metadata</Button>
                      <Button size="sm" className="gap-1.5 bg-gradient-primary text-primary-foreground"><Plus className="h-3.5 w-3.5" />Add season</Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 p-5">
                  {detailsLoading ? <div className="text-sm text-muted-foreground">Loading series details...</div> : null}
                  {current.seasons.map((season) => {
                    const open = openSeasons[season.id] ?? false;
                    return (
                      <div key={season.id} className="card-elevated rounded-lg">
                        <button
                          onClick={() => setOpenSeasons((state) => ({ ...state, [season.id]: !open }))}
                          className="flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-smooth hover:bg-surface-2/40"
                        >
                          <div className="flex items-center gap-3">
                            <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", !open && "-rotate-90")} />
                            <div>
                              <p className="text-sm font-semibold">Season {season.number}</p>
                              <p className="text-[11px] text-muted-foreground">{season.episode_total ?? season.episodes.length} episodes</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                            <span>{season.episodes.reduce((total, episode) => total + episode.variants, 0)} variants</span>
                            <Button size="sm" variant="ghost" className="text-xs">Batch edit</Button>
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs"><Plus className="h-3 w-3" />Episode</Button>
                          </div>
                        </button>
                        {open ? (
                          <div className="border-t border-border p-3">
                            <div className="grid gap-2 xl:grid-cols-2">
                              {season.episodes.map((episode) => (
                                <div key={episode.id} className="rounded-md border border-border bg-surface-2/40 p-3 transition-smooth hover:border-primary/40 hover:bg-surface-2">
                                  <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 items-center justify-center rounded bg-gradient-primary/20 font-mono text-xs font-semibold text-primary">
                                      E{String(episode.number).padStart(2, "0")}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-medium">{episode.title}</p>
                                        <StatusBadge status={episode.status} />
                                      </div>
                                      <p className="mt-1 text-[11px] text-muted-foreground">
                                        {episode.runtime ? `${episode.runtime}m` : "Runtime n/a"} • {episode.variants} variants • {episode.source_count ?? 0} sources • {episode.air || "No air date"}
                                      </p>
                                      {episode.files && episode.files.length > 0 ? (
                                        <div className="mt-2 space-y-1.5">
                                          {episode.files.map((file) => (
                                            <div key={`${episode.id}-${file.id}-${file.display_name}`} className="flex items-center justify-between rounded border border-border/70 bg-background/50 px-2.5 py-2 text-[11px]">
                                              <div className="min-w-0">
                                                <p className="truncate font-medium">{file.display_name}</p>
                                                <p className="truncate font-mono text-muted-foreground">
                                                  {file.quality || "Unknown"} • {file.codec || "Codec n/a"} • {file.size}
                                                </p>
                                              </div>
                                              <span className="rounded bg-surface-3 px-1.5 py-px font-mono">{file.source_count}</span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : null}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
