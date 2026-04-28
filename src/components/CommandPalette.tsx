import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator,
} from "@/components/ui/command";
import { Film, Tv, Inbox, Users, Upload, Settings, BarChart3, LayoutDashboard, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const nav = useNavigate();
  const go = (path: string) => { onOpenChange(false); nav(path); };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => go("/dashboard")}><LayoutDashboard className="mr-2 h-4 w-4" />Overview</CommandItem>
          <CommandItem onSelect={() => go("/dashboard/movies")}><Film className="mr-2 h-4 w-4" />Movies</CommandItem>
          <CommandItem onSelect={() => go("/dashboard/series")}><Tv className="mr-2 h-4 w-4" />TV Series</CommandItem>
          <CommandItem onSelect={() => go("/dashboard/requests")}><Inbox className="mr-2 h-4 w-4" />Requests</CommandItem>
          <CommandItem onSelect={() => go("/dashboard/users")}><Users className="mr-2 h-4 w-4" />Users</CommandItem>
          <CommandItem onSelect={() => go("/dashboard/sources")}><Upload className="mr-2 h-4 w-4" />Upload / Sources</CommandItem>
          <CommandItem onSelect={() => go("/dashboard/analytics")}><BarChart3 className="mr-2 h-4 w-4" />Analytics</CommandItem>
          <CommandItem onSelect={() => go("/dashboard/settings")}><Settings className="mr-2 h-4 w-4" />Settings</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick Actions">
          <CommandItem><Plus className="mr-2 h-4 w-4" />New movie</CommandItem>
          <CommandItem><Plus className="mr-2 h-4 w-4" />New series</CommandItem>
          <CommandItem><Upload className="mr-2 h-4 w-4" />Bulk import sources</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
