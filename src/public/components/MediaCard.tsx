import { Link } from "react-router-dom";
import { Star } from "lucide-react";
import type { Movie } from "../data/movies";

export const MediaCard = ({ movie, size = "md" }: { movie: Movie; size?: "sm" | "md" }) => {
  const widthCls = size === "sm" ? "w-40 sm:w-44" : "w-full";

  return (
    <Link to={`/${movie.type === "series" ? "series" : "movie"}/${movie.id}`} className={`group block ${widthCls} flex-shrink-0`}>
      <div className="relative overflow-hidden rounded-xl bg-secondary/40 shadow-[var(--shadow-card)]">
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://placehold.co/300x450/0a0a0a/3B82F6?text=No+Image";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 transition-opacity group-hover:opacity-100" />
          <span className={`public-media-tag ${movie.type === "series" ? "series" : ""}`}>
            {movie.type === "series" ? "Series" : "Movie"}
          </span>
          <span className="public-rating-badge">
            <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
            {movie.rating.toFixed(1)}
          </span>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-1 font-semibold transition-colors group-hover:text-primary">{movie.title}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{movie.year}</p>
        </div>
      </div>
    </Link>
  );
};
