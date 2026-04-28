import { Calendar, Clock, Download, Film, Globe, HardDrive, Pencil, Play, Plus, Server, Star, Tag, Trash2, Users } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import type { DashboardMovie } from "@/lib/dashboard-api";

interface MovieDetailDrawerProps {
  movie: DashboardMovie | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MovieDetailDrawer({ movie, open, onOpenChange }: MovieDetailDrawerProps) {
  if (!movie) return null;

  const totalSize = movie.variants.reduce((acc, v) => acc + parseFloat(v.size), 0).toFixed(1);
  const totalSources = movie.variants.reduce((acc, v) => acc + v.sources, 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto border-l border-border bg-surface-1 p-0 sm:max-w-xl"
      >
        {/* Hero */}
        <div className="relative h-44 w-full overflow-hidden">
          <img src={movie.poster} alt="" className="h-full w-full object-cover blur-xl scale-110 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-surface-1/60 to-surface-1" />
          <div className="absolute inset-0 flex items-end gap-3 p-4">
            <img
              src={movie.poster}
              alt={movie.title}
              className="h-32 w-[88px] rounded-md border border-border object-cover shadow-2xl"
            />
            <div className="min-w-0 flex-1 pb-1">
              <div className="mb-1.5 flex items-center gap-2">
                <StatusBadge status={movie.status} />
                <span className="flex items-center gap-1 rounded bg-black/40 px-1.5 py-0.5 text-[10px] font-medium text-white">
                  <Star className="h-2.5 w-2.5 fill-warning text-warning" />
                  {movie.rating}
                </span>
              </div>
              <SheetHeader className="space-y-0 text-left">
                <SheetTitle className="truncate text-lg font-semibold text-foreground">
                  {movie.title}
                </SheetTitle>
              </SheetHeader>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {movie.year} • {movie.runtime}m • {movie.language} • {movie.genre.join(", ")}
              </p>
            </div>
          </div>
        </div>

        {/* Action bar */}
        <div className="flex items-center gap-1.5 border-b border-border bg-surface-2/40 px-4 py-2.5">
          <Button size="sm" className="h-7 gap-1.5 bg-gradient-primary text-primary-foreground">
            <Play className="h-3 w-3" /> Preview
          </Button>
          <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs">
            <Pencil className="h-3 w-3" /> Edit
          </Button>
          <Button size="sm" variant="outline" className="h-7 gap-1.5 text-xs">
            <Plus className="h-3 w-3" /> Variant
          </Button>
          <div className="ml-auto">
            <Button size="sm" variant="ghost" className="h-7 gap-1.5 text-xs text-destructive hover:text-destructive">
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-px bg-border">
          {[
            { icon: Download, label: "Downloads", value: movie.downloads.toLocaleString() },
            { icon: HardDrive, label: "Total size", value: `${totalSize} GB` },
            { icon: Server, label: "Sources", value: totalSources.toString() },
            { icon: Film, label: "Variants", value: movie.variants.length.toString() },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="bg-surface-1 p-3">
              <Icon className="mb-1 h-3 w-3 text-muted-foreground" />
              <p className="font-mono text-sm font-semibold text-foreground">{value}</p>
              <p className="text-[10px] text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="px-4 pb-6 pt-4">
          <TabsList className="h-8 w-full justify-start gap-1 bg-surface-2/60 p-0.5">
            <TabsTrigger value="overview" className="h-7 px-3 text-xs">Overview</TabsTrigger>
            <TabsTrigger value="variants" className="h-7 px-3 text-xs">Variants</TabsTrigger>
            <TabsTrigger value="sources" className="h-7 px-3 text-xs">Sources</TabsTrigger>
            <TabsTrigger value="activity" className="h-7 px-3 text-xs">Activity</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-4 space-y-4">
            <section>
              <h3 className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">Synopsis</h3>
              <p className="text-xs leading-relaxed text-foreground/90">
                A taut, atmospheric story set against a fractured horizon — {movie.title} weaves
                {" "}{movie.genre.join(" and ").toLowerCase()} into a memorable {movie.runtime}-minute
                arc. Released in {movie.year}, it has built a steady cult following among
                {" "}{movie.language}-speaking audiences.
              </p>
            </section>

            <Separator />

            <section className="grid grid-cols-2 gap-3 text-xs">
              {[
                { icon: Tag, label: "ID", value: movie.id },
                { icon: Calendar, label: "Added", value: movie.added },
                { icon: Clock, label: "Runtime", value: `${movie.runtime} min` },
                { icon: Globe, label: "Language", value: movie.language },
                { icon: Star, label: "Rating", value: movie.rating.toFixed(1) },
                { icon: Users, label: "Genre", value: movie.genre.join(", ") },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 rounded-md border border-border bg-surface-2/40 px-2.5 py-2">
                  <Icon className="h-3 w-3 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
                    <p className="truncate font-mono text-xs text-foreground">{value}</p>
                  </div>
                </div>
              ))}
            </section>
          </TabsContent>

          <TabsContent value="variants" className="mt-4">
            <div className="overflow-hidden rounded-md border border-border">
              <table className="w-full text-xs">
                <thead className="bg-surface-2 text-muted-foreground">
                  <tr className="text-left [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                    <th>Quality</th><th>Size</th><th>Sources</th><th className="text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {movie.variants.map((v) => (
                    <tr key={v.quality} className="[&>td]:px-3 [&>td]:py-2 hover:bg-surface-2/50">
                      <td><span className="rounded bg-surface-3 px-1.5 py-px font-mono text-[10px]">{v.quality}</span></td>
                      <td className="font-mono text-muted-foreground">{v.size}</td>
                      <td className="font-mono">{v.sources}</td>
                      <td className="text-right"><StatusBadge status="Published" /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="sources" className="mt-4 space-y-2">
            {(movie.sources ?? []).flatMap((resolution) =>
              resolution.files.map((file) => (
                <div key={`${resolution.resolution}-${file.id}`} className="flex items-center justify-between rounded-md border border-border bg-surface-2/40 p-2.5">
                  <div className="flex items-center gap-2">
                    <Server className="h-3.5 w-3.5 text-muted-foreground" />
                    <div>
                      <p className="text-xs font-medium">{resolution.resolution} • {file.display_name}</p>
                      <p className="font-mono text-[10px] text-muted-foreground">{file.file_data[0]?.chat_id ?? "n/a"}:{file.file_data[0]?.message_id ?? "n/a"}</p>
                    </div>
                  </div>
                  <span className="rounded bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">{file.source_count} source{file.source_count === 1 ? "" : "s"}</span>
                </div>
              )),
            )}
            {(!movie.sources || movie.sources.length === 0) && (
              <div className="rounded-md border border-border bg-surface-2/40 p-3 text-xs text-muted-foreground">No source data available.</div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-4 space-y-2">
            {[
              { who: "@aria", what: "published 2160p variant", when: "2h ago" },
              { who: "@kenji", what: "added new source", when: "1d ago" },
              { who: "system", what: "validated all sources", when: "3d ago" },
              { who: "@mira", what: "updated metadata", when: "5d ago" },
            ].map((a, i) => (
              <div key={i} className="flex items-center gap-2 rounded-md border border-border bg-surface-2/40 px-2.5 py-2 text-xs">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="font-mono text-muted-foreground">{a.who}</span>
                <span className="text-foreground/90">{a.what}</span>
                <span className="ml-auto text-[10px] text-muted-foreground">{a.when}</span>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
