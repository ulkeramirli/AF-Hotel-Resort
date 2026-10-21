"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Sparkles, Clock, Ticket, ArrowRight, ArrowLeft, Wand2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import useEmblaCarousel from "embla-carousel-react";
import CategoryTabs from "./CategoryTabs";
import { EmblaCarouselType } from "embla-carousel";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";
import TiltCard from "./TiltCard";
import MagneticButton from "./MagneticButton";
import DynamicIcon from "./DynamicIcon";
import { useCurrency } from "@/contexts/CurrencyContext";

const content = {
  az: { highlightsTitle: "Parkın Möhtəşəm Attrksionları", tickets: "Bilet Qiymətləri" },
  en: { highlightsTitle: "Grand Attractions of the Park", tickets: "Ticket Prices" },
  ru: { highlightsTitle: "Главные достопримечательности парка", tickets: "Стоимость билетов" },
};

export default function Wonderland() {
  const { language } = useLanguage();
  const { currency } = useCurrency();
  const l = (language as "az" | "en" | "ru") || "az";
  const c = content[l];
  const [activeTab, setActiveTab] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "center",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, []);

  const [wonderland, setWonderland] = useState<any>(null);
  const [rates, setRates] = useState<{ usd: number; eur: number } | null>(null);

  useEffect(() => {
    fetch("/api/wonderland")
      .then((res) => res.headers.get("content-type")?.includes("application/json") ? res.json() : { wonderland: null })
      .then((data) => setWonderland(data.wonderland))
      .catch(console.error);
      
    fetch("/api/exchange-rates")
      .then(res => res.headers.get("content-type")?.includes("application/json") ? res.json() : { success: false })
      .then(data => {
        if (data.success) setRates(data.data);
      })
      .catch(console.error);
  }, [l]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("reInit", onSelect);
    emblaApi.on("select", onSelect);
    requestAnimationFrame(() => {
      if (emblaApi) onSelect(emblaApi);
    });
    return () => {
      emblaApi.off("reInit", onSelect);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect, activeTab]);

  const active = wonderland?.bigAttractions?.[activeTab];

  const isFree = (p: string | number) => ['0', 'ödənişsiz', 'free', 'бесплатно'].includes(String(p).toLowerCase().trim());
  const freeText = { az: 'Ödənişsiz', en: 'Free', ru: 'Бесплатно' }[l] || 'Ödənişsiz';

  const formatPriceString = (price: string | number) => {
    if (!price) return price;
    if (isFree(price)) return freeText;
    
    let str = String(price);
    let usdRate = rates?.usd || 1.7;
    let eurRate = rates?.eur || 1.85;
    
    if (currency === "USD") {
      str = str.replace(/\d+/g, (match) => Math.ceil(parseInt(match) / usdRate).toString());
      str = str.replace(/AZN|azn|₼/g, "$");
    } else if (currency === "EUR") {
      str = str.replace(/\d+/g, (match) => Math.ceil(parseInt(match) / eurRate).toString());
      str = str.replace(/AZN|azn|₼/g, "€");
    }
    
    return str;
  };

  return (
    <section id="wonderland" className="pt-12 pb-16 md:pt-20 md:pb-24 relative overflow-hidden scroll-mt-10 bg-[#f8fafc] perspective-1000">
      {/* Background Magic Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[10%] left-[5%] w-[40%] h-[40%] rounded-full bg-linear-to-r from-[#00b5d5]/10 to-[#ff6c02]/5 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[5%] w-[50%] h-[50%] rounded-full bg-linear-to-l from-[#ff6c02]/10 to-transparent blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10 space-y-20 md:space-y-28">
        
        {/* Header Section */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-4">
          <ScrollReveal type="dropIn" delay={0.1}>
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white border border-stone-200 shadow-sm relative overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-stone-100 to-transparent -translate-x-full group-hover:animate-shimmer" />
              <Wand2 className="w-4 h-4 text-[#ff6c02] animate-pulse" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#1e325c]">
                {typeof wonderland?.tag === 'object' ? (wonderland.tag[l] || wonderland.tag.az || "WONDERLAND") : (wonderland?.tag || "WONDERLAND")}
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal type="fadeUp" delay={0.2}>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-[#1e325c] tracking-wide font-serif leading-tight relative inline-block mt-2">
              AF PARK
              <Sparkles className="absolute -top-6 -right-10 w-8 h-8 text-[#ff6c02] opacity-70" />
            </h2>
            <div className="mt-6 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-linear-to-r from-[#ff6c02] to-[#ff9800] rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity duration-500 animate-pulse" />
                <div className="relative flex items-center gap-2.5 px-6 py-2.5 bg-white/90 backdrop-blur-md border border-[#ff6c02]/30 rounded-full shadow-[0_8px_20px_rgba(255,108,2,0.1)]">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6c02] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff6c02]"></span>
                  </span>
                  <span className="text-[11px] sm:text-[12px] font-extrabold uppercase tracking-[0.2em] text-[#ff6c02]">
                    {l === 'az' ? 'Açıldı' : l === 'ru' ? 'Открылся' : 'Opened'}
                  </span>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal type="zoomIn" delay={0.3} className="w-full">
            <div 
              className="text-sm md:text-base text-stone-500 font-light leading-relaxed max-w-lg mx-auto mt-4 text-center w-[95%] sm:w-full px-2"
              dangerouslySetInnerHTML={{ __html: String(typeof wonderland?.description === 'object' ? (wonderland.description[l] || wonderland.description.az || "Description") : (wonderland?.description || "Description")).replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ') }}
            />
          </ScrollReveal>
        </div>

        {/* Highlights / Small Attractions */}
        <div className="space-y-10">
          <div className="flex items-center justify-center gap-4">
            <div className="h-px w-10 sm:w-16 bg-linear-to-r from-transparent via-[#00b5d5]/60 to-transparent shrink-0" />
            <h3 className="text-xs uppercase font-semibold tracking-[0.2em] text-stone-500 text-center">
              {c.highlightsTitle}
            </h3>
            <div className="h-px w-10 sm:w-16 bg-linear-to-r from-transparent via-[#ff6c02]/60 to-transparent shrink-0" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
            {wonderland?.smallAttractions?.map((h:any, i:any) => {
              const gradients = [
                { bg: 'from-[#00b5d5]/10 to-[#00b5d5]/5', border: 'hover:border-[#00b5d5]/40', accent: '#00b5d5', num: 'bg-[#00b5d5]' },
                { bg: 'from-[#ff6c02]/10 to-[#ff6c02]/5', border: 'hover:border-[#ff6c02]/40', accent: '#ff6c02', num: 'bg-[#ff6c02]' },
                { bg: 'from-[#1e325c]/10 to-[#1e325c]/5', border: 'hover:border-[#1e325c]/40', accent: '#1e325c', num: 'bg-[#1e325c]' },
                { bg: 'from-[#10b981]/10 to-[#10b981]/5', border: 'hover:border-[#10b981]/40', accent: '#10b981', num: 'bg-[#10b981]' }, // Added 4th color (emerald)
              ];
              const g = gradients[i % 4];
              return (
                <TiltCard key={i} tiltAmount={4}>
                  <ScrollReveal type="zoomIn" delay={i * 0.12}
                    className={`h-full relative group bg-white rounded-2xl sm:rounded-3xl border border-stone-100 ${g.border} shadow-[0_4px_24px_rgba(30,50,92,0.04)] overflow-hidden transition-all duration-500 hover:shadow-[0_20px_48px_rgba(30,50,92,0.10)] hover:-translate-y-1 flex flex-col`}
                  >
                    {/* Top gradient stripe */}
                    <div className={`h-1.5 w-full bg-linear-to-r from-current to-current`} style={{ background: `linear-gradient(90deg, ${g.accent}99, ${g.accent}33)` }} />

                    {/* Blurred background blob */}
                    <div className={`absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-linear-to-br ${g.bg} blur-xl group-hover:scale-125 transition-transform duration-700`} />

                    <div className="relative z-10 p-5 sm:p-6 flex flex-col flex-1 min-h-35 sm:min-h-40">
                      {/* Top row: icon + number badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div 
                          className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-linear-to-br ${g.bg} flex items-center justify-center border border-stone-100 shadow-sm group-hover:scale-110 group-hover:-rotate-6 transition-all duration-500`}
                          style={{ color: g.accent }}
                        >
                          <DynamicIcon name={h?.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
                        </div>
                        <span className={`${g.num} text-white text-[10px] sm:text-[11px] font-bold w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center shadow-md shrink-0`}>{i + 1}</span>
                      </div>

                      {/* Text */}
                      <h4 className="text-[13px] sm:text-[15px] md:text-base font-bold text-[#1e325c] mb-2 leading-snug group-hover:text-[#00b5d5] transition-colors duration-300 line-clamp-2">
                        {(h?.name as any)?.[l] || (h?.name as any)?.az || 'Name'}
                      </h4>
                      <div className="text-[11px] sm:text-xs md:text-[13px] text-stone-500 leading-relaxed prose prose-stone [&>p]:mb-0 line-clamp-3" dangerouslySetInnerHTML={{ __html: (h?.description as any)?.[l] || (h?.description as any)?.az || 'Desc' }} />

                      {/* Bottom accent line */}
                      <div className="mt-auto pt-4 border-t border-stone-100">
                        <div className="w-8 h-0.5 rounded-full transition-all duration-500 group-hover:w-14" style={{ background: g.accent }} />
                      </div>
                    </div>
                  </ScrollReveal>
                </TiltCard>
              );
            })}
          </div>
        </div>

        {/* Dynamic Attractions Slider */}
        <ScrollReveal type="fadeUp" delay={0.1} className="relative z-20">
          <div className="bg-white rounded-[3rem] p-6 md:p-12 lg:p-16 border border-stone-100 shadow-[0_20px_60px_rgba(30,50,92,0.06)] relative overflow-hidden">
            
            {/* Background glowing blob for slider area */}
            <div className="absolute top-0 right-0 w-125 h-125 bg-linear-to-br from-[#00b5d5]/5 to-transparent rounded-full blur-3xl pointer-events-none" />

            <ScrollReveal type="fadeDown" delay={0.3} className="relative z-10 flex justify-center mb-8 md:mb-12">
              {wonderland?.bigAttractions?.length > 0 && (
                <div className="w-full flex justify-center">
                  <CategoryTabs
                    categories={wonderland.bigAttractions.map((t:any, i:any) => ({
                      id: String(i),
                      label: (t.title as any)?.[l] || (t as any).title || "Tab"
                    }))}
                    activeId={String(activeTab)}
                    onSelect={(id) => {
                      setActiveTab(Number(id));
                      emblaApi?.scrollTo(0);
                    }}
                    className="justify-center gap-3"
                  />
                </div>
              )}
            </ScrollReveal>

            <ScrollReveal type="slideLeft" delay={0.4} className="overflow-hidden -mx-6 md:-mx-12 lg:-mx-16 px-6 md:px-12 lg:px-16">
              <div ref={emblaRef}>
                <div className="flex gap-6 md:gap-10 py-6">
                  {active?.games?.map((game: any, i: number) => (
                    <div key={i} className="flex-none w-[80vw] sm:w-[45vw] md:w-[35vw] lg:w-[28vw] xl:w-[22vw] group relative rounded-[2.5rem] cursor-grab active:cursor-grabbing hover:-translate-y-4 transition-all duration-500 ease-out perspective-1000">
                      <div className="absolute inset-0 bg-[#ff6c02]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl scale-95 -z-10" />
                      
                      <div className="relative bg-white rounded-[2.5rem] border border-stone-100 shadow-[0_10px_30px_rgba(30,50,92,0.08)] group-hover:shadow-[0_30px_60px_rgba(0,181,213,0.15)] h-full flex flex-col overflow-hidden transition-all duration-500 transform-gpu group-hover:rotate-y-2 group-hover:rotate-x-2">
                        
                        {/* Image Container */}
                        <div className="relative h-60 md:h-64 overflow-hidden bg-stone-100">
                          <Image src={game.image} alt={(game.name as any)?.[l] || (game.name as any)?.az || "Game"} fill sizes="(max-width: 640px) 85vw, 40vw" className="object-cover transition-transform duration-1000 group-hover:scale-110" />
                          <div className="absolute inset-0 bg-linear-to-t from-[#1e325c]/90 via-[#1e325c]/20 to-transparent" />
                          
                          {/* Title overlaying image for dramatic effect */}
                          <div className="absolute bottom-6 left-6 right-6">
                            <h3 className="font-serif font-semibold text-lg md:text-xl text-white group-hover:text-[#00b5d5] transition-colors drop-shadow-lg">
                        {(game.name as any)?.[l] || (game.name as any)?.az || "Game"}
                      </h3>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 flex-1 bg-white relative">
                        <div className="absolute -top-4 right-8 w-12 h-12 bg-[#ff6c02] rounded-2xl rotate-12 flex items-center justify-center text-white shadow-[0_8px_20px_rgba(255,108,2,0.4)] group-hover:rotate-24 group-hover:scale-110 transition-all duration-500">
                          <Ticket className="w-6 h-6" />
                        </div>
                        <div className="text-xs md:text-sm text-stone-500 font-medium leading-relaxed prose prose-stone [&>p]:mb-0 pt-2" dangerouslySetInnerHTML={{ __html: typeof game.description === 'object' ? (game.description[l] || game.description.az || "Desc") : (game.description || "Desc") }} />
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </div>
            </ScrollReveal>

            <ScrollReveal type="fadeUp" delay={0.5} className="flex gap-4 justify-center mt-6 lg:mt-8 relative z-10">
              <button
                onClick={scrollPrev}
                disabled={!prevBtnEnabled}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-md hover:scale-110 active:scale-95 ${
                  prevBtnEnabled
                    ? 'bg-[#ff6c02] border-[#ff6c02] text-white hover:bg-[#e05e00] hover:border-[#e05e00] shadow-[0_4px_16px_rgba(255,108,2,0.35)]'
                    : 'bg-stone-50 border-stone-200 text-stone-300 cursor-not-allowed opacity-50'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollNext}
                disabled={!nextBtnEnabled}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 border-2 shadow-md hover:scale-110 active:scale-95 ${
                  nextBtnEnabled
                    ? 'bg-[#ff6c02] border-[#ff6c02] text-white hover:bg-[#e05e00] hover:border-[#e05e00] shadow-[0_4px_16px_rgba(255,108,2,0.35)]'
                    : 'bg-stone-50 border-stone-200 text-stone-300 cursor-not-allowed opacity-50'
                }`}
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </ScrollReveal>
          </div>
        </ScrollReveal>

        {/* Tickets & Info Area */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Tickets */}
          <ScrollReveal type="slideRight" delay={0.3} className="xl:col-span-7 bg-white border border-stone-100 rounded-4xl p-5 md:p-6 relative overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-80 h-80 bg-stone-50 rounded-full blur-3xl group-hover:bg-[#00b5d5]/5 transition-colors duration-1000" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10 border-b border-stone-100 pb-4">
              <h3 className="font-serif text-xl md:text-2xl text-[#1e325c] flex items-center gap-2.5 font-medium">
                <Ticket className="w-5 h-5 text-[#ff6c02]" />
                {c.tickets}
              </h3>
            </div>
            
            <div className="flex flex-col gap-3 relative z-10">
              {wonderland?.tickets?.map((ticket: any) => (
                <div key={ticket._id} className="relative bg-stone-50/50 rounded-xl border border-stone-200 hover:border-[#00b5d5]/50 transition-all duration-300 hover:shadow-sm overflow-hidden group/ticket flex flex-col justify-center min-h-12.5">
                  
                  {/* Perforations for real ticket look */}
                  <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-r border-stone-200 group-hover/ticket:border-[#00b5d5]/50 transition-colors" />
                  <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-l border-stone-200 group-hover/ticket:border-[#00b5d5]/50 transition-colors" />
                  
                  <div className="flex justify-between items-center px-4 py-2 border-l-2 border-dashed border-stone-200 group-hover/ticket:border-[#ff6c02]/40 ml-3 transition-colors">
                    <span className="text-sm font-medium text-stone-700 pr-4">
                      {typeof ticket.name === 'object' ? (ticket.name[l] || ticket.name.az || "Ticket") : (ticket.name || "Ticket")}
                    </span>
                    <span className="text-sm md:text-base font-bold text-[#ff6c02] whitespace-nowrap">
                      {formatPriceString(ticket.price)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollReveal>

          {/* Special Offer & Info */}
          <ScrollReveal type="slideLeft" delay={0.4} className="xl:col-span-5 flex flex-col gap-6">
            <div className="bg-white rounded-4xl p-5 md:p-6 border border-stone-100 flex items-center gap-5 shadow-sm hover:shadow-md transition-all duration-500 group">
              <div className="w-12 h-12 rounded-xl bg-stone-50 flex items-center justify-center text-[#00b5d5] shrink-0 border border-stone-200 shadow-sm group-hover:scale-110 transition-transform duration-500">  
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.15em] text-stone-500 font-medium mb-0.5">İş Saatları</p>
                <p className="text-lg font-bold text-[#1e325c] tracking-wide">{wonderland?.workingHours}</p>
              </div>
            </div>

            {wonderland?.discount?.enabled && (
              <div className="flex-1 rounded-4xl p-6 md:p-8 relative overflow-hidden bg-[#1e325c] shadow-md group cursor-default border border-[#1e325c]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b5d5]/10 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#ff6c02]/5 rounded-full blur-3xl" />
                
                <div className="relative z-10 flex flex-col h-full justify-center text-white">
                  <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-[10px] font-medium uppercase tracking-[0.15em] rounded-full w-fit mb-4 border border-white/10">
                    Xüsusi Təklif
                  </span>
                  <h4 className="font-serif text-white text-4xl md:text-5xl font-medium tracking-wide mb-3 drop-shadow-sm">
                    {wonderland.discount.percentage}% Endirim
                  </h4>
                  <p className="text-white/80 text-sm font-light mb-6 max-w-55 leading-relaxed">
                    {(wonderland as any)?.specialOffer?.text?.[l] || "Xüsusi təklif mətni"}
                  </p>
                  <MagneticButton>
                    <button className="flex items-center gap-2 bg-white text-[#1e325c] hover:bg-stone-50 px-6 py-3 rounded-xl font-medium uppercase tracking-wider text-xs transition-all shadow-sm mt-1">
                      <Ticket className="w-4 h-4 text-[#ff6c02]" />
                      {(wonderland as any)?.specialOffer?.btnText?.[l] || "Buy Tickets"}
                    </button>
                  </MagneticButton>
                </div>
              </div>
            )}
          </ScrollReveal>
        </div>

      </div>
    </section>
  );
}