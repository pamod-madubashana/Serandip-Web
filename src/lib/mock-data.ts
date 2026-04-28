// Polished mock data for the admin dashboard

export type Movie = {
  id: string;
  title: string;
  year: number;
  genre: string[];
  language: string;
  runtime: number;
  rating: number;
  status: "Published" | "Draft" | "Review";
  poster: string;
  backdrop?: string;
  variants: { quality: string; size: string; sources: number }[];
  added: string;
  downloads: number;
};

export type Episode = {
  id: string;
  number: number;
  title: string;
  runtime: number;
  variants: number;
  status: "Published" | "Missing" | "Review";
  air: string;
};

export type Season = {
  id: string;
  number: number;
  episodes: Episode[];
};

export type Series = {
  id: string;
  title: string;
  year: number;
  network: string;
  poster: string;
  status: "Ongoing" | "Ended" | "Upcoming";
  genre: string[];
  seasons: Season[];
};

const POSTERS = [
  "https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
  "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
  "https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
  "https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
  "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONONX.jpg",
  "https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg",
  "https://image.tmdb.org/t/p/w500/yOm993lsJyPmBodlYjgpPwBjXP9.jpg",
  "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
  "https://image.tmdb.org/t/p/w500/4woSOUD0equAYzvwhWBHIJDCM88.jpg",
  "https://image.tmdb.org/t/p/w500/3E53WEZJqP6aM84D8CckXx4pIHw.jpg",
  "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
  "https://image.tmdb.org/t/p/w500/A7EByudX0eOzlkQ2FIbogzyazm2.jpg",
];

const titles = [
  "Neon Horizon", "Crimson Echo", "The Silent Code", "Solaris Drift",
  "Velvet Shadows", "Iron Continuum", "Midnight Atlas", "Echoes of Tomorrow",
  "The Hollow Crown", "Aether Bound", "Fractured Skies", "Phantom Signal",
];

const genresPool = [
  ["Sci-Fi", "Thriller"], ["Drama"], ["Action", "Adventure"], ["Mystery", "Crime"],
  ["Sci-Fi", "Drama"], ["Fantasy", "Adventure"], ["Thriller"], ["Drama", "Romance"],
  ["Crime", "Drama"], ["Sci-Fi"], ["Action"], ["Mystery"],
];

export const movies: Movie[] = titles.map((t, i) => ({
  id: `mov_${i + 1}`,
  title: t,
  year: 2018 + (i % 7),
  genre: genresPool[i % genresPool.length],
  language: ["English", "Japanese", "Spanish", "French", "Korean"][i % 5],
  runtime: 92 + (i * 7) % 60,
  rating: Math.round((6.4 + (i % 7) * 0.4) * 10) / 10,
  status: (["Published", "Published", "Review", "Draft", "Published"] as const)[i % 5],
  poster: POSTERS[i % POSTERS.length],
  variants: [
    { quality: "2160p", size: "18.4 GB", sources: 2 },
    { quality: "1080p", size: "4.8 GB", sources: 5 },
    { quality: "720p", size: "1.9 GB", sources: 3 },
  ].slice(0, (i % 3) + 1),
  added: `2025-0${(i % 9) + 1}-${10 + (i % 18)}`,
  downloads: 1240 + i * 873,
}));

export const series: Series[] = [
  "Stellar Frontier", "Hollow Bay", "Northbound", "The Cipher Files",
  "Ashes & Ivory", "Quantum Lane", "Pale Horizon", "Reverie",
].map((t, i) => ({
  id: `ser_${i + 1}`,
  title: t,
  year: 2020 + (i % 5),
  network: ["Netflix", "HBO", "Apple TV+", "Prime Video", "Hulu"][i % 5],
  poster: POSTERS[(i + 3) % POSTERS.length],
  status: (["Ongoing", "Ongoing", "Ended", "Upcoming"] as const)[i % 4],
  genre: genresPool[(i + 2) % genresPool.length],
  seasons: Array.from({ length: 2 + (i % 3) }, (_, s) => ({
    id: `ser_${i + 1}_s${s + 1}`,
    number: s + 1,
    episodes: Array.from({ length: 6 + (s % 4) }, (_, e) => ({
      id: `ser_${i + 1}_s${s + 1}_e${e + 1}`,
      number: e + 1,
      title: ["Pilot", "The Reckoning", "Cold Light", "Embers", "After Hours", "Fallout", "Drift", "Outliers", "Echo Chamber", "Sundown"][e % 10],
      runtime: 38 + (e * 3) % 22,
      variants: 1 + ((e + s) % 4),
      status: (["Published", "Published", "Review", "Missing", "Published"] as const)[e % 5],
      air: `2024-${String((e % 12) + 1).padStart(2, "0")}-${10 + e}`,
    })),
  })),
}));

