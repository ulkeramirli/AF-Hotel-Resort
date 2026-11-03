/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarCheck,
  BedDouble,
  Banknote,
  Clock,
  Search,
  User,
  ShieldAlert,
  Loader2,
  RefreshCw,
  Plus,
  ArrowRight,
  Star,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Percent,
} from "lucide-react";
import { getDashboardStats, updateBooking } from "@/services/api";
import type { DashboardStats } from "@/types/api";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("Hamısı");
  const [searchQuery, setSearchQuery] = useState("");

  const loadData = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);
      setError(null);
      const data = await getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.message || "Xəta baş verdi");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleBookingStatus = async (id: string, currentStatus: string) => {
    const statuses = ["pending", "confirmed", "cancelled"] as const;
    const next =
      statuses[(statuses.indexOf(currentStatus as any) + 1) % statuses.length];
    setStats((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        recentBookings: prev.recentBookings?.map((b) =>
          b._id === id ? { ...b, status: next } : b
        ),
      };
    });
    try {
      await updateBooking(id, { status: next });
      loadData(true);
    } catch {
      loadData(true);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Check className="w-3 h-3 text-emerald-600" />
            Təsdiqlənib
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-600" />
            Gözləyir
          </span>
        );
      case "cancelled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
            <X className="w-3 h-3 text-rose-600" />
            Ləğv edilib
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-stone-100 text-stone-700">
            {status}
          </span>
        );
    }
  };

  const statusMap: Record<string, string> = {
    Gözləyir: "pending",
    Təsdiqlənib: "confirmed",
    "Ləğv edilib": "cancelled",
  };

  const filteredBookings = (stats?.recentBookings || []).filter((b) => {
    const matchFilter =
      activeFilter === "Hamısı" || b.status === statusMap[activeFilter];
    const guestMatch = (b.guestName || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const roomName =
      typeof b.room?.name === "object"
        ? (b.room.name as any)?.az || ""
        : b.room?.name || "";
    const matchSearch =
      guestMatch || roomName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const getNightCount = (checkIn: string, checkOut: string) => {
    try {
      const start = new Date(checkIn).getTime();
      const end = new Date(checkOut).getTime();
      const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : 1;
    } catch {
      return 1;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#1e325c]">
            İdarəetmə Paneli
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            AF Hotel & Aqua Park Resort — ümumi göstəricilər və rezervasiyalar
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadData(true)}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-white hover:bg-stone-50 border border-stone-200 text-stone-700 text-xs font-bold rounded-xl transition-all shadow-2xs active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Yenilə</span>
          </button>

          <Link
            href="/admin/otaqlar"
            className="flex items-center gap-1.5 px-4 py-2 bg-[#00b5d5] hover:bg-[#009bb8] text-white text-xs font-bold rounded-xl transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Otaq</span>
          </Link>
        </div>
      </div>

      {/* 4 Clean Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Confirmed Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">
              Təsdiqlənmiş Bronlar
            </span>
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-[#00b5d5] flex items-center justify-center">
              <CalendarCheck className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#1e325c]">
            {loading ? "..." : stats?.confirmedBookings ?? 0}
          </p>
          <p className="text-[11px] text-stone-400 mt-2">
            Ümumi {loading ? "..." : stats?.totalBookings ?? 0} sifarişdən
          </p>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">
              Təsdiq Gözləyən
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p
              className={`text-3xl font-extrabold ${
                (stats?.pendingBookings ?? 0) > 0
                  ? "text-amber-600"
                  : "text-[#1e325c]"
              }`}
            >
              {loading ? "..." : stats?.pendingBookings ?? 0}
            </p>
            {(stats?.pendingBookings ?? 0) > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                Baxış lazımdır
              </span>
            )}
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            Ləğv edilmiş: {loading ? "..." : stats?.cancelledBookings ?? 0}
          </p>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">
              Otaq Doluluğu
            </span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <p className="text-3xl font-extrabold text-[#1e325c]">
            {loading ? "..." : `${stats?.occupancyRate ?? 0}%`}
          </p>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2.5 overflow-hidden">
            <div
              className="bg-[#00b5d5] h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(stats?.occupancyRate ?? 0, 100)}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            {loading ? "..." : stats?.totalRooms ?? 0} aktiv otaq fonduna əsasən
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">
              Ümumi Gəlir
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#1e325c]">
              {loading
                ? "..."
                : Number(stats?.totalRevenue ?? 0).toLocaleString("az-AZ")}
            </p>
            <span className="text-xs font-bold text-emerald-600">AZN</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            Bu ayın bronları: +{loading ? "..." : stats?.monthlyBookings ?? 0}
          </p>
        </div>
      </div>

      {/* Quick Navigation Deck */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { name: "Otaqlar", href: "/admin/otaqlar" },
          { name: "Bronlar", href: "/admin/bronlar" },
          { name: "Restoranlar", href: "/admin/restaurants" },
          { name: "AF Park & Aqua", href: "/admin/wonderland" },
          { name: "Biletlər", href: "/admin/tickets" },
          { name: "Rəylər", href: "/admin/reviews" },
          { name: "Məzənnələr", href: "/admin/exchange-rates" },
          { name: "Tənzimləmələr", href: "/admin/settings" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-200/80 text-xs font-bold text-stone-700 hover:text-[#1e325c] transition-colors whitespace-nowrap shadow-2xs"
          >
            {item.name}
          </Link>
        ))}
      </div>

      {/* Main Grid: Recent Bookings & Right Side Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Recent Bookings Table (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs overflow-hidden">
            {/* Header + Search + Tabs */}
            <div className="p-5 border-b border-stone-100 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-[#1e325c] text-base">
                    Son Rezervasiyalar
                  </h3>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600">
                    {filteredBookings.length}
                  </span>
                </div>

                <Link
                  href="/admin/bronlar"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#00b5d5] hover:underline"
                >
                  <span>Bütün bronlar</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 pt-1">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Qonaq və ya otaq adı..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-[#00b5d5] focus:bg-white transition-all"
                  />
                </div>

                <div className="flex gap-1 bg-stone-100 p-1 rounded-xl">
                  {["Hamısı", "Gözləyir", "Təsdiqlənib", "Ləğv edilib"].map(
                    (tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveFilter(tab)}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          activeFilter === tab
                            ? "bg-white text-[#1e325c] shadow-2xs"
                            : "text-stone-500 hover:text-stone-800"
                        }`}
                      >
                        {tab}
                      </button>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Table */}
            {loading ? (
              <div className="py-16 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-[#00b5d5]" />
                <p className="text-xs text-stone-400">Yüklənir...</p>
              </div>
            ) : error ? (
              <div className="py-12 text-center text-rose-500 space-y-1">
                <ShieldAlert className="w-6 h-6 mx-auto text-rose-500" />
                <p className="text-xs font-bold">{error}</p>
              </div>
            ) : filteredBookings.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-130">
                  <thead>
                    <tr className="border-b border-stone-100 bg-stone-50/50 text-[11px] font-bold text-stone-400 uppercase">
                      <th className="py-3 px-5">Qonaq</th>
                      <th className="py-3 px-3">Otaq</th>
                      <th className="py-3 px-3">Tarix</th>
                      <th className="py-3 px-3">Məbləğ</th>
                      <th className="py-3 px-5 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredBookings.map((b) => {
                      const nights = getNightCount(b.checkIn, b.checkOut);

                      return (
                        <tr
                          key={b._id}
                          className="hover:bg-stone-50/60 transition-colors"
                        >
                          <td className="py-3 px-5">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-full bg-stone-100 text-stone-600 font-bold flex items-center justify-center text-[10px] shrink-0 border border-stone-200">
                                <User className="w-3.5 h-3.5 text-stone-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-[#1e325c] truncate">
                                  {b.guestName}
                                </p>
                                <p className="text-[10px] text-stone-400 truncate">
                                  {b.phone || b.email || "—"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-3 text-stone-600 font-semibold">
                            {typeof b.room?.name === "object"
                              ? (b.room.name as any)?.az || "Otaq"
                              : b.room?.name || "Otaq"}
                          </td>

                          <td className="py-3 px-3 text-stone-500">
                            <p className="font-medium text-stone-700">
                              {new Date(b.checkIn).toLocaleDateString("az-AZ")}{" "}
                              →{" "}
                              {new Date(b.checkOut).toLocaleDateString("az-AZ")}
                            </p>
                            <span className="text-[10px] text-stone-400">
                              {nights} gecə
                            </span>
                          </td>

                          <td className="py-3 px-3 font-bold text-stone-800">
                            {b.amount ? `${b.amount} AZN` : "—"}
                          </td>

                          <td className="py-3 px-5 text-right">
                            <button
                              onClick={() =>
                                toggleBookingStatus(b._id, b.status)
                              }
                              title="Statusu dəyişmək üçün klikləyin"
                              className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                            >
                              {getStatusBadge(b.status)}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-12 text-center text-stone-400 text-xs">
                Rezervasiya tapılmadı
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Popular Rooms & Summary */}
        <div className="space-y-5">
          {/* Top Rooms */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5">
            <div className="flex items-center justify-between mb-3.5">
              <h3 className="font-bold text-[#1e325c] text-sm">
                Ən Populyar Otaqlar
              </h3>
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            </div>

            <div className="space-y-2.5">
              {stats?.topRooms && stats.topRooms.length > 0 ? (
                stats.topRooms.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-50 border border-stone-100 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-xs text-[#1e325c]">
                        {typeof r.name === "object"
                          ? (r.name as any)?.az || ""
                          : r.name}
                      </h4>
                      <p className="text-[10px] text-stone-400">
                        {typeof r.type === "object"
                          ? (r.type as any)?.az || ""
                          : r.type}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#008ba5]">
                      {r.count} bron
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-stone-400 text-center py-4">
                  Məlumat yoxdur
                </p>
              )}
            </div>
          </div>

          {/* Statistics Summary */}
          <div className="bg-white rounded-2xl border border-stone-200/80 shadow-2xs p-5 space-y-3.5">
            <h3 className="font-bold text-[#1e325c] text-sm">
              Statistika Xülasəsi
            </h3>

            <div className="space-y-2.5 text-xs divide-y divide-stone-100">
              <div className="flex justify-between items-center pt-1">
                <span className="text-stone-500">Ümumi Rəylər</span>
                <span className="font-bold text-[#1e325c]">
                  {stats?.totalReviews ?? 0}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-stone-500">Bu Ayın Bronları</span>
                <span className="font-bold text-emerald-600">
                  +{stats?.monthlyBookings ?? 0}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-stone-500">Ləğv Edilmişlər</span>
                <span className="font-bold text-rose-600">
                  {stats?.cancelledBookings ?? 0}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2.5">
                <span className="text-stone-500">Aktiv Otaq Fondu</span>
                <span className="font-bold text-[#1e325c]">
                  {stats?.totalRooms ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
