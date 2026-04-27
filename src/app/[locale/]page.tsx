"use client";

import { Link } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import {
    Heart, ShieldCheck, Clock, ArrowRight,
    Search, Activity, BookOpen, Pill, MapPin, Calculator, Newspaper, BarChart3,
    Stethoscope, Users, Phone, MousePointer2, ClipboardCheck
} from "lucide-react";

export default function HomePage() {
    const t = useTranslations();
    const locale = useLocale();

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 transition-colors duration-300">
            <Header />

            <main className="pt-24 md:pt-32">
                {/* 1. PREMIUM HERO SECTION */}
                <section className="relative min-h-[80dvh] flex items-center bg-gradient-to-br from-zinc-50 to-white overflow-hidden pb-20">
                    <div className="absolute inset-0 bg-[radial-gradient(#c8102e_0.8px,transparent_1px)] [background-size:40px_40px] opacity-[0.03]" />
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent opacity-50 blur-3xl" />

                    <div className="max-w-7xl mx-auto px-8 relative z-10 w-full">
                        <div className="max-w-4xl">
                            <div className="inline-flex items-center gap-3 px-5 py-2 bg-white rounded-3xl border border-[#d4af37]/20 mb-8 shadow-sm">
                                <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />
                                <span className="text-sm font-medium text-primary uppercase tracking-widest">{t("hero.badge")}</span>
                            </div>

                            <h1 className="text-5xl md:text-[5.5rem] leading-[1.1] font-bold tracking-tighter text-gray-950 mb-8">
                                {t("hero.title")},<br />
                                <span className="text-primary italic font-medium">{t("hero.subtitle")}</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl leading-relaxed font-medium">
                                {t("hero.description")}
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5">
                                <Button asChild size="lg" className="group h-20 rounded-[2rem] bg-primary px-12 text-xl font-bold text-white shadow-2xl shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-[1.02] active:scale-95">
                                    <Link href="/symptoms">
                                        {t("hero.cta_primary")}
                                        <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
                                    </Link>
                                </Button>

                                <Button asChild size="lg" variant="outline" className="h-20 rounded-[2rem] border-2 border-[#d4af37] px-12 text-xl font-bold text-[#d4af37] hover:bg-[#d4af37] hover:text-white transition-all hover:scale-[1.02] active:scale-95">
                                    <Link href="/encyclopedia">
                                        {t("hero.cta_secondary")}
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. STATS SECTION (Clean & Elegant) */}
                <section className="bg-white border-y border-gray-100 py-20">
                    <div className="mx-auto max-w-7xl px-8">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                            {[
                                { label: t("hero.stats.symptoms"), icon: Stethoscope },
                                { label: t("hero.stats.diseases"), icon: Activity },
                                { label: t("hero.stats.medicines"), icon: Pill },
                                { label: t("hero.stats.accessibility"), icon: Clock },
                            ].map((stat, i) => (
                                <div key={i} className="flex flex-col items-center gap-6 text-center group">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 text-gray-400 transition-all group-hover:bg-primary group-hover:text-white group-hover:scale-110">
                                        <stat.icon className="h-9 w-9" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.2em] text-gray-500 group-hover:text-gray-900 leading-tight">
                                        {stat.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 3. HOW IT WORKS (Redesigned Elegant) */}
                <section className="bg-zinc-50 py-32">
                    <div className="mx-auto max-w-7xl px-8 text-center">
                        <p className="text-[#d4af37] tracking-[4px] text-xs font-black mb-4 uppercase">{t("how_it_works.title")}</p>
                        <h2 className="text-5xl font-bold tracking-tight mb-20 text-gray-950">Simple, rapide et sécurisé</h2>
                        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-16">
                            {/* Connector Line */}
                            <div className="hidden md:block absolute top-[2.5rem] left-[15%] right-[15%] h-[2px] bg-gray-200" />

                            {[
                                { title: t("how_it_works.step1.title"), desc: t("how_it_works.step1.desc"), icon: MousePointer2 },
                                { title: t("how_it_works.step2.title"), desc: t("how_it_works.step2.desc"), icon: Activity },
                                { title: t("how_it_works.step3.title"), desc: t("how_it_works.step3.desc"), icon: ClipboardCheck },
                            ].map((item, i) => (
                                <div key={i} className="relative z-10 flex flex-col items-center gap-8 text-center group">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-white border-2 border-gray-100 shadow-xl text-primary font-bold text-3xl group-hover:bg-primary group-hover:text-white transition-all">
                                        {i + 1}
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        <h4 className="text-2xl font-bold text-gray-950">{item.title}</h4>
                                        <p className="text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. KEY FEATURES GRID (Premium Cards) */}
                <section className="bg-white py-32">
                    <div className="mx-auto max-w-7xl px-8">
                        <div className="text-center mb-24">
                            <h2 className="text-5xl font-bold tracking-tight text-gray-950">Tout ce dont vous avez besoin</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[
                                { key: "symptoms", icon: Stethoscope, color: "var(--primary)" },
                                { key: "encyclopedia", icon: BookOpen, color: "#d4af37" },
                                { key: "medicines", icon: Pill, color: "var(--primary)" },
                                { key: "directory", icon: MapPin, color: "#d4af37" },
                                { key: "tools", icon: Calculator, color: "var(--primary)" },
                                { key: "articles", icon: Newspaper, color: "#d4af37" },
                                { key: "analytics", icon: BarChart3, color: "var(--primary)" },
                            ].map((feature, i) => (
                                <Link
                                    key={i}
                                    href={`/${feature.key === "analytics" ? "tools" : feature.key}`}
                                    className={cn(
                                        "group relative overflow-hidden rounded-[2.5rem] bg-white border border-gray-100 p-12 transition-all hover:border-gray-200 hover:shadow-2xl hover:-translate-y-2",
                                        i === 0 ? "md:col-span-2 lg:col-span-1 bg-slate-50/50" : ""
                                    )}
                                >
                                    <div className="mb-10 w-20 h-20 rounded-3xl flex items-center justify-center transition-colors group-hover:bg-primary group-hover:text-white" style={{ backgroundColor: `${feature.color}10`, color: feature.color }}>
                                        <feature.icon className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-3xl font-bold mb-6 text-gray-900 tracking-tight leading-tight">
                                        {t(`features.${feature.key}.title`)}
                                    </h3>
                                    <p className="text-lg text-gray-600 leading-relaxed font-medium mb-10 line-clamp-2">
                                        {t(`features.${feature.key}.desc`)}
                                    </p>
                                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm transition-all group-hover:gap-4">
                                        {t(`features.${feature.key}.cta`)} <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 5. TRIAGE LEVELS (Elegant Cards) */}
                <section className="bg-gray-950 py-32 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/10 blur-[120px]" />
                    <div className="mx-auto max-w-7xl px-8">
                        <div className="mb-16">
                            <h2 className="text-4xl font-bold tracking-tight">{t("triage.emergency.title")} ?</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[
                                { key: "emergency", color: "bg-red-600" },
                                { key: "urgent", color: "bg-orange-500" },
                                { key: "normal", color: "bg-emerald-600" },
                                { key: "selfcare", color: "bg-blue-600" },
                            ].map((level) => (
                                <div key={level.key} className={cn("p-10 rounded-[2.5rem] flex flex-col gap-8 transition-transform hover:scale-105", level.color)}>
                                    <h4 className="text-sm font-black tracking-widest uppercase opacity-90">{t(`triage.${level.key}.title`)}</h4>
                                    <p className="text-sm font-medium leading-relaxed">{t(`triage.${level.key}.desc`)}</p>
                                    <div className="mt-auto pt-8 border-t border-white/20 text-xs font-black uppercase tracking-[0.2em]">
                                        {t(`triage.${level.key}.action`)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 6. POPULAR CONDITIONS (Elegant Grid) */}
                <section className="bg-white py-32">
                    <div className="mx-auto max-w-7xl px-8">
                        <div className="flex items-end justify-between mb-20 border-b border-gray-100 pb-10">
                            <div>
                                <p className="text-[#d4af37] tracking-[4px] text-xs font-black mb-4 uppercase">BIBLIOTHÈQUE</p>
                                <h2 className="text-5xl font-bold tracking-tight text-gray-950">{t("conditions.title")}</h2>
                            </div>
                            <Button asChild variant="link" className="text-primary font-bold uppercase tracking-widest text-sm hover:gap-3 transition-all">
                                <Link href="/encyclopedia">
                                    {t("conditions.more")} <ArrowRight className="ml-2 w-4 h-4 rtl:rotate-180" />
                                </Link>
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {["diabetes", "hypertension", "migraine", "asthma", "cold", "back_pain"].map((cond) => (
                                <Link key={cond} href="/encyclopedia" className="group p-10 rounded-[2.5rem] border border-gray-100 transition-all hover:bg-slate-50 hover:border-primary/20">
                                    <h4 className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-primary">
                                        {t(`conditions.${cond}`)}
                                    </h4>
                                    <div className="mt-6 flex items-center justify-between text-gray-400 group-hover:text-gray-600 transition-all">
                                        <span className="text-xs font-black uppercase tracking-widest">Voir la fiche</span>
                                        <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform rtl:rotate-180" />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 7. TRUST INDICATORS (Al Rajhi Style) */}
                <section className="bg-zinc-50 py-32 border-y border-gray-100">
                    <div className="mx-auto max-w-7xl px-8">
                        <div className="flex flex-wrap items-center justify-center gap-x-20 gap-y-16">
                            {[
                                { key: "validated", icon: ShieldCheck, color: "text-emerald-500" },
                                { key: "secure", icon: ShieldCheck, color: "text-[#d4af37]" },
                                { key: "free", icon: ShieldCheck, color: "text-primary" },
                                { key: "support", icon: Clock, color: "text-blue-500" },
                            ].map((trust) => (
                                <div key={trust.key} className="flex items-center gap-6 group">
                                    <div className={cn("flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white shadow-xl transition-all group-hover:scale-110", trust.color)}>
                                        <trust.icon className="h-8 w-8" />
                                    </div>
                                    <span className="text-xs font-black uppercase tracking-[0.3em] text-gray-400 group-hover:text-gray-900 transition-colors">
                                        {t(`trust.${trust.key}`)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 8. FINAL CTA (Elegant) */}
                <section className="bg-white py-48 text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[radial-gradient(#c8102e_0.5px,transparent_1px)] [background-size:20px:20px] opacity-[0.02]" />
                    <div className="max-w-4xl mx-auto px-8 relative z-10">
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-12 leading-tight">
                            Prenez en <span className="text-primary italic">main votre santé</span> avec Afya.
                        </h2>
                        <div className="flex flex-wrap justify-center gap-8 mt-16">
                            <Button asChild size="lg" className="h-24 px-16 rounded-[2.5rem] bg-primary text-2xl font-bold shadow-2xl shadow-primary/30 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
                                <Link href="/symptoms">
                                    Commencer l'analyse
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline" className="h-24 px-16 rounded-[2.5rem] border-2 border-gray-100 text-2xl font-bold hover:bg-slate-50 transition-all hover:scale-105 active:scale-95">
                                <Link href="/about">
                                    Qui sommes-nous?
                                </Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
