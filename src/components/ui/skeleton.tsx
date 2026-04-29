import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("relative isolate overflow-hidden rounded-md bg-muted/70", className)}
      {...props}
    >
      <div className="absolute inset-0 bg-[linear-gradient(110deg,transparent_20%,hsl(var(--foreground)/0.06)_38%,hsl(var(--foreground)/0.14)_50%,hsl(var(--foreground)/0.06)_62%,transparent_80%)] bg-[length:200%_100%] animate-shimmer" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,hsl(var(--background)/0.06),transparent_55%,hsl(var(--background)/0.08))]" />
    </div>
  );
}

export { Skeleton };
