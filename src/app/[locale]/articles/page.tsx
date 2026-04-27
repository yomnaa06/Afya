"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Newspaper, ArrowLeft, Clock, ChevronRight, Share2, Bookmark } from "lucide-react";
import Link from "next/link";

const ARTICLES = [
    {
        id: "a1",
        title: "Comment prévenir le diabète de type 2 au quotidien ?",
        category: "Prévention",
        readTime: "5 min",
        excerpt: "Des conseils pratiques sur l'alimentation et l'activité physique adaptés au mode de vie tunisien."
    },
    {
        id: "a2",
        title: "Guide nutrition : Les bienfaits du régime méditerranéen",
        category: "Nutrition",
        readTime: "8 min",
        excerpt: "Pourquoi l'huile d'olive et les légumes locaux sont vos meilleurs alliés santé."
    },
    {
        id: "a3",
        title: "Santé Mentale : Gérer le stress professionnel",
        category: "Bien-être",
        readTime: "6 min",
        excerpt: "Techniques de relaxation et conseils pour un meilleur équilibre vie pro/vie privée."
    },
    {
        id: "a4",
        title: "Premiers secours : Les gestes qui sauvent",
        category: "Urgences",
        readTime: "10 min",
        excerpt: "Que faire en cas d'étouffement ou d'arrêt cardiaque avant l'arrivée du SAMU 190."
    }
];

export default function ArticlesPage() {
    const t = useTranslations("nav");

    return (
        <div className="min-h-screen bg-slate-50/30 flex flex-col font-sans dark:bg-slate-950">
            <Header />

            <main className="flex-1 py-12 px-6 md:px-12">
                <div className="mx-auto max-w-7xl">
                    {/* Header */}
                    <div className="mb-16">
                        <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
                            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                            Retour à l'accueil
                        </Link>
                        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                            {t("articles")}
                        </h1>
                        <p className="text-lg font-medium text-slate-400 mt-2">
                            Conseils, prévention et actualités santé pour la Tunisie.
                        </p>

                        {/* Category Pills */}
                        <div className="mt-10 flex gap-3 overflow-x-auto pb-4 scrollbar-none">
                            {["Tous", "Nutrition", "Prévention", "Urgences", "Pédiatrie", "Seniors"].map(cat => (
                                <Button key={cat} variant={cat === "Tous" ? "default" : "outline"} className="rounded-full px-6 font-bold text-xs uppercase tracking-widest">
                                    {cat}
                                </Button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {ARTICLES.map((art) => (
                            <div key={art.id} className="group flex flex-col bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-2xl hover:-translate-y-2 dark:bg-slate-900 dark:border-slate-800">
                                {/* Image Placeholder */}
                                <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center relative overflow-hidden">
                                    <Newspaper className="h-12 w-12 text-slate-200" />
                                    <div className="absolute top-4 left-4 bg-primary text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg">
                                        {art.category}
                                    </div>
                                </div>

                                <div className="flex-1 p-8 flex flex-col">
                                    <div className="flex items-center gap-4 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="h-3 w-3" />
                                            {art.readTime}
                                        </div>
                                        <span className="h-1 w-1 rounded-full bg-slate-200" />
                                        <span>Aujourd'hui</span>
                                    </div>

                                    <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2">
                                        {art.title}
                                    </h3>

                                    <p className="mt-4 text-slate-500 font-medium leading-relaxed line-clamp-2">
                                        {art.excerpt}
                                    </p>

                                    <div className="mt-auto pt-8 flex items-center justify-between">
                                        <Button variant="link" className="p-0 h-auto font-black uppercase tracking-[0.2em] text-xs text-primary group-hover:gap-2 transition-all">
                                            Lire l'article <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                                        </Button>
                                        <div className="flex gap-2 text-slate-300">
                                            <button className="hover:text-primary transition-colors"><Bookmark className="h-5 w-5" /></button>
                                            <button className="hover:text-primary transition-colors"><Share2 className="h-5 w-5" /></button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Newsletter section */}
                    <div className="mt-24 p-12 lg:p-20 rounded-[3rem] bg-primary relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
                        <div className="relative z-10 max-w-2xl flex flex-col gap-6 text-white">
                            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
                                Restez informé, <br />
                                <span className="italic opacity-80">vivez en meilleure santé.</span>
                            </h2>
                            <p className="text-lg font-medium opacity-80">
                                Inscrivez-vous à notre newsletter pour recevoir des conseils santé exclusifs chaque semaine.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                <input
                                    type="email"
                                    placeholder="votre@email.com"
                                    className="flex-1 h-16 px-8 rounded-2xl bg-white/10 border-2 border-white/20 text-white placeholder:text-white/50 outline-none focus:bg-white/20 transition-all font-bold"
                                />
                                <Button className="h-16 px-12 rounded-2xl bg-white text-primary hover:bg-slate-50 text-lg font-black shadow-xl">
                                    S'abonner
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
