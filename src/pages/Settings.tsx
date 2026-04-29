import { PageHeader } from "@/components/PageHeader";
import { APP_NAME } from "@/lib/app-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Settings() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Workspace, integrations and audit logs." />
      <div className="grid gap-4 p-5 lg:grid-cols-2">
        <div className="card-elevated rounded-lg p-5">
          <h3 className="text-sm font-semibold">Workspace</h3>
          <p className="text-xs text-muted-foreground">General configuration for your CMS.</p>
          <div className="mt-4 space-y-3">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Workspace name</label>
              <Input defaultValue={`${APP_NAME} Vault`} className="mt-1 bg-surface-2/60" />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-muted-foreground">Default quality</label>
              <Input defaultValue="1080p" className="mt-1 bg-surface-2/60" />
            </div>
            <Button size="sm" className="bg-gradient-primary text-primary-foreground">Save</Button>
          </div>
        </div>

        <div className="card-elevated rounded-lg p-5">
          <h3 className="text-sm font-semibold">Integrations</h3>
          <ul className="mt-3 space-y-2 text-xs">
            {[
              { n: "Telegram Bot API", s: "Connected" },
              { n: "TMDB Metadata", s: "Connected" },
              { n: "Plex Sync", s: "Disconnected" },
              { n: "Webhook · Discord", s: "Connected" },
            ].map((i) => (
              <li key={i.n} className="flex items-center justify-between rounded-md border border-border bg-surface-2/40 px-3 py-2">
                <span className="font-medium">{i.n}</span>
                <span className={i.s === "Connected" ? "text-success" : "text-muted-foreground"}>● {i.s}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
