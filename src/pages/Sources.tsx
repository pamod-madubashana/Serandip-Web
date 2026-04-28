import { PageHeader } from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { sources } from "@/lib/mock-data";
import { CheckCircle2, CloudUpload, FileVideo, Link2, Upload } from "lucide-react";

const uploads = [
  { name: "Neon Horizon — 2160p.mkv", size: "18.4 GB", progress: 78, eta: "2m 12s" },
  { name: "Stellar Frontier S02E04 — 1080p.mp4", size: "1.9 GB", progress: 42, eta: "5m 04s" },
  { name: "Phantom Signal — 720p.mkv", size: "1.2 GB", progress: 96, eta: "8s" },
];

export default function Sources() {
  return (
    <div>
      <PageHeader
        title="Upload & Sources"
        subtitle="Map files to titles, validate Telegram sources, monitor storage."
        actions={<Button size="sm" className="gap-1.5 bg-gradient-primary text-primary-foreground"><Upload className="h-3.5 w-3.5" />New upload</Button>}
      />

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
            <p className="mt-2 text-[11px] text-muted-foreground">{s.files.toLocaleString()} files indexed</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 px-5 pb-8 lg:grid-cols-2">
        <div className="card-elevated rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Active uploads</h3>
            <CloudUpload className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {uploads.map((u) => (
              <div key={u.name} className="rounded-md border border-border bg-surface-2/40 p-3">
                <div className="flex items-center gap-2">
                  <FileVideo className="h-4 w-4 text-primary" />
                  <p className="min-w-0 flex-1 truncate text-xs font-medium">{u.name}</p>
                  <span className="font-mono text-[11px] text-muted-foreground">{u.size}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full bg-gradient-primary animate-pulse-glow" style={{ width: `${u.progress}%` }} />
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-muted-foreground">
                  <span>{u.progress}% • ETA {u.eta}</span>
                  <span>Vault A</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Telegram source mapping</h3>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="overflow-hidden rounded-md border border-border">
            <table className="w-full text-xs">
              <thead className="bg-surface-2 text-muted-foreground">
                <tr className="text-left [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                  <th>Title</th><th>Variant</th><th>Channel</th><th>Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { t: "Neon Horizon", v: "2160p", c: "@vault_a_2160", s: "Validated" },
                  { t: "Crimson Echo", v: "1080p", c: "@vault_b_1080", s: "Validated" },
                  { t: "Solaris Drift", v: "720p", c: "@archive_720", s: "Pending" },
                  { t: "Velvet Shadows", v: "1080p", c: "@vault_a_1080", s: "Validated" },
                  { t: "Phantom Signal", v: "720p", c: "@archive_720", s: "Failed" },
                ].map((r) => (
                  <tr key={r.t + r.v} className="[&>td]:px-3 [&>td]:py-2">
                    <td className="font-medium">{r.t}</td>
                    <td><span className="rounded bg-surface-3 px-1.5 py-px font-mono">{r.v}</span></td>
                    <td className="font-mono text-muted-foreground">{r.c}</td>
                    <td>
                      <span className={
                        r.s === "Validated" ? "text-success" :
                        r.s === "Pending" ? "text-warning" : "text-danger"
                      }>● {r.s}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
