/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  CalendarCheck,
  BedDouble,
  Star,
  Settings,
  LogOut,
  HelpCircle,
  Ticket as TicketIcon,
  Palmtree,
  Info,
  Castle,
  UtensilsCrossed,
  Banknote,
  ExternalLink,
  Menu,
  X,
  Clock,
  ChevronRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { logout, getCurrentUser } from "@/services/api";

interface User {
  name: string;
  email: string;
  role?: string;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Əsas İdarəetmə",
    items: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Bronlar", href: "/admin/bronlar", icon: CalendarCheck },
      { name: "Biletlər", href: "/admin/tickets", icon: TicketIcon },
    ],
  },
  {
    title: "Otel və Əyləncə",
    items: [
      { name: "Otaqlar", href: "/admin/otaqlar", icon: BedDouble },
      { name: "Fəaliyyətlər", href: "/admin/activities", icon: Palmtree },
      { name: "AF Park & Aqua", href: "/admin/wonderland", icon: Castle },
      { name: "Restoranlar", href: "/admin/restaurants", icon: UtensilsCrossed },
    ],
  },
  {
    title: "Məzmun və Əlaqə",
    items: [
      { name: "Rəylər", href: "/admin/reviews", icon: Star },
      { name: "Haqqımızda", href: "/admin/about", icon: Info },
      { name: "FAQ", href: "/admin/faqs", icon: HelpCircle },
    ],
  },
  {
    title: "Sistem və Maliyyə",
    items: [
      { name: "Məzənnələr", href: "/admin/exchange-rates", icon: Banknote },
      { name: "Tənzimləmələr", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    async function loadUser() {
      const currentUser = await getCurrentUser();

      if (!currentUser) {
        router.replace("/auth/sign-in");
        return;
      }

      if (currentUser.role !== "admin") {
        router.replace("/auth/sign-in");
        return;
      }

      setUser(currentUser);
      setLoading(false);
    }

    loadUser();
  }, [router]);

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(
        new Date().toLocaleTimeString("az-AZ", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.replace("/auth/sign-in");
  };

  const getCurrentPageName = () => {
    for (const sec of navSections) {
      const found = sec.items.find((item) => item.href === pathname);
      if (found) return found.name;
    }
    return "İdarəetmə Paneli";
  };

  if (loading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0b1329] text-white">
        <div className="w-16 h-16 relative animate-pulse mb-3 bg-white p-2 rounded-2xl shadow-lg border border-white/20">
          <Image
            src="/loqo-af.png"
            alt="AF Hotel"
            fill
            className="object-contain p-1"
            priority
          />
        </div>
        <p className="text-xs font-bold text-sky-400 tracking-widest uppercase">
          AF Hotel Admin Yüklənir...
        </p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const renderNavLinks = () => (
    <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-3 py-4 space-y-5 [scrollbar-width:thin] [scrollbar-color:#334155_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
      {navSections.map((section) => (
        <div key={section.title} className="space-y-1">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5">
            {section.title}
          </p>
          <div className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${
                    isActive
                      ? "bg-gradient-to-r from-[#00b5d5] to-[#009bb8] text-white shadow-md shadow-sky-500/25"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/80"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive ? "text-white" : "text-slate-400"
                      }`}
                    />
                    <span>{item.name}</span>
                  </div>
                  {isActive && (
                    <ChevronRight className="w-3.5 h-3.5 text-white/80" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#f1f5f9]">
      {/* Desktop Sidebar (Fixed Left, Dark Executive Theme, Scrollable Middle Nav) */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 bg-[#0b1329] border-r border-slate-800/90 shadow-xl z-30">
        {/* Brand Header */}
        <div className="shrink-0 p-4 border-b border-slate-800 flex items-center justify-between bg-[#080e1e]">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-10 h-10 relative shrink-0 bg-white p-1 rounded-xl shadow-md border border-white/20">
              <Image
                src="/loqo-af.png"
                alt="AF Hotel"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white uppercase">
                  AF Hotel
                </span>
                <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-sm bg-[#00b5d5]/20 text-sky-400 border border-[#00b5d5]/30">
                  Admin
                </span>
              </div>
              <p className="text-[10px] font-medium text-slate-400 tracking-wide uppercase truncate">
                Resort & Aqua Park
              </p>
            </div>
          </Link>
        </div>

        {/* Scrollable Navigation Area */}
        {renderNavLinks()}

        {/* Footer / User Profile & Logout */}
        <div className="shrink-0 p-3 border-t border-slate-800 bg-[#080e1e] space-y-2 mt-auto">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all shadow-xs"
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Sayta Bax</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </Link>

          <div className="flex items-center justify-between px-3 py-2 bg-slate-900/90 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#00b5d5] to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                {user.name ? user.name.slice(0, 1).toUpperCase() : "A"}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">
                  {user.name}
                </p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" />
                  <span>Admin</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              title="Sistemdən Çıxış"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-64 z-50 lg:hidden flex flex-col bg-[#0b1329] border-r border-slate-800 transform transition-transform duration-200 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="shrink-0 p-4 border-b border-slate-800 flex items-center justify-between bg-[#080e1e]">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-9 h-9 relative shrink-0 bg-white p-1 rounded-xl shadow-md border border-white/20">
              <Image
                src="/loqo-af.png"
                alt="AF Hotel"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
            <span className="font-bold text-sm text-white uppercase">
              AF Hotel Admin
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {renderNavLinks()}

        <div className="shrink-0 p-3 border-t border-slate-800 bg-[#080e1e] mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sistemdən Çıxış</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Top Navbar with Crisp Contrast */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/90 px-6 py-3.5 flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
              aria-label="Menyu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 hidden sm:inline">Admin /</span>
                <h2 className="text-sm sm:text-base font-extrabold text-[#1e325c]">
                  {getCurrentPageName()}
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Aktiv
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Clock */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#00b5d5]" />
              <span>{currentTime || "..."}</span>
            </div>

            {/* Quick Visit Site */}
            <Link
              href="/"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#00b5d5] hover:bg-[#009bb8] text-white text-xs font-bold transition-all shadow-xs active:scale-95"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Sayta Keçid</span>
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-5 sm:p-7 flex-1">
          <div className="max-w-6xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
