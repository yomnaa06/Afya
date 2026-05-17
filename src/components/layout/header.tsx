"use client";

import { useEffect, useState } from "react";
import { Link } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Heart, Phone } from "lucide-react";
import { getServerSession } from "@/lib/auth-actions";
import { HeaderUserMenu } from "@/components/layout/header-user-menu";
import { AuthUser } from "@/lib/mock-auth";

export function Header() {
  const t = useTranslations();
  const locale = useLocale();
  const [session, setSession] = useState<AuthUser | null>(null);
  const isAr = locale === "ar";

  useEffect(() => {
    // Call server action on client mount
    getServerSession().then((res) => {
      setSession(res);
    });
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 transition-all dark:bg-background/95 dark:border-border">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center gap-4 group">
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
            <Heart className="w-6 h-6 text-white" fill="white" />
          </div>
          <div className="flex flex-col leading-none">
            <div className="font-semibold text-3xl tracking-tighter text-gray-900 dark:text-foreground">
              AFYA <span className="text-[#d4af37]">+</span>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
              {isAr ? "صحة تونس" : "Santé Tunisienne"}
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="hidden xl:flex items-center gap-8 text-sm font-medium text-gray-700 dark:text-muted-foreground">
          {["symptoms", "encyclopedia", "medicines", "directory", "tools"].map((item) => (
            <Link
              key={item}
              href={`/${item}`}
              className="hover:text-primary transition-colors"
            >
              {t(`nav.${item}`)}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <ThemeToggle />

          {session ? (
            // ── Logged-in state ──
            <HeaderUserMenu
              name={session.name}
              avatarInitials={session.avatarInitials}
              role={session.role}
            />
          ) : (
            // ── Logged-out state ──
            <>
              <Button
                variant="outline"
                asChild
                className="hidden md:flex px-7 py-3 text-sm font-medium border border-gray-300 rounded-full hover:border-gray-400 transition h-11"
              >
                <Link href="/login">{isAr ? "دخول" : "Se connecter"}</Link>
              </Button>
              <Button
                asChild
                className="px-7 py-3 text-sm font-semibold bg-primary text-white rounded-full flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md h-11"
              >
                <a href="tel:190">
                  <Phone className="w-4 h-4" />
                  {isAr ? "طوارئ" : "Urgence"}
                </a>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
