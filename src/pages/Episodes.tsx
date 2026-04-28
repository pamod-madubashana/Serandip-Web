import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { series } from "@/lib/mock-data";

export default function Episodes() {
  const all = series.flatMap((s) =>
    s.seasons.flatMap((se) => se.episodes.map((ep) => ({ ...ep, series: s.title, season: se.number, poster: s.poster }))),
  );

  return (
    <div>
      <PageHeader
        title="Seasons & Episodes"
        subtitle={`${all.length} episodes across ${series.length} series`}
      />
      <div className="px-5 py-4">
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-xs">
            <thead className="bg-surface-2 text-muted-foreground">
              <tr className="text-left [&>th]:px-3 [&>th]:py-2 [&>th]:font-medium">
                <th>Series</th><th>S/E</th><th>Title</th><th>Runtime</th>
                <th>Variants</th><th>Status</th><th className="text-right">Air date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {all.slice(0, 50).map((ep) => (
                <tr key={ep.id} className="transition-smooth hover:bg-surface-2/50 [&>td]:px-3 [&>td]:py-2">
                  <td>
                    <div className="flex items-center gap-2">
                      <img src={ep.poster} alt="" className="h-8 w-6 rounded object-cover border border-border" />
                      <span className="truncate font-medium">{ep.series}</span>
                    </div>
                  </td>
                  <td className="font-mono">S{ep.season}·E{String(ep.number).padStart(2, "0")}</td>
                  <td className="truncate">{ep.title}</td>
                  <td className="text-muted-foreground">{ep.runtime}m</td>
                  <td><span className="rounded bg-surface-3 px-1.5 py-px font-mono">{ep.variants}</span></td>
                  <td><StatusBadge status={ep.status} /></td>
                  <td className="text-right text-muted-foreground">{ep.air}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
