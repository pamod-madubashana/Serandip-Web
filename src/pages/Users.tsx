import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { dashboardApi, type DashboardUsers } from "@/lib/dashboard-api";

export default function Users() {
  const [data, setData] = useState<DashboardUsers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadUsers = async () => {
      try {
        const payload = await dashboardApi.users();
        if (!cancelled) {
          setData(payload);
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setError("Could not load live dashboard users.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadUsers();
    const interval = window.setInterval(() => {
      void loadUsers();
    }, 30000);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const summary = data?.summary;
  const items = data?.items ?? [];

  const initials = (name: string) => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] ?? "U") + (parts[1]?.[0] ?? "");
  };

  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${summary?.users ?? 0} users • ${summary?.chats ?? 0} chats • ${summary?.bots ?? 0} bots connected`}
        actions={<Button size="sm" className="bg-gradient-primary text-primary-foreground">Invite user</Button>}
      />

      {error ? <div className="px-5 pt-4 text-sm text-destructive">{error}</div> : null}

      <div className="grid gap-4 p-5 lg:grid-cols-3">
        <div className="card-elevated rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Registered users</p>
          <p className="mt-1 text-2xl font-semibold">{loading ? "..." : summary?.users ?? 0}</p>
          <p className="text-[11px] text-muted-foreground">Current user records stored in MongoDB</p>
        </div>
        <div className="card-elevated rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Tracked chats</p>
          <p className="mt-1 text-2xl font-semibold">{loading ? "..." : summary?.chats ?? 0}</p>
          <p className="text-[11px] text-muted-foreground">Conversation records linked to the bot</p>
        </div>
        <div className="card-elevated rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Connected bots</p>
          <p className="mt-1 text-2xl font-semibold">{loading ? "..." : summary?.bots ?? 0}</p>
          <p className="text-[11px] text-muted-foreground">Live worker clients reported by the runtime</p>
        </div>
      </div>

      <div className="px-5 pb-8">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="bg-surface-2 text-muted-foreground">
              <tr className="text-left [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                <th>User</th><th>Role</th><th>Joined</th><th>Watched</th><th>Requests</th><th>Status</th><th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {items.map((u) => (
                <tr key={u.id} className="transition-smooth hover:bg-surface-2/50 [&>td]:px-3 [&>td]:py-2">
                  <td>
                    <div className="flex items-center gap-2">
                      {u.avatar_url ? (
                        <img
                          src={u.avatar_url}
                          alt={u.name}
                          className="h-7 w-7 rounded-full bg-surface-3 object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-primary text-[10px] font-semibold text-primary-foreground">
                          {initials(u.name)}
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{u.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="rounded bg-surface-3 px-1.5 py-px text-[10px]">{u.role}</span></td>
                  <td className="text-muted-foreground">{u.joined || "-"}</td>
                  <td className="font-mono">{u.watched}</td>
                  <td className="font-mono">{u.requests}</td>
                  <td><StatusBadge status={u.status} /></td>
                  <td className="text-right">
                    <Button size="sm" variant="ghost" className="h-7 text-xs">Manage</Button>
                  </td>
                </tr>
              ))}
              {!loading && items.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-muted-foreground">No live user records or bot sessions are available yet.</td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
