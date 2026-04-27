"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { RotateCw, ZoomIn, ZoomOut, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type BodyPart =
    | "face" | "neck" | "shoulders" | "chest" | "heart" | "stomach" | "abdomen" | "pelvis"
    | "upper_arms" | "forearms" | "hands" | "thighs" | "knees" | "calves" | "ankles" | "feet"
    | "back_head" | "nape" | "upper_back" | "mid_back" | "lower_back" | "glutes" | "back_thighs" | "back_calves"
    | "heels" | null;

interface BodyMapProps {
    onSelectPart: (part: BodyPart) => void;
    selectedPart: BodyPart;
    gender: "male" | "female";
}

export function BodyMap({ onSelectPart, selectedPart, gender }: BodyMapProps) {
    const [hovered, setHovered] = useState<BodyPart>(null);
    const [isBackView, setIsBackView] = useState(false);
    const [zoom, setZoom] = useState(1);

    const toggleView = () => setIsBackView(!isBackView);
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.3, 2));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.3, 1));

    // Granular Invisible SVG Overlays - Widened High Forgiveness Paths
    // Using broad, forgiving shapes (mostly rounded rectangles and ellipses built with paths) 
    // to ensure they overlay the AI-generated image perfectly.
    const frontParts = [
        { id: "face", label: "Visage", d: "M 80,10 C 80,-10 120,-10 120,10 C 120,40 115,55 100,55 C 85,55 80,40 80,10 Z" },
        { id: "neck", label: "Cou", d: "M 88,50 L 112,50 L 115,75 L 85,75 Z" },
        { id: "shoulders", label: "Épaules", d: "M 40,75 L 160,75 C 170,95 160,115 145,110 L 100,95 L 55,110 C 40,115 30,95 40,75 Z" },
        { id: "chest", label: "Poitrine / Poumons", d: "M 60,95 L 140,95 C 150,130 145,150 130,150 L 70,150 C 55,150 50,130 60,95 Z" },
        { id: "heart", label: "Cœur", d: "M 100,105 C 115,105 125,115 120,130 C 110,145 95,130 100,105 Z" },
        { id: "stomach", label: "Estomac", d: "M 65,150 L 135,150 C 130,175 125,195 115,200 L 85,200 C 75,195 70,175 65,150 Z" },
        { id: "abdomen", label: "Abdomen / Intestins", d: "M 75,200 L 125,200 C 130,225 135,245 120,260 L 80,260 C 65,245 70,225 75,200 Z" },
        { id: "pelvis", label: "Bassin / Aine", d: "M 80,260 L 120,260 C 125,275 120,300 100,305 C 80,300 75,275 80,260 Z" },
        // Widened Limbs
        { id: "upper_arms", label: "Haut des bras", d: "M 35,90 C 20,90 15,120 15,160 C 25,175 35,175 45,160 Z M 165,90 C 180,90 185,120 185,160 C 175,175 165,175 155,160 Z" },
        { id: "forearms", label: "Avant-bras", d: "M 15,160 C 25,175 35,175 45,160 L 40,230 C 30,240 20,240 10,230 Z M 185,160 C 175,175 165,175 155,160 L 160,230 C 170,240 180,240 190,230 Z" },
        { id: "hands", label: "Mains / Doigts", d: "M 10,230 C 20,240 30,240 40,230 C 45,260 40,300 15,310 C 0,300 0,260 10,230 Z M 190,230 C 180,240 170,240 160,230 C 155,260 160,300 185,310 C 200,300 200,260 190,230 Z" },
        { id: "thighs", label: "Cuisses", d: "M 75,270 L 100,270 L 95,370 L 65,370 Z M 125,270 L 100,270 L 105,370 L 135,370 Z" },
        { id: "knees", label: "Genoux", d: "M 65,370 L 95,370 L 90,405 L 60,405 Z M 135,370 L 105,370 L 110,405 L 140,405 Z" },
        { id: "calves", label: "Tibias", d: "M 60,405 L 90,405 L 85,480 L 55,480 Z M 140,405 L 110,405 L 115,480 L 145,480 Z" },
        { id: "ankles", label: "Chevilles", d: "M 55,480 L 85,480 L 85,505 L 55,505 Z M 145,480 L 115,480 L 115,505 L 145,505 Z" },
        { id: "feet", label: "Pieds / Orteils", d: "M 55,505 L 85,505 C 85,530 95,540 65,540 C 45,540 50,530 55,505 Z M 145,505 L 115,505 C 115,530 105,540 135,540 C 155,540 150,530 145,505 Z" }
    ];

    const backParts = [
        { id: "back_head", label: "Arrière de la tête", d: "M 80,10 C 80,-10 120,-10 120,10 C 120,40 115,55 100,55 C 85,55 80,40 80,10 Z" },
        { id: "nape", label: "Nuque", d: "M 88,50 L 112,50 L 115,75 L 85,75 Z" },
        { id: "shoulders", label: "Épaules", d: "M 40,75 L 160,75 C 170,95 160,115 145,110 L 100,95 L 55,110 C 40,115 30,95 40,75 Z" },
        { id: "upper_back", label: "Haut du dos", d: "M 60,95 L 140,95 C 150,115 145,135 125,155 L 75,155 C 55,135 50,115 60,95 Z" },
        { id: "mid_back", label: "Milieu du dos", d: "M 75,155 L 125,155 L 120,210 L 80,210 Z" },
        { id: "lower_back", label: "Lombaires", d: "M 80,210 L 120,210 C 125,245 120,265 110,275 L 90,275 C 80,265 75,245 80,210 Z" },
        { id: "glutes", label: "Fessiers", d: "M 90,275 L 110,275 C 135,275 140,295 125,325 L 75,325 C 60,295 65,275 90,275 Z" },
        { id: "upper_arms", label: "Haut des bras", d: frontParts.find(p => p.id === "upper_arms")?.d },
        { id: "forearms", label: "Avant-bras", d: frontParts.find(p => p.id === "forearms")?.d },
        { id: "hands", label: "Mains", d: frontParts.find(p => p.id === "hands")?.d },
        { id: "back_thighs", label: "Arrière des cuisses", d: "M 75,325 L 100,325 L 95,395 L 65,395 Z M 125,325 L 100,325 L 105,395 L 135,395 Z" },
        { id: "knees", label: "Arrière des genoux", d: "M 65,395 L 95,395 L 90,425 L 60,425 Z M 135,395 L 105,395 L 110,425 L 140,425 Z" },
        { id: "back_calves", label: "Mollets", d: "M 60,425 L 90,425 L 85,480 L 55,480 Z M 140,425 L 110,425 L 115,480 L 145,480 Z" },
        { id: "ankles", label: "Chevilles", d: frontParts.find(p => p.id === "ankles")?.d },
        { id: "heels", label: "Talons", d: frontParts.find(p => p.id === "feet")?.d }
    ];

    const currentParts = isBackView ? backParts : frontParts;
    const viewString = isBackView ? "back" : "front";
    const imageSrc = `/anatomy-${gender}-${viewString}.png`;

    return (
        <div className="relative flex flex-col items-center justify-center p-2 sm:p-6 bg-white/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden dark:bg-slate-950/40 dark:border-slate-800/60 dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] h-[75vh] min-h-[600px] w-full">
            {/* View Controls */}
            <div className="absolute top-8 right-8 flex flex-col gap-3 z-30">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleView}
                    className="rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-slate-100/50 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 dark:bg-slate-900/80 dark:border-slate-800 dark:hover:bg-primary"
                    title="Rotation 180°"
                >
                    <RotateCw className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomIn}
                    className="rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-slate-100/50 hover:bg-slate-50 transition-all duration-300 dark:bg-slate-900/80 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                    <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleZoomOut}
                    className="rounded-2xl bg-white/80 backdrop-blur-md shadow-sm border border-slate-100/50 hover:bg-slate-50 transition-all duration-300 dark:bg-slate-900/80 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                    <ZoomOut className="h-5 w-5" />
                </Button>
            </div>

            {/* View Indicator */}
            <div className="absolute top-8 left-8 z-30 flex items-center gap-3 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-100/50 shadow-sm dark:bg-slate-900/80 dark:border-slate-800">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
                </span>
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-700 dark:text-slate-300">
                    {isBackView ? "VUE DORSALE" : "VUE FRONTALE"}
                </span>
            </div>

            {/* Full Space Image Container */}
            <div
                className="relative z-10 w-full h-full max-w-[800px] transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center"
                style={{ transform: `scale(${zoom})` }}
            >
                {/* Photorealistic 3D Base Layer */}
                <div className="absolute inset-0 w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-visible">
                    <Image
                        key={imageSrc} 
                        src={imageSrc}
                        alt={`Modèle 3D Anatomie - ${gender} ${viewString}`}
                        fill
                        className="object-contain transition-opacity duration-700 pointer-events-none"
                        priority
                    />
                </div>

                {/* Invisible Interactive SVG Overlay */}
                <svg
                    viewBox="0 0 200 550"
                    className="absolute inset-0 w-full h-full z-20"
                    fill="none"
                    preserveAspectRatio="xMidYMid meet"
                >
                    <defs>
                        <filter id="soft-glow" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="8" result="blur" />
                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                    </defs>

                    <g className="transition-all duration-300 ease-in-out">
                        {currentParts.map((part) => {
                            if (!part.d) return null;
                            const isSelected = selectedPart === part.id;
                            const isHovered = hovered === part.id;
                            const isActive = isSelected || isHovered;
                            
                            return (
                                <path
                                    key={`${part.id}-${viewString}`}
                                    d={part.d}
                                    className={cn(
                                        "cursor-pointer transition-all duration-300 outline-none",
                                        isActive
                                            ? "fill-primary/40 stroke-primary/30 stroke-[1.5]" 
                                            : "fill-transparent stroke-transparent"
                                    )}
                                    filter={isActive ? "url(#soft-glow)" : ""}
                                    onClick={() => onSelectPart(part.id as BodyPart)}
                                    onMouseEnter={() => setHovered(part.id as BodyPart)}
                                    onMouseLeave={() => setHovered(null)}
                                />
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Label Overlay */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 min-h-[3rem] flex items-center justify-center pointer-events-none z-30 w-max max-w-[90%]">
                <div className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/90 backdrop-blur-md shadow-lg border border-slate-100/50 transition-all duration-500 dark:bg-slate-900/90 dark:border-slate-800",
                    hovered || selectedPart ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95"
                )}>
                    {selectedPart === (hovered || selectedPart) && <CheckCircle2 className="h-4 w-4 text-primary" />}
                    <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-800 dark:text-slate-200">
                        {currentParts.find(p => p.id === (hovered || selectedPart))?.label || "SÉLECTIONNEZ UNE ZONE"}
                    </span>
                </div>
            </div>
        </div>
    );
}

