import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Star, Download, Play } from "lucide-react";
import { getMedia } from "../data/movies";

const FILES = [
  { resolution: "2160p (4K HDR)", quality: "BluRay", codec: "HEVC", size: 18.4, parts: 1 },
  { resolution: "1080p", quality: "WEB-DL", codec: "H.264", size: 4.2, parts: 1 },
  { resolution: "720p", quality: "WEB-DL", codec: "H.264", size: 1.8, parts: 1 },
];

const MovieDetails = () => {
  const { id } = useParams();
  const movie = id ? getMedia(id) : undefined;

  if (!movie) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="mb-2 text-2xl font-bold">Title not found</h1>
        <Link to="/movies" className="text-primary hover:underline">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Link
        to={movie.type === "series" ? "/tv-series" : "/movies"}
        className="mb-6 inline-flex items-center gap-2 text-sm text-primary hover:text-primary-glow"
      >
        <ArrowLeft className="h-4 w-4" /> Back to {movie.type === "series" ? "Series" : "Movies"}
      </Link>

      <div className="mb-8 overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)]">
        <div className="relative h-72 sm:h-96">
          <img src={movie.backdrop} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-8">
            <div className="flex items-end gap-4 sm:gap-6">
              <img
                src={movie.poster}
                alt={movie.title}
                className="aspect-[2/3] w-28 rounded-xl border-2 border-foreground/20 object-cover shadow-2xl sm:w-40"
              />
              <div className="flex-1 pb-2">
                <h1 className="mb-2 text-2xl font-bold sm:text-4xl">{movie.title}</h1>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded bg-yellow-500 px-2 py-0.5 text-xs font-bold text-black sm:text-sm">
                    <Star className="h-3 w-3 fill-current" /> {movie.rating.toFixed(1)}
                  </span>
                  <span className="rounded bg-foreground/15 px-2 py-0.5 text-xs sm:text-sm">{movie.year}</span>
                  <span className="rounded border border-primary/40 bg-primary/25 px-2 py-0.5 text-xs font-semibold uppercase sm:text-sm">
                    {movie.type === "series" ? "Series" : "Movie"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span key={g} className="rounded-full bg-foreground/10 px-2 py-0.5 text-xs text-foreground">
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <div className="public-glass-card rounded-2xl p-6 lg:col-span-2">
          <h2 className="mb-3 text-lg font-semibold">Synopsis</h2>
          <p className="leading-relaxed text-muted-foreground">{movie.overview}</p>
        </div>
        <div className="public-glass-card rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold">Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Year</dt><dd>{movie.year}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Rating</dt><dd>{movie.rating.toFixed(1)} / 10</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Type</dt><dd className="capitalize">{movie.type}</dd></div>
            <div className="flex justify-between gap-3"><dt className="text-muted-foreground">Genres</dt><dd className="text-right">{movie.genres.join(", ")}</dd></div>
          </dl>
        </div>
      </div>

      <div className="public-glass-card rounded-2xl p-4 sm:p-6">
        <h2 className="mb-5 text-xl font-semibold">Available Files</h2>
        <div className="space-y-5">
          {FILES.map((f, idx) => (
            <div key={f.resolution} className="overflow-hidden rounded-xl border border-border">
              <div className="flex items-center justify-between bg-secondary/60 px-4 py-2">
                <h3 className="font-medium">{f.resolution}</h3>
                <span className="text-xs text-muted-foreground">{f.parts} part(s)</span>
              </div>
              <div className="grid items-center gap-4 p-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <p className="mb-2 text-sm font-medium">{movie.title} ({movie.year}) {f.resolution.split(" ")[0]} {f.quality} {f.codec}</p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="rounded border border-primary/30 bg-primary/15 px-2 py-0.5 text-xs text-primary">{f.quality}</span>
                    <span className="rounded border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-xs text-emerald-400">{f.codec}</span>
                    <span className="rounded bg-foreground/10 px-2 py-0.5 text-xs">{f.size.toFixed(2)} GB</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link
                    to={`/watch/${movie.id}-${idx}`}
                    className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary-glow"
                  >
                    <Play className="h-4 w-4 fill-current" /> Watch
                  </Link>
                  <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-emerald-500">
                    <Download className="h-4 w-4" /> Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
