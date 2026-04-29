import { useEffect, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Pause, Play, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from "lucide-react";
import { publicMediaApi, type PublicMedia } from "../lib/media-api";

const formatTime = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
};

const VideoPlayer = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const mediaId = searchParams.get("media");
  const mediaType = (searchParams.get("type") === "tv" ? "tv" : "movie") as "movie" | "tv";

  const ref = useRef<HTMLVideoElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [movie, setMovie] = useState<PublicMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    let cancelled = false;

    if (!mediaId) {
      setLoading(false);
      setError("Missing media reference.");
      return;
    }

    publicMediaApi
      .details(mediaType, mediaId)
      .then((payload) => {
        if (!cancelled) {
          setMovie(payload);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mediaId, mediaType]);

  useEffect(() => {
    let t: number | undefined;
    const reset = () => {
      setShowControls(true);
      window.clearTimeout(t);
      t = window.setTimeout(() => playing && setShowControls(false), 2500);
    };
    const el = wrapRef.current;
    el?.addEventListener("mousemove", reset);
    return () => {
      el?.removeEventListener("mousemove", reset);
      window.clearTimeout(t);
    };
  }, [playing]);

  const toggle = () => {
    const v = ref.current;
    if (!v) return;
    if (v.paused) v.play();
    else v.pause();
  };

  const seek = (delta: number) => {
    const v = ref.current;
    if (v) v.currentTime = Math.max(0, Math.min(v.duration || 0, v.currentTime + delta));
  };

  const goFullscreen = () => wrapRef.current?.requestFullscreen?.();

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-24 text-center text-muted-foreground">Loading video...</div>;
  }

  if (!movie || !id) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="mb-2 text-2xl font-bold">Video not available</h1>
        <p className="mb-4 text-sm text-muted-foreground">{error ?? "The selected file could not be resolved."}</p>
        <Link to="/movies" className="text-primary hover:underline">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <Link
        to={`/${movie.type === "series" ? "series" : "movie"}/${movie.id}`}
        className="mb-4 inline-flex items-center gap-2 text-sm text-primary hover:text-primary-glow"
      >
        <ArrowLeft className="h-4 w-4" /> Back to details
      </Link>

      <div
        ref={wrapRef}
        className="group relative aspect-video overflow-hidden rounded-2xl border border-border bg-black shadow-[var(--shadow-card)]"
      >
        <video
          ref={ref}
          className="h-full w-full"
          poster={movie.backdrop}
          src={`/api/watch/${id}`}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onTimeUpdate={(e) => setTime((e.target as HTMLVideoElement).currentTime)}
          onLoadedMetadata={(e) => setDuration((e.target as HTMLVideoElement).duration)}
          onClick={toggle}
        />

        {!playing && (
          <button
            onClick={toggle}
            className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
            aria-label="Play"
          >
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/90 text-primary-foreground shadow-[var(--shadow-glow)]">
              <Play className="h-8 w-8 fill-current" />
            </span>
          </button>
        )}

        <div
          className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 transition-opacity sm:p-4 ${
            showControls ? "opacity-100" : "opacity-0"
          }`}
        >
          <input
            type="range"
            min={0}
            max={duration || 0}
            step={0.1}
            value={time}
            onChange={(e) => {
              const v = ref.current;
              if (v) v.currentTime = Number(e.target.value);
            }}
            className="w-full cursor-pointer accent-primary"
            aria-label="Seek"
          />
          <div className="mt-2 flex items-center justify-between text-foreground">
            <div className="flex items-center gap-3">
              <button onClick={toggle} aria-label="Play/Pause" className="transition hover:text-primary">
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 fill-current" />}
              </button>
              <button onClick={() => seek(-10)} aria-label="Back 10s" className="transition hover:text-primary">
                <SkipBack className="h-5 w-5" />
              </button>
              <button onClick={() => seek(10)} aria-label="Forward 10s" className="transition hover:text-primary">
                <SkipForward className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  const v = ref.current;
                  if (!v) return;
                  v.muted = !v.muted;
                  setMuted(v.muted);
                }}
                aria-label="Mute"
                className="transition hover:text-primary"
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <span className="text-xs tabular-nums text-muted-foreground">
                {formatTime(time)} / {formatTime(duration)}
              </span>
            </div>
            <button onClick={goFullscreen} aria-label="Fullscreen" className="transition hover:text-primary">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h1 className="text-2xl font-bold">{movie.title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {movie.year ?? "Unknown"} - {movie.genres.join(", ")} - {movie.rating.toFixed(1)}
        </p>
        <p className="mt-4 max-w-3xl text-foreground/90">{movie.overview || "No synopsis is available for this title."}</p>
      </div>
    </div>
  );
};

export default VideoPlayer;
