import { Link, NavLink, useLocation } from "react-router-dom";
import { Film, Home, Info, Tv, User, LogIn, LogOut, UserCircle2, LayoutDashboard } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { APP_NAME } from "@/lib/app-config";

const NAV = [
  { to: "/", label: "Home", icon: Home },
  { to: "/movies", label: "Movies", icon: Film },
  { to: "/tv-series", label: "TV Series", icon: Tv },
  { to: "/about", label: "About", icon: Info },
];

export const Navbar = ({ appName = APP_NAME }: { appName?: string }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <nav className="public-glass fixed left-0 right-0 top-0 z-50 px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          {appName}
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {NAV.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) => `public-nav-item ${isActive ? "text-primary" : ""}`}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{label}</span>
            </NavLink>
          ))}
        </div>

        <div className="relative" ref={ref}>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Profile menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-lg transition-all hover:scale-110"
          >
            <User className="h-4 w-4" />
          </button>

          {open && (
            <div className="public-glass-menu public-animate-fade-down absolute right-0 mt-2 w-56 origin-top-right rounded-xl py-2">
              <div className="border-b border-border/60 px-4 py-3">
                <p className="text-sm font-medium text-foreground">Guest</p>
                <p className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                  <UserCircle2 className="h-3 w-3" /> Not signed in
                </p>
              </div>
              <Link
                to="/login"
                className="mx-2 my-1 flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all hover:bg-secondary/60"
              >
                <LogIn className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Sign in</span>
              </Link>
              <Link
                to="/dashboard"
                className="mx-2 my-1 flex items-center gap-3 rounded-lg px-4 py-2.5 transition-all hover:bg-secondary/60"
              >
                <LayoutDashboard className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Dashboard</span>
              </Link>
              <div className="mx-2 my-1 border-t border-border/60" />
              <button className="mx-2 my-1 flex w-full items-center gap-3 rounded-lg px-4 py-2.5 text-destructive transition-all hover:bg-destructive/15">
                <LogOut className="h-4 w-4" />
                <span className="text-sm font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export const MobileBottomNav = () => (
  <nav className="public-glass fixed bottom-0 left-0 right-0 z-50 flex justify-around px-4 py-2 md:hidden">
    {NAV.slice(0, 3).map(({ to, label, icon: Icon }) => (
      <NavLink
        key={to}
        to={to}
        end={to === "/"}
        className={({ isActive }) =>
          `flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
            isActive ? "text-primary" : "text-foreground/80"
          }`
        }
      >
        <Icon className="h-5 w-5" />
        <span className="text-[10px] font-medium">{label}</span>
      </NavLink>
    ))}
    <NavLink
      to="/login"
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 px-3 py-1 transition-colors ${
          isActive ? "text-primary" : "text-foreground/80"
        }`
      }
    >
      <User className="h-5 w-5" />
      <span className="text-[10px] font-medium">Profile</span>
    </NavLink>
  </nav>
);
