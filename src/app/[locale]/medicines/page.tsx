"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pill, Search, ArrowLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const MEDICINES = [
    // ANTALGIQUES & ANTIPYRÉTIQUES
    { id: "m1", name: "Doliprane 500mg", dci: "Paracétamol", price: "4.250 DT", cnam: true },
    { id: "m1b", name: "Doliprane 1000mg", dci: "Paracétamol", price: "6.800 DT", cnam: true },
    { id: "m1c", name: "Efferalgan 500mg", dci: "Paracétamol", price: "4.500 DT", cnam: true },
    { id: "m5", name: "Advil 200mg", dci: "Ibuprofène", price: "6.700 DT", cnam: false },
    { id: "m5b", name: "Upfen 400mg", dci: "Ibuprofène", price: "5.400 DT", cnam: true },

    // ANTIBIOTIQUES
    { id: "m2", name: "Amoxicilline 1g", dci: "Amoxicilline trihydratée", price: "12.800 DT", cnam: true },
    { id: "m3", name: "Clamoxyl 500mg", dci: "Amoxicilline", price: "9.500 DT", cnam: true },
    { id: "m4", name: "Augmentin", dci: "Amoxicilline + Acide clavulanique", price: "22.300 DT", cnam: true },
    { id: "m4b", name: "Curam 1g/125mg", dci: "Amoxicilline + Acide clavulanique", price: "21.500 DT", cnam: true },
    { id: "m7", name: "Zinnat 500mg", dci: "Céfuroxime", price: "28.900 DT", cnam: true },
    { id: "m8", name: "Pyostacine 500mg", dci: "Pristinamycine", price: "18.400 DT", cnam: true },

    // GASTRO-ENTÉROLOGIE
    { id: "m6", name: "Spasfon", dci: "Phloroglucinol", price: "8.900 DT", cnam: true },
    { id: "m9", name: "Meteospasmyl", dci: "Alvérine + Siméticone", price: "14.200 DT", cnam: true },
    { id: "m10", name: "Gaviscon", dci: "Alginate de sodium + Bicarbonate de sodium", price: "11.500 DT", cnam: false },
    { id: "m11", name: "Inexium 40mg", dci: "Ésoméprazole", price: "34.600 DT", cnam: true },
    { id: "m12", name: "Smecta", dci: "Diosmectite", price: "7.800 DT", cnam: false },

    // CARDIOLOGIE & HYPERTENSION
    { id: "m13", name: "Aprovel 150mg", dci: "Irbésartan", price: "25.400 DT", cnam: true },
    { id: "m14", name: "Amlor 5mg", dci: "Amlodipine", price: "18.900 DT", cnam: true },
    { id: "m15", name: "Kardegic 75mg", dci: "Aspegic (Aspirine)", price: "5.200 DT", cnam: true },

    // DIABÈTE
    { id: "m16", name: "Glucophage 850mg", dci: "Metformine", price: "9.800 DT", cnam: true },
    { id: "m17", name: "Diamicron 60mg", dci: "Gliclazide", price: "22.300 DT", cnam: true },

    // DERMATOLOGIE
    { id: "m18", name: "Fucidine Crème", dci: "Acide fusidique", price: "9.200 DT", cnam: true },
    { id: "m19", name: "Biafine", dci: "Trolamine", price: "12.500 DT", cnam: false },

    // VITAMINES & COMPLÉMENTS
    { id: "m20", name: "Magnésium Vitamine B6", dci: "Magnésium + B6", price: "15.800 DT", cnam: false },
    { id: "m21", name: "Supradyn", dci: "Multivitamines", price: "19.500 DT", cnam: false }
];

export default function MedicinesPage() {
    const t = useTranslations("nav");

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
                            {t("medicines")}
                        </h1>
                        <p className="text-lg font-medium text-slate-400 mt-2">
                            Consultez les prix, les remboursements CNAM et les alternatives génériques.
                        </p>

                        {/* Search + Filters */}
                        <div className="mt-10 flex flex-col md:flex-row gap-4 items-center max-w-4xl">
                            <div className="relative flex-1 group">
                                <div className="absolute inset-0 bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="relative flex items-center bg-white rounded-3xl border-2 border-slate-100 shadow-xl overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                                    <Search className="ml-6 h-6 w-6 text-slate-300" />
                                    <input
                                        type="text"
                                        placeholder="Rechercher un médicament (Nom ou DCI)..."
                                        className="flex-1 h-16 px-6 text-lg font-medium bg-transparent outline-none placeholder:text-slate-300"
                                    />
                                </div>
                            </div>
                            <Button variant="outline" className="h-16 px-10 rounded-3xl border-2 border-slate-100 font-black uppercase tracking-widest">
                                Filtres avancés
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {MEDICINES.map((med) => (
                            <div key={med.id} className="group relative flex flex-col gap-6 p-8 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-2xl hover:-translate-y-2 dark:bg-slate-900 dark:border-slate-800">
                                <div className="flex items-start justify-between">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Pill className="h-6 w-6" />
                                    </div>
                                    {med.cnam && (
                                        <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                                            <CheckCircle2 className="h-3 w-3" />
                                            Remboursé CNAM
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                        {med.name}
                                    </h3>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {med.dci}
                                    </span>
                                </div>

                                <div className="mt-4 flex items-end justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Prix Public</span>
                                        <span className="text-2xl font-black text-slate-900 dark:text-white">{med.price}</span>
                                    </div>
                                    <Button size="sm" variant="ghost" className="rounded-xl h-10 px-4 font-bold text-primary hover:bg-primary/5">
                                        Détails <ChevronRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </div>

                                {/* Status Indicator */}
                                <div className="absolute top-8 right-8 flex gap-1">
                                    <span className="h-2 w-2 rounded-full bg-emerald-500" title="Disponible" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Quick Warning */}
                    <div className="mt-20 p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white flex gap-6">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white">
                            <AlertCircle className="h-8 w-8" />
                        </div>
                        <div className="flex flex-col gap-2">
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] text-white">Attention</h4>
                            <p className="text-sm font-medium leading-relaxed opacity-60">
                                Les prix sont donnés à titre indicatif et peuvent varier selon les pharmacies et les mises à jour réglementaires. Consultez toujours votre pharmacien.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
