import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

type AuthState = "checking" | "allowed" | "denied";

export function AdminLayout() {
  const location = useLocation();
  const [authState, setAuthState] = useState<AuthState>("checking");

  useEffect(() => {
    const controller = new AbortController();

    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
          signal: controller.signal,
        });

        if (!response.ok) {
          setAuthState("denied");
          return;
        }

        const payload = (await response.json()) as {
          authenticated?: boolean;
          admin?: boolean;
        };

        setAuthState(payload.authenticated && payload.admin ? "allowed" : "denied");
      } catch {
        if (controller.signal.aborted) {
          return;
        }
        setAuthState("denied");
      }
    };

    setAuthState("checking");
    void checkAuth();

    return () => controller.abort();
  }, [location.pathname]);

  if (authState === "checking") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="text-center">
          <p className="text-sm font-medium">Checking access...</p>
          <p className="mt-2 text-sm text-muted-foreground">Please wait while we verify your dashboard session.</p>
        </div>
      </div>
    );
  }

  if (authState === "denied") {
    const next = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?next=${encodeURIComponent(next)}`} replace />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar />
          <main className="flex-1 animate-fade-in">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
