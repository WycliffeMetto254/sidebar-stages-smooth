import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useForgeAuth } from '@/contexts/ForgeAuthContext';
import { BUSINESS_ROLE_LABELS, FORGE_PHASES } from '@/types/forge';
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Flame, LayoutDashboard, Database, ListTodo, BarChart3, FileCheck, LogOut } from 'lucide-react';

const NAV_ITEMS = [
  { title: 'Dashboard', url: '/forge/dashboard', icon: LayoutDashboard },
  { title: 'Problem Bank', url: '/forge/problems', icon: Database },
  { title: 'To-Do\'s', url: '/forge/todos', icon: ListTodo },
  { title: 'KPIs', url: '/forge/kpis', icon: BarChart3 },
  { title: 'Market Validation', url: '/forge/validation', icon: FileCheck },
];

export default function ForgeLayout() {
  const { member, squad, logout } = useForgeAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!member || !squad) return null;

  const forgeProgress = Math.min(100, (squad.forgeDay / 90) * 100);
  const currentPhase = FORGE_PHASES.find((p) => {
    const [start, end] = p.days.split('-').map(Number);
    return squad.forgeDay >= start && squad.forgeDay <= end;
  }) ?? FORGE_PHASES[0];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar collapsible="icon">
          <SidebarContent>
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="h-5 w-5 text-orange-500 shrink-0" />
                <span className="font-bold text-sm truncate">The Forge</span>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold truncate">{squad.name}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {member.name} — {BUSINESS_ROLE_LABELS[member.businessRole]}
                </p>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>Day {squad.forgeDay}/90</span>
                    <span>{currentPhase.label}</span>
                  </div>
                  <Progress value={forgeProgress} className="h-1.5" />
                </div>
              </div>
            </div>

            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {NAV_ITEMS.map(item => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild>
                        <NavLink to={item.url} className="hover:bg-muted/50" activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium">
                          <item.icon className="mr-2 h-4 w-4" />
                          <span>{item.title}</span>
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <div className="mt-auto p-4 border-t">
              <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground" onClick={() => { logout(); navigate('/forge'); }}>
                <LogOut className="mr-2 h-4 w-4" /> Sign Out
              </Button>
            </div>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-12 flex items-center border-b px-4 gap-3">
            <SidebarTrigger />
            <h1 className="text-sm font-semibold truncate">
              {NAV_ITEMS.find(n => location.pathname.startsWith(n.url))?.title ?? 'The Forge'}
            </h1>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
