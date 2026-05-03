import { useEffect, useMemo, useState } from "react";
import { Filter, Grid3x3, Plus, Rows3, Search, Star, Tag } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { MovieDetailDrawer } from "@/components/MovieDetailDrawer";
import { dashboardApi, type DashboardMovie } from "@/lib/dashboard-api";
import { cn } from "@/lib/utils";

const filterChips = ["All", "Published", "Draft", "2160p", "1080p", "720p"];

function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={`movie-skeleton-${index}`} className="group rounded-xl border border-border/70 bg-[linear-gradient(180deg,hsl(var(--surface-2)/0.55),transparent)] p-2 transition-all duration-300 hover:border-primary/25 hover:shadow-[0_24px_60px_rgba(0,0,0,0.24)]">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg border border-border/60 bg-surface-2/70">
            <Skeleton className="h-full w-full rounded-none bg-gradient-to-b from-primary/15 via-muted/35 to-muted/70" style={{ animationDelay: `${index * 40}ms` }} />
            <div className="absolute left-2 top-2"><Skeleton className="h-5 w-16 rounded-full bg-primary/20" /></div>
            <div className="absolute right-2 top-2"><Skeleton className="h-5 w-9 rounded-full bg-background/45" /></div>
            <div className="absolute inset-x-0 bottom-0 space-y-2 bg-gradient-to-t from-black/45 to-transparent p-2">
              <Skeleton className="h-3 w-4/5 rounded-full bg-white/20" />
              <div className="flex gap-1">
                <Skeleton className="h-4 w-10 rounded-full bg-white/15" />
                <Skeleton className="h-4 w-12 rounded-full bg-white/10" />
              </div>
            </div>
          </div>
          <div className="mt-2 space-y-2">
            <Skeleton className="h-3 w-4/5 rounded-full" />
            <Skeleton className="h-2.5 w-3/5 rounded-full bg-muted/70" />
          </div>
        </div>
      ))}
    </div>
  );
}

