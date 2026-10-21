"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Eye, EyeOff, AlertCircle, ArrowLeft } from "lucide-react";

const FlagIcon = ({ code }: { code: LangType }) => {
  if (code === "az")
    return (
      <svg className="w-5 h-3.5 rounded-xs object-cover shadow-xs border border-stone-200 shrink-0" viewBox="0 0 6 3">
        <path fill="#24aad4" d="M0 0h6v1H0z" /><path fill="#ed2c34" d="M0 1h6v1H0z" /><path fill="#339966" d="M0 2h6v1H0z" />
        <circle cx="3" cy="1.5" r=".4" fill="#fff" /><circle cx="3.08" cy="1.5" r=".34" fill="#ed2c34" />
        <path fill="#fff" d="M3.15 1.32l.04.14.15-.02-.1.1.07.13-.12-.08-.12.08.06-.13-.1-.1.14.02z" />
      </svg>
    );
  if (code === "en")
    return (
      <svg className="w-5 h-3.5 rounded-xs object-cover shadow-xs border border-stone-200 shrink-0" viewBox="0 0 50 30">
        <clipPath id="t"><path d="M0 0v30h50V0z" /></clipPath>
        <g clipPath="url(#t)"><path d="M0 0v30h50V0z" fill="#012169" /><path d="M0 0l50 30M50 0L0 30" stroke="#fff" strokeWidth="6" /><path d="M0 0l50 30M50 0L0 30" stroke="#c8102e" strokeWidth="4" /><path d="M25 0v30M0 15h50" stroke="#fff" strokeWidth="10" /><path d="M25 0v30M0 15h50" stroke="#c8102e" strokeWidth="6" /></g>
      </svg>
    );
  return (
    <svg className="w-5 h-3.5 rounded-xs object-cover shadow-xs border border-stone-200 shrink-0" viewBox="0 0 3 2">
      <path fill="#fff" d="M0 0h3v2H0z" /><path fill="#0039a6" d="M0 .67h3v1.33H0z" /><path fill="#d52b1e" d="M0 1.33h3v.67H0z" />
    </svg>
  );
};

type LangType = "az" | "en" | "ru";

const translations = {
  az: {
    heroTitle: "AF Hotel & Aqua Park\nResort-a Xoş Gəlmisiniz",
    heroDesc: "Novxanıda, Xəzər dənizi sahilində yerləşən unudulmaz ailəvi istirahət mərkəzi.",
    statRoom: "Otaq",
    statRest: "Restoran",
    statPool: "Hovuz",
    welcome: "Xoş gəldiniz",
    subtitle: "Hesabınıza daxil olun",
    googleBtn: "Google ilə daxil ol",
    orWith: "və ya email ilə",
    emailLabel: "Email",
    passwordLabel: "Parol",
    forgotPass: "Parolu unutmusunuz?",
    signInBtn: "Daxil ol",
    checking: "Yoxlanılır...",
    noAccount: "Hesabın yoxdur?",
    signUp: "Qeydiyyat",
    errorAuth: "Email və ya parol yanlışdır",
    errorGoogle: "Google ilə daxil olma zamanı xəta baş verdi"
  },
  ru: {
    heroTitle: "Добро пожаловать в\nAF Hotel & Aqua Park",
    heroDesc: "Незабываемый семейный центр отдыха, расположенный в Новханы на берегу Каспийского моря.",
    statRoom: "Номеров",
    statRest: "Ресторана",
    statPool: "Бассейнов",
    welcome: "Добро пожаловать",
    subtitle: "Войдите в свой аккаунт",
    googleBtn: "Войти через Google",
    orWith: "или с помощью email",
    emailLabel: "Email",
    passwordLabel: "Пароль",
    forgotPass: "Забыли пароль?",
    signInBtn: "Войти",
    checking: "Проверка...",
    noAccount: "Нет аккаунта?",
    signUp: "Регистрация",
    errorAuth: "Неверный email или пароль",
    errorGoogle: "Произошла ошибка при входе через Google"
  },
  en: {
    heroTitle: "Welcome to\nAF Hotel & Aqua Park",
    heroDesc: "An unforgettable family recreation center located in Novxani on the coast of the Caspian Sea.",
    statRoom: "Rooms",
    statRest: "Restaurants",
    statPool: "Pools",
    welcome: "Welcome back",
    subtitle: "Sign in to your account",
    googleBtn: "Sign in with Google",
    orWith: "or with email",
    emailLabel: "Email",
    passwordLabel: "Password",
    forgotPass: "Forgot password?",
    signInBtn: "Sign In",
    checking: "Checking...",
    noAccount: "Don't have an account?",
    signUp: "Sign Up",
    errorAuth: "Incorrect email or password",
    errorGoogle: "An error occurred during Google sign-in"
  }
};

