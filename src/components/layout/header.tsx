"use client";

import { Link } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function Header() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-100 transition-all">
            <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
                {/* Brand / Logo */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                        <Heart className="w-6 h-6 text-white" fill="white" />
                    </div>
                    <div className="flex flex-col leading-none">
                        <div className="font-semibold text-3xl tracking-tighter text-gray-900">
                            AFYA <span className="text-[#d4af37]">+</span>
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                            {locale === "ar" ? "صحة تونس" : "Santé Tunisienne"}
                        </span>
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="hidden xl:flex items-center gap-8 text-sm font-medium text-gray-700">
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
                    <Button variant="outline" className="hidden md:flex px-7 py-3 text-sm font-medium border border-gray-300 rounded-full hover:border-gray-400 transition h-11">
                        {locale === "ar" ? "دخول" : "Se connecter"}
                    </Button>
                    <Button className="px-7 py-3 text-sm font-semibold bg-primary text-white rounded-full flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md h-11">
                        <Phone className="w-4 h-4" /> 
                        {locale === "ar" ? "طوارئ" : "Urgence"}
                    </Button>
                </div>
            </div>
        </header>
    );
}
