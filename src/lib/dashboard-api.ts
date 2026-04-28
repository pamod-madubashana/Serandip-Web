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
  title: string;
  year: number | null;
  network: string;
  poster: string;
  status: string;
  genre: string[];
  seasons: {
    id: string;
    number: number;
    episodes: {
      id: string;
      number: number;
      title: string;
      runtime: number;
      variants: number;
      status: string;
      air: string;
    }[];
  }[];
  episode_count: number;
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
  sources: { name: string; used: number; files: number; workload: number; status: string }[];
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

async function api<T>(path: string): Promise<T> {
  const response = await fetch(path, { credentials: "include" });
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export const dashboardApi = {
  overview: () => api<DashboardOverview>("/api/dashboard/overview"),
  movies: (search = "") => api<{ movies: DashboardMovie[]; total: number }>(`/api/dashboard/movies${search ? `?search=${encodeURIComponent(search)}` : ""}`),
  movie: (id: string) => api<DashboardMovie>(`/api/dashboard/movies/${id}`),
  series: () => api<{ series: DashboardSeries[]; total: number }>("/api/dashboard/series"),
  users: () => api<DashboardUsers>("/api/dashboard/users"),
  requests: () => api<DashboardRequests>("/api/dashboard/requests"),
};