function SignInContent() {
  const { signIn, signInGoogle } = useAuth();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [langOpen, setLangOpen] = useState(false);

  const l = language || "az";
  const t = translations[l];

  const [email, setEmail] = useState(searchParams.get("email")?.trim() || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  // 2FA state
  const [step, setStep] = useState<"login" | "2fa">("login");
  const [otp, setOtp] = useState("");
  const { verify2FA } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const trimmedEmail = email.trim();
    try {
      const res = await signIn(trimmedEmail, password);
      if (res && res.ok) {
        if (res.requiresTwoFactor) {
          setStep("2fa");
          setLoading(false);
          return;
        }
        router.push(res.redirect ?? "/account");
      } else {
        let errorText = res?.message;
        if (res?.message === "Please verify your email first") {
          errorText = l === "az" ? "Zəhmət olmasa hesabınızı təsdiqləyin (emailinizi yoxlayın)" : l === "ru" ? "Пожалуйста, сначала подтвердите ваш аккаунт (проверьте email)" : "Please verify your email first";
        } else if (res?.message === "Invalid email or password" || res?.message === "User not found") {
          errorText = t.errorAuth;
        }
        setError(errorText || t.errorAuth);
        setLoading(false);
      }
    } catch {
      setError(t.errorAuth);
      setLoading(false);
    }
  };

  const handle2FASubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await verify2FA(email.trim(), otp);
      if (res && res.ok) {
        router.push(res.redirect ?? "/admin");
      } else {
        setError(res?.message || "Yanlış kod");
        setLoading(false);
      }
    } catch {
      setError("Yanlış kod");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const res = await signInGoogle();
      if (res && res.ok) {
        router.push(res.redirect ?? "/account");
      } else {
        setError(t.errorGoogle);
        setGoogleLoading(false);
      }
    } catch {
      setError(t.errorGoogle);
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-hotel-light)" }}>
      {/* Левая декоративная панель (Компьютерная версия) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <Image
          src="/AF-hotel.jpg"
          alt="AF Hotel"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#00406a]/80" />
        
        {/* ИЗМЕНЕНО: ПОДНЯТО МАКСИМАЛЬНО ВЫШЕ В УГОЛ (top-4 left-4) */}
        <div className="absolute top-4 left-4 z-20 flex flex-col items-start">
          <div className="w-32 h-32 relative">
            <Image src="/loqo-af.png" alt="AF Hotel" fill className="object-contain brightness-0 invert" />
          </div>
          <span className="text-[10px] font-medium text-white/80 tracking-wider italic uppercase text-left -mt-2">
            AF Hotel & Aqua Park Resort
          </span>
        </div>

        {/* Language Switcher Overlay */}
        <div className="absolute top-4 right-4 z-20">
          <div className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center space-x-1.5 font-bold text-xs tracking-wider text-white outline-none uppercase p-2 hover:bg-white/10 rounded-xl transition-all duration-300 border-none bg-transparent cursor-pointer"
            >
              <FlagIcon code={l} />
              <span>{l}</span>
            </button>
            {langOpen && (
              <div className="absolute right-0 mt-2 w-28 bg-white border border-stone-200/80 rounded-xl shadow-xl py-1 z-50">
                {(["az", "en", "ru"] as LangType[]).map((lng) => (
                  <button
                    key={lng}
                    onClick={() => {
                      setLanguage(lng);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2.5 px-4 py-2.5 text-[11px] font-bold tracking-wider text-slate-700 hover:bg-stone-50 transition-colors duration-150 uppercase border-none bg-transparent cursor-pointer ${language === lng ? "text-[#00b5d5] bg-stone-50/50" : ""}`}
                  >
                    <FlagIcon code={lng} />
                    <span>{lng}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Контент слева снизу */}
        <div className="relative z-10 flex flex-col justify-end p-12 text-white h-full">
          <h2 className="text-4xl font-bold mb-3 leading-tight whitespace-pre-line">
            {t.heroTitle}
          </h2>
          <p className="text-white/70 text-sm leading-relaxed max-w-xs">
            {t.heroDesc}
          </p>
          <div className="mt-8 flex gap-6">
            {[["345+", t.statRoom], ["4", t.statRest], ["4", t.statPool]].map(([num, label]) => (
              <div key={label}>
                <div className="text-2xl font-bold">{num}</div>
                <div className="text-white/60 text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Правая панель с формой */}
      <div className="flex-1 lg:max-w-md flex flex-col justify-center px-8 py-12 bg-white relative">
        <button onClick={() => router.back()} className="lg:hidden absolute top-6 left-6 w-10 h-10 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full flex items-center justify-center transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="max-w-sm w-full mx-auto space-y-7">
          
          {/* Мобильный блок логотипа */}
          <div className="lg:hidden flex flex-col items-center mb-10 -mt-10">
            <div className="w-40 h-28 relative">
              <Image src="/loqo-af.png" alt="AF Hotel" fill className="object-contain" priority />
            </div>
            <span className="text-[11px] font-medium text-stone-400 tracking-wider italic text-center opacity-90">
              AF Hotel & Aqua Park Resort
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-[#1e325c]">{t.welcome}</h1>
            <p className="text-sm text-stone-400 mt-1">{t.subtitle}</p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700 font-medium">{error}</p>
            </div>
          )}



          {step === "login" ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t.emailLabel}</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all"
                />
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t.passwordLabel}</label>
                  <Link href={`/auth/forgot-password?email=${encodeURIComponent(email)}`} className="text-xs font-semibold hover:underline" style={{ color: "#00b5d5" }}>
                    {t.forgotPass}
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 pr-11 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 transition-colors cursor-pointer">
                    {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #00b5d5, #00406a)" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t.checking}
                  </>
                ) : t.signInBtn}
              </button>
            </form>
          ) : (
            <form onSubmit={handle2FASubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">6-Rəqəmli Kod (OTP)</label>
                <p className="text-xs text-stone-500 mb-2">
                  Email ünvanınıza göndərilən 6 rəqəmli təsdiq kodunu daxil edin.
                </p>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm tracking-[0.5em] text-center font-bold focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
                style={{ background: "linear-gradient(135deg, #00b5d5, #00406a)" }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Yoxlanılır...
                  </>
                ) : "Təsdiqlə"}
              </button>
              <button
                type="button"
                onClick={() => setStep("login")}
                className="w-full py-2 text-sm text-stone-500 hover:text-stone-700 font-semibold"
              >
                Geri qayıt
              </button>
            </form>
          )}

          <p className="text-center text-sm text-stone-500">
            {t.noAccount}{" "}
            <Link href="/auth/sign-up" className="font-bold hover:underline" style={{ color: "#00b5d5" }}>
              {t.signUp}
            </Link>
          </p>


        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-[#00b5d5]" />
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}