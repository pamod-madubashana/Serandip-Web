import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { dashboardApi, type DashboardRequests } from "@/lib/dashboard-api";
import { Flame, ThumbsUp } from "lucide-react";

const columns = ["Pending", "Leeching", "Uploading", "Finished", "Reject"] as const;

export default function Requests() {
  const [data, setData] = useState<DashboardRequests | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [manualSources, setManualSources] = useState<Record<string, string>>({});
  const [manualNames, setManualNames] = useState<Record<string, string>>({});

  const loadRequests = async () => {
    try {
      const payload = await dashboardApi.requests();
      setData(payload);
      setError(null);
    } catch {
      setError("Could not load live request backlog data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      await loadRequests();
      if (cancelled) return;
    })();
    const interval = window.setInterval(() => {
      if (!cancelled) void loadRequests();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const items = data?.items ?? [];

  const runSearchLeech = async (requestId: string) => {
    setBusyId(requestId);
    setActionMessage(null);
    try {
      const payload = await dashboardApi.requestSearchLeech(requestId);
      setActionMessage(`Queued legal torrent for ${payload.title}.`);
      await loadRequests();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Could not queue legal torrent.");
    } finally {
      setBusyId(null);
    }
  };

  const runManualLeech = async (requestId: string, fallbackName: string) => {
    const source = (manualSources[requestId] ?? "").trim();
    if (!source) {
      setActionMessage("Paste a magnet link or torrent URL first.");
      return;
    }
    setBusyId(requestId);
    setActionMessage(null);
    try {
      const payload = await dashboardApi.requestManualLeech(requestId, source, (manualNames[requestId] ?? fallbackName).trim() || fallbackName);
      setActionMessage(`Queued manual leech for ${payload.title}.`);
      setManualSources((current) => ({ ...current, [requestId]: "" }));
      await loadRequests();
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Could not queue manual leech.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <PageHeader
        title="Requests"
        subtitle={`${data?.total ?? 0} live queue items waiting for processing.`}
        actions={<Button size="sm" variant="outline">Export CSV</Button>}
      />

      {error ? <div className="px-5 pt-4 text-sm text-destructive">{error}</div> : null}
      {actionMessage ? <div className="px-5 pt-2 text-sm text-muted-foreground">{actionMessage}</div> : null}

      {/* Kanban */}
      <div className="grid gap-3 p-5 xl:grid-cols-5">
        {columns.map((col) => {
          const columnItems = items.filter((r) => r.status === col);
          return (
            <div key={col} className="card-elevated rounded-lg p-3">
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={col} />
                  <span className="text-[11px] text-muted-foreground">{columnItems.length}</span>
                </div>
              </div>
              <div className="space-y-2">
                {columnItems.map((r) => (
                  <div key={r.id} className="rounded-md border border-border bg-surface-2/40 p-3 transition-smooth hover:border-primary/40">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-xs font-semibold leading-tight">{r.title}</p>
                      <span className="rounded bg-surface-3 px-1.5 py-px text-[10px] font-mono">{r.type}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="font-mono">{r.requester}</span>
                      <span className="flex items-center gap-1">
                        {r.votes > 200 && <Flame className="h-3 w-3 text-warning" />}
                        <ThumbsUp className="h-3 w-3" /> {r.votes}
                      </span>
                    </div>
                    <div className="mt-3 space-y-2">
                      <Button size="sm" className="w-full" variant="secondary" disabled={busyId === r.id} onClick={() => void runSearchLeech(r.id)}>
                        Search & Leech
                      </Button>
                      <input
                        value={manualSources[r.id] ?? ""}
                        onChange={(event) => setManualSources((current) => ({ ...current, [r.id]: event.target.value }))}
                        placeholder="Magnet or .torrent URL"
                        className="w-full rounded-md border border-border bg-background px-2 py-1 text-[11px]"
                      />
                      <input
                        value={manualNames[r.id] ?? ""}
                        onChange={(event) => setManualNames((current) => ({ ...current, [r.id]: event.target.value }))}
                        placeholder="Optional display name"
                        className="w-full rounded-md border border-border bg-background px-2 py-1 text-[11px]"
                      />
                      <Button size="sm" className="w-full" disabled={busyId === r.id} onClick={() => void runManualLeech(r.id, r.title)}>
                        Queue Manual Leech
                      </Button>
                    </div>
                  </div>
                ))}
                {columnItems.length === 0 && <p className="px-2 py-6 text-center text-[11px] text-muted-foreground">Empty</p>}
              </div>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="px-5 pb-8">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="bg-surface-2 text-muted-foreground">
              <tr className="text-left [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                <th>Title</th><th>Type</th><th>Votes</th><th>Status</th><th>Requester</th><th className="text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((r) => (
                <tr key={r.id} className="transition-smooth hover:bg-surface-2/50 [&>td]:px-3 [&>td]:py-2">
                  <td className="font-medium">{r.title}</td>
                  <td><span className="rounded bg-surface-3 px-1.5 py-px font-mono">{r.type}</span></td>
                  <td className="font-mono">{r.votes}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="font-mono text-muted-foreground">{r.requester}</td>
                  <td className="text-right text-muted-foreground">{r.date}</td>
                </tr>
              ))}
              {!loading && items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-6 text-center text-muted-foreground">No live request records are waiting in the queue.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
