import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/auth-actions";
import { getLocale, getTranslations } from "next-intl/server";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { LogoutButton } from "@/components/auth/logout-button";
import { Heart, User, Shield, Mail, Calendar } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "ar" ? "ملفي الشخصي | عافية+" : "Mon Profil | Afya+",
  };
}

export default async function ProfilePage() {
  const session = await getServerSession();
  const locale = await getLocale();
  const t = await getTranslations("auth");
  const isAr = locale === "ar";

  // Server-side redirect if not authenticated
  if (!session) {
    redirect(`/${locale}/login`);
  }

  const roleLabel = isAr
    ? session.role === "admin"
      ? "مشرف"
      : session.role === "doctor"
        ? "طبيب"
        : "مستخدم"
    : session.role === "admin"
      ? "Administrateur"
      : session.role === "doctor"
        ? "Médecin"
        : "Utilisateur";

  const joinDate = new Date().toLocaleDateString(locale === "ar" ? "ar-TN" : "fr-TN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <Header />
      <main className="min-h-screen bg-background pt-28 pb-16 px-6" dir={isAr ? "rtl" : "ltr"}>
        <div className="max-w-2xl mx-auto flex flex-col gap-8">
          {/* Hero card */}
          <div className="relative rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 text-white overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 translate-x-1/3 -translate-y-1/3" />
            <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-black/10 -translate-x-1/4 translate-y-1/4" />

            <div className="relative z-10 flex items-center gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shrink-0">
                <span className="text-3xl font-bold">{session.avatarInitials}</span>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-2xl font-bold">{session.name}</h1>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-sm bg-white/15 border border-white/20 rounded-full px-3 py-0.5">
                    <Shield className="w-3.5 h-3.5" />
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Afya logo bottom right */}
            <div className="absolute bottom-6 right-6 flex items-center gap-2 opacity-30">
              <Heart className="w-5 h-5" fill="white" />
              <span className="font-bold text-lg tracking-tighter">AFYA +</span>
            </div>
          </div>

          {/* Info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {isAr ? "البريد الإلكتروني" : "E-mail"}
                </span>
                <span className="text-sm font-semibold text-foreground">{session.email ?? "—"}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {isAr ? "الدور" : "Rôle"}
                </span>
                <span className="text-sm font-semibold text-foreground">{roleLabel}</span>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4 sm:col-span-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                  {isAr ? "تاريخ الدخول" : "Session démarrée le"}
                </span>
                <span className="text-sm font-semibold text-foreground">{joinDate}</span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="flex justify-center">
            <LogoutButton locale={locale} t={{ logout: t("sign_out") }} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
