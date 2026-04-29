import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Play, Download, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { APP_NAME } from "@/lib/app-config";
import { MediaCard } from "../components/MediaCard";
import { publicMediaApi, type PublicMedia } from "../lib/media-api";

const heroBackdrops = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1920&h=1080&fit=crop",
];

const Particles = () => {
  const particles = Array.from({ length: 22 }).map((_, i) => ({
    size: 4 + (i % 5) * 2,
    top: `${(i * 13) % 100}%`,
    left: `${(i * 17) % 100}%`,
    delay: `${(i % 4) * 0.7}s`,
    duration: `${8 + (i % 5)}s`,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p, i) => (
        <span
          key={i}
          className="public-animate-particle-float absolute rounded-full bg-primary/60"
          style={{
            width: p.size,
            height: p.size,
            top: p.top,
            left: p.left,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

const HorizontalRail = ({ id, items }: { id: string; items: PublicMedia[] }) => {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: 1 | -1) => {
    ref.current?.scrollBy({ left: dir * 480, behavior: "smooth" });
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const interval = setInterval(() => {
      if (!el.matches(":hover")) {
        const max = el.scrollWidth - el.clientWidth;
        if (el.scrollLeft >= max - 10) el.scrollTo({ left: 0, behavior: "smooth" });
        else el.scrollBy({ left: 240, behavior: "smooth" });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold md:text-3xl">{id === "trending" ? "Trending This Week" : "Popular Series"}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => scroll(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:border-primary hover:bg-primary"
            aria-label="Previous"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border transition-all hover:border-primary hover:bg-primary"
            aria-label="Next"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <Link
            to={id === "trending" ? "/movies" : "/tv-series"}
            className="hidden items-center gap-1 px-3 py-2 text-sm text-primary hover:text-primary-glow sm:inline-flex"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <div ref={ref} className="public-scrollbar-hide flex snap-x gap-5 overflow-x-auto pb-4">
        {items.map((m) => (
          <div key={m.id} className="snap-start">
            <MediaCard movie={m} size="sm" />
          </div>
        ))}
      </div>
    </div>
  );
};

const Home = () => {
  const [movies, setMovies] = useState<PublicMedia[]>([]);
  const [series, setSeries] = useState<PublicMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      publicMediaApi.catalog("movie", 1, "", 18),
      publicMediaApi.catalog("tv", 1, "", 12),
    ])
      .then(([moviePayload, seriesPayload]) => {
        if (cancelled) {
          return;
        }
        setMovies(moviePayload.items);
        setSeries(seriesPayload.items);
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
  }, []);

  const heroBackdrops = [...movies, ...series].map((item) => item.backdrop).filter(Boolean);

  return (
    <>
      <section className="relative -mt-16 flex h-[92vh] items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="public-animate-hero-scroll flex h-full" style={{ width: "200%" }}>
            {[...(heroBackdrops.length ? heroBackdrops : [
              "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
              "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
              "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
            ]), ...(heroBackdrops.length ? heroBackdrops : [
              "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
              "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
              "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
            ])].map((src, i, arr) => (
              <div key={i} className="relative h-full flex-shrink-0" style={{ width: `${100 / arr.length}%` }}>
                <img
                  src={src}
                  alt=""
                  aria-hidden
                  className="public-animate-color-shift public-animate-zoom-in h-full w-full object-cover blur-[2px]"
                />
              </div>
            ))}
          </div>
        </div>

        <Particles />

        <div className="public-animate-bg-move absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background/60 to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/70 via-transparent to-background/70" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="public-animate-fade-up mx-auto max-w-4xl">
            <h1 className="public-text-shadow-hero text-5xl font-bold leading-tight md:text-7xl lg:text-[5.5rem]">
              <span className="inline-block">Stream.</span> <span className="inline-block text-primary">Download.</span>
              <br />
              <span className="inline-block">Enjoy {APP_NAME}.</span>
            </h1>
            <p className="public-text-shadow-hero mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-2xl">
              Browse the live catalog powering your Telegram media backend with streaming and download links generated in real time.
            </p>
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
              <Link to="/movies" className="public-hero-btn-primary px-8 py-4 text-lg">
                <Play className="h-5 w-5 fill-current" /> Explore Now
              </Link>
              <Link to="/tv-series" className="public-hero-btn-secondary px-8 py-4 text-lg">
                <Download className="h-5 w-5" /> Browse Series
              </Link>
            </div>
          </div>
        </div>

        <div className="public-bg-gradient-fade-bottom pointer-events-none absolute bottom-0 left-0 right-0 h-40" />
      </section>

      <section className="container mx-auto px-4 py-16">
        {loading ? (
          <div className="public-glass-card rounded-2xl py-16 text-center text-muted-foreground">Loading the latest movies...</div>
        ) : error ? (
          <div className="public-glass-card rounded-2xl py-16 text-center text-muted-foreground">Could not load movies: {error}</div>
        ) : (
          <HorizontalRail id="trending" items={movies.slice(0, 12)} />
        )}
      </section>

      <section className="container mx-auto px-4 pb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Featured Movies</h2>
          <Link to="/movies" className="flex items-center gap-1 text-sm text-primary hover:text-primary-glow">
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {movies.slice(0, 12).map((m) => (
            <MediaCard key={m.id} movie={m} />
          ))}
        </div>
      </section>

      <section className="container mx-auto px-4 pb-20">
        {series.length > 0 ? (
          <HorizontalRail id="series" items={series} />
        ) : (
          <div className="public-glass-card rounded-2xl py-16 text-center text-muted-foreground">No TV series are available yet.</div>
        )}
      </section>
    </>
  );
};

export default Home;
