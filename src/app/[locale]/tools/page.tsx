"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Calculator, ArrowLeft, Info, CheckCircle2, Activity } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function ToolsPage() {
    const t = useTranslations("tools");
    const [weight, setWeight] = useState(70);
    const [height, setHeight] = useState(170);
    const [bmi, setBmi] = useState<number | null>(null);

    const calculateBMI = () => {
        const heightInMeters = height / 100;
        const result = weight / (heightInMeters * heightInMeters);
        setBmi(parseFloat(result.toFixed(1)));
    };

    const getBMICategory = (val: number) => {
        if (val < 18.5) return { label: t("bmi.underweight"), color: "text-blue-500", bg: "bg-blue-50" };
        if (val < 25) return { label: t("bmi.normal"), color: "text-emerald-500", bg: "bg-emerald-50" };
        if (val < 30) return { label: t("bmi.overweight"), color: "text-orange-500", bg: "bg-orange-50" };
        return { label: t("bmi.obese"), color: "text-red-500", bg: "bg-red-50" };
    };

    return (
        <div className="min-h-screen bg-slate-50/30 flex flex-col font-sans dark:bg-slate-950">
            <Header />

            <main className="flex-1 py-12 px-6 md:px-12">
                <div className="mx-auto max-w-7xl">
                    {/* Breadcrumbs */}
                    <div className="mb-12">
                        <Link href="/" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all">
                            <ArrowLeft className="h-4 w-4 rtl:rotate-180" />
                            Retour à l'accueil
                        </Link>
                        <h1 className="mt-4 text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
                            {t("title")}
                        </h1>
                        <p className="text-lg font-medium text-slate-400">
                            {t("subtitle")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* BMI Calculator Card */}
                        <Card className="lg:col-span-2 rounded-[2.5rem] border-slate-100 shadow-2xl overflow-hidden dark:bg-slate-900 dark:border-slate-800">
                            <CardHeader className="p-8 pb-4">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/5 text-primary">
                                        <Calculator className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black tracking-tight">{t("bmi.title")}</CardTitle>
                                        <CardDescription className="font-medium">{t("bmi.desc")}</CardDescription>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 flex flex-col gap-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    {/* Inputs */}
                                    <div className="flex flex-col gap-8">
                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("bmi.weight")}</Label>
                                                <span className="text-lg font-black text-primary">{weight} kg</span>
                                            </div>
                                            <Slider
                                                value={[weight]}
                                                min={30}
                                                max={200}
                                                step={1}
                                                onValueChange={(val) => setWeight(val[0])}
                                                className="py-4"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <div className="flex justify-between items-center">
                                                <Label className="text-xs font-black uppercase tracking-widest text-slate-400">{t("bmi.height")}</Label>
                                                <span className="text-lg font-black text-primary">{height} cm</span>
                                            </div>
                                            <Slider
                                                value={[height]}
                                                min={100}
                                                max={250}
                                                step={1}
                                                onValueChange={(val) => setHeight(val[0])}
                                                className="py-4"
                                            />
                                        </div>

                                        <Button
                                            onClick={calculateBMI}
                                            className="h-16 rounded-2xl bg-primary text-lg font-black shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-98 transition-all"
                                        >
                                            {t("bmi.calculate")}
                                        </Button>
                                    </div>

                                    {/* Result Display */}
                                    <div className="flex flex-col items-center justify-center border-l border-slate-50 pl-0 md:pl-12 dark:border-slate-800">
                                        {bmi ? (
                                            <div className="text-center animate-in zoom-in fade-in duration-500">
                                                <span className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 block mb-2">
                                                    {t("bmi.result")}
                                                </span>
                                                <div className="text-8xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
                                                    {bmi}
                                                </div>
                                                <div className={cn(
                                                    "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-black uppercase tracking-widest",
                                                    getBMICategory(bmi).bg,
                                                    getBMICategory(bmi).color
                                                )}>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    {getBMICategory(bmi).label}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center text-center text-slate-300 gap-4">
                                                <Calculator className="h-20 w-20 opacity-20" />
                                                <p className="text-sm font-bold uppercase tracking-widest max-w-[180px]">
                                                    Ajustez les curseurs pour calculer votre IMC
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Info Box */}
                                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100 flex gap-4 dark:bg-slate-900/50 dark:border-slate-800 underline-offset-4">
                                    <Info className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                                    <p className="text-sm font-medium text-slate-500 leading-relaxed">
                                        L'Indice de Masse Corporelle (IMC) est un indicateur de la corporulence d'une personne. Il est calculé en fonction du poids et de la taille.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Sidebar: More tools placeholder */}
                        <div className="flex flex-col gap-6">
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 px-4">AUTRES OUTILS</h3>
                            {[
                                { title: "Calories Quotidiennes", icon: Calculator },
                                { title: "Risque Cardiovasculaire", icon: Activity },
                                { title: "Calculateur d'Hydratation", icon: Calculator }
                            ].map((tool, i) => (
                                <div key={i} className="group p-6 bg-white rounded-3xl border border-slate-100 shadow-sm transition-all hover:shadow-xl hover:-translate-y-1 dark:bg-slate-900 dark:border-slate-800">
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-400 transition-colors group-hover:bg-primary group-hover:text-white dark:bg-slate-800">
                                            <tool.icon className="h-5 w-5" />
                                        </div>
                                        <span className="text-sm font-black tracking-tight">{tool.title}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
