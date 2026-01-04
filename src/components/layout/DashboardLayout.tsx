import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  UserCircle,
  Briefcase,
  FileCheck,
  PiggyBank,
  Receipt,
  HelpCircle,
  Bell,
  ChevronDown,
  Building2,
  UserPlus,
  ClipboardList,
  Wallet,
  BarChart3,
  Shield,
  FileBarChart,
  Ticket,
  History,
  Banknote,
  FileSignature,
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

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: "admin" | "agent" | "customer";
}

const adminNav: NavItem[] = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Leads", href: "/admin/leads", icon: UserPlus, badge: 12 },
  { label: "Applications", href: "/admin/applications", icon: ClipboardList, badge: 5 },
  { label: "KYC Queue", href: "/admin/kyc", icon: Shield, badge: 8 },
  { label: "Loan Accounts", href: "/admin/loans", icon: Briefcase },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Agents", href: "/admin/agents", icon: UserCircle },
  { label: "Documents", href: "/admin/documents", icon: FileCheck },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Invoices", href: "/admin/invoices", icon: FileSignature },
  { label: "Commission", href: "/admin/commission", icon: Wallet },
  { label: "Tickets", href: "/admin/tickets", icon: Ticket },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Audit Logs", href: "/admin/audit", icon: History },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const agentNav: NavItem[] = [
  { label: "Dashboard", href: "/agent", icon: LayoutDashboard },
  { label: "My Leads", href: "/agent/leads", icon: UserPlus, badge: 5 },
  { label: "Applications", href: "/agent/applications", icon: ClipboardList },
  { label: "Customers", href: "/agent/customers", icon: Users },
  { label: "Commission", href: "/agent/commission", icon: PiggyBank },
  { label: "Support", href: "/agent/support", icon: HelpCircle },
];

const customerNav: NavItem[] = [
  { label: "Dashboard", href: "/customer", icon: LayoutDashboard },
  { label: "My Profile", href: "/customer/profile", icon: UserCircle },
  { label: "Apply Loan", href: "/customer/apply", icon: FileText, badge: 1 },
  { label: "My Loans", href: "/customer/loans", icon: Briefcase },
  { label: "EMI Schedule", href: "/customer/emi", icon: CreditCard, badge: 2 },
  { label: "Documents", href: "/customer/documents", icon: FileCheck, badge: 3 },
  { label: "Receipts & NOC", href: "/customer/receipts", icon: Receipt },
  { label: "Payments", href: "/customer/payments", icon: Banknote },
  { label: "Loan Calculator", href: "/customer/calculator", icon: BarChart3 },
  { label: "Notifications", href: "/customer/notifications", icon: Bell, badge: 3 },
  { label: "Support", href: "/customer/support", icon: HelpCircle },
];

const navConfig = {
  admin: adminNav,
  agent: agentNav,
  customer: customerNav,
};

const roleLabels = {
  admin: "Admin Portal",
  agent: "Agent Portal",
  customer: "Customer Portal",
};

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const navItems = navConfig[role];

  const displayUser = {
    name: user?.name || "User",
    email: user?.email || "",
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.id || role}`,
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 h-16 bg-sidebar border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-sidebar-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <span className="text-lg font-bold text-sidebar-foreground">LoanAgent</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="text-sidebar-foreground relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
          </Button>
          <Avatar className="h-8 w-8">
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
          "fixed top-0 left-0 z-50 h-full bg-sidebar transition-all duration-300 flex flex-col",
          sidebarOpen ? "w-64" : "w-20",
          "max-lg:translate-x-[-100%]",
          mobileOpen && "max-lg:translate-x-0"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-sidebar-border">
          <Link to="/" className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg gradient-accent flex items-center justify-center">
              <Building2 className="h-5 w-5 text-accent-foreground" />
            </div>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex flex-col"
              >
                <span className="text-lg font-bold text-sidebar-foreground">LoanAgent</span>
                <span className="text-xs text-sidebar-foreground/60">{roleLabels[role]}</span>
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
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground hidden lg:flex"
          >
            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(false)}
            className="text-sidebar-foreground/70 hover:text-sidebar-foreground lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                    )}
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <span className="flex-1">{item.label}</span>
                    )}
                    {sidebarOpen && item.badge && (
                      <span className="px-2 py-0.5 rounded-full text-xs bg-destructive text-destructive-foreground">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-sidebar-border p-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={cn(
                "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm transition-all hover:bg-sidebar-accent",
                !sidebarOpen && "justify-center"
              )}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={displayUser.avatar} />
                  <AvatarFallback className="bg-sidebar-primary text-sidebar-primary-foreground">
                    {displayUser.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-sidebar-foreground">{displayUser.name}</p>
                      <p className="text-xs text-sidebar-foreground/60 truncate">{displayUser.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-sidebar-foreground/60" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
          <div>
            <h1 className="text-lg font-semibold text-foreground">
              {navItems.find((item) => item.href === location.pathname)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <InstallButton role={role} />
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={displayUser.avatar} />
                    <AvatarFallback>{displayUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="font-medium">{displayUser.name}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
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
          <InstallBanner role={role} />
          <InstallPromptModal role={role} />
          <FloatingInstallButton role={role} />
          {children}
        </div>
      </main>
    </div>
  );
}
