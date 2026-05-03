import { useEffect, useState } from "react";
import { Film, Tv, Layers, Inbox, HardDrive, Database, Activity } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { dashboardApi, type DashboardOverview } from "@/lib/dashboard-api";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Overview() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadOverview = async () => {
      try {
        const payload = await dashboardApi.overview();
        if (!cancelled) {
          setData(payload);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load live dashboard overview data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOverview();
    const interval = window.setInterval(() => {
      void loadOverview();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const counts = data?.counts;

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Live library metrics and operational signals from your real database."
        actions={<Button size="sm" className="bg-gradient-primary text-primary-foreground">Live data</Button>}
      />

      {error ? <div className="px-5 pt-4 text-sm text-destructive">{error}</div> : null}

      <div className="grid gap-4 p-5 lg:grid-cols-4">
        <StatCard label="Total Movies" value={loading ? "..." : String(counts?.movies ?? 0)} icon={Film} accent="primary" />
        <StatCard label="Total Series" value={loading ? "..." : String(counts?.series ?? 0)} icon={Tv} accent="info" />
        <StatCard label="Total Episodes" value={loading ? "..." : String(counts?.episodes ?? 0)} icon={Layers} accent="success" />
        <StatCard label="Pending Queue" value={loading ? "..." : String(counts?.requests ?? 0)} icon={Inbox} accent="warning" />
      </div>

      <div className="grid gap-4 px-5 pb-5 lg:grid-cols-3">
        <div className="card-elevated rounded-lg p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Library by Release Year</h3>
              <p className="text-xs text-muted-foreground">Derived from your indexed movie records</p>
            </div>
            <Database className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.release_distribution ?? []} margin={{ top: 10, right: 6, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Storage / Sources</h3>
              <p className="text-xs text-muted-foreground">Bot workload + database size</p>
            </div>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {(data?.sources ?? []).map((source) => (
              <div key={source.name}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-foreground">{source.name}</span>
                  <span className="font-mono text-muted-foreground">{source.workload}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-gradient-primary" style={{ width: `${source.used}%` }} />
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {source.status}
                  {source.files != null ? ` • ${source.files} files tracked` : " • library coverage pending"}
                </p>
              </div>
            ))}
            {data?.sources.length ? null : (
              <div className="rounded-md border border-dashed border-border bg-surface-2/20 p-3 text-xs text-muted-foreground">
                No live bot workload data is available right now.
              </div>
            )}
            <div className="rounded-md border border-border bg-surface-2/40 p-3 text-xs text-muted-foreground">
              DB size: {data?.storage.storage_size_label ?? "0 B"} • Data: {data?.storage.data_size_label ?? "0 B"}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 px-5 pb-8 lg:grid-cols-3">
        <div className="card-elevated rounded-lg p-4 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold">Recently Indexed Movies</h3>
              <p className="text-xs text-muted-foreground">Sorted by newest database records</p>
            </div>
          </div>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
              {(data?.recent_movies ?? []).map((movie) => (
              <div key={movie.id} className="group">
                <div className="relative aspect-[2/3] overflow-hidden rounded-md border border-border bg-surface-2">
                  <img src={movie.poster} alt={movie.title} loading="lazy" className="h-full w-full object-cover transition-smooth group-hover:scale-105" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1.5">
                    <div className="flex items-center justify-between text-[10px] text-white/90">
                      <span className="font-medium">{movie.year ?? "-"}</span>
                      <span className="font-mono">{movie.variants[0]?.quality ?? "-"}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-1.5 truncate text-xs font-medium">{movie.title}</p>
                <p className="truncate text-[10px] text-muted-foreground">{movie.genre.join(" • ") || "No genres"}</p>
              </div>
              ))}
              {!loading && (data?.recent_movies.length ?? 0) === 0 ? (
                <div className="col-span-full rounded-md border border-dashed border-border bg-surface-2/20 p-4 text-sm text-muted-foreground">
                  No indexed movie records are available yet.
                </div>
              ) : null}
            </div>
          </div>

        <div className="card-elevated rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Activity Timeline</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <ul className="relative space-y-3 border-l border-border pl-4">
            {(data?.activity ?? []).map((item, index) => (
              <li key={`${item.target}-${index}`} className="relative">
                <span className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full bg-primary shadow-glow" />
                <p className="text-xs">
                  <span className="font-medium">{item.who}</span>
                  <span className="text-muted-foreground"> {item.what} </span>
                  <span className="font-medium">{item.target}</span>
                </p>
                <p className="text-[10px] text-muted-foreground">{item.when || "recently"}</p>
              </li>
            ))}
            {!loading && (data?.activity.length ?? 0) === 0 ? (
              <li className="text-xs text-muted-foreground">No recent indexed activity is available yet.</li>
            ) : null}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 px-5 pb-8 md:grid-cols-2">
        <div className="card-elevated rounded-lg p-4">
          <h3 className="mb-3 text-sm font-semibold">Quality Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.quality_distribution ?? []} margin={{ top: 10, right: 6, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="files" stroke="hsl(var(--accent))" strokeWidth={2} fill="hsl(var(--accent) / 0.2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="card-elevated rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Tracked users</p>
          <p className="mt-1 text-2xl font-semibold">{counts?.users ?? 0}</p>
          <p className="mt-4 text-xs text-muted-foreground">Tracked chats</p>
          <p className="mt-1 text-2xl font-semibold">{counts?.chats ?? 0}</p>
          <p className="mt-4 text-xs text-muted-foreground">Indexed files</p>
          <p className="mt-1 text-2xl font-semibold">{counts?.files ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
