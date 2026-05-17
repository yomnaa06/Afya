import type { Metadata } from "next";
import { LoginForm } from "@/components/auth/login-form";
import { Link } from "@/navigation";
import { ChevronLeft } from "lucide-react";
import { getLocale, getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: locale === "ar" ? "تسجيل الدخول | عافية+" : "Se connecter | Afya+",
    description:
      locale === "ar"
        ? "سجّل دخولك إلى منصة عافية+ للصحة الرقمية التونسية"
        : "Connectez-vous à Afya+, votre plateforme tunisienne de santé digitale.",
  };
}

export default async function LoginPage() {
  const t = await getTranslations("auth");
  const locale = await getLocale();

  return (
    <main className="relative min-h-screen">
      {/* Back to home link – floated over the form panel */}
      <Link
        href="/"
        className="absolute top-5 right-5 z-10 flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
      >
        {locale === "ar" ? (
          <>
            {t("back_home")}
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </>
        ) : (
          <>
            <ChevronLeft className="w-4 h-4" />
            {t("back_home")}
          </>
        )}
      </Link>

      <LoginForm />
    </main>
  );
}
