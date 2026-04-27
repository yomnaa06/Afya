"use client";

import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Search, Filter, Navigation, Star, PlusCircle, Hospital, PlusSquare } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const FACILITIES = [
    { id: "f1", name: "Hôpital Charles Nicolle", type: "Hôpital", area: "Tunis", phone: "+216 71 578 000", cnam: true },
    { id: "f2", name: "Clinique Avicenne", type: "Clinique", area: "El Manar", phone: "+216 71 885 500", cnam: true },
    { id: "f3", name: "Pharmacie de Nuit de Tunis", type: "Pharmacie", area: "Avenue de Paris", phone: "+216 71 254 000", cnam: false, guard: true },
    { id: "f4", name: "Laboratoire d'analyses médicales", type: "Laboratoire", area: "Ennasr", phone: "+216 71 829 000", cnam: true }
];

export default function DirectoryPage() {
    const t = useTranslations("nav");

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans dark:bg-slate-950">
            <Header />

            <main className="flex-1 flex flex-col lg:flex-row">
                {/* Left Side: Map Placeholder (50%) */}
                <div className="relative w-full lg:w-1/2 h-[400px] lg:h-auto bg-slate-100 dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800">
                    {/* Visual Placeholder for Map */}
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#C8102E 2px, transparent 2px)', backgroundSize: '60px 60px' }} />
                        <div className="z-10 bg-white/80 backdrop-blur-md px-8 py-4 rounded-full border-2 border-primary/20 shadow-2xl flex items-center gap-3 dark:bg-slate-900/80">
                            <MapPin className="h-6 w-6 text-primary animate-bounce" />
                            <span className="text-sm font-black uppercase tracking-[0.2em] text-slate-900 dark:text-white">Chargement de la carte...</span>
                        </div>
                    </div>

                    {/* Map Overlay Controls */}
                    <div className="absolute top-6 left-6 z-20 flex flex-col gap-2">
                        <Button size="icon" variant="outline" className="rounded-xl shadow-lg bg-white dark:bg-slate-900">
                            <Navigation className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Right Side: Filters & List (50%) */}
                <div className="w-full lg:w-1/2 flex flex-col bg-white dark:bg-slate-950 overflow-y-auto">
                    {/* Search Top Bar */}
                    <div className="p-8 border-b border-slate-50 dark:border-slate-900">
                        <h1 className="text-3xl font-black tracking-tighter mb-8">{t("directory")}</h1>
                        <div className="flex flex-col gap-4">
                            <div className="relative group">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300" />
                                <input
                                    type="text"
                                    placeholder="Hôpital, Pharmacie, Spécialiste..."
                                    className="w-full h-16 pl-16 pr-6 rounded-2xl bg-slate-50/50 border-2 border-slate-100 focus:border-primary/20 outline-none transition-all dark:bg-slate-900 dark:border-slate-800"
                                />
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                                {["Hôpitaux", "Cliniques", "Pharmacies", "Laboratoires"].map(tag => (
                                    <Button key={tag} variant="outline" size="sm" className="rounded-full px-5 whitespace-nowrap font-bold text-xs uppercase tracking-widest border-2">
                                        {tag}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Facilities List */}
                    <div className="flex-1 p-8 flex flex-col gap-6">
                        {FACILITIES.map((fac) => (
                            <div key={fac.id} className="group p-8 rounded-[2rem] border border-slate-100 bg-white shadow-sm transition-all hover:shadow-2xl hover:border-primary/10 dark:bg-slate-900 dark:border-slate-800">
                                <div className="flex items-start justify-between mb-6">
                                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors dark:bg-slate-800">
                                        {fac.type === "Hôpital" ? <Hospital className="h-6 w-6" /> : fac.type === "Pharmacie" ? <PlusSquare className="h-6 w-6" /> : <PlusCircle className="h-6 w-6" />}
                                    </div>
                                    <div className="flex flex-col items-end">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">{fac.type}</span>
                                        {fac.guard && (
                                            <div className="mt-1 flex items-center gap-1 text-emerald-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                                                <Star className="h-3 w-3 fill-emerald-500" />
                                                De Garde
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-black tracking-tight">{fac.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-400 font-medium text-sm">
                                        <MapPin className="h-4 w-4" />
                                        {fac.area}
                                    </div>
                                </div>

                                <div className="mt-8 flex gap-4 pt-6 border-t border-slate-50 dark:border-slate-800">
                                    <Button className="flex-1 h-12 rounded-xl bg-slate-900 hover:bg-black dark:bg-white dark:text-black font-bold">
                                        <Phone className="mr-2 h-4 w-4" /> Appeler
                                    </Button>
                                    <Button variant="outline" className="flex-1 h-12 rounded-xl border-2 font-bold">
                                        Itinéraire
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
