"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { BodyMap, BodyPart } from "@/components/anatomy/body-map";
import { SymptomList, SelectedSymptom } from "@/components/anatomy/symptom-list";
import { AIDiagnosisResults } from "@/components/anatomy/ai-diagnosis-results";
import { analyzeSymptomsMock, DiagnosisResult } from "@/lib/mock-ai-agent";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Thermometer, Info } from "lucide-react";
import Link from "next/link";

export default function SymptomsPage() {
    const t = useTranslations("symptoms");
    const [selectedPart, setSelectedPart] = useState<BodyPart>(null);
    const [gender, setGender] = useState<"male" | "female" | null>(null);
    
    // AI Evaluation States
    const [isEvaluating, setIsEvaluating] = useState(false);
    const [results, setResults] = useState<DiagnosisResult[] | null>(null);

    const handleGeneralSymptoms = () => {
        setSelectedPart("face"); 
    };

    const handleEvaluate = async (selections: SelectedSymptom[]) => {
        setIsEvaluating(true);
        try {
            const res = await analyzeSymptomsMock(selections);
            setResults(res);
        } finally {
            setIsEvaluating(false);
        }
    };

    const handleReset = () => {
        setResults(null);
        setSelectedPart(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col font-sans dark:from-slate-950 dark:to-slate-900">
            <Header />

            <main className="flex-1 py-12 px-6 md:px-12">
                <div className="mx-auto max-w-7xl">
                    {/* Page Header */}
                    <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex flex-col gap-4">
                            <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all w-fit">
                                <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                                Retour à l'accueil
                            </Link>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                                {t("title")}
                            </h1>
                            <p className="text-lg font-medium text-slate-500">
                                {t("subtitle")}
                            </p>
                        </div>

                        {gender && (
                            <div className="hidden lg:flex items-center gap-4 p-4 bg-white/60 backdrop-blur-md rounded-2xl border border-white/80 shadow-sm dark:bg-slate-900/60 dark:border-slate-800">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Info className="h-5 w-5" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profil</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold text-slate-700 dark:text-slate-200">
                                            {gender === 'male' ? 'Homme' : 'Femme'}
                                        </span>
                                        <button 
                                            onClick={() => { setGender(null); setResults(null); setSelectedPart(null); }}
                                            className="text-[10px] text-primary hover:underline"
                                        >
                                            (Modifier)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {!gender ? (
                        /* Gender Selection View */
                        <div className="max-w-3xl mx-auto flex flex-col items-center justify-center min-h-[50vh] gap-12 animate-in fade-in zoom-in duration-700">
                            <div className="text-center flex flex-col gap-4">
                                <h2 className="text-3xl font-black text-slate-900 dark:text-white">Sélectionnez votre profil</h2>
                                <p className="text-slate-500 max-w-lg mx-auto">
                                    Pour fournir une analyse précise et adaptée à votre physiologie, veuillez nous indiquer votre sexe biologique.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                                {/* Female Option */}
                                <button 
                                    onClick={() => setGender("female")}
                                    className="group relative flex flex-col items-center justify-center gap-6 p-12 rounded-[3rem] bg-white/60 backdrop-blur-xl border-2 border-transparent hover:border-primary/50 shadow-xl hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="h-24 w-24 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="10" r="6"/><line x1="12" y1="16" x2="12" y2="22"/><line x1="9" y1="19" x2="15" y2="19"/></svg>
                                    </div>
                                    <span className="text-2xl font-black text-slate-800">Femme</span>
                                </button>

                                {/* Male Option */}
                                <button 
                                    onClick={() => setGender("male")}
                                    className="group relative flex flex-col items-center justify-center gap-6 p-12 rounded-[3rem] bg-white/60 backdrop-blur-xl border-2 border-transparent hover:border-blue-500/50 shadow-xl hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-500 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="h-24 w-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="10" cy="14" r="6"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="15" y1="3" x2="21" y2="3"/><line x1="21" y1="3" x2="21" y2="9"/></svg>
                                    </div>
                                    <span className="text-2xl font-black text-slate-800">Homme</span>
                                </button>
                            </div>
                        </div>
                    ) : results ? (
                        /* AI Results View */
                        <div className="max-w-4xl mx-auto">
                            <AIDiagnosisResults results={results} onBack={handleReset} />
                        </div>
                    ) : (
                        /* Default Selection View */
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-in fade-in duration-700">
                            {/* Left Column: Body Map (55%) */}
                            <div className="lg:col-span-6 flex flex-col gap-8">
                                <BodyMap onSelectPart={setSelectedPart} selectedPart={selectedPart} gender={gender} />

                                {/* Medical Disclaimer Section */}
                                <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 text-white flex gap-6">
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-500">
                                        <AlertCircle className="h-8 w-8" />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h4 className="text-sm font-black uppercase tracking-[0.2em] text-red-500">
                                            {t("disclaimer.title")}
                                        </h4>
                                        <p className="text-sm font-medium leading-relaxed opacity-60">
                                            {t("disclaimer.text")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Symptom List (45%) */}
                            <div className="lg:col-span-6 flex flex-col min-h-[600px]">
                                <div className="sticky top-32 flex flex-col gap-8 h-full">
                                    <div className="rounded-[3rem] bg-white/40 backdrop-blur-3xl p-8 border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:bg-slate-950/40 dark:border-slate-800/60 h-full flex flex-col">
                                        <SymptomList 
                                            part={selectedPart} 
                                            onEvaluate={handleEvaluate} 
                                            isEvaluating={isEvaluating}
                                        />
                                    </div>
                                    
                                    {/* General Symptoms Quick Access */}
                                    {!selectedPart && (
                                        <div className="mt-auto flex items-center justify-between p-6 bg-white/60 backdrop-blur-md rounded-3xl border border-slate-100 shadow-sm dark:bg-slate-900/60 dark:border-slate-800 transition-transform hover:scale-[1.02]">
                                            <div className="flex items-center gap-4">
                                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800">
                                                    <Thermometer className="h-6 w-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-slate-200">Symptômes généraux</h4>
                                                    <p className="text-xs font-medium text-slate-500">Fièvre, fatigue, nausée...</p>
                                                </div>
                                            </div>
                                            <Button
                                                variant="outline"
                                                className="rounded-xl font-bold"
                                                onClick={handleGeneralSymptoms}
                                            >
                                                Sélectionner
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

