import { useEffect, useState } from "react";
import { Flame, Search, ThumbsUp, XCircle } from "lucide-react";

import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  dashboardApi,
  type DashboardRequests,
  type DashboardTorrentSearchResult,
} from "@/lib/dashboard-api";

const columns = ["Pending", "Leeching", "Uploading", "Finished", "Reject"] as const;

type RequestItem = DashboardRequests["items"][number];

export default function Requests() {
  const [data, setData] = useState<DashboardRequests | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<RequestItem | null>(null);
  const [searchResults, setSearchResults] = useState<Record<string, DashboardTorrentSearchResult[]>>({});
  const [selectedSource, setSelectedSource] = useState<Record<string, string>>({});
  const [manualSources, setManualSources] = useState<Record<string, string>>({});
  const [manualNames, setManualNames] = useState<Record<string, string>>({});

  const loadRequests = async () => {
    try {
      const payload = await dashboardApi.requests();
      setData(payload);
      setError(null);
      setSelectedRequest((current) => payload.items.find((item) => item.id === current?.id) ?? current);
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
  const selectedId = selectedRequest?.id ?? "";
  const selectedResults = selectedId ? searchResults[selectedId] ?? [] : [];
  const resolvedSource = (selectedId ? selectedSource[selectedId] : "") || "";
  const resolvedName = (selectedId ? manualNames[selectedId] : "") || selectedRequest?.title || "";
  const canStartLeech = resolvedSource.trim().length > 0;

  const columnCounts = Object.fromEntries(columns.map((status) => [status, items.filter((item) => item.status === status).length])) as Record<(typeof columns)[number], number>;

  const openRequest = (request: RequestItem) => {
    setSelectedRequest(request);
    setActionMessage(null);
  };

  const runSearchTorrent = async () => {
    if (!selectedRequest) return;
    setBusyId(selectedRequest.id);
    setActionMessage(null);
    try {
      const payload = await dashboardApi.requestSearchTorrents(selectedRequest.id);
      setSearchResults((current) => ({ ...current, [selectedRequest.id]: payload.items }));
      setSelectedSource((current) => ({ ...current, [selectedRequest.id]: payload.items[0]?.torrent_url ?? current[selectedRequest.id] ?? "" }));
      setActionMessage(payload.items.length ? `Found ${payload.items.length} torrent result(s).` : "No legal torrent results found.");
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Could not search torrents.");
    } finally {
      setBusyId(null);
    }
  };

  const runStartLeech = async () => {
    if (!selectedRequest || !canStartLeech) return;
    setBusyId(selectedRequest.id);
    setActionMessage(null);
    try {
      const payload = await dashboardApi.requestStartLeech(selectedRequest.id, resolvedSource, resolvedName.trim() || selectedRequest.title);
      setActionMessage(`Queued leech for ${payload.title}.`);
      await loadRequests();
      setSelectedRequest((current) => (current ? { ...current, status: "Leeching" } : current));
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Could not start leech.");
    } finally {
      setBusyId(null);
    }
  };

  const runReject = async () => {
    if (!selectedRequest) return;
    setBusyId(selectedRequest.id);
    setActionMessage(null);
    try {
      await dashboardApi.requestSetStatus(selectedRequest.id, "Reject");
      setActionMessage(`Rejected ${selectedRequest.title}.`);
      await loadRequests();
      setSelectedRequest((current) => (current ? { ...current, status: "Reject" } : current));
    } catch (err) {
      setActionMessage(err instanceof Error ? err.message : "Could not reject request.");
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

      <div className="grid gap-3 p-5 xl:grid-cols-5">
        {columns.map((col) => (
          <div key={col} className="card-elevated rounded-lg p-4">
            <div className="flex items-center justify-between gap-3">
              <StatusBadge status={col} />
              <span className="font-mono text-2xl font-semibold text-foreground">{columnCounts[col]}</span>
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{col} items</p>
          </div>
        ))}
      </div>

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
                <tr
                  key={r.id}
                  className="cursor-pointer transition-smooth hover:bg-surface-2/50 [&>td]:px-3 [&>td]:py-2"
                  onClick={() => openRequest(r)}
                >
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

      <Dialog open={Boolean(selectedRequest)} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="w-[min(96vw,1100px)] max-w-5xl overflow-hidden border-border bg-surface-1 p-0">
          {selectedRequest ? (
            <>
              <DialogHeader className="border-b border-border px-6 pb-4 pt-6">
                <DialogTitle className="flex flex-wrap items-center gap-3 pr-8">
                  <span>{selectedRequest.title}</span>
                  <StatusBadge status={selectedRequest.status} />
                </DialogTitle>
                <DialogDescription>
                  Manage this request, search legal torrents, select one, or paste a magnet or torrent URL before starting leech.
                </DialogDescription>
              </DialogHeader>

              <div className="max-h-[calc(90vh-180px)] overflow-y-auto px-6 py-5">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_320px]">
                  <div className="min-w-0 space-y-4">
                    <div className="rounded-lg border border-border bg-surface-2/40 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold">Torrent Search</p>
                          <p className="text-xs text-muted-foreground">Search Internet Archive results for this request.</p>
                        </div>
                        <Button size="sm" variant="secondary" disabled={busyId === selectedRequest.id} onClick={() => void runSearchTorrent()}>
                          <Search className="mr-1 h-3.5 w-3.5" /> Search Torrent
                        </Button>
                      </div>
                      <div className="mt-3 max-h-[52vh] space-y-2 overflow-y-auto pr-1">
                        {selectedResults.map((result) => {
                          const active = resolvedSource === result.torrent_url;
                          return (
                            <button
                              key={result.torrent_url}
                              type="button"
                              onClick={() => {
                                setSelectedSource((current) => ({ ...current, [selectedRequest.id]: result.torrent_url }));
                                setManualNames((current) => ({ ...current, [selectedRequest.id]: result.label }));
                              }}
                              className={`w-full min-w-0 rounded-lg border p-3 text-left transition-smooth ${active ? "border-primary bg-primary/10" : "border-border bg-background hover:border-primary/40"}`}
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0">
                                  <p className="text-sm font-medium leading-snug break-words">{result.label}</p>
                                  <p className="mt-1 break-all text-[11px] text-muted-foreground">{result.archive_url}</p>
                                </div>
                                <span className="shrink-0 rounded bg-surface-3 px-1.5 py-px text-[10px] font-mono">torrent</span>
                              </div>
                            </button>
                          );
                        })}
                        {selectedResults.length === 0 ? <p className="py-8 text-center text-xs text-muted-foreground">No torrent searched yet.</p> : null}
                      </div>
                    </div>
                  </div>

                  <div className="min-w-0 space-y-4">
                    <div className="rounded-lg border border-border bg-surface-2/40 p-4">
                      <p className="text-sm font-semibold">Leech Source</p>
                      <p className="mt-1 text-xs text-muted-foreground">Pick a searched torrent or paste a magnet or torrent URL manually.</p>
                      <textarea
                        value={manualSources[selectedRequest.id] ?? resolvedSource}
                        onChange={(event) => {
                          const value = event.target.value;
                          setManualSources((current) => ({ ...current, [selectedRequest.id]: value }));
                          setSelectedSource((current) => ({ ...current, [selectedRequest.id]: value }));
                        }}
                        placeholder="magnet:?xt=... or https://example.com/file.torrent"
                        className="mt-3 min-h-32 w-full rounded-md border border-border bg-background px-3 py-2 font-mono text-xs leading-relaxed"
                      />
                      <input
                        value={manualNames[selectedRequest.id] ?? selectedRequest.title}
                        onChange={(event) => setManualNames((current) => ({ ...current, [selectedRequest.id]: event.target.value }))}
                        placeholder="Optional display name"
                        className="mt-3 w-full rounded-md border border-border bg-background px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="rounded-lg border border-border bg-surface-2/40 p-4 text-xs text-muted-foreground">
                      <p className="font-medium text-foreground">Request details</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center justify-between"><span>Requester</span><span className="font-mono">{selectedRequest.requester}</span></div>
                        <div className="flex items-center justify-between"><span>Votes</span><span className="font-mono flex items-center gap-1">{selectedRequest.votes > 200 && <Flame className="h-3 w-3 text-warning" />}<ThumbsUp className="h-3 w-3" /> {selectedRequest.votes}</span></div>
                        <div className="flex items-center justify-between"><span>Type</span><span className="font-mono">{selectedRequest.type}</span></div>
                        <div className="flex items-center justify-between"><span>Date</span><span className="font-mono">{selectedRequest.date}</span></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t border-border px-6 py-4 sm:justify-between">
                <Button variant="destructive" disabled={busyId === selectedRequest.id} onClick={() => void runReject()}>
                  <XCircle className="mr-1 h-3.5 w-3.5" /> Reject
                </Button>
                <Button disabled={busyId === selectedRequest.id || !canStartLeech} onClick={() => void runStartLeech()}>
                  Start Leech
                </Button>
              </DialogFooter>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
