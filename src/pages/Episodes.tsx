import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Input } from "@/components/ui/input";
import { dashboardApi, type DashboardSeries } from "@/lib/dashboard-api";

export default function Episodes() {
  const [series, setSeries] = useState<DashboardSeries[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadEpisodes = async () => {
      setLoading(true);
      try {
        const payload = await dashboardApi.series();
        if (!cancelled) {
          setSeries(payload.series);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setSeries([]);
          setError("Could not load live episode inventory.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadEpisodes();
    const interval = window.setInterval(() => {
      void loadEpisodes();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const episodes = useMemo(() => {
    return series.flatMap((show) =>
      show.seasons.flatMap((season) =>
        season.episodes.map((episode) => ({
          ...episode,
          series: show.title,
          season: season.number,
          poster: show.poster,
        })),
      ),
    );
  }, [series]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return episodes;
    return episodes.filter((episode) => {
      return (
        episode.series.toLowerCase().includes(term)
        || episode.title.toLowerCase().includes(term)
        || `s${episode.season}e${episode.number}`.toLowerCase().includes(term)
      );
    });
  }, [episodes, query]);

  return (
    <div>
      <PageHeader
        title="Seasons & Episodes"
        subtitle={`${episodes.length} episodes across ${series.length} live series`}
      />
      {error ? <div className="px-5 pt-4 text-sm text-destructive">{error}</div> : null}
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-5 py-3">
        <div className="relative w-full max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search episodes..." className="h-8 bg-surface-2/60 pl-8 text-xs" />
        </div>
        <div className="ml-auto text-[11px] text-muted-foreground">{loading ? "Loading..." : `${filtered.length} rows`}</div>
      </div>
      <div className="px-5 py-4">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="bg-surface-2 text-muted-foreground">
              <tr className="text-left [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                <th>Series</th><th>S/E</th><th>Title</th><th>Runtime</th>
                <th>Variants</th><th>Sources</th><th>Status</th><th className="text-right">Air date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((episode) => (
                <tr key={episode.id} className="transition-smooth hover:bg-surface-2/50 [&>td]:px-3 [&>td]:py-2">
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-6 overflow-hidden rounded border border-border bg-surface-2">
                        {episode.poster ? <img src={episode.poster} alt="" className="h-full w-full object-cover" /> : null}
                      </div>
                      <span className="truncate font-medium">{episode.series}</span>
                    </div>
                  </td>
                  <td className="font-mono">S{episode.season}E{String(episode.number).padStart(2, "0")}</td>
                  <td className="truncate">{episode.title}</td>
                  <td className="text-muted-foreground">{episode.runtime ? `${episode.runtime}m` : "-"}</td>
                  <td><span className="rounded bg-surface-3 px-1.5 py-px font-mono">{episode.variants}</span></td>
                  <td className="font-mono text-muted-foreground">{episode.source_count ?? 0}</td>
                  <td><StatusBadge status={episode.status} /></td>
                  <td className="text-right text-muted-foreground">{episode.air || "-"}</td>
                </tr>
              ))}
              {!loading && filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-6 text-center text-muted-foreground">No episodes matched this search.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
