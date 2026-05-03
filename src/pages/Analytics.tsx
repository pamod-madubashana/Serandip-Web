import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { dashboardApi, type DashboardOverview } from "@/lib/dashboard-api";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function Analytics() {
  const [data, setData] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadAnalytics = async () => {
      try {
        const payload = await dashboardApi.overview();
        if (!cancelled) {
          setData(payload);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load live analytics data.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadAnalytics();
    const interval = window.setInterval(() => {
      void loadAnalytics();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Live content distribution and indexing activity from the current library." />
      {error ? <div className="px-5 pt-4 text-sm text-destructive">{error}</div> : null}
      <div className="grid gap-4 p-5 lg:grid-cols-2">
        <div className="card-elevated rounded-lg p-4">
          <h3 className="mb-3 text-sm font-semibold">Library by release year</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.release_distribution ?? []} margin={{ top: 10, right: 6, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated rounded-lg p-4">
          <h3 className="mb-3 text-sm font-semibold">Quality distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.quality_distribution ?? []} margin={{ top: 10, right: 6, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: "hsl(var(--popover))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="files" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="grid gap-4 px-5 pb-8 md:grid-cols-3">
        <div className="card-elevated rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Movies indexed</p>
          <p className="mt-1 text-2xl font-semibold">{loading ? "..." : data?.counts.movies ?? 0}</p>
        </div>
        <div className="card-elevated rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Series indexed</p>
          <p className="mt-1 text-2xl font-semibold">{loading ? "..." : data?.counts.series ?? 0}</p>
        </div>
        <div className="card-elevated rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Episodes indexed</p>
          <p className="mt-1 text-2xl font-semibold">{loading ? "..." : data?.counts.episodes ?? 0}</p>
        </div>
      </div>
    </div>
  );
}
