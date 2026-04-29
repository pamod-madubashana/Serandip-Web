export type PublicMediaFile = {
  id: string;
  resolution: string;
  quality: string | null;
  codec: string | null;
  size: string;
  source_count: number;
  watch_url: string;
  download_url: string;
};

export type PublicEpisode = {
  id: string;
  number: number;
  title: string;
  runtime: number;
  variants: number;
  status: string;
  air: string;
};

export type PublicSeason = {
  id: string;
  number: number;
  episodes: PublicEpisode[];
};

export type PublicMedia = {
  id: string;
  title: string;
  year: number | null;
  rating: number;
  genres: string[];
  type: "movie" | "series";
  poster: string;
  backdrop: string;
  overview: string;
  network?: string;
  status: string;
  seasons?: PublicSeason[];
  episode_count?: number;
  files: PublicMediaFile[];
};

export type PublicCatalogResponse = {
  items: PublicMedia[];
  total_count: number;
  current_page: number;
  total_pages: number;
};

export type PublicMediaType = "movie" | "tv";

async function api<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const publicMediaApi = {
  catalog: (mediaType: PublicMediaType, page = 1, search = "", pageSize = 12) =>
    api<PublicCatalogResponse>(
      `/api/public/catalog?media_type=${mediaType}&page=${page}&page_size=${pageSize}&search=${encodeURIComponent(search)}`,
    ),
  details: (mediaType: PublicMediaType, mediaId: string) =>
    api<PublicMedia>(`/api/public/media/${mediaType}/${mediaId}`),
};
