export type DashboardMovie = {
  id: string;
  title: string;
  year: number | null;
  genre: string[];
  language: string;
  runtime: number;
  rating: number;
  status: string;
  poster: string;
  backdrop?: string;
  variants: { quality: string; size: string; size_mb: number; sources: number }[];
  added: string;
  downloads: number;
  normalized_title?: string;
  sources?: {
    resolution: string;
    files: {
      id: number;
      display_name: string;
      quality: string | null;
      codec: string | null;
      size: string;
      source_count: number;
      file_data: { chat_id: number | null; message_id: number | null; filename: string | null }[];
    }[];
  }[];
};

export type DashboardSeries = {
  id: string;
  tmdb_id?: string;
  title: string;
  normalized_title?: string;
  year: number | null;
  network: string;
  poster: string;
  backdrop?: string;
  status: string;
  genre: string[];
  rating?: number;
  first_air_date?: string;
  last_air_date?: string;
  added?: string;
  seasons: {
    id: string;
    number: number;
    episode_total?: number;
    episodes: {
      id: string;
      number: number;
      title: string;
      runtime: number;
      variants: number;
      source_count?: number;
      status: string;
      air: string;
      files?: {
        id: string;
        display_name: string;
        quality: string | null;
        codec: string | null;
        empty: boolean;
        size: string;
        size_mb: number;
        source_count: number;
        file_data: {
          chat_id: number | null;
          message_id: number | null;
          filename: string | null;
          unique_id: string | null;
        }[];
      }[];
    }[];
  }[];
  episode_count: number;
  total_seasons?: number;
  total_episodes?: number;
  total_variants?: number;
  total_sources?: number;
};

export type DashboardOverview = {
  counts: {
    movies: number;
    series: number;
    episodes: number;
    requests: number;
    users: number;
    chats: number;
    files: number;
  };
  storage: {
    database?: string;
    storage_size: number;
    storage_size_label: string;
    data_size: number;
    data_size_label: string;
  };
  recent_movies: DashboardMovie[];
  quality_distribution: { name: string; files: number }[];
  release_distribution: { label: string; count: number }[];
  sources: { name: string; used: number; files?: number | null; workload: number; status: string }[];
  activity: { who: string; what: string; target: string; when: string }[];
};

export type DashboardUsers = {
  summary: { users: number; chats: number; bots: number };
  items: {
    id: number | string;
    name: string;
    handle: string;
    role: string;
    joined: string;
    watched: number;
    requests: number;
    status: string;
    profile_picture?: string;
    avatar_url?: string;
  }[];
};

export type DashboardRequests = {
  items: {
    id: string;
    title: string;
    type: string;
    votes: number;
    status: string;
    requester: string;
    date: string;
  }[];
  total: number;
};

export type DashboardLeechResponse = {
  queued: boolean;
  request_id: string;
  title: string;
  source: string;
  status_chat: number;
  match?: {
    title: string;
    year: string | null;
    archive_url: string;
    torrent_url: string;
  };
};

async function api<T>(path: string): Promise<T> {
  const response = await fetch(path, {
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    credentials: "include",
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    let detail = `Request failed: ${response.status}`;
    try {
      const payload = await response.json() as { detail?: string };
      if (payload?.detail) detail = payload.detail;
    } catch {
      // ignore json parse failure
    }
    throw new Error(detail);
  }
  return response.json() as Promise<T>;
}

export const dashboardApi = {
  overview: () => api<DashboardOverview>("/api/dashboard/overview"),
  movies: (search = "") => api<{ movies: DashboardMovie[]; total: number }>(`/api/dashboard/movies${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  movie: (id: string) => api<DashboardMovie>(`/api/dashboard/movies/${id}`),
  series: (search = "") => api<{ series: DashboardSeries[]; total: number }>(`/api/dashboard/series${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  seriesDetails: (id: string) => api<DashboardSeries>(`/api/dashboard/series/${id}`),
  users: () => api<DashboardUsers>("/api/dashboard/users"),
  requests: () => api<DashboardRequests>("/api/dashboard/requests"),
  requestSearchLeech: (id: string) => apiPost<DashboardLeechResponse>(`/api/dashboard/requests/${id}/search-leech`),
  requestManualLeech: (id: string, source: string, name?: string) => apiPost<DashboardLeechResponse>(`/api/dashboard/requests/${id}/manual-leech`, { source, name }),
};
