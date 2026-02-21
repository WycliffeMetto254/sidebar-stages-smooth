import { Outlet, NavLink as RouterNavLink, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import { LayoutDashboard, FileText, Plus, Bell, LogOut, Menu, User, ChevronRight, Eye, BarChart3, UserCheck, CalendarCheck, Search, FileSignature, GraduationCap, DollarSign, TrendingUp, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useState } from 'react';
import { ROLE_LABELS, STAGES, STAGE_LABELS, Stage } from '@/types';

type TabKey = 'overview' | 'analysis' | 'assignment' | 'meeting' | 'diligence' | 'contract' | 'bootcamp' | 'funding' | 'projections';

const STAGE_TABS: { key: TabKey; label: string; icon: React.ElementType; stageIndex: number }[] = [
  { key: 'overview', label: 'Pitch Overview', icon: Eye, stageIndex: 0 },
  { key: 'analysis', label: 'Analysis', icon: BarChart3, stageIndex: 1 },
  { key: 'assignment', label: 'Assignment', icon: UserCheck, stageIndex: 2 },
  { key: 'meeting', label: 'Meeting', icon: CalendarCheck, stageIndex: 3 },
  { key: 'diligence', label: 'Due Diligence', icon: Search, stageIndex: 4 },
  { key: 'contract', label: 'Contract', icon: FileSignature, stageIndex: 5 },
  { key: 'bootcamp', label: 'Bootcamp', icon: GraduationCap, stageIndex: 6 },
  { key: 'funding', label: 'Funding', icon: DollarSign, stageIndex: 7 },
  { key: 'projections', label: 'Projections', icon: TrendingUp, stageIndex: 1 },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth();
  const { pitches, getNotificationsForUser } = useData();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const unread = user ? getNotificationsForUser(user.id).filter(n => !n.read).length : 0;

  // Detect if we're on a pitch detail page
  const pitchMatch = location.pathname.match(/^\/pitch\/(.+)$/);
  const pitchId = pitchMatch ? pitchMatch[1] : null;
  const pitch = pitchId ? pitches.find(p => p.id === pitchId) : null;

  const currentTab = searchParams.get('tab') || 'overview';

  const linkClass = (path: string) => {
    const active = location.pathname === path || (path !== '/dashboard' && path !== '/pitch/new' && location.pathname.startsWith(path) && !pitchMatch);
    return `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      active
        ? 'bg-sidebar-accent text-sidebar-accent-foreground'
        : 'text-sidebar-foreground hover:bg-accent'
    }`;
  };

  const currentStageIndex = pitch ? STAGES.indexOf(pitch.stage) : -1;

  return (
    <nav className="flex flex-col gap-1 p-3">
      <RouterNavLink to="/dashboard" className={() => linkClass('/dashboard')} onClick={onNavigate}>
        <LayoutDashboard className="h-4 w-4 shrink-0" />
        Dashboard
      </RouterNavLink>
      {user?.role === 'founder' && (
        <RouterNavLink to="/pitch/new" className={() => linkClass('/pitch/new')} onClick={onNavigate}>
          <Plus className="h-4 w-4 shrink-0" />
          New Pitch
        </RouterNavLink>
      )}
      <RouterNavLink to="/pitches" className={() => linkClass('/pitches')} onClick={onNavigate}>
        <FileText className="h-4 w-4 shrink-0" />
        Pitches
      </RouterNavLink>
      <RouterNavLink to="/notifications" className={() => linkClass('/notifications')} onClick={onNavigate}>
        <Bell className="h-4 w-4 shrink-0" />
        Notifications
        {unread > 0 && (
          <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
            {unread}
          </span>
        )}
      </RouterNavLink>

      {/* Stage tabs when a pitch is selected */}
      {pitch && (
        <>
          <div className="border-t my-2" />
          <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
            {pitch.companyName}
          </p>
          {STAGE_TABS.map((tab) => {
            const accessible = currentStageIndex >= tab.stageIndex;
            const isActive = currentTab === tab.key;
            const Icon = tab.icon;

            return (
              <RouterNavLink
                key={tab.key}
                to={`/pitch/${pitchId}?tab=${tab.key}`}
                onClick={(e) => {
                  if (!accessible) {
                    e.preventDefault();
                    return;
                  }
                  onNavigate?.();
                }}
                className={() =>
                  `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    !accessible
                      ? 'text-muted-foreground/50 cursor-not-allowed'
                      : isActive
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-accent'
                  }`
                }
              >
                {accessible ? (
                  <Icon className="h-4 w-4 shrink-0" />
                ) : (
                  <Lock className="h-4 w-4 shrink-0" />
                )}
                {tab.label}
              </RouterNavLink>
            );
          })}
        </>
      )}
    </nav>
  );
}

function Breadcrumbs() {
  const location = useLocation();
  const parts = location.pathname.split('/').filter(Boolean);

  const crumbs: { label: string; path?: string }[] = [{ label: 'Dashboard', path: '/dashboard' }];

  if (parts[0] === 'pitches') {
    crumbs.push({ label: 'Pitches' });
  } else if (parts[0] === 'pitch') {
    crumbs.push({ label: 'Pitches', path: '/pitches' });
    if (parts[1] === 'new') {
      crumbs.push({ label: 'New Pitch' });
    } else {
      crumbs.push({ label: 'Pitch Details' });
    }
  } else if (parts[0] === 'notifications') {
    crumbs.push({ label: 'Notifications' });
  }

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          {crumb.path && i < crumbs.length - 1 ? (
            <RouterNavLink to={crumb.path} className="hover:text-foreground transition-colors">
              {crumb.label}
            </RouterNavLink>
          ) : (
            <span className="text-foreground font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

export default function AppLayout() {
  const { user, logout } = useAuth();
  const { getNotificationsForUser } = useData();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unread = user ? getNotificationsForUser(user.id).filter(n => !n.read).length : 0;

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-[280px] shrink-0 flex-col border-r bg-sidebar">
        <div className="h-14 flex items-center px-4 border-b">
          <h1 className="text-base font-semibold tracking-tight text-foreground">Vett & Venture</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          <SidebarNav />
        </div>
        {user && (
          <div className="border-t p-3">
            <div className="flex items-center gap-3 px-3 py-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b flex items-center justify-between px-4 bg-background shrink-0">
          <div className="flex items-center gap-3">
            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <div className="h-14 flex items-center px-4 border-b">
                  <h1 className="text-base font-semibold tracking-tight">Vett & Venture</h1>
                </div>
                <div className="overflow-y-auto flex-1">
                  <SidebarNav onNavigate={() => setMobileOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <Breadcrumbs />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => navigate('/notifications')}
            >
              <Bell className="h-5 w-5" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-destructive text-destructive-foreground text-[10px] rounded-full h-4 min-w-[16px] flex items-center justify-center px-1">
                  {unread}
                </span>
              )}
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {user && (
                  <>
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{ROLE_LABELS[user.role]}</p>
                    </div>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem onClick={() => { logout(); navigate('/'); }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}