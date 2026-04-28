import { Outlet } from "react-router-dom";
import { MobileBottomNav, Navbar } from "./Navbar";

export const PublicLayout = () => (
  <div className="public-theme min-h-screen bg-background text-foreground">
    <Navbar />
    <main className="pb-20 pt-16 md:pb-6 public-animate-fade-up">
      <Outlet />
    </main>
    <MobileBottomNav />
  </div>
);
