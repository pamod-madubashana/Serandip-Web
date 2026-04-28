import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, delta, icon: Icon, accent,
}: {
  label: string; value: string | number; delta?: number;
  icon: LucideIcon; accent?: "primary" | "info" | "success" | "warning";
}) {
  const positive = (delta ?? 0) >= 0;
  const dot = {
    primary: "bg-primary", info: "bg-info", success: "bg-success", warning: "bg-warning",
  }[accent || "primary"];

  return (
    <div className="card-elevated relative overflow-hidden rounded-lg p-4 transition-smooth hover:shadow-elegant">
      <div className="absolute inset-0 opacity-60" style={{ background: "var(--gradient-glow)" }} />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
            <span className={cn("h-1.5 w-1.5 rounded-full", dot)} />
            {label}
          </div>
          <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
          {delta !== undefined && (
            <div className={cn(
              "mt-1 inline-flex items-center gap-0.5 text-xs",
              positive ? "text-success" : "text-danger",
            )}>
              {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
              {Math.abs(delta)}% vs last week
            </div>
          )}
        </div>
        <div className="rounded-md border border-border bg-surface-2 p-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}
