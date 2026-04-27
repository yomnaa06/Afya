"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { BodyPart } from "./body-map";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles, Loader2, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export interface Symptom {
    id: string;
    label: string;
    parts: string[];
}

export interface SelectedSymptom extends Symptom {
    intensity: "low" | "mid" | "high";
    duration: "hours" | "days" | "weeks";
    evolution: "stable" | "worse" | "better";
}

interface SymptomListProps {
    part: BodyPart;
    onEvaluate: (selections: SelectedSymptom[]) => void;
    isEvaluating?: boolean;
}

const ALL_SYMPTOMS: Record<string, Symptom> = {
    // ---- TÊTE, CERVEAU & VISAGE (NEUROLOGIE/ORL) ----
    "headache": { id: "headache", label: "Maux de tête / Migraine pulsatile", parts: ["face", "back_head"] },
    "dizziness": { id: "dizziness", label: "Vertiges / Étourdissements / Perte d'équilibre", parts: ["face", "back_head"] },
    "vision_blur": { id: "vision_blur", label: "Vision floue / Taches noires (Mouches)", parts: ["face"] },
    "vision_loss": { id: "vision_loss", label: "Perte de vision soudaine (Urgent)", parts: ["face"] },
    "fever": { id: "fever", label: "Fièvre (>38°C)", parts: ["face"] },
    "fever_chills": { id: "fever_chills", label: "Fièvre avec frissons intenses", parts: ["face", "chest"] },
    "skin_lesion_face": { id: "skin_lesion_face", label: "Lésion cutanée / Ulcère persistant (ex: Clou de Biskra)", parts: ["face"] },
    "toothache": { id: "toothache", label: "Douleur dentaire lancinante", parts: ["face"] },
    "earache": { id: "earache", label: "Douleur à l'oreille / Acouphènes (Bourdonnements)", parts: ["face"] },
    "confusion": { id: "confusion", label: "Confusion / Difficulté à parler (Aphasie)", parts: ["face"] },
    "fainting": { id: "fainting", label: "Syncope / Évanouissement", parts: ["face", "back_head"] },

    // ---- COU, GORGE & TYROÏDE ----
    "neck_pain": { id: "neck_pain", label: "Douleur cervicale / Raideur de la nuque", parts: ["neck", "nape"] },
    "sore_throat": { id: "sore_throat", label: "Maux de gorge / Déglutition douloureuse", parts: ["neck"] },
    "swollen_nodes": { id: "swollen_nodes", label: "Ganglions enflés (Cou/Aisselles)", parts: ["neck", "nape"] },
    "hoarseness": { id: "hoarseness", label: "Enrouement / Perte de voix", parts: ["neck"] },
    "goiter": { id: "goiter", label: "Gonflement à la base du cou (Goitre)", parts: ["neck"] },

    // ---- THORAX, CŒUR & POUMONS (CARDIOLOGIE/PNEUMOLOGIE) ----
    "chest_pain_heavy": { id: "chest_pain_heavy", label: "Douleur thoracique (Sensation d'étau/Pression)", parts: ["chest", "heart"] },
    "chest_pain_sharp": { id: "chest_pain_sharp", label: "Douleur thoracique pointue (Pleurétique)", parts: ["chest"] },
    "breath_short": { id: "breath_short", label: "Essoufflement au moindre effort (Dyspnée)", parts: ["chest", "heart"] },
    "breath_rest": { id: "breath_rest", label: "Difficulté à respirer au repos", parts: ["chest"] },
    "palpitations": { id: "palpitations", label: "Palpitations / Battements cardiaques rapides", parts: ["heart"] },
    "cough_dry": { id: "cough_dry", label: "Toux sèche irritative", parts: ["chest", "neck"] },
    "cough_wet": { id: "cough_wet", label: "Toux grasse (Expectorations)", parts: ["chest"] },
    "cough_blood": { id: "cough_blood", label: "Crachats sanglants (Hémoptysie)", parts: ["chest"] },
    "wheezing": { id: "wheezing", label: "Sifflement respiratoire (Sibilances)", parts: ["chest"] },

    // ---- ABDOMEN, FOIE & DIGESTION (GASTRO-ENTÉROLOGIE) ----
    "stomach_burn": { id: "stomach_burn", label: "Brûlures d'estomac / Remontées acides", parts: ["stomach"] },
    "nausea_vomit": { id: "nausea_vomit", label: "Nausées / Vomissements fréquents", parts: ["stomach", "abdomen"] },
    "diarrhea_watery": { id: "diarrhea_watery", label: "Diarrhée aqueuse (Gastro)", parts: ["abdomen", "pelvis"] },
    "diarrhea_bloody": { id: "diarrhea_bloody", label: "Selles avec sang ou glaires", parts: ["abdomen", "pelvis"] },
    "constipation": { id: "constipation", label: "Constipation (Arrêt des matières et des gaz)", parts: ["abdomen"] },
    "bloating": { id: "bloating", label: "Ballonnements / Météorisme abdominal", parts: ["abdomen"] },
    "right_upper_pain": { id: "right_upper_pain", label: "Douleur sous les côtes à droite (Foie/Vésicule)", parts: ["abdomen", "chest"] },
    "left_upper_pain": { id: "left_upper_pain", label: "Douleur sous les côtes à gauche (Rate/Estomac)", parts: ["abdomen", "chest"] },
    "right_lower_pain": { id: "right_lower_pain", label: "Douleur vive fosse iliaque droite (Appendice)", parts: ["abdomen", "pelvis"] },
    "jaundice": { id: "jaundice", label: "Peau ou yeux jaunes (Ictère)", parts: ["face", "stomach"] },

    // ---- PELVIS & URO-GÉNITAL ----
    "pelvic_pain": { id: "pelvic_pain", label: "Douleur pelvienne / Bas-ventre", parts: ["pelvis"] },
    "urinary_burn": { id: "urinary_burn", label: "Brûlure ou douleur en urinant", parts: ["pelvis"] },
    "urinary_freq": { id: "urinary_freq", label: "Besoin fréquent d'uriner (Pollakiurie)", parts: ["pelvis"] },
    "urinary_blood": { id: "urinary_blood", label: "Sang dans les urines (Hématurie)", parts: ["pelvis"] },

    // ---- BRAS, MAINS & ÉPAULES (ORTHOPÉDIE) ----
    "shoulder_stiff": { id: "shoulder_stiff", label: "Épaule gelée / Raideur articulaire", parts: ["shoulders"] },
    "arm_numbness": { id: "arm_numbness", label: "Fourmillements / Engourdissement du bras", parts: ["upper_arms", "forearms", "hands"] },
    "arm_weakness": { id: "arm_weakness", label: "Perte de force dans la main ou le bras", parts: ["upper_arms", "forearms", "hands"] },
    "joint_swelling_arm": { id: "joint_swelling_arm", label: "Articulation enflée et chaude", parts: ["upper_arms", "forearms", "hands"] },

    // ---- DOS & COLONNE VERTÉBRALE ----
    "upper_back": { id: "upper_back", label: "Douleur dorsale entre les omoplates", parts: ["upper_back", "shoulders"] },
    "lower_back_sharp": { id: "lower_back_sharp", label: "Douleur lombaire aiguë (Tour de rein)", parts: ["lower_back", "mid_back"] },
    "sciatica": { id: "sciatica", label: "Douleur irradiant du dos vers la jambe (Sciatique)", parts: ["lower_back", "glutes", "back_thighs", "back_calves"] },
    "kidney_flank": { id: "kidney_flank", label: "Douleur violente au flanc irradiant vers le bas", parts: ["lower_back", "mid_back"] },

    // ---- JAMBES & PIEDS ----
    "leg_swelling": { id: "leg_swelling", label: "Jambe gonflée, rouge et douloureuse (Phlébite?)", parts: ["thighs", "calves", "ankles"] },
    "knee_instability": { id: "knee_instability", label: "Genou instable / Sensation de dérobement", parts: ["knees"] },
    "calf_cramp": { id: "calf_cramp", label: "Crampes nocturnes au mollet", parts: ["calves", "back_calves"] },
    "foot_numbness": { id: "foot_numbness", label: "Perte de sensibilité au pied (Diabète?)", parts: ["feet"] },

    // ---- GÉNÉRAL & SYSTÉMIQUE ----
    "fatigue_chronic": { id: "fatigue_chronic", label: "Asthénie / Fatigue persistante au réveil", parts: [] },
    "weight_loss": { id: "weight_loss", label: "Perte de poids involontaire rapide", parts: [] },
    "night_sweats": { id: "night_sweats", label: "Sueurs nocturnes abondantes", parts: [] },
    "itching": { id: "itching", label: "Démangeaisons généralisées (Prurit)", parts: [] },
    "thirst_excessive": { id: "thirst_excessive", label: "Soif excessive et urines fréquentes", parts: [] },
    "bruising": { id: "bruising", label: "Bleus (Ecchymoses) apparaissant sans choc", parts: [] },
    "raw_milk_consumption": { id: "raw_milk_consumption", label: "Consommation récente de lait ou fromage cru", parts: [] },
};

