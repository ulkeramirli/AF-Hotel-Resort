'use client';
import { useState, FormEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSettings } from '@/contexts/SettingsContext';
import { createReview } from '@/services/api';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const ReCAPTCHA = dynamic(() => import('react-google-recaptcha'), { ssr: false });

export default function Contacts() {
  const { language } = useLanguage();
  const currentLang = language;
  const { settings } = useSettings();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [fullName, setFullName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [message, setMessage] = useState('');
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);

  const handleSend = async (e: FormEvent) => {
    e.preventDefault();
    if (!captchaValue && process.env.NODE_ENV === 'production') {
      setError('Zəhmət olmasa robot olmadığınızı təsdiqləyin');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await createReview({ fullName, emailOrPhone, message });
      if (res.success) {
        setSent(true);
      } else {
        setError(res.message || 'Xəta baş verdi');
      }
    } catch {
      setError('Şəbəkə xətası. Zəhmət olmasa yenidən cəhd edin.');
    } finally {
      setLoading(false);
    }
  };

  const content = {
    tag: { az: 'QONAQ RƏYLƏRİ VƏ XƏRİTƏ', en: 'GUEST REVIEWS & MAP', ru: 'ОТЗЫВЫ ГОСТЕЙ И КАРТА' }[currentLang],
    title: { az: 'FİKİRLƏRİNİZ BİZİM ÜÇÜN ÖNƏMLİDİR.', en: 'YOUR FEEDBACK MATTERS.', ru: 'ВАШЕ МНЕНИЕ ВАЖНО ДЛЯ НАС.' }[currentLang],
    loc: { az: 'Əsas Ünvan', en: 'Main Location', ru: 'Главный Адрес' }[currentLang],
    address: { az: 'Novxanı çimərlik yolu, Bakı, Azərbaycan', en: 'Novkhani Beach Road, Baku, Azerbaijan', ru: 'Новханинское пляжное шоссе, Баку, Азербайджан' }[currentLang],
    reception: { az: 'Qəbul Şöbəsi', en: 'Reception Desks', ru: 'Ресепшн' }[currentLang],
    labelName: { az: 'Adınız və Soyadınız', en: 'Full Name', ru: 'Имя и Фамилия' }[currentLang],
    placeholderName: { az: 'Ad Soyad', en: 'First Last Name', ru: 'Имя Фамилия' }[currentLang],
    labelPhone: { az: 'Telefon Nömrəniz və ya Email', en: 'Phone or Email', ru: 'Телефон или Email' }[currentLang],
    labelMsg: { az: 'Təəssüratınız, rəyiniz və ya təklifiniz (müsbət və ya mənfi)', en: 'Your review, feedback, or suggestion', ru: 'Ваш отзыв, впечатление или замечание' }[currentLang],
    placeholderMsg: { 
      az: 'Bura həm xoş sözlərinizi, həm də təkmilləşdirməyimizi istədiyiniz məqamları yaza bilərsiniz...', 
      en: 'Feel free to share both your positive highlights and areas where we can improve...', 
      ru: 'Вы можете написать как приятные слова, так и моменты, которые нам стоит улучшить...' 
    }[currentLang],
    btn: { az: 'Rəyi Göndər', en: 'Submit Review', ru: 'Оставить Отзыв' }[currentLang],
    thanks: { az: 'RƏYİNİZ ÜÇÜN TƏŞƏKKÜR EDİRİK!', en: 'THANK YOU FOR YOUR FEEDBACK!', ru: 'СПАСИБО ЗА ВАШ ОТЗЫВ!' }[currentLang],
    success: { 
      az: 'Hər bir rəy bizim üçün dəyərlidir. Xidmət keyfiyyətini artırmaq üçün qeydləriniz mütləq nəzərə alınacaq.', 
      en: 'Every review helps us grow. Your notes will be carefully reviewed by our management team to enhance our services.', 
      ru: 'Каждое мнение помогает нам стать лучше. Ваш отзыв будет передан руководством для повышения качества сервиса.' 
    }[currentLang],
    robot: { az: 'Mən robot deyiləm', en: 'I am not a robot', ru: 'Я не робот' }[currentLang]
  };

  return (
    <section id="contacts" className="py-20 lg:py-24 bg-[#f4f1eb] text-stone-800 border-t border-stone-200/40 scroll-mt-20 select-none relative overflow-hidden">
      
      <div className="max-w-7xl mx-auto px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start relative z-10">
        
        {/* forma otzivov (sleva) */}
        <div className="lg:col-span-5 w-full order-2 lg:order-1 sticky top-28">
          {sent ? (
            <div className="bg-[#fdfbf7] rounded-2xl p-10 text-center border border-stone-200/80 shadow-md space-y-4 animate-fade-in">
              <div className="w-12 h-12 bg-white text-[#00b5d5] rounded-full flex items-center justify-center mx-auto text-lg shadow-sm border border-stone-100">✓</div>
              <span className="text-stone-900 font-serif text-lg font-light block">{content.thanks}</span>
              <p className="text-xs text-stone-500 max-w-xs font-light leading-relaxed mx-auto">{content.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-6 bg-[#fdfbf7] backdrop-blur-md border border-white rounded-2xl p-6 md:p-8 shadow-xl shadow-stone-300/20">
              <div className="space-y-5">
                
                <div className="space-y-1 text-left relative group">
                  <label className="block text-[10px] uppercase tracking-widest text-[#1e325c] font-bold transition-colors group-focus-within:text-[#00b5d5]">{content.labelName}</label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    placeholder={content.placeholderName}
                    className="w-full bg-transparent border-b border-stone-200 text-stone-900 placeholder-stone-300 py-2 text-sm font-light outline-none focus:border-[#00b5d5] transition-all"
                  />
                </div>

                <div className="space-y-1 text-left relative group">
                  <label className="block text-[10px] uppercase tracking-widest text-[#1e325c] font-bold transition-colors group-focus-within:text-[#00b5d5]">{content.labelPhone}</label>
                  <input
                    required
                    type="text"
                    value={emailOrPhone}
                    onChange={e => setEmailOrPhone(e.target.value)}
                    placeholder="+994 / info@example.com"
                    className="w-full bg-transparent border-b border-stone-200 text-stone-900 placeholder-stone-300 py-2 text-sm font-light outline-none focus:border-[#00b5d5] transition-all"
                  />
                </div>

                <div className="space-y-1 text-left relative group">
                  <label className="block text-[10px] uppercase tracking-widest text-[#1e325c] font-bold transition-colors group-focus-within:text-[#00b5d5]">{content.labelMsg}</label>
                  <textarea
                    required
                    rows={3}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder={content.placeholderMsg}
                    className="w-full bg-transparent border-b border-stone-200 text-stone-900 placeholder-stone-300 py-2 text-xs font-light outline-none focus:border-[#00b5d5] transition-all resize-none leading-relaxed"
                  />
                </div>
              </div>

              {process.env.NODE_ENV === 'production' && (
                <div className="flex justify-center mt-4">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"}
                    onChange={(val) => setCaptchaValue(val)}
                  />
                </div>
              )}

              {error && (
                <p className="text-xs text-rose-500 font-medium">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#ff6c02] hover:bg-[#e55f00] disabled:bg-stone-300 text-white font-bold text-xs uppercase tracking-widest py-3.5 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : content.btn}
              </button>
            </form>
          )}
        </div>

        {/* information and map (right side) */}
        <div className="lg:col-span-7 space-y-6 order-1 lg:order-2 lg:pl-4">
          <div className="space-y-2 text-left">
            <span className="text-[#00b5d5] text-[10px] font-bold tracking-widest uppercase bg-white/60 px-3 py-1 rounded-md inline-block border border-white">
              {content.tag}
            </span>
            <h2 className="text-3xl md:text-4xl font-light font-serif tracking-tight text-[#1e325c] leading-tight">
              {content.title}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left text-xs">
            <div className="p-4 bg-white/40 border border-white/60 rounded-xl md:col-span-2 space-y-1 backdrop-blur-xs">
              <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-widest">{content.loc}</span>
              <p className="text-stone-800 font-light text-sm leading-snug whitespace-pre-line">
                {(settings?.address as any)?.[currentLang] || content.address}
              </p>
            </div>

            <div className="p-4 bg-white/40 border border-white/60 rounded-xl space-y-1 backdrop-blur-xs">
              <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-widest">{content.reception}</span>
              <div className="flex flex-col space-y-0.5">
                {settings?.reception ? (
                  settings.reception.split('\n').map((phone, i) => (
                    <a key={i} href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="text-stone-900 hover:text-[#00b5d5] transition-colors font-light text-sm">{phone}</a>
                  ))
                ) : (
                  <>
                    <a href="tel:+994502233285" className="text-stone-900 hover:text-[#00b5d5] transition-colors font-light text-sm">+994 50 223 32 85</a>
                    <a href="tel:+994517895555" className="text-stone-900 hover:text-[#00b5d5] transition-colors font-light text-sm">+994 51 789 55 55</a>
                  </>
                )}
              </div>
            </div>

            <div className="p-4 bg-white/40 border border-white/60 rounded-xl space-y-1 backdrop-blur-xs flex flex-col justify-between">
              <div>
                <span className="block text-[9px] text-stone-400 font-bold uppercase tracking-widest">Digital Concierge</span>
                <a href={`mailto:${settings?.email || 'info@afhotel.az'}`} className="inline-block mt-0.5 text-stone-900 hover:text-[#00b5d5] transition-colors font-light text-sm underline decoration-[#00b5d5]/30 underline-offset-4">
                  {settings?.email || 'info@afhotel.az'}
                </a>
              </div>
            </div>
          </div>

          {/* interaktivnaya karta */}
          <div className="w-full h-64 md:h-72 bg-stone-100 border border-white rounded-xl overflow-hidden shadow-sm relative">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3032.073400585868!2d49.7997864765691!3d40.54045514870535!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1m2s9x403080641b9bf8e7%3A0x7d6f5552db6a2ecb!2sAF%20Hotel%20%26%20Aqua%20Park!5e0!3m2!1sru!2saz!4v1717500000000!5m2!1sru!2saz"
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>
        </div>

      </div>
    </section>
  );
}