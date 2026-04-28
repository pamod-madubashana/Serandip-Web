import {
  LayoutDashboard, Film, Tv, Layers, Upload, Inbox, Users, BarChart3, Settings, Clapperboard,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const main = [
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Movies", url: "/dashboard/movies", icon: Film },
  { title: "TV Series", url: "/dashboard/series", icon: Tv },
  { title: "Seasons & Episodes", url: "/dashboard/episodes", icon: Layers },
];

const ops = [
  { title: "Upload / Sources", url: "/dashboard/sources", icon: Upload },
  { title: "Requests", url: "/dashboard/requests", icon: Inbox },
  { title: "Users", url: "/dashboard/users", icon: Users },
];

const meta = [
  { title: "Analytics", url: "/dashboard/analytics", icon: BarChart3 },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";

  const item = (i: { title: string; url: string; icon: any }) => (
    <SidebarMenuItem key={i.title}>
      <SidebarMenuButton asChild tooltip={i.title}>
        <NavLink
          to={i.url}
          end={i.url === "/dashboard"}
          className="flex items-center gap-3 rounded-md px-2.5 py-2 text-sm text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-smooth"
          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground !text-foreground shadow-[inset_2px_0_0_hsl(var(--sidebar-primary))]"
        >
          <i.icon className="h-4 w-4 shrink-0" />
          {!collapsed && <span className="truncate">{i.title}</span>}
        </NavLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="px-3 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-gradient-primary shadow-glow">
            <Clapperboard className="h-4 w-4 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold tracking-tight">Cineplex</span>
              <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Admin CMS</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="scrollbar-thin">
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">Library</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{main.map(item)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">Operations</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{ops.map(item)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground/70">Insights</SidebarGroupLabel>}
          <SidebarGroupContent>
            <SidebarMenu>{meta.map(item)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border p-3">
        {!collapsed ? (
          <div className="glass rounded-md p-2.5">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-gradient-primary" />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-xs font-medium">Aria Vance</p>
                <p className="truncate text-[10px] text-muted-foreground">Owner • aria@cineplex.io</p>
              </div>
              <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse-glow" />
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="h-7 w-7 rounded-full bg-gradient-primary" />
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
