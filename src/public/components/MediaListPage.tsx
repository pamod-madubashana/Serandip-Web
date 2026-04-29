import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { MediaCard } from "./MediaCard";
import { publicMediaApi, type PublicCatalogResponse, type PublicMediaType } from "../lib/media-api";

const PAGE_SIZE = 12;

export const MediaListPage = ({
  title,
  subtitle,
  mediaType,
}: {
  title: string;
  subtitle: string;
  mediaType: PublicMediaType;
}) => {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<PublicCatalogResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    publicMediaApi
      .catalog(mediaType, page, query, PAGE_SIZE)
      .then((payload) => {
        if (!cancelled) {
          setData(payload);
        }
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setError(err.message);
          setData(null);
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
  }, [mediaType, page, query]);

  const items = data?.items ?? [];
  const totalPages = Math.max(1, data?.total_pages ?? 1);
  const currentPage = Math.min(page, totalPages);
  const totalItems = data?.total_count ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      </div>

      <div className="public-glass-card mb-10 rounded-2xl p-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder={`Search ${title.toLowerCase()} by title...`}
            className="w-full rounded-xl border border-border bg-secondary/40 py-3 pl-11 pr-11 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:bg-secondary"
              aria-label="Clear"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="public-glass-card rounded-2xl py-20 text-center">
          <h3 className="mb-2 text-lg font-semibold">Loading titles...</h3>
          <p className="text-sm text-muted-foreground">Fetching the latest catalog from the server.</p>
        </div>
      ) : error ? (
        <div className="public-glass-card rounded-2xl py-20 text-center">
          <h3 className="mb-2 text-lg font-semibold">Could not load the catalog</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="public-glass-card rounded-2xl py-20 text-center">
          <h3 className="mb-2 text-lg font-semibold">Nothing found</h3>
          <p className="text-sm text-muted-foreground">No titles match "{query}".</p>
        </div>
      ) : (
        <>
          <div className="mb-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {items.map((m) => (
              <MediaCard key={m.id} movie={m} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              {Array.from({ length: totalPages }).map((_, i) => {
                const n = i + 1;
                const active = n === currentPage;
                return (
                  <button
                    key={n}
                    onClick={() => setPage(n)}
                    className={`min-w-[2.5rem] rounded-lg px-3 py-2 text-sm transition ${
                      active
                        ? "border border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
                        : "border border-border hover:bg-secondary/60"
                    }`}
                  >
                    {n}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm transition hover:bg-secondary/60 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Showing {totalItems === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, totalItems)} of {totalItems}
          </p>
        </>
      )}
    </div>
  );
};