export function SymptomList({ part, onEvaluate, isEvaluating = false }: SymptomListProps) {
    const t = useTranslations("symptoms");
    const [selections, setSelections] = useState<Record<string, SelectedSymptom>>({});
    const [searchTerm, setSearchTerm] = useState("");

    const displayedSymptoms = Object.values(ALL_SYMPTOMS).filter(s => {
        if (searchTerm.trim() !== "") {
            return s.label.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (part) {
            return s.parts.includes(part);
        }
        return false;
    });

    const toggleSymptom = (symptom: Symptom) => {
        setSelections(prev => {
            const newS = { ...prev };
            if (newS[symptom.id]) {
                delete newS[symptom.id];
            } else {
                newS[symptom.id] = {
                    ...symptom,
                    intensity: "mid",
                    duration: "days",
                    evolution: "stable"
                };
            }
            return newS;
        });
    };

    const updateQualifier = (id: string, key: keyof SelectedSymptom, val: any) => {
        setSelections(prev => ({
            ...prev,
            [id]: { ...prev[id], [key]: val }
        }));
    };

    const handleEvaluateClick = () => {
        onEvaluate(Object.values(selections));
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex flex-col gap-6 mb-8">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                            Symptômes
                        </h3>
                        <p className="text-sm text-slate-500">
                            Recherchez ou sélectionnez une zone
                        </p>
                    </div>
                    {part && (
                        <div className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-100 shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 dark:text-slate-300">
                                {part.replace('_', ' ')}
                            </span>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <Input 
                        placeholder="Recherchez un symptôme (ex: Maux de tête)..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 h-14 rounded-2xl bg-white/60 backdrop-blur-md border-white/60 shadow-sm text-base focus-visible:ring-primary/20 dark:bg-slate-900/60 dark:border-slate-800"
                    />
                </div>
            </div>

            <div className="grid gap-4 flex-1 content-start overflow-y-auto pr-2 pb-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
                {!part && searchTerm === "" ? (
                    <div className="flex flex-col items-center justify-center text-center p-12 bg-white/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/60 shadow-sm dark:bg-slate-900/40 dark:border-slate-800/60">
                        <div className="text-4xl mb-4 opacity-70">🔎</div>
                        <h3 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-2">
                            Que ressentez-vous ?
                        </h3>
                        <p className="text-slate-500 font-medium text-sm">
                            Tapez un symptôme dans la barre de recherche ou cliquez sur la zone douloureuse du modèle 3D.
                        </p>
                    </div>
                ) : displayedSymptoms.length === 0 ? (
                    <div className="p-8 text-center bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/60 shadow-sm dark:bg-slate-900/40 dark:border-slate-800">
                        <p className="text-slate-500 font-medium">Aucun symptôme trouvé pour cette recherche.</p>
                    </div>
                ) : (
                    displayedSymptoms.map((s) => (
                        <div
                            key={s.id}
                            className={cn(
                                "group relative rounded-[2rem] border transition-all duration-500 p-6 overflow-hidden",
                                selections[s.id]
                                    ? "border-primary/30 bg-primary/[0.03] shadow-[0_8px_30px_rgb(200,16,46,0.06)] dark:bg-primary/[0.05]"
                                    : "border-white/60 bg-white/40 backdrop-blur-md shadow-sm hover:shadow-md hover:bg-white/60 dark:border-slate-800/60 dark:bg-slate-950/40 dark:hover:bg-slate-900/60"
                            )}
                        >
                            <div className="flex items-center gap-4 cursor-pointer relative z-10" onClick={() => toggleSymptom(s)}>
                                <div className={cn(
                                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors",
                                    selections[s.id] ? "border-primary bg-primary text-white" : "border-slate-300 bg-transparent dark:border-slate-600"
                                )}>
                                    {selections[s.id] && <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                                </div>
                                <label className="text-lg font-bold text-slate-800 dark:text-slate-200 cursor-pointer select-none">
                                    {s.label}
                                </label>
                            </div>

                            {selections[s.id] && (
                                <div className="mt-6 pt-6 border-t border-primary/10 flex flex-col gap-6 animate-in slide-in-from-top-4 fade-in duration-500 relative z-10">
                                    {/* Intensité */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Intensité</span>
                                        <div className="flex gap-2">
                                            {["low", "mid", "high"].map((level) => (
                                                <Button
                                                    key={level}
                                                    size="sm"
                                                    variant={selections[s.id].intensity === level ? "default" : "outline"}
                                                    onClick={() => updateQualifier(s.id, "intensity", level)}
                                                    className={cn(
                                                        "flex-1 rounded-xl h-10 text-xs font-bold transition-all",
                                                        selections[s.id].intensity === level ? "shadow-md" : "bg-white/50 backdrop-blur-sm dark:bg-slate-900/50"
                                                    )}
                                                >
                                                    {level === "low" ? "Léger" : level === "mid" ? "Modéré" : "Sévère"}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Durée */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Durée</span>
                                        <div className="flex gap-2">
                                            {["hours", "days", "weeks"].map((d) => (
                                                <Button
                                                    key={d}
                                                    size="sm"
                                                    variant={selections[s.id].duration === d ? "default" : "outline"}
                                                    onClick={() => updateQualifier(s.id, "duration", d)}
                                                    className={cn(
                                                        "flex-1 rounded-xl h-10 text-xs font-bold transition-all",
                                                        selections[s.id].duration === d ? "shadow-md" : "bg-white/50 backdrop-blur-sm dark:bg-slate-900/50"
                                                    )}
                                                >
                                                    {d === "hours" ? "Heures" : d === "days" ? "Jours" : "Semaines"}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Evolution */}
                                    <div className="flex flex-col gap-3">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Évolution</span>
                                        <div className="flex gap-2">
                                            {["stable", "worse", "better"].map((e) => (
                                                <Button
                                                    key={e}
                                                    size="sm"
                                                    variant={selections[s.id].evolution === e ? "default" : "outline"}
                                                    onClick={() => updateQualifier(s.id, "evolution", e)}
                                                    className={cn(
                                                        "flex-1 rounded-xl h-10 text-xs font-bold transition-all",
                                                        selections[s.id].evolution === e ? "shadow-md" : "bg-white/50 backdrop-blur-sm dark:bg-slate-900/50"
                                                    )}
                                                >
                                                    {e === "stable" ? "Stable" : e === "worse" ? "Aggravation" : "Amélioration"}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>

            {Object.keys(selections).length > 0 && (
                <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-6 animate-in slide-in-from-bottom-4 fade-in duration-500 shrink-0">
                    <div className="flex items-center justify-between text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] px-2">
                        <span>{Object.keys(selections).length} symptôme(s) sélectionné(s)</span>
                        <button onClick={() => setSelections({})} className="hover:text-primary transition-colors flex items-center gap-1">
                            Effacer tout
                        </button>
                    </div>

                    <Button
                        size="lg"
                        onClick={handleEvaluateClick}
                        disabled={isEvaluating}
                        className="relative overflow-hidden group h-16 rounded-[2rem] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary text-white text-lg font-black shadow-[0_10px_40px_rgba(200,16,46,0.3)] hover:shadow-[0_15px_50px_rgba(200,16,46,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 w-full"
                    >
                        {isEvaluating ? (
                            <span className="flex items-center justify-center gap-3 w-full">
                                <Loader2 className="h-6 w-6 animate-spin" />
                                ANALYSE IA EN COURS...
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-3 w-full">
                                <Sparkles className="h-5 w-5" />
                                ANALYSER MES SYMPTÔMES
                            </span>
                        )}
                        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
                    </Button>
                </div>
            )}
        </div>
    );
}

