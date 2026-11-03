"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Sparkles, Clock, Phone, ChefHat, Utensils, Coffee, Wine, Calendar, Search, Loader2 , ExternalLink} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import CategoryTabs from "./CategoryTabs";
import ScrollReveal from "@/components/ScrollReveal";
import { motion, AnimatePresence } from "framer-motion";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";
import TextReveal from "./TextReveal";
import { getRestaurants, getRestaurantSettings } from "@/services/api";
import type { Restaurant, MenuCategory as ApiMenuCategory, MenuItem as ApiMenuItem, RestaurantSettings } from "@/types/api";

type LangType = "az" | "en" | "ru";

// İkon seçimi — kateqoriya adına görə uyğun ikon qaytarır
function getCategoryIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("bar") || lower.includes("kokteyl") || lower.includes("cocktail") || lower.includes("şərab") || lower.includes("wine")) return Wine;
  if (lower.includes("səhər") || lower.includes("breakfast") || lower.includes("завтрак") || lower.includes("coffee") || lower.includes("qəhvə")) return Coffee;
  if (lower.includes("desert") || lower.includes("dessert") || lower.includes("десерт") || lower.includes("snek") || lower.includes("snack") || lower.includes("закуск")) return Utensils;
  return ChefHat;
}

interface LanguageLabels {
  tag: string;
  title: string;
  subtitle: string;
  hours: string;
  breakfast: string;
  lunch: string;
  dinner: string;
  reserve: string;
  call: string;
  viewMenu: string;
  searchPlaceholder: string;
  noResults: string;
  loading: string;
  noRestaurants: string;
  moreInfo: string;
  onlineMenu: string;
  menuShowcaseTitle: string;
  menuShowcaseDesc: string;
  menuShowcaseBtn: string;
}

const labels: Record<LangType, LanguageLabels> = {
  az: {
    tag: "",
    title: "",
    subtitle: "",
    hours: "İş saatları",
    breakfast: "Səhər yeməyi",
    lunch: "Nahar",
    dinner: "Şam yeməyi",
    reserve: "Rezerv et",
    call: "Zəng et",
    viewMenu: "Menyu ilə tanış olun",
    searchPlaceholder: "Menyuda axtar...",
    noResults: "Təam tapılmadı.",
    loading: "Yüklənir...",
    noRestaurants: "Restoran tapılmadı.",
    moreInfo: "Ətraflı məlumat",
    onlineMenu: "Onlayn Menyu",
    menuShowcaseTitle: "Onlayn Menyu",
    menuShowcaseDesc: "Menyu və qiymətlərlə tanış olmaq üçün keçid edin.",
    menuShowcaseBtn: "Menyuya bax",
  },
  ru: {
    tag: "",
    title: "",
    subtitle: "",
    hours: "Часы работы",
    breakfast: "Завтрак",
    lunch: "Обед",
    dinner: "Ужин",
    reserve: "Забронировать",
    call: "Позвонить",
    viewMenu: "Изучить меню",
    searchPlaceholder: "Найти в меню...",
    noResults: "Блюдо не найдено.",
    loading: "Загрузка...",
    noRestaurants: "Ресторан не найден.",
    moreInfo: "Подробнее",
    onlineMenu: "Онлайн меню",
    menuShowcaseTitle: "Меню ресторана",
    menuShowcaseDesc: "Чтобы посмотреть блюда и цены, перейдите в онлайн-меню.",
    menuShowcaseBtn: "Открыть меню",
  },
  en: {
    tag: "",
    title: "",
    subtitle: "",
    hours: "Opening Hours",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    reserve: "Book a Table",
    call: "Call Us",
    viewMenu: "Explore Menu",
    searchPlaceholder: "Search menu...",
    noResults: "Dish not found.",
    loading: "Loading...",
    noRestaurants: "No restaurants found.",
    moreInfo: "More details",
    onlineMenu: "Online Menu",
    menuShowcaseTitle: "Restaurant Menu",
    menuShowcaseDesc: "View our full menu and prices online.",
    menuShowcaseBtn: "Open Menu",
  },
};

