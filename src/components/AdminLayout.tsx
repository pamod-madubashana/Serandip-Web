import { Navigate, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/lib/auth";
import { AppSidebar } from "./AppSidebar";
import { TopBar } from "./TopBar";

export function AdminLayout() {
  const location = useLocation();
  const { auth } = useAuth();

  if (auth.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-foreground">
        <div className="text-center">
          <p className="text-sm font-medium">Checking access...</p>
          <p className="mt-2 text-sm text-muted-foreground">Please wait while we verify your dashboard session.</p>
        </div>
      </div>
    );
  }

  if (!auth.authenticated || !auth.admin) {
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