export const requests = [
  { id: "req_1", title: "Dune: Part Three", type: "Movie", votes: 412, status: "Pending", requester: "@aria", date: "2025-04-12" },
  { id: "req_2", title: "Severance S03", type: "Series", votes: 289, status: "In Progress", requester: "@kenji", date: "2025-04-10" },
  { id: "req_3", title: "Oppenheimer (IMAX)", type: "Movie", votes: 178, status: "Fulfilled", requester: "@nora", date: "2025-04-08" },
  { id: "req_4", title: "The Bear S04", type: "Series", votes: 156, status: "Pending", requester: "@leo", date: "2025-04-05" },
  { id: "req_5", title: "Foundation S03", type: "Series", votes: 132, status: "Pending", requester: "@mira", date: "2025-04-04" },
  { id: "req_6", title: "Andor S02 4K", type: "Series", votes: 98, status: "In Progress", requester: "@ravi", date: "2025-04-02" },
  { id: "req_7", title: "Blade Runner 2099", type: "Series", votes: 76, status: "Rejected", requester: "@sky", date: "2025-04-01" },
];

export const users = [
  { id: "u1", name: "Aria Vance", handle: "@aria", role: "Admin", joined: "2024-08-12", watched: 412, requests: 18, status: "Active" },
  { id: "u2", name: "Kenji Sato", handle: "@kenji", role: "Curator", joined: "2024-09-02", watched: 287, requests: 9, status: "Active" },
  { id: "u3", name: "Nora Levin", handle: "@nora", role: "Member", joined: "2024-10-19", watched: 198, requests: 4, status: "Active" },
  { id: "u4", name: "Leo Marín", handle: "@leo", role: "Member", joined: "2024-11-01", watched: 156, requests: 12, status: "Suspended" },
  { id: "u5", name: "Mira Okafor", handle: "@mira", role: "Curator", joined: "2024-11-22", watched: 312, requests: 7, status: "Active" },
  { id: "u6", name: "Ravi Shah", handle: "@ravi", role: "Member", joined: "2025-01-14", watched: 89, requests: 3, status: "Active" },
];

export const trend = Array.from({ length: 14 }, (_, i) => ({
  day: `D${i + 1}`,
  watches: 320 + Math.round(Math.sin(i / 1.7) * 80) + i * 18,
  downloads: 180 + Math.round(Math.cos(i / 2) * 60) + i * 9,
}));

export const sources = [
  { name: "Telegram • Vault A", used: 78, total: 100, files: 1284 },
  { name: "Telegram • Vault B", used: 54, total: 100, files: 940 },
  { name: "Telegram • Archive", used: 31, total: 100, files: 612 },
  { name: "Mirror • EU-1", used: 88, total: 100, files: 2104 },
];

export const activity = [
  { who: "@aria", what: "published", target: "Neon Horizon (2160p)", when: "2m ago" },
  { who: "@mira", what: "added source to", target: "Stellar Frontier S02E04", when: "9m ago" },
  { who: "@kenji", what: "approved request", target: "Severance S03", when: "23m ago" },
  { who: "@nora", what: "flagged", target: "The Hollow Crown — bad audio", when: "41m ago" },
  { who: "@ravi", what: "uploaded", target: "Phantom Signal • 1080p", when: "1h ago" },
  { who: "system", what: "validated", target: "12 sources across Vault A", when: "2h ago" },
];
