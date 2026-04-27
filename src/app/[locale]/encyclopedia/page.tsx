"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowLeft, BookOpen, ChevronRight } from "lucide-react";
import Link from "next/link";

const DISEASES = [
    { id: "diabetes", titleFr: "Diabète", titleAr: "السكري", desc: "Trouble du métabolisme du sucre." },
    { id: "hypertension", titleFr: "Hypertension", titleAr: "ارتفاع ضغط الدم", desc: "Pression artérielle élevée." },
    { id: "migraine", titleFr: "Migraine", titleAr: "الصداع النصفي", desc: "Maux de tête sévères et récurrents." },
    { id: "asthma", titleFr: "Asthme", titleAr: "الربو", desc: "Affection respiratoire chronique." },
    { id: "cold", titleFr: "Rhume", titleAr: "الزكام", desc: "Infection virale des voies respiratoires." },
    { id: "back_pain", titleFr: "Mal de Dos", titleAr: "آلام الظهر", desc: "Douleurs musculaires ou vertébrales." }
];

export default function EncyclopediaPage() {
    const t = useTranslations("nav");
    const t_cond = useTranslations("conditions");

    return (
        <div className="min-h-screen bg-slate-50/30 flex flex-col font-sans dark:bg-slate-950">
            <Header />

            <main className="flex-1 py-12 px-6 md:px-12">
                <div className="mx-auto max-w-7xl">
                    {/* Header Section */}
                    <div className="mb-16">
                        <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
                            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                            Retour à l'accueil
                        </Link>
                        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                            {t("encyclopedia")}
                        </h1>
                        <p className="text-lg font-medium text-slate-400 mt-2">
                            Explorez notre base de données médicale validée.
                        </p>

                        {/* Search Bar */}
                        <div className="mt-10 max-w-2xl relative group">
                            <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex items-center bg-white rounded-3xl border-2 border-slate-100 shadow-xl overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                                <Search className="ml-6 h-6 w-6 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Rechercher une maladie..."
                                    className="flex-1 h-16 px-6 text-lg font-medium bg-transparent outline-none placeholder:text-slate-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {DISEASES.map((disease) => (
                            <div key={disease.id} className="group cursor-pointer flex flex-col gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2 dark:bg-slate-900 dark:border-slate-800">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-primary group-hover:text-white dark:bg-slate-800">
                                    <BookOpen className="h-6 w-6" />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                            {t_cond(disease.id)}
                                        </h3>
                                        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">{disease.titleAr}</span>
                                    </div>
                                    <p className="text-slate-500 font-medium leading-relaxed italic">
                                        "{disease.desc}"
                                    </p>
                                </div>
                                <div className="mt-auto pt-6 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">En savoir plus</span>
                                    <ChevronRight className="h-5 w-5 text-primary rtl:rotate-180" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Placeholder */}
                    <div className="mt-20 flex justify-center">
                        <Button variant="outline" className="h-14 px-10 rounded-2xl border-2 border-slate-100 font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                            Charger plus de maladies
                        </Button>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
