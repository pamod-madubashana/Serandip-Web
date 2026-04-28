import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AdminLayout } from "@/components/AdminLayout";
import Overview from "./pages/Overview";
import Movies from "./pages/Movies";
import Series from "./pages/Series";
import Episodes from "./pages/Episodes";
import Sources from "./pages/Sources";
import Requests from "./pages/Requests";
import Users from "./pages/Users";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import { PublicLayout } from "./public/components/Layout";
import PublicHome from "./public/pages/Home";
import PublicMovies from "./public/pages/Movies";
import PublicTVSeries from "./public/pages/TVSeries";
import PublicMovieDetails from "./public/pages/MovieDetails";
import PublicVideoPlayer from "./public/pages/VideoPlayer";
import PublicLogin from "./public/pages/Login";
import PublicAbout from "./public/pages/About";
import NotFound from "./pages/NotFound.tsx";
import "./public/public.css";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<PublicHome />} />
            <Route path="/movies" element={<PublicMovies />} />
            <Route path="/tv-series" element={<PublicTVSeries />} />
            <Route path="/movie/:id" element={<PublicMovieDetails />} />
            <Route path="/series/:id" element={<PublicMovieDetails />} />
            <Route path="/watch/:id" element={<PublicVideoPlayer />} />
            <Route path="/login" element={<PublicLogin />} />
            <Route path="/about" element={<PublicAbout />} />
          </Route>

          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Overview />} />
            <Route path="/dashboard/movies" element={<Movies />} />
            <Route path="/dashboard/series" element={<Series />} />
            <Route path="/dashboard/episodes" element={<Episodes />} />
            <Route path="/dashboard/sources" element={<Sources />} />
            <Route path="/dashboard/requests" element={<Requests />} />
            <Route path="/dashboard/users" element={<Users />} />
            <Route path="/dashboard/analytics" element={<Analytics />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
