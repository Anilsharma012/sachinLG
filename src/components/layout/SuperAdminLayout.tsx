import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
  Bell,
  ChevronDown,
  Shield,
  CreditCard,
  AlertTriangle,
  Webhook,
  History,
  UserCog,
  Package,
  BarChart3,
  Wrench,
  Globe,
  FileText,
  Megaphone,
  Lock,
  Crown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { InstallBanner } from "@/components/pwa/InstallBanner";
import { InstallButton } from "@/components/pwa/InstallButton";
import { InstallPromptModal } from "@/components/pwa/InstallPromptModal";
import { FloatingInstallButton } from "@/components/pwa/FloatingInstallButton";
import { UpdateNotification } from "@/components/pwa/UpdateNotification";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SuperAdminLayoutProps {
  children: React.ReactNode;
}

const navGroups: NavGroup[] = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/superadmin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Management",
    items: [
      { label: "Organizations", href: "/superadmin/organizations", icon: Building2, badge: 4 },
      { label: "Platform Admins", href: "/superadmin/admins", icon: UserCog },
      { label: "Cross-Org Users", href: "/superadmin/users", icon: Users },
    ],
  },
  {
    title: "Billing",
    items: [
      { label: "Plans", href: "/superadmin/plans", icon: Package },
      { label: "Subscriptions", href: "/superadmin/subscriptions", icon: CreditCard, badge: 1 },
    ],
  },
  {
    title: "Operations",
    items: [
      { label: "Error Console", href: "/superadmin/errors", icon: AlertTriangle, badge: 3 },
      { label: "Webhook Logs", href: "/superadmin/webhooks", icon: Webhook },
      { label: "Data Repair", href: "/superadmin/repair", icon: Wrench },
      { label: "Support Mode", href: "/superadmin/support-mode", icon: UserCircle },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Integrations", href: "/superadmin/integrations", icon: Globe },
      { label: "Templates", href: "/superadmin/templates", icon: FileText },
      { label: "Announcements", href: "/superadmin/announcements", icon: Megaphone },
    ],
  },
  {
    title: "Security",
    items: [
      { label: "Audit Logs", href: "/superadmin/audit", icon: History },
      { label: "Security Settings", href: "/superadmin/security", icon: Lock },
      { label: "Platform Settings", href: "/superadmin/settings", icon: Settings },
    ],
  },
];

export function SuperAdminLayout({ children }: SuperAdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const displayUser = {
    name: user?.name || "Super Admin",
    email: user?.email || "",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || 'superadmin'}`,
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const getCurrentPageTitle = () => {
    for (const group of navGroups) {
      const item = group.items.find((item) => item.href === location.pathname);
      if (item) return item.label;
    }
    return "Dashboard";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-white"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            <span className="text-lg font-bold text-white">SuperAdmin</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-white relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-400" />
          </Button>
          <Avatar className="h-8 w-8 ring-2 ring-amber-400/50">
            <AvatarImage src={displayUser.avatar} />
            <AvatarFallback>{displayUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-40 bg-foreground/50"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full bg-slate-900 transition-all duration-300 flex flex-col border-r border-slate-800",
          sidebarOpen ? "w-64" : "w-20",
          "max-lg:translate-x-[-100%]",
          mobileOpen && "max-lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <Link to="/superadmin" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <Crown className="h-5 w-5 text-slate-900" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-lg font-bold text-white">LoanAgent</span>
                <span className="text-xs text-amber-400 font-medium">CEO Dashboard</span>
              </motion.div>
            )}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setMobileOpen(false);
            }}
            className="text-slate-400 hover:text-white hidden lg:flex"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="text-slate-400 hover:text-white lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navGroups.map((group) => (
            <div key={group.title} className="mb-6">
              {sidebarOpen && (
                <h3 className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <li key={item.href}>
                      <Link
                        to={item.href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                          isActive
                            ? "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border border-amber-500/30"
                            : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        {sidebarOpen && (
                          <>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && (
                              <Badge 
                                variant="secondary" 
                                className={cn(
                                  "px-2 py-0.5 text-xs",
                                  isActive 
                                    ? "bg-amber-500 text-slate-900" 
                                    : "bg-slate-700 text-slate-300"
                                )}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-slate-800 p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-slate-800",
                !sidebarOpen && "justify-center"
              )}>
                <Avatar className="h-8 w-8 ring-2 ring-amber-400/50">
                  <AvatarImage src={displayUser.avatar} />
                  <AvatarFallback className="bg-amber-500 text-slate-900">
                    {displayUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-white">{displayUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{displayUser.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Crown className="h-4 w-4 text-amber-500" />
                Super Admin Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserCircle className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          "min-h-screen transition-all duration-300 pt-16 lg:pt-0",
          sidebarOpen ? "lg:pl-64" : "lg:pl-20"
        )}
      >
        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between h-16 px-6 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-foreground">
              {getCurrentPageTitle()}
            </h1>
            <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">
              <Crown className="h-3 w-3 mr-1" />
              Super Admin
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <InstallButton role="superadmin" />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-amber-500" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8 ring-2 ring-amber-400/30">
                    <AvatarImage src={displayUser.avatar} />
                    <AvatarFallback>{displayUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{displayUser.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-amber-500" />
                  Super Admin Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-6">
          <UpdateNotification />
          <InstallBanner role="superadmin" />
          <InstallPromptModal role="superadmin" />
          <FloatingInstallButton role="superadmin" />
          {children}
        </div>
      </main>
    </div>
  );
}