function MovieTableSkeleton() {
  return (
    <div className="px-5 py-4">
      <div className="overflow-hidden rounded-lg border border-border bg-surface-2/15">
        <table className="w-full text-xs">
          <thead className="bg-surface-2 text-muted-foreground">
            <tr className="text-left [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
              <th>Title</th><th>Year</th><th>Genre</th><th>Variants</th><th>Status</th><th>Rating</th><th className="text-right">Files</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: 7 }).map((_, index) => (
              <tr key={`movie-row-skeleton-${index}`} className="[&>td]:px-3 [&>td]:py-3">
                <td>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-9 w-7 rounded border border-border/60" style={{ animationDelay: `${index * 50}ms` }} />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-3 w-36 rounded-full" />
                      <Skeleton className="h-2.5 w-24 rounded-full bg-muted/70" />
                    </div>
                  </div>
                </td>
                <td><Skeleton className="h-3 w-10 rounded-full" /></td>
                <td><Skeleton className="h-3 w-28 rounded-full" /></td>
                <td><div className="flex gap-1"><Skeleton className="h-4 w-12 rounded-full" /><Skeleton className="h-4 w-10 rounded-full" /></div></td>
                <td><Skeleton className="h-5 w-16 rounded-full" /></td>
                <td><Skeleton className="ml-0 h-3 w-8 rounded-full" /></td>
                <td className="text-right"><Skeleton className="ml-auto h-3 w-10 rounded-full" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Movies() {
  const [view, setView] = useState<"grid" | "table">("grid");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string[]>(["All"]);
  const [movies, setMovies] = useState<DashboardMovie[]>([]);
  const [selected, setSelected] = useState<DashboardMovie | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dashboardApi.movies().then((payload) => setMovies(payload.movies));
  }, []);

  const openMovie = async (movie: DashboardMovie) => {
    const details = await dashboardApi.movie(movie.id);
    setSelected(details);
    setOpen(true);
  };

  const filtered = useMemo(() => {
    return movies.filter((movie) => {
      const matchesSearch = movie.title.toLowerCase().includes(q.toLowerCase());
      const matchesChip = active.includes("All") || active.every((chip) => {
        if (chip === "Published" || chip === "Draft") return movie.status === chip;
        return movie.variants.some((variant) => variant.quality === chip);
      });
      return matchesSearch && matchesChip;
    });
  }, [active, movies, q]);

  const toggle = (chip: string) => setActive((arr) => (arr.includes(chip) ? arr.filter((x) => x !== chip) : [...arr.filter((x) => x !== "All" || chip === "All"), chip]));

  return (
    <div>
      <PageHeader
        title="Movies"
        subtitle={`${movies.length.toLocaleString()} titles • real database records`}
        actions={
          <>
            <div className="hidden items-center gap-1 rounded-md border border-border bg-surface-2/60 p-0.5 sm:flex">
              <Button size="sm" variant={view === "grid" ? "secondary" : "ghost"} onClick={() => setView("grid")} className="h-7 gap-1.5 px-2 text-xs">
                <Grid3x3 className="h-3.5 w-3.5" /> Grid
              </Button>
              <Button size="sm" variant={view === "table" ? "secondary" : "ghost"} onClick={() => setView("table")} className="h-7 gap-1.5 px-2 text-xs">
                <Rows3 className="h-3.5 w-3.5" /> Table
              </Button>
            </div>
            <Button size="sm" variant="outline" className="gap-1.5"><Filter className="h-3.5 w-3.5" />Filters</Button>
            <Button size="sm" className="gap-1.5 bg-gradient-primary text-primary-foreground"><Plus className="h-3.5 w-3.5" />Movie DB</Button>
          </>
        }
      />

      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search real titles..." className="h-8 bg-surface-2/60 pl-8 text-xs" />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {filterChips.map((chip) => (
            <button
              key={chip}
              onClick={() => toggle(chip)}
              className={cn(
                "rounded-full border px-2.5 py-0.5 text-[11px] transition-smooth",
                active.includes(chip) ? "border-primary/40 bg-primary/15 text-foreground" : "border-border bg-surface-2/60 text-muted-foreground hover:text-foreground",
              )}
            >
              {chip}
            </button>
          ))}
        </div>
        <div className="ml-auto text-[11px] text-muted-foreground">{filtered.length} of {movies.length}</div>
      </div>

      {loading ? view === "grid" ? (
        <MovieGridSkeleton />
      ) : (
        <MovieTableSkeleton />
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 p-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {filtered.map((movie) => (
            <div key={movie.id} onClick={() => void openMovie(movie)} className="group cursor-pointer">
              <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-border bg-surface-2">
                <img src={movie.poster} alt={movie.title} loading="lazy" className="h-full w-full object-cover transition-smooth group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/0 to-black/0 opacity-90" />
                <div className="absolute left-1.5 top-1.5"><StatusBadge status={movie.status} /></div>
                <div className="absolute right-1.5 top-1.5 flex items-center gap-0.5 rounded bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  <Star className="h-2.5 w-2.5 fill-warning text-warning" />{movie.rating || 0}
                </div>
                <div className="absolute inset-x-0 bottom-0 p-2">
                  <p className="truncate text-xs font-semibold text-white">{movie.title}</p>
                  <div className="mt-1 flex items-center gap-1">
                    {movie.variants.map((variant) => (
                      <span key={variant.quality} className="rounded bg-white/10 px-1 py-px text-[9px] font-mono text-white/90">{variant.quality}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                <span>{movie.year ?? "-"} • {movie.genre[0] ?? "Unknown"}</span>
                <span className="font-mono">{movie.downloads}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-5 py-4">
          <div className="overflow-hidden rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="bg-surface-2 text-muted-foreground">
                <tr className="text-left [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                  <th>Title</th><th>Year</th><th>Genre</th><th>Variants</th><th>Status</th><th>Rating</th><th className="text-right">Files</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((movie) => (
                  <tr key={movie.id} onClick={() => void openMovie(movie)} className="cursor-pointer transition-smooth hover:bg-surface-2/50 [&>td]:px-3 [&>td]:py-2">
                    <td>
                      <div className="flex items-center gap-2">
                        <img src={movie.poster} alt="" className="h-9 w-7 rounded border border-border object-cover" />
                        <div className="min-w-0">
                          <p className="truncate font-medium">{movie.title}</p>
                          <p className="flex items-center gap-1 truncate text-[10px] text-muted-foreground"><Tag className="h-2.5 w-2.5" />{movie.id}</p>
                        </div>
                      </div>
                    </td>
                    <td>{movie.year ?? "-"}</td>
                    <td className="text-muted-foreground">{movie.genre.join(", ") || "Unknown"}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        {movie.variants.map((variant) => (
                          <span key={variant.quality} className="rounded bg-surface-3 px-1.5 py-px font-mono text-[10px]">{variant.quality}</span>
                        ))}
                      </div>
                    </td>
                    <td><StatusBadge status={movie.status} /></td>
                    <td><span className="font-mono">{movie.rating || 0}</span></td>
                    <td className="text-right font-mono text-muted-foreground">{movie.downloads}</td>
                  </tr>
                ))}
                {!loading && filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">No movie records matched this view.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <MovieDetailDrawer movie={selected} open={open} onOpenChange={setOpen} />
    </div>
  );
}
