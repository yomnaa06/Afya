"use client";

import React from "react";
import { DiagnosisResult } from "@/lib/mock-ai-agent";
import { AlertCircle, ArrowLeft, HeartPulse, Activity, Sparkles, ShieldCheck, Info, CheckCircle2, AlertTriangle, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AIDiagnosisResultsProps {
    results: DiagnosisResult[];
    onBack: () => void;
}

export function AIDiagnosisResults({ results, onBack }: AIDiagnosisResultsProps) {
    if (results.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center min-h-[500px]">
                <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                    <ShieldCheck className="h-10 w-10 text-slate-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 mb-2">Aucun résultat spécifique</h3>
                <p className="text-slate-500 max-w-md mb-8">
                    Vos symptômes ne correspondent pas de manière évidente à nos modèles actuels. Si vous ne vous sentez pas bien, veuillez consulter un professionnel de la santé.
                </p>
                <Button onClick={onBack} variant="outline" className="rounded-2xl">
                    Retourner à la sélection
                </Button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-8 animate-in fade-in duration-700">
            {/* Header - Professional, no excessive warnings */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white/60 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="flex flex-col gap-2">
                    <button 
                        onClick={onBack}
                        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-80 transition-opacity w-fit mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" /> Nouvelle analyse
                    </button>
                    <div className="flex items-center gap-3">
                        <Activity className="h-8 w-8 text-primary" />
                        <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                            Rapport de Diagnostic
                        </h2>
                    </div>
                    <p className="text-slate-500 mt-2 max-w-xl font-medium">
                        Basé sur l'analyse de vos symptômes et la prévalence épidémiologique locale, voici les conditions médicales probables.
                    </p>
                </div>
            </div>

            {/* Results List */}
            <div className="grid gap-8">
                {results.map((result, idx) => (
                    <div 
                        key={result.id}
                        className={cn(
                            "relative overflow-hidden flex flex-col p-8 rounded-[2.5rem] border backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl",
                            idx === 0 
                                ? "bg-gradient-to-br from-primary/5 to-transparent border-primary/20 shadow-lg"
                                : "bg-white/80 border-white shadow-sm hover:shadow-lg dark:bg-slate-900/80 dark:border-slate-800"
                        )}
                        style={{ animationDelay: `${idx * 150}ms` }}
                    >
                        {idx === 0 && (
                            <div className="absolute top-0 right-0 bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-bl-2xl">
                                Correspondance Majeure
                            </div>
                        )}
                        
                        {/* Card Header */}
                        <div className="flex flex-col md:flex-row gap-6 md:items-center justify-between mb-8">
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl shadow-inner",
                                    result.urgency === "critical" ? "bg-red-600 text-white animate-pulse" :
                                    result.urgency === "high" ? "bg-red-100 text-red-600" : 
                                    result.urgency === "medium" ? "bg-amber-100 text-amber-600" : 
                                    "bg-emerald-100 text-emerald-600"
                                )}>
                                    {result.urgency === "critical" ? <AlertTriangle className="h-7 w-7" /> : 
                                     result.urgency === "high" ? <AlertCircle className="h-7 w-7" /> : 
                                     <Activity className="h-7 w-7" />}
                                </div>
                                <div className="flex flex-col gap-1">
                                    <h3 className="text-2xl font-black text-slate-800 dark:text-slate-100 pr-8">
                                        {result.conditionName}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-1.5">
                                            <div className="h-1.5 w-16 bg-slate-200 rounded-full overflow-hidden">
                                                <div 
                                                    className={cn("h-full rounded-full", idx === 0 ? "bg-primary" : "bg-slate-400")}
                                                    style={{ width: `${result.probability}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-black text-slate-500">{result.probability}% de probabilité</span>
                                        </div>
                                        <span className="text-slate-300">•</span>
                                        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                                            <Info className="h-3 w-3" /> {result.howCommon}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rich Medical Content Grid */}
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Left Column: Overview & Symptoms */}
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-2">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Aperçu Médical</span>
                                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                                        {result.overview}
                                    </p>
                                </div>
                                
                                <div className="flex flex-col gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Symptômes Associés</span>
                                    <ul className="space-y-2">
                                        {result.symptomsList.map((symp, i) => (
                                            <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                                                <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                                <span>{symp}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Right Column: Treatment & Action */}
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Options de Traitement</span>
                                    <div className="bg-white/60 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-2xl p-4">
                                        <ul className="space-y-2.5">
                                            {result.treatmentOptions.map((treatment, i) => (
                                                <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                                    <Pill className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                                                    <span>{treatment}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2 mt-auto">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Recommandation Immédiate</span>
                                    <div className={cn(
                                        "p-4 rounded-2xl border shadow-sm",
                                        result.urgency === "critical" ? "bg-red-600 border-red-700 text-white font-bold" :
                                        result.urgency === "high" ? "bg-red-50 border-red-100 text-red-800 font-semibold" : 
                                        "bg-slate-50 border-slate-200 text-slate-700 font-medium"
                                    )}>
                                        <p className="text-sm leading-relaxed">
                                            {result.recommendation}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
