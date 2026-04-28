import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { requests } from "@/lib/mock-data";
import { Flame, ThumbsUp } from "lucide-react";

const columns = ["Pending", "In Progress", "Fulfilled", "Rejected"] as const;

export default function Requests() {
  return (
    <div>
      <PageHeader
        title="Requests"
        subtitle="Community-driven backlog with voting & fulfillment workflow."
        actions={<Button size="sm" variant="outline">Export CSV</Button>}
      />

      {/* Kanban */}
      <div className="grid gap-3 p-5 lg:grid-cols-4">
        {columns.map((col) => {
          const items = requests.filter((r) => r.status === col);
          return (
            <div key={col} className="card-elevated rounded-lg p-3">
              <div className="mb-2 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <StatusBadge status={col} />
                  <span className="text-[11px] text-muted-foreground">{items.length}</span>
                </div>
              </div>
              <div className="space-y-2">
                {items.map((r) => (
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
                  </div>
                ))}
                {items.length === 0 && <p className="px-2 py-6 text-center text-[11px] text-muted-foreground">Empty</p>}
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
              {requests.map((r) => (
                <tr key={r.id} className="transition-smooth hover:bg-surface-2/50 [&>td]:px-3 [&>td]:py-2">
                  <td className="font-medium">{r.title}</td>
                  <td><span className="rounded bg-surface-3 px-1.5 py-px font-mono">{r.type}</span></td>
                  <td className="font-mono">{r.votes}</td>
                  <td><StatusBadge status={r.status} /></td>
                  <td className="font-mono text-muted-foreground">{r.requester}</td>
                  <td className="text-right text-muted-foreground">{r.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
