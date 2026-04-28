import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { users } from "@/lib/mock-data";

export default function Users() {
  return (
    <div>
      <PageHeader
        title="Users"
        subtitle={`${users.length} accounts • 2 admins • 2 curators`}
        actions={<Button size="sm" className="bg-gradient-primary text-primary-foreground">Invite user</Button>}
      />

      <div className="grid gap-4 p-5 lg:grid-cols-3">
        <div className="card-elevated rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Active (7d)</p>
          <p className="mt-1 text-2xl font-semibold">1,284</p>
          <p className="text-[11px] text-success">+12% w/w</p>
        </div>
        <div className="card-elevated rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Avg watch time</p>
          <p className="mt-1 text-2xl font-semibold">42<span className="text-base text-muted-foreground"> min/day</span></p>
          <p className="text-[11px] text-info">Stable</p>
        </div>
        <div className="card-elevated rounded-lg p-4">
          <p className="text-xs text-muted-foreground">Wishlist additions</p>
          <p className="mt-1 text-2xl font-semibold">3,902</p>
          <p className="text-[11px] text-success">+8% w/w</p>
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
              {users.map((u) => (
                <tr key={u.id} className="transition-smooth hover:bg-surface-2/50 [&>td]:px-3 [&>td]:py-2">
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 rounded-full bg-gradient-primary" />
                      <div>
                        <p className="font-medium">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">{u.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td><span className="rounded bg-surface-3 px-1.5 py-px text-[10px]">{u.role}</span></td>
                  <td className="text-muted-foreground">{u.joined}</td>
                  <td className="font-mono">{u.watched}</td>
                  <td className="font-mono">{u.requests}</td>
                  <td><StatusBadge status={u.status} /></td>
                  <td className="text-right">
                    <Button size="sm" variant="ghost" className="h-7 text-xs">Manage</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
