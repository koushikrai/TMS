"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTMSStore, UserRole, Toast } from "@/lib/store/tmsStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Compass, LayoutDashboard, Car, Bus, Truck, Users, 
  AlertTriangle, Briefcase, FileSpreadsheet, GitFork, 
  BarChart3, Settings, LogOut, Search, Bell, X, ChevronRight, CheckCircle, Info, Menu
} from "lucide-react";
import Link from "next/link";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
}

const SIDEBAR_ITEMS: SidebarItem[] = [
  { name: "Command Center", href: "/dashboard", icon: LayoutDashboard, roles: ["SYS_ADMIN", "TRANS_ADMIN", "FLEET_MGR", "EXEC", "HR_DEPT", "FINANCE", "DRIVER"] },
  { name: "Light Vehicles", href: "/light-vehicles", icon: Car, roles: ["SYS_ADMIN", "TRANS_ADMIN", "FLEET_MGR", "HR_DEPT"] },
  { name: "Buses & Transport", href: "/buses", icon: Bus, roles: ["SYS_ADMIN", "TRANS_ADMIN", "FLEET_MGR", "HR_DEPT"] },
  { name: "Heavy & Equipment", href: "/heavy-vehicles", icon: Truck, roles: ["SYS_ADMIN", "TRANS_ADMIN", "FLEET_MGR"] },
  { name: "Driver Profiles", href: "/drivers", icon: Users, roles: ["SYS_ADMIN", "TRANS_ADMIN", "FLEET_MGR", "DRIVER"] },
  { name: "Violations & Logs", href: "/violations", icon: AlertTriangle, roles: ["SYS_ADMIN", "TRANS_ADMIN", "FLEET_MGR"] },
  { name: "Vendors & RFQ", href: "/vendors", icon: Briefcase, roles: ["SYS_ADMIN", "TRANS_ADMIN", "FINANCE"] },
  { name: "Master Data Hub", href: "/master-data", icon: FileSpreadsheet, roles: ["SYS_ADMIN", "TRANS_ADMIN"] },
  { name: "Workflow Builder", href: "/workflows", icon: GitFork, roles: ["SYS_ADMIN"] },
  { name: "KPI & Analytics", href: "/reports", icon: BarChart3, roles: ["SYS_ADMIN", "TRANS_ADMIN", "EXEC", "FINANCE"] },
  { name: "System Settings", href: "/settings", icon: Settings, roles: ["SYS_ADMIN", "TRANS_ADMIN", "FLEET_MGR", "HR_DEPT", "FINANCE", "DRIVER"] }
];

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { currentRole, currentUser, setRole, toasts, removeToast, addToast, initializeStore } = useTMSStore();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hydrate store from API backend routes on portal entry
  useEffect(() => {
    if (currentRole) {
      initializeStore();
    }
  }, [currentRole, initializeStore]);

  // 1. Guard check: Redirect to login if not logged in
  useEffect(() => {
    if (!currentRole) {
      router.replace("/login");
    }
  }, [currentRole, router]);

  // 2. Track screen size for mobile nav conversion
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 834;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 3. Command+K search shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (!currentRole || !currentUser) return null;

  // Filter menu items by user role permissions
  const allowedItems = SIDEBAR_ITEMS.filter(item => item.roles.includes(currentRole));
  const showMoreButton = allowedItems.length > 4;
  const bottomNavItems = showMoreButton ? allowedItems.slice(0, 4) : allowedItems;

  // Determine breadcrumb list from active URL path
  const getBreadcrumbs = () => {
    const paths = pathname.split("/").filter(p => p);
    return paths.map((path, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");
      const name = SIDEBAR_ITEMS.find(item => item.href === href)?.name || 
        path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
      return { name, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  const handleLogout = () => {
    setRole(null);
    router.replace("/login");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery) return;
    
    // Auto navigation matching key terms
    const term = searchQuery.toLowerCase();
    let targetRoute = "";
    if (term.includes("vehicle") || term.includes("car")) targetRoute = "/light-vehicles";
    else if (term.includes("bus") || term.includes("route")) targetRoute = "/buses";
    else if (term.includes("heavy") || term.includes("crane") || term.includes("permit")) targetRoute = "/heavy-vehicles";
    else if (term.includes("driver")) targetRoute = "/drivers";
    else if (term.includes("violation") || term.includes("speed")) targetRoute = "/violations";
    else if (term.includes("vendor") || term.includes("rfq")) targetRoute = "/vendors";
    else if (term.includes("workflow")) targetRoute = "/workflows";
    else if (term.includes("report") || term.includes("chart")) targetRoute = "/reports";
    else if (term.includes("setting")) targetRoute = "/settings";
    else targetRoute = "/dashboard";
    
    setSearchOpen(false);
    setSearchQuery("");
    addToast({
      type: "info",
      title: "Navigation Shortcut",
      message: `Navigating to ${targetRoute === "/dashboard" ? "Command Center" : targetRoute.split("/")[1].replace("-", " ")}`
    });
    router.push(targetRoute);
  };

  return (
    <div className="flex h-screen bg-background text-ink overflow-hidden">
      
      {/* ---------------- SIDEBAR ---------------- */}
      {!isMobile && (
        <motion.aside
          animate={{ width: sidebarCollapsed ? 72 : 256 }}
          className="flex flex-col bg-background-secondary border-r border-border-soft h-full py-6 relative"
        >
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-6 mb-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-apple-md bg-brand-teal text-white shadow-overlay">
              <Compass className="h-5 w-5" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-display text-lg font-semibold tracking-tight text-ink">TMS-365</span>
            )}
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto" aria-label="Main sidebar navigation">
            {allowedItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-apple-sm text-caption transition-all btn-press-active ${
                    isActive 
                      ? "bg-brand-teal/10 text-brand-teal border-l-2 border-brand-teal font-semibold" 
                      : "text-ink hover:bg-border-soft"
                  }`}
                >
                  <Icon className={`h-5 w-5 shrink-0 ${isActive ? "text-brand-teal" : "text-ink-muted"}`} />
                  {!sidebarCollapsed && <span>{item.name}</span>}
                </Link>
              );
            })}
          </nav>

          {/* Footer Action items */}
          <div className="px-3 border-t border-border-soft pt-4 space-y-1.5">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              aria-label={sidebarCollapsed ? "Expand sidebar menu" : "Collapse sidebar menu"}
              className="w-full flex items-center justify-center py-2 text-ink-muted hover:text-ink hover:bg-border-soft rounded-apple-sm transition-all"
            >
              <Menu className="h-5 w-5" />
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 text-system-red hover:bg-system-red/10 rounded-apple-sm transition-all btn-press-active"
            >
              <LogOut className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span className="font-semibold text-caption">Log Out</span>}
            </button>
          </div>
        </motion.aside>
      )}

      {/* ---------------- MAIN CONTAINER ---------------- */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        
        {/* ---------------- TOPBAR ---------------- */}
        <header className="h-[72px] border-b border-border-soft flex items-center justify-between px-6 bg-background">
          <div className="flex items-center gap-4">
            {isMobile && (
              <button 
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open navigation menu"
                aria-expanded={mobileMenuOpen}
                className="h-10 w-10 flex items-center justify-center border border-border-hairline rounded-apple-md hover:bg-background-secondary transition-all"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            
            {/* Breadcrumb Trail */}
            <nav className="flex items-center gap-1.5 text-caption text-ink-muted select-none" aria-label="Breadcrumbs">
              <Link href="/dashboard" className="hover:text-brand-teal transition-all font-medium">TMS</Link>
              {breadcrumbs.map((bc, idx) => (
                <React.Fragment key={bc.href}>
                  <ChevronRight className="h-3.5 w-3.5 stroke-[2] shrink-0" />
                  <Link 
                    href={bc.href}
                    className={`hover:text-brand-teal transition-all ${
                      idx === breadcrumbs.length - 1 ? "text-ink font-semibold" : "font-medium"
                    }`}
                  >
                    {bc.name}
                  </Link>
                </React.Fragment>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Search Launcher */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search operations database"
              aria-keyshortcuts="Control+K"
              className="h-10 px-3 bg-background-secondary border border-border-soft rounded-apple-pill flex items-center gap-2 hover:border-brand-blue-focus transition-all text-ink-muted text-caption"
            >
              <Search className="h-4 w-4" />
              <span className="hidden sm:inline pr-12">Search command...</span>
              <kbd className="hidden sm:inline px-1.5 py-0.5 border border-border-hairline rounded bg-background text-[10px] font-semibold">Ctrl+K</kbd>
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="View notifications feed"
                aria-expanded={notificationsOpen}
                aria-haspopup="true"
                className="h-10 w-10 flex items-center justify-center border border-border-soft rounded-apple-pill bg-background hover:bg-background-secondary transition-all relative"
              >
                <Bell className="h-5 w-5 text-ink-muted" />
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-system-red rounded-full ring-2 ring-background animate-pulse" />
              </button>

              {/* Notification Overlay Popover */}
              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="absolute right-0 mt-2 w-80 bg-white border border-border-soft rounded-apple-md shadow-product py-4 z-50"
                  >
                    <div className="flex items-center justify-between px-4 pb-2 border-b border-border-soft">
                      <span className="text-caption-strong font-semibold text-ink">Operations Feed</span>
                      <span className="text-xs text-brand-teal cursor-pointer hover:underline">Mark all read</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto py-2">
                      <div className="px-4 py-2 hover:bg-background-secondary transition-all cursor-pointer">
                        <div className="flex items-start gap-2.5">
                          <AlertTriangle className="h-4 w-4 text-system-red mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-ink">LV-08 Istimara Expired</p>
                            <p className="text-[10px] text-ink-muted mt-0.5">Please check vehicle compliance sheet immediately.</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-2 hover:bg-background-secondary transition-all cursor-pointer border-t border-border-soft">
                        <div className="flex items-start gap-2.5">
                          <CheckCircle className="h-4 w-4 text-system-green mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-ink">Trip REQ-1002 Completed</p>
                            <p className="text-[10px] text-ink-muted mt-0.5">Sultan Al-Otaibi logged arrival at Jubail Port.</p>
                          </div>
                        </div>
                      </div>
                      <div className="px-4 py-2 hover:bg-background-secondary transition-all cursor-pointer border-t border-border-soft">
                        <div className="flex items-start gap-2.5">
                          <Info className="h-4 w-4 text-brand-blue mt-0.5 shrink-0" />
                          <div>
                            <p className="text-xs font-semibold text-ink">SAP Roster Synced</p>
                            <p className="text-[10px] text-ink-muted mt-0.5">Roster alignment updated for 12 leaves today.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar & Role */}
            <div className="flex items-center gap-3" aria-label="User profile">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-caption-strong font-semibold text-ink">{currentUser.name}</span>
                <span className="text-[10px] uppercase font-bold text-brand-teal tracking-wider">{currentRole}</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-brand-teal text-white flex items-center justify-center font-semibold border border-border-soft">
                {currentUser.name.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* ---------------- PAGE ROUTE WRAPPER ---------------- */}
        <main className={`flex-1 overflow-y-auto bg-background p-6 ${isMobile ? "pb-[76px]" : ""}`}>
          {children}
        </main>
      </div>

      {/* ---------------- MOBILE MENU DRAWER ---------------- */}
      <AnimatePresence>
        {isMobile && mobileMenuOpen && (
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-start"
          >
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation panel"
              className="w-72 bg-white h-full p-6 flex flex-col shadow-product relative"
            >
              <button 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="absolute top-4 right-4 h-8 w-8 flex items-center justify-center border border-border-hairline rounded-apple-pill"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3 mb-8">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-apple-md bg-brand-teal text-white shadow-overlay">
                  <Compass className="h-5 w-5" />
                </div>
                <span className="font-display text-lg font-semibold tracking-tight text-ink">TMS-365</span>
              </div>

              <nav className="flex-1 space-y-1.5 overflow-y-auto" aria-label="Mobile side panel menu">
                {allowedItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-apple-sm text-caption transition-all ${
                        isActive 
                          ? "bg-brand-teal/10 text-brand-teal border-l-2 border-brand-teal font-semibold" 
                          : "text-ink hover:bg-border-soft"
                      }`}
                    >
                      <Icon className="h-5 w-5 shrink-0 text-ink-muted" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="border-t border-border-soft pt-4">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 text-system-red hover:bg-system-red/10 rounded-apple-sm transition-all"
                >
                  <LogOut className="h-5 w-5 shrink-0" />
                  <span className="font-semibold text-caption">Log Out</span>
                </button>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- COMMAND PALETTE MODAL ---------------- */}
      <AnimatePresence>
        {searchOpen && (
          <div 
            onClick={() => setSearchOpen(false)}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-start justify-center pt-24 px-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label="Command search palette"
              className="w-full max-w-[600px] bg-white border border-border-soft rounded-apple-lg shadow-product overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="flex items-center border-b border-border-soft px-4 py-3 gap-2">
                <Search className="h-5 w-5 text-ink-muted shrink-0" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Type a location, route, module, or plate number..."
                  className="w-full text-caption text-ink placeholder:text-ink-muted/50 bg-transparent focus:outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button 
                  type="button" 
                  onClick={() => setSearchOpen(false)}
                  className="p-1 rounded-apple-pill border border-border-hairline text-ink-muted hover:text-ink hover:bg-background-secondary transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </form>
              <div className="p-4 text-[11px] text-ink-muted bg-background-secondary border-t border-border-soft flex justify-between select-none">
                <span>Press <kbd className="px-1 border border-border-hairline rounded bg-white">Enter</kbd> to execute shortcut</span>
                <span>Type keywords: &ldquo;bus&rdquo;, &ldquo;heavy&rdquo;, &ldquo;driver&rdquo;, &ldquo;violations&rdquo;</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- BOTTOM NAV RAIL FOR MOBILE ---------------- */}
      {isMobile && (
        <nav 
          aria-label="Mobile tab bar"
          className="fixed bottom-0 left-0 right-0 h-16 bg-white/85 dark:bg-black/85 backdrop-blur-md border-t border-border-soft flex justify-around items-center z-40 pb-safe select-none shadow-product"
        >
          {bottomNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                role="link"
                aria-current={isActive ? "page" : undefined}
                className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 text-center transition-all btn-press-active ${
                  isActive ? "text-brand-teal" : "text-ink-muted"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-[9px] font-bold tracking-tight truncate max-w-[64px]">
                  {item.name === "Command Center" ? "Home" : item.name}
                </span>
              </Link>
            );
          })}
          {showMoreButton && (
            <button
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Show more menu items"
              aria-expanded={mobileMenuOpen}
              className={`flex flex-col items-center justify-center gap-1 flex-1 py-2 text-center transition-all btn-press-active ${
                mobileMenuOpen ? "text-brand-teal" : "text-ink-muted"
              }`}
            >
              <Menu className="h-5 w-5" />
              <span className="text-[9px] font-bold tracking-tight">More</span>
            </button>
          )}
        </nav>
      )}

      {/* ---------------- TOAST STACK ---------------- */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            let color = "border-brand-blue";
            let Icon = Info;
            if (toast.type === "warning") {
              color = "border-system-orange";
              Icon = AlertTriangle;
            } else if (toast.type === "error") {
              color = "border-system-red";
              Icon = AlertTriangle;
            } else if (toast.type === "success") {
              color = "border-system-green";
              Icon = CheckCircle;
            }
            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto bg-white border-l-4 ${color} rounded-apple-md shadow-product p-4 flex gap-3 relative`}
              >
                <Icon className={`h-5 w-5 shrink-0 ${
                  toast.type === 'success' ? 'text-system-green' : 
                  toast.type === 'warning' ? 'text-system-orange' : 
                  toast.type === 'error' ? 'text-system-red' : 'text-brand-blue'
                }`} />
                <div className="flex-1">
                  <h4 className="text-xs font-semibold text-ink leading-none">{toast.title}</h4>
                  <p className="text-[11px] text-ink-muted mt-1 leading-normal">{toast.message}</p>
                </div>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="text-ink-muted hover:text-ink shrink-0 h-5 w-5 flex items-center justify-center rounded-apple-pill border border-border-soft hover:bg-background-secondary"
                >
                  <X className="h-3 w-3" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
