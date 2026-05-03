import { cn } from "@/lib/utils";

const styles: Record<string, string> = {
  Published: "bg-success/15 text-success border-success/30",
  Active: "bg-success/15 text-success border-success/30",
  Ongoing: "bg-success/15 text-success border-success/30",
  Fulfilled: "bg-success/15 text-success border-success/30",
  Draft: "bg-muted text-muted-foreground border-border",
  Upcoming: "bg-info/15 text-info border-info/30",
  Review: "bg-warning/15 text-warning border-warning/30",
  Pending: "bg-warning/15 text-warning border-warning/30",
  "In Progress": "bg-info/15 text-info border-info/30",
  Missing: "bg-danger/15 text-danger border-danger/30",
  Empty: "bg-danger/12 text-danger border-danger/25",
  Suspended: "bg-danger/15 text-danger border-danger/30",
  Rejected: "bg-danger/15 text-danger border-danger/30",
  Ended: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider",
      styles[status] || "bg-muted text-muted-foreground border-border",
      className,
    )}>
      <span className="h-1 w-1 rounded-full bg-current" />
      {status}
    </span>
  );
}
