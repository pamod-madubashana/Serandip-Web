export type Movie = {
  id: string;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  type: "movie" | "series";
  poster: string;
  backdrop: string;
  overview: string;
};

const posters = [
  "https://image.tmdb.org/t/p/w500/qNBAXBIQlnOThrVvA6mA2B5ggV6.jpg",
  "https://image.tmdb.org/t/p/w500/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
  "https://image.tmdb.org/t/p/w500/q719jXXEzOoYaps6babgKnONNsH.jpg",
  "https://image.tmdb.org/t/p/w500/1E5baAaEse26fej7uHcjOgEE2t2.jpg",
  "https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7Jz20NpMygczOkv.jpg",
  "https://image.tmdb.org/t/p/w500/A7EByudX0eOzlkQ2FIbogzyazm2.jpg",
  "https://image.tmdb.org/t/p/w500/dKqa850uvbNSCaQCV4Im1XlzEtQ.jpg",
  "https://image.tmdb.org/t/p/w500/wFjboE0aFZNbVOF05fzrka9Fqyx.jpg",
  "https://image.tmdb.org/t/p/w500/d5NXSklXo0qyIYkgV94XAgMIckC.jpg",
  "https://image.tmdb.org/t/p/w500/uDgy6hyPd82kOHh6I95FLtLnj6p.jpg",
  "https://image.tmdb.org/t/p/w500/yF1eOkaYvwiORauRCPWznV9xVvi.jpg",
  "https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg",
  "https://image.tmdb.org/t/p/w500/aosm8NMQ3UyoBVpSxyimorCQykC.jpg",
  "https://image.tmdb.org/t/p/w500/9n2tJBplPbgR2ca05hS5CKXwP2c.jpg",
  "https://image.tmdb.org/t/p/w500/kAVRgw7GgK1CfYEjq8IhP67A1Jw.jpg",
  "https://image.tmdb.org/t/p/w500/fiVW06jE7z9YnO4trhaMEdclSiC.jpg",
  "https://image.tmdb.org/t/p/w500/yOm993lsJyPmBodlYjgpPwBjXP9.jpg",
  "https://image.tmdb.org/t/p/w500/qhb1qOilapbapxWQn9jtRCMwXJF.jpg",
];

const backdrops = [
  "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1560169897-fc0cdbdfa4d5?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=1920&h=1080&fit=crop",
];

const titles = [
  ["Stellar Drift", 2024, 8.4, ["Sci-Fi", "Adventure", "Drama"]],
  ["Neon Skies", 2023, 7.8, ["Action", "Thriller"]],
  ["Echoes of Tomorrow", 2024, 8.9, ["Sci-Fi", "Mystery"]],
  ["The Last Lighthouse", 2022, 7.3, ["Drama", "Romance"]],
  ["Crimson Horizon", 2024, 8.1, ["Action", "War"]],
  ["Whispering Pines", 2023, 7.6, ["Horror", "Mystery"]],
  ["Velvet Underworld", 2024, 8.5, ["Crime", "Thriller"]],
  ["Solar Wind", 2023, 7.9, ["Sci-Fi", "Adventure"]],
  ["Midnight Protocol", 2024, 8.7, ["Thriller", "Action"]],
  ["Garden of Stars", 2022, 7.2, ["Romance", "Drama"]],
  ["Iron Cathedral", 2024, 8.3, ["Action", "Sci-Fi"]],
  ["Pale Moon Rising", 2023, 7.5, ["Drama", "Mystery"]],
  ["Quantum Riot", 2024, 8.6, ["Sci-Fi", "Action"]],
  ["The Cobalt Hour", 2023, 7.7, ["Thriller", "Crime"]],
  ["Northbound", 2022, 7.1, ["Adventure", "Drama"]],
  ["Phantom Frequencies", 2024, 8.8, ["Horror", "Sci-Fi"]],
  ["Saffron Tides", 2023, 7.4, ["Drama", "Romance"]],
  ["Halcyon Days", 2024, 8.0, ["Drama", "Comedy"]],
] as const;

export const ALL_MEDIA: Movie[] = titles.map((t, i) => ({
  id: String(i + 1),
  title: t[0] as string,
  year: t[1] as number,
  rating: t[2] as number,
  genres: [...(t[3] as readonly string[])],
  type: i % 4 === 3 ? "series" : "movie",
  poster: posters[i % posters.length],
  backdrop: backdrops[i % backdrops.length],
  overview:
    "A breathtaking journey through unknown frontiers, where every choice carves a new fate. Stunning visuals, gripping performances, and a soundtrack that lingers long after the credits roll.",
}));

export const MOVIES = ALL_MEDIA.filter((m) => m.type === "movie");
export const SERIES = ALL_MEDIA.filter((m) => m.type === "series");

export function getMedia(id: string) {
  return ALL_MEDIA.find((m) => m.id === id);
}
