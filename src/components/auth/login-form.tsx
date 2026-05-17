"use client";

import { useState, useTransition } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/navigation";
import {
  Heart,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginAction } from "@/lib/auth-actions";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const isRtl = locale === "ar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successName, setSuccessName] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const result = await loginAction(email, password);

        if (!result.success || !result.user) {
          setError(t("error_invalid"));
          return;
        }

        setSuccessName(result.user.name);

        // Brief success flash, then hard-refresh the home page
        // (hard refresh ensures the server re-reads the new cookie and
        //  the header re-renders with the logged-in state)
        await new Promise((r) => setTimeout(r, 900));
        router.push("/");
        router.refresh();
      } catch {
        setError(t("error_generic"));
      }
    });
  };

  return (
    <div className="min-h-screen flex" dir={isRtl ? "rtl" : "ltr"}>
      {/* ── Left panel: Branding (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#C8102E] relative overflow-hidden flex-col items-center justify-center p-16 text-white">
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-black/10 translate-x-1/4 translate-y-1/4" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-white/[0.03] border border-white/10" />

        {/* Content */}
        <div className="relative z-10 max-w-md flex flex-col gap-8">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/15 backdrop-blur rounded-2xl flex items-center justify-center border border-white/20">
              <Heart className="w-8 h-8 text-white" fill="white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-bold text-4xl tracking-tighter">
                AFYA <span className="text-[#D4AF37]">+</span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">
                {isRtl ? "الصحة الرقمية التونسية" : "Santé Digitale Tunisienne"}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <h2 className="text-4xl font-bold leading-tight">
              {isRtl ? "منصتك الصحية الشاملة" : "Votre plateforme santé complète"}
            </h2>
            <p className="text-white/70 text-lg leading-relaxed">
              {isRtl
                ? "الوصول إلى جميع أدوات الصحة الرقمية التونسية في مكان واحد."
                : "Accédez à tous vos outils de santé digitale tunisienne en un seul endroit."}
            </p>
          </div>

          {/* Feature pills */}
          <div className="flex flex-col gap-3">
            {[
              isRtl ? "✓  فاحص الأعراض الذكي" : "✓  Vérificateur de symptômes IA",
              isRtl ? "✓  أكثر من 200 دواء تونسي" : "✓  200+ médicaments tunisiens",
              isRtl ? "✓  دليل المستشفيات والعيادات" : "✓  Annuaire hôpitaux & cliniques",
            ].map((f) => (
              <div
                key={f}
                className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl px-4 py-3 border border-white/10 text-sm font-medium"
              >
                {f}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: Login form ── */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 bg-background">
        <div className="w-full max-w-md flex flex-col gap-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" fill="white" />
            </div>
            <span className="font-bold text-2xl tracking-tighter text-foreground">
              AFYA <span className="text-[#D4AF37]">+</span>
            </span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {t("login_title")}
            </h1>
            <p className="text-muted-foreground text-base">{t("login_subtitle")}</p>
          </div>



          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-email" className="text-sm font-medium text-foreground">
                {t("email_label")}
              </Label>
              <div className="relative">
                <Mail
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                    isRtl ? "right-3" : "left-3"
                  )}
                />
                <Input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("email_placeholder")}
                  className={cn(
                    "h-12 text-base rounded-xl",
                    isRtl ? "pr-10 text-right" : "pl-10"
                  )}
                  disabled={isPending || !!successName}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="login-password" className="text-sm font-medium text-foreground">
                  {t("password_label")}
                </Label>
                <button
                  type="button"
                  className="text-xs text-primary hover:underline font-medium"
                >
                  {t("forgot_password")}
                </button>
              </div>
              <div className="relative">
                <Lock
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none",
                    isRtl ? "right-3" : "left-3"
                  )}
                />
                <Input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t("password_placeholder")}
                  className={cn(
                    "h-12 text-base rounded-xl",
                    isRtl ? "pr-10 pl-10 text-right" : "pl-10 pr-10"
                  )}
                  disabled={isPending || !!successName}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className={cn(
                    "absolute top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground hover:text-foreground transition-colors",
                    isRtl ? "left-2" : "right-2"
                  )}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-border accent-primary cursor-pointer"
                disabled={isPending}
              />
              <Label
                htmlFor="remember-me"
                className="text-sm text-muted-foreground cursor-pointer select-none"
              >
                {t("remember_me")}
              </Label>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Success */}
            {successName && (
              <div className="flex items-center gap-2.5 rounded-xl bg-green-500/10 border border-green-500/20 px-4 py-3 text-sm text-green-700 dark:text-green-400 animate-fade-in">
                <Heart className="w-4 h-4 shrink-0" fill="currentColor" />
                <span>{t("success_welcome").replace("{name}", successName)}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              id="login-submit"
              type="submit"
              disabled={isPending || !!successName}
              className="h-12 rounded-xl text-base font-semibold bg-primary hover:bg-primary/90 text-white shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t("signing_in")}
                </>
              ) : (
                <>
                  {t("sign_in")}
                  <ArrowRight className={cn("w-4 h-4", isRtl && "rotate-180")} />
                </>
              )}
            </Button>
          </form>

          {/* Sign-up link */}
          <p className="text-center text-sm text-muted-foreground">
            {t("no_account")}{" "}
            <button type="button" className="text-primary hover:underline font-semibold">
              {t("sign_up")}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
