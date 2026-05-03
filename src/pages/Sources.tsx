import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { dashboardApi, type DashboardOverview, type DashboardMovie } from "@/lib/dashboard-api";
import { CheckCircle2, Database, FileVideo, Link2, Upload } from "lucide-react";

export default function Sources() {
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [movies, setMovies] = useState<DashboardMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadSources = async () => {
      try {
        const [overviewPayload, moviePayload] = await Promise.all([
          dashboardApi.overview(),
          dashboardApi.movies(),
        ]);

        if (!cancelled) {
          setOverview(overviewPayload);
          setMovies(moviePayload.movies);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load live storage and source data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadSources();
    const interval = window.setInterval(() => {
      void loadSources();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const sources = overview?.sources ?? [];
  const variantRows = useMemo(() => {
    return movies.flatMap((movie) =>
      movie.variants.map((variant) => ({
        title: movie.title,
        quality: variant.quality,
        size: variant.size,
        sources: variant.sources,
      })),
    ).slice(0, 8);
  }, [movies]);

  return (
    <div>
      <PageHeader
        title="Upload & Sources"
        subtitle={`${sources.length} live source workers • ${overview?.counts.files ?? 0} indexed files`}
        actions={<Button size="sm" className="gap-1.5 bg-gradient-primary text-primary-foreground"><Upload className="h-3.5 w-3.5" />New upload</Button>}
      />

      {error ? <div className="px-5 pt-4 text-sm text-destructive">{error}</div> : null}

      <div className="grid gap-4 p-5 lg:grid-cols-4">
        {sources.map((s) => (
          <div key={s.name} className="card-elevated rounded-lg p-4">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium">{s.name}</p>
              <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            </div>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="text-2xl font-semibold">{s.used}%</span>
              <span className="text-[10px] text-muted-foreground">used</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
              <div className="h-full bg-gradient-primary" style={{ width: `${s.used}%` }} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {s.files != null ? `${s.files.toLocaleString()} files indexed` : "Library coverage pending"} • {s.status}
            </p>
          </div>
        ))}
        {!loading && sources.length === 0 ? (
          <div className="card-elevated rounded-lg p-4 lg:col-span-4">
            <p className="text-sm text-muted-foreground">No live source workers are currently connected.</p>
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 px-5 pb-8 lg:grid-cols-2">
        <div className="card-elevated rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Live source workload</h3>
            <Database className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {sources.map((source) => (
              <div key={source.name} className="rounded-md border border-border bg-surface-2/40 p-3">
                <div className="flex items-center gap-2">
                  <FileVideo className="h-4 w-4 text-primary" />
                  <p className="min-w-0 flex-1 truncate text-xs font-medium">{source.name}</p>
                  <span className="font-mono text-[11px] text-muted-foreground">{source.workload}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-gradient-primary animate-pulse-glow" style={{ width: `${source.used}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>{source.used}% utilized • {source.status}</span>
                  <span>{source.files != null ? `${source.files} files tracked` : "coverage pending"}</span>
                </div>
              </div>
            ))}
            {!loading && sources.length === 0 ? <p className="text-xs text-muted-foreground">No worker workload data is available.</p> : null}
            <div className="rounded-md border border-border bg-surface-2/30 p-3 text-xs text-muted-foreground">
              DB size: {overview?.storage.storage_size_label ?? "0 B"} • Data: {overview?.storage.data_size_label ?? "0 B"}
            </div>
          </div>
        </div>

        <div className="card-elevated rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent indexed variants</h3>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-xs">
              <thead className="bg-surface-2 text-muted-foreground">
                <tr className="text-left [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                  <th>Title</th><th>Variant</th><th>Size</th><th>Sources</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {variantRows.map((row) => (
                  <tr key={`${row.title}-${row.quality}-${row.size}`} className="[&>td]:px-3 [&>td]:py-2">
                    <td className="font-medium">{row.title}</td>
                    <td><span className="rounded bg-surface-3 px-1.5 py-px font-mono">{row.quality}</span></td>
                    <td className="font-mono text-muted-foreground">{row.size}</td>
                    <td>
                      <span className="text-success">● {row.sources} sources</span>
                    </td>
                  </tr>
                ))}
                {!loading && variantRows.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-3 py-6 text-center text-muted-foreground">No live movie variants are available yet.</td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