export default function Restoran() {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const l = language || "az";
  const c = labels[l] || labels.az;

  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeRest, setActiveRest] = useState<number>(0);
  const [rates, setRates] = useState<{ usd: number; eur: number } | null>(null);

  const formatPrice = (priceAzn: number) => {
    if (currency === "USD" && rates?.usd) {
      return `$${(priceAzn / rates.usd).toFixed(2)}`;
    } else if (currency === "EUR" && rates?.eur) {
      return `€${(priceAzn / rates.eur).toFixed(2)}`;
    }
    return `${priceAzn} AZN`;
  };

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [rests, sets, ratesRes] = await Promise.all([
          getRestaurants(),
          getRestaurantSettings(),
          fetch("/api/exchange-rates").then(r => r.json())
        ]);
        setRestaurants(rests);
        if (sets) setSettings(sets);
        if (ratesRes?.success && ratesRes?.data) setRates(ratesRes.data);
      } catch (error) {
        console.error("Restoran məlumatları yüklənmədi:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [l]);

  const currentRestaurant = restaurants[activeRest] || restaurants[0];

  const handleRestaurantChange = (index: number) => {
    setActiveRest(index);
  };

  const loc = (obj: any) => {
    if (!obj) return "";
    if (typeof obj === "string") return obj;
    return obj[l] || obj.az || "";
  };

  // İş saatları schedule array olaraq formatla
  const getSchedule = () => {
    if (!currentRestaurant?.workingHours) return [];
    const wh = currentRestaurant.workingHours;
    const schedule: { meal: string; time: string }[] = [];
    if (wh.breakfast) schedule.push({ meal: c.breakfast, time: wh.breakfast });
    if (wh.lunch) schedule.push({ meal: c.lunch, time: wh.lunch });
    if (wh.dinner) schedule.push({ meal: c.dinner, time: wh.dinner });
    return schedule;
  };

  if (loading) {
    return (
      <section id="restoran" className="py-24 md:py-32 bg-transparent scroll-mt-20">
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-[#00b5d5]" />
          <span className="ml-3 text-sm text-stone-500">{c.loading}</span>
        </div>
      </section>
    );
  }

  if (restaurants.length === 0) {
    return (
      <section id="restoran" className="py-24 md:py-32 bg-transparent scroll-mt-20">
        <div className="text-center py-20 text-stone-400 text-sm">{c.noRestaurants}</div>
      </section>
    );
  }

  const schedule = getSchedule();

  return (
    <section id="restoran" className="pt-12 pb-16 md:pt-20 md:pb-24 bg-transparent scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16 space-y-12 md:space-y-16">
        
        {/* Header & Tabs Container */}
        <div className="flex flex-col items-center justify-center mb-16 gap-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ease: 'easeOut', duration: 0.45 }}
            className="space-y-4 flex flex-col items-center w-full max-w-3xl px-4"
          >
            <div className="flex items-center justify-center gap-4">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                style={{ originX: 0.5 }}
                className="w-12 h-px bg-[#00b5d5]"
              />
              <motion.span
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] text-[#00b5d5]"
              >
                {loc(settings?.tag) || c.tag}
              </motion.span>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
                style={{ originX: 0.5 }}
                className="w-12 h-px bg-[#00b5d5]"
              />
            </div>
            <h2 className="text-2xl md:text-4xl lg:text-4xl font-medium text-[#1e325c] tracking-wide font-serif leading-tight text-center w-full max-w-2xl mx-auto">
              <TextReveal key={loc(settings?.title)} text={loc(settings?.title) || c.title} delay={0.1} center />
            </h2>
            <div 
              className="text-[13px] md:text-sm font-medium text-stone-500 leading-relaxed max-w-lg mx-auto w-[95%] sm:w-full text-center px-2"
              dangerouslySetInnerHTML={{ __html: String(loc(settings?.subtitle) || c.subtitle || "").replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') }}
            />
          </motion.div>

          {restaurants.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ease: 'easeOut', duration: 0.45, delay: 0.15 }}
              className="flex justify-center w-full mt-4"
            >
              <div className="flex flex-row flex-wrap justify-center gap-2 md:gap-4 bg-stone-100/50 p-2 md:p-3 rounded-2xl md:rounded-4xl border border-stone-200/60 backdrop-blur-md shadow-sm w-full max-w-4xl">
                {restaurants.map((r, i) => {
                  const isActive = activeRest === i;
                  const IconComponent = getCategoryIcon(loc(r.name));
                  return (
                    <button
                      key={i}
                      onClick={() => handleRestaurantChange(i)}
                      className={`relative p-3 md:p-5 rounded-xl md:rounded-3xl flex flex-col items-center md:items-start text-center md:text-left gap-1 transition-all cursor-pointer flex-1 shrink-0 min-w-35 md:min-w-0 ${
                        isActive
                          ? "bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-stone-100 scale-[1.02]"
                          : "hover:bg-white/60 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 md:gap-2">
                        <IconComponent className={`w-3.5 h-3.5 md:w-4 md:h-4 ${isActive ? "text-[#00b5d5]" : "text-stone-400"}`} />
                        <span className={`text-[12px] md:text-[13px] font-semibold tracking-wide ${isActive ? "text-[#1e325c]" : "text-stone-500"}`}>
                          {loc(r.name)}
                        </span>
                      </div>
                      {loc(r.description) && (
                        <span className="text-[10px] md:text-[11px] text-stone-400 font-medium line-clamp-1 w-full text-center md:text-left mt-0.5" dangerouslySetInnerHTML={{ __html: loc(r.description) }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Əsas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Sol info panel */}
          <ScrollReveal direction="left" delay={0.3} className="lg:col-span-5 space-y-6">
            <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden shadow-md group">
              {currentRestaurant.image ? (
                <Image
                  src={currentRestaurant.image}
                  alt={loc(currentRestaurant.name)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-[#1e325c] to-[#00b5d5]" />
              )}
              <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="text-[10px] uppercase tracking-widest font-bold bg-[#00b5d5] px-2.5 py-1 rounded-md">
                  Hotel Concept
                </span>
                <h3 className="text-xl md:text-2xl font-bold mt-2 text-white">{loc(currentRestaurant.name)}</h3>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200/50 shadow-xs space-y-4">
              <div className="text-stone-600 text-sm leading-relaxed prose prose-sm prose-stone [&>p]:mb-2" dangerouslySetInnerHTML={{ __html: loc(currentRestaurant.description) }} />
              <hr className="border-stone-100" />
              
              {schedule.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-xs uppercase tracking-widest text-[#1e325c] flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-[#00b5d5]" />
                    {c.hours}
                  </h4>
                  <div className="space-y-2 bg-stone-50/50 p-3 rounded-xl border border-stone-100">
                    {schedule.map((s, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-stone-500 font-medium">{s.meal}</span>
                        <span className="font-bold text-[#1e325c]">{s.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {currentRestaurant.phone && (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <MagneticButton className="w-full block">
                    <a href={`tel:${currentRestaurant.phone.replace(/\s+/g, "")}`} className="flex items-center justify-center gap-2 px-4 py-3 bg-[#1e325c] hover:bg-[#162545] text-white text-xs font-medium rounded-xl transition-colors shadow-xs w-full">
                      <Calendar className="w-3.5 h-3.5" /> {c.reserve}
                    </a>
                  </MagneticButton>
                  <MagneticButton className="w-full block">
                    <a href={`tel:${currentRestaurant.phone.replace(/\s+/g, "")}`} className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium rounded-xl transition-colors w-full">
                      <Phone className="w-3.5 h-3.5 text-[#00b5d5]" /> {c.call}
                    </a>
                  </MagneticButton>
                </div>
              )}
            </div>
          </ScrollReveal>

          {/* Sağ hissə: Onlayn Menyu Təqdimatı */}
          <ScrollReveal direction="right" delay={0.4} className="lg:col-span-7">
            <div className="bg-white rounded-4xl p-6 sm:p-8 md:p-10 border border-stone-100 shadow-sm relative overflow-hidden flex flex-col justify-between group">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#00b5d5]/5 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
                  <div className="w-10 h-10 rounded-xl bg-sky-50 text-[#00b5d5] flex items-center justify-center shrink-0">
                    <Utensils className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#1e325c] font-medium">
                      {c.menuShowcaseTitle}
                    </h3>
                  </div>
                </div>

                <p className="text-stone-500 text-sm sm:text-base leading-relaxed">
                  {c.menuShowcaseDesc}
                </p>
              </div>

              <div className="relative z-10 pt-6">
                <a
                  href="https://menu.afhotel.az/#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1e325c] hover:bg-[#00b5d5] text-white text-xs sm:text-sm font-semibold transition-all duration-300 shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] group/btn cursor-pointer"
                >
                  <span>{c.menuShowcaseBtn}</span>
                  <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>
          </ScrollReveal>

        </div>
      </div>
    </section>
  );
}