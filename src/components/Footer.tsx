'use client';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import MagneticButton from './MagneticButton';
import { Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

export default function Footer() {
  const pathname = usePathname();
  const { language, t } = useLanguage();
  const currentLang = language;
  const { settings } = useSettings();

  const [email, setEmail] = useState('');
  const [subStatus, setSubStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  if (pathname.startsWith('/admin') || pathname.startsWith('/auth') || pathname.startsWith('/login') || pathname.startsWith('/account') || pathname.startsWith('/rooms/')) return null;

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubStatus('loading');
    setTimeout(() => {
      setSubStatus('success');
      setEmail('');
      setTimeout(() => setSubStatus('idle'), 3000);
    }, 1000);
  };

  return (
    <footer className="relative bg-[#f4f9fa] text-[#1e325c] border-t border-stone-200/60 shadow-[0_-10px_30px_rgba(30,50,92,0.03)] overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-6 lg:px-16 relative z-10">

        {/* Main grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 py-10 lg:py-12 border-b border-[#00b5d5]/10 items-center">

          {/* Brand column */}
          <div className="lg:col-span-4 space-y-5">
            <div className="relative flex items-center transform transition-transform hover:scale-105 duration-500 origin-left w-fit">
              <Image
                src="/loqo-af.png"
                alt="AF Hotel & Resort"
                width={120}
                height={50}
                priority
                className="w-24 h-auto object-contain drop-shadow-sm"
                style={{ width: 'auto', height: 'auto' }}
              />
            </div>
            <p className="text-xs text-stone-600 font-light leading-relaxed max-w-sm">
              {t.footer.desc}
            </p>

            {/* Contact info */}
            <div className="space-y-3 pt-1">
              <a href="tel:+994502233285" className="flex items-center gap-3 text-xs text-stone-600 hover:text-[#ff6c02] transition-colors group">
                <div className="w-7 h-7 rounded-full bg-[#00b5d5]/10 flex items-center justify-center group-hover:bg-[#ff6c02]/10 group-hover:scale-110 transition-all">
                  <Phone className="w-3 h-3 text-[#00b5d5] group-hover:text-[#ff6c02] transition-colors" />
                </div>
                <span className="font-medium tracking-wide">+994 50 223 32 85</span>
              </a>
              <div className="flex items-start gap-3 text-xs text-stone-600 group">
                <div className="w-7 h-7 rounded-full bg-[#00b5d5]/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-all">
                  <MapPin className="w-3 h-3 text-[#00b5d5]" />
                </div>
                <span className="font-light leading-relaxed mt-1">
                  {(settings?.address as any)?.[currentLang] || 'Novkhani Beach Road, Baku, Azerbaijan'}
                </span>
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3.5 pt-2">
              {settings?.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #f58529, #dd2a7b, #8134af)' }}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              )}
              {settings?.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-lg"
                  style={{ background: '#1877F2' }}
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
              )}
              {settings?.tiktok && (
                <a
                  href={settings.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white transition-all hover:scale-110 hover:-translate-y-1 shadow-md hover:shadow-lg bg-black"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.27 8.27 0 004.84 1.56V6.79a4.85 4.85 0 01-1.07-.1z"/>
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Navigation columns */}
          <div className="lg:col-span-5 grid grid-cols-2 md:grid-cols-3 gap-6 text-[13px]">
            <div className="space-y-3">
              <h4 className="font-serif text-base font-semibold text-[#1e325c]">The Resort</h4>
              <div className="flex flex-col space-y-2 font-light text-stone-600">
                <a href="#about" className="hover:text-[#ff6c02] hover:translate-x-1 transition-all duration-300 inline-block w-fit">{t.footer.aboutUs}</a>
                <a href="#rooms" className="hover:text-[#ff6c02] hover:translate-x-1 transition-all duration-300 inline-block w-fit">{t.nav.rooms}</a>
                <a href="#aquapark" className="hover:text-[#ff6c02] hover:translate-x-1 transition-all duration-300 inline-block w-fit">{t.nav.aquapark}</a>
                <a href="#restoran" className="hover:text-[#ff6c02] hover:translate-x-1 transition-all duration-300 inline-block w-fit">{t.nav.restoran}</a>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-serif text-base font-semibold text-[#1e325c]">Experience</h4>
              <div className="flex flex-col space-y-2 font-light text-stone-600">
                <a href="#aquapark" className="hover:text-[#ff6c02] hover:translate-x-1 transition-all duration-300 inline-block w-fit">{t.footer.waterSlides}</a>
                <a href="#restoran" className="hover:text-[#ff6c02] hover:translate-x-1 transition-all duration-300 inline-block w-fit">{t.footer.poolsideBars}</a>
                <a href="#contacts" className="hover:text-[#ff6c02] hover:translate-x-1 transition-all duration-300 inline-block w-fit">{t.footer.privateBeach}</a>
              </div>
            </div>

            <div className="space-y-3 col-span-2 md:col-span-1">
              <h4 className="font-serif text-base font-semibold text-[#1e325c] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#00b5d5]" />
                Hours
              </h4>
              <div className="space-y-2 font-light text-stone-600 text-xs">
                <div className="flex justify-between gap-3 border-b border-[#00b5d5]/10 pb-1.5">
                  <span>Reception</span>
                  <span className="font-medium text-[#1e325c]">{settings?.reception || '24 / 7'}</span>
                </div>
                <div className="flex justify-between gap-3 border-b border-[#00b5d5]/10 pb-1.5">
                  <span>Aqua Park</span>
                  <span className="font-medium text-[#1e325c]">{settings?.aquapark || '09:00 – 20:00'}</span>
                </div>
                <div className="flex justify-between gap-3 pb-1">
                  <span>Restaurant</span>
                  <span className="font-medium text-[#1e325c]">{settings?.dining || '08:00 – 23:00'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-3 space-y-3 ml-auto w-full pl-6 lg:pl-10">
            <h4 className="font-serif text-base font-semibold text-[#1e325c]">{t.footer.subscribeTitle}</h4>
            <p className="text-xs text-stone-600 font-light leading-relaxed">{t.footer.subscribeDesc}</p>

            <form onSubmit={handleSubscribe} className="space-y-2.5 pt-1">
              <div className="relative group">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.footer.placeholder}
                  className="w-full bg-white border border-[#00b5d5]/20 rounded-lg px-4 py-2.5 text-xs font-light text-[#1e325c] placeholder-stone-400 outline-none focus:border-[#00b5d5] focus:ring-2 focus:ring-[#00b5d5]/10 transition-all shadow-sm"
                  disabled={subStatus === 'loading'}
                />
              </div>
              <MagneticButton>
                <button
                  type="submit"
                  disabled={subStatus === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-[#ff6c02] to-[#e55f00] hover:from-[#e55f00] hover:to-[#cc5500] text-white font-medium text-xs uppercase tracking-wide px-5 py-2.5 rounded-lg transition-all cursor-pointer disabled:opacity-50 shadow-md hover:shadow-lg hover:shadow-[#ff6c02]/20 hover:-translate-y-0.5 duration-300"
                >
                  {subStatus === 'loading' ? '...' : t.footer.subBtn}
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </MagneticButton>
              {subStatus === 'success' && (
                <p className="text-[10px] text-emerald-600 font-medium animate-pulse pt-0.5">✓ Successfully subscribed</p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-4 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] text-stone-500 font-light tracking-wide">
          <p>© {new Date().getFullYear()} {((settings?.hotelName as any)?.[currentLang] || 'AF HOTEL & AQUA PARK').toUpperCase()}. {t.footer.rights}</p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link href="/privacy" className="hover:text-[#00b5d5] transition-colors">{t.footer.privacyPolicy}</Link>
            <Link href="/terms" className="hover:text-[#00b5d5] transition-colors">{t.footer.termsOfUse}</Link>
            <Link href="/booking-policy" className="hover:text-[#00b5d5] transition-colors">{t.footer.bookingPolicy}</Link>
            <Link href="/cookie-policy" className="hover:text-[#00b5d5] transition-colors">{t.footer.cookiePolicy}</Link>
          </div>
        </div>

        {/* Developer credits */}
        <div className="pb-4 pt-1 border-t border-stone-200/50 flex justify-center items-center text-[11px] text-stone-400 font-light tracking-wide">
          <p>
            Site by{' '}
            <a
              href="https://www.linkedin.com/in/ulker-amirli-099087320/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-600 hover:text-[#00b5d5] transition-colors underline decoration-stone-300 underline-offset-2 hover:decoration-[#00b5d5]"
            >
              Ulker Amirli
            </a>{' '}
            and{' '}
            <a
              href="https://www.linkedin.com/in/ali-asadzade-185010335/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-600 hover:text-[#00b5d5] transition-colors underline decoration-stone-300 underline-offset-2 hover:decoration-[#00b5d5]"
            >
              Ali Asadzade
            </a>
          </p>
        </div>

      </div>
    </footer>
  );
}