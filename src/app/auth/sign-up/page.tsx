"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, Eye, EyeOff, User, Mail, Lock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";

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
    heroTitle: "İstirahətinizi İndi\nPlanlaşdırın",
    heroDesc: "AF Hotel-də qeydiyyatdan keçərək xüsusi təkliflərdən və Akvapark əyləncələrindən ilk siz xəbərdar olun.",
    benefit1: "Otaqların asan və sürətli bronu",
    benefit2: "Akvapark və çimərlik üçün xüsusi endirimlər",
    benefit3: "Restoranlarda eksklüziv təkliflər",
    createAccount: "Hesab yarat",
    joinFamily: "AF Hotel ailəsinə qoşulun",
    googleBtn: "Google ilə davam et",
    orWith: "və ya email ilə",
    fullName: "Ad Soyad",
    fullNamePlaceholder: "Adınızı daxil edin",
    emailLabel: "Email",
    passwordLabel: "Parol",
    passPlaceholder: "Ən az 6 simvol",
    strengthLabels: ["", "Zəif", "Orta", "Güclü"],
    signUpBtn: "Hesab Yarat",
    creating: "Yaradılır...",
    alreadyHave: "Artıq hesabın var?",
    signIn: "Daxil ol",
    errorLength: "Parol ən az 6 simvol olmalıdır",
    errorGoogle: "Google ilə daxil olma zamanı xəta baş verdi",
    errorGeneral: "Qeydiyyat zamanı xəta baş verdi",
    userExistsTitle: "Bu email artıq qeydiyyatdadır!",
    userExistsDesc: "Bu email ünvanı ilə artıq bir hesab mövcuddur. Daxil olmaq istəyirsiniz?",
    goToSignIn: "Daxil ol"
  },
  ru: {
    heroTitle: "Спланируйте свой\nотдых сейчас",
    heroDesc: "Зарегистрируйтесь в AF Hotel и первыми узнавайте о специальных предложениях и развлечениях в Аквапарке.",
    benefit1: "Простое и быстрое бронирование номеров",
    benefit2: "Специальные скидки на аквапарк и пляж",
    benefit3: "Эксклюзивные предложения в ресторанах",
    createAccount: "Создать аккаунт",
    joinFamily: "Присоединяйтесь к семье AF Hotel",
    googleBtn: "Продолжить через Google",
    orWith: "или с помощью email",
    fullName: "Имя Фамилия",
    fullNamePlaceholder: "Введите ваше имя",
    emailLabel: "Email",
    passwordLabel: "Пароль",
    passPlaceholder: "Не менее 6 символов",
    strengthLabels: ["", "Слабый", "Средний", "Сильный"],
    signUpBtn: "Создать аккаунт",
    creating: "Создание...",
    alreadyHave: "Уже есть аккаунт?",
    signIn: "Войти",
    errorLength: "Пароль должен состоять минимум из 6 символов",
    errorGoogle: "Произошла ошибка при входе через Google",
    errorGeneral: "Произошла ошибка при регистрации",
    userExistsTitle: "Этот email уже зарегистрирован!",
    userExistsDesc: "Аккаунт с таким email уже существует. Хотите войти?",
    goToSignIn: "Войти"
  },
  en: {
    heroTitle: "Plan Your Vacation\nRight Now",
    heroDesc: "Register at AF Hotel and be the first to know about special offers and Aqua Park entertainment.",
    benefit1: "Easy and fast room booking",
    benefit2: "Special discounts for the Aqua Park and beach",
    benefit3: "Exclusive offers in restaurants",
    createAccount: "Create account",
    joinFamily: "Join the AF Hotel family",
    googleBtn: "Continue with Google",
    orWith: "or with email",
    fullName: "Full Name",
    fullNamePlaceholder: "Enter your name",
    emailLabel: "Email",
    passwordLabel: "Password",
    passPlaceholder: "At least 6 characters",
    strengthLabels: ["", "Weak", "Medium", "Strong"],
    signUpBtn: "Create Account",
    creating: "Creating...",
    alreadyHave: "Already have an account?",
    signIn: "Sign In",
    errorLength: "Password must be at least 6 characters",
    errorGoogle: "An error occurred during Google sign-in",
    errorGeneral: "An error occurred during registration",
    userExistsTitle: "This email is already registered!",
    userExistsDesc: "An account with this email already exists. Would you like to sign in?",
    goToSignIn: "Sign In"
  }
};

export default function SignUpPage() {
  const { signUp, signInGoogle } = useAuth();
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  const [langOpen, setLangOpen] = useState(false);

  const l = language || "az";
  const t = translations[l];

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = t.strengthLabels[strength];
  const strengthColor = ["", "bg-rose-400", "bg-amber-400", "bg-emerald-400"][strength];

  const [existingUser, setExistingUser] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) { setError(t.errorLength); return; }
    setLoading(true);
    setError("");
    setExistingUser(false);
    try {
      const res = await signUp(name, email.trim(), password);
      if (res && res.ok) {
        router.push(`/auth/verify-otp?email=${encodeURIComponent(email)}`);
      } else {
        const msg = res?.message || "";
        // Detect "user already exists" response
        if (
          msg.toLowerCase().includes("already") ||
          msg.toLowerCase().includes("mövcuddur") ||
          msg.toLowerCase().includes("существует") ||
          msg.toLowerCase().includes("exist")
        ) {
          setExistingUser(true);
        } else {
          setError(msg || t.errorGeneral);
        }
        setLoading(false);
      }
    } catch {
      setError(t.errorGeneral);
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
        setGoogleLoading(false);
        setError(t.errorGoogle);
      }
    } catch {
      setGoogleLoading(false);
      setError(t.errorGoogle);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--color-hotel-light)" }}>
      {/* Левая панель (Компьютерная версия) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <Image
          src="/AF-hero.jpg"
          alt="AF Hotel Resort"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#00406a]/85" />
        
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
          <h2 className="text-4xl font-bold mb-3 leading-tight whitespace-pre-line text-white">{t.heroTitle}</h2>
          <p className="text-white/70 text-sm max-w-xs leading-relaxed">
            {t.heroDesc}
          </p>
          <div className="mt-10 space-y-3">
            {[t.benefit1, t.benefit2, t.benefit3].map((b) => (
              <div key={b} className="flex items-center gap-2.5 text-sm text-white/80">
                <CheckCircle2 className="w-4 h-4 text-[#00b5d5] shrink-0" />
                {b}
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
        <div className="max-w-sm w-full mx-auto space-y-6">
          
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
            <h1 className="text-2xl font-bold text-[#1e325c]">{t.createAccount}</h1>
            <p className="text-sm text-stone-400 mt-1">{t.joinFamily}</p>
          </div>

          {existingUser && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <p className="text-sm font-bold text-amber-800">{t.userExistsTitle}</p>
              <p className="text-xs text-amber-700">{t.userExistsDesc}</p>
              <button
                type="button"
                onClick={() => router.push(`/auth/sign-in?email=${encodeURIComponent(email)}`)}
                className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                {t.goToSignIn}
              </button>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-100 rounded-xl">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-700 font-medium">{error}</p>
            </div>
          )}



          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t.fullName}</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  placeholder={t.fullNamePlaceholder}
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t.emailLabel}</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-wide">{t.passwordLabel}</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.passPlaceholder}
                  className="w-full pl-10 pr-11 py-3 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:border-[#00b5d5] focus:bg-white focus:ring-2 focus:ring-[#00b5d5]/10 transition-all"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-stone-400 hover:text-stone-600 cursor-pointer">
                  {showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i <= strength ? strengthColor : "bg-stone-200"}`} />
                    ))}
                  </div>
                  <p className={`text-[10px] font-semibold ${["", "text-rose-500", "text-amber-500", "text-emerald-500"][strength]}`}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            <button
              type="submit" disabled={loading || googleLoading}
              className="w-full py-3 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              style={{ background: "linear-gradient(135deg, #00b5d5, #00406a)" }}
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> {t.creating}</> : t.signUpBtn}
            </button>
          </form>

          <p className="text-center text-sm text-stone-500">
            {t.alreadyHave}{" "}
            <Link href="/auth/sign-in" className="font-bold hover:underline" style={{ color: "#00b5d5" }}>
              {t.signIn}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}