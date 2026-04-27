"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Search, Navigation, Star, X, Building2, Pill, FlaskConical, Stethoscope, Building } from "lucide-react";
import dynamic from "next/dynamic";
import type { Facility } from "@/components/directory/health-map";

const HealthMap = dynamic(
    () => import("@/components/directory/health-map").then(m => m.HealthMap),
    { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-900"><div className="text-slate-400 font-bold animate-pulse">Chargement de la carte...</div></div> }
);

// ─── DATABASE: Real Tunisian health facilities ─────────────────────────────
const ALL_FACILITIES: Facility[] = [
    // ── HÔPITAUX PUBLICS ──
    { id: "h1", type: "Hôpital", name: "Hôpital Charles Nicolle", city: "Tunis", address: "Bd du 9 Avril 1938, Bab Saadoun", phone: "+216 71 578 000", cnam: true, lat: 36.8299, lng: 10.1636 },
    { id: "h2", type: "Hôpital", name: "Hôpital La Rabta", city: "Tunis", address: "Jebel Lakdar, Bab Saadoun", phone: "+216 71 578 522", cnam: true, lat: 36.8311, lng: 10.1621 },
    { id: "h3", type: "Hôpital", name: "Hôpital Mongi Slim (La Marsa)", city: "La Marsa", address: "La Marsa, Tunis Nord", phone: "+216 71 774 011", cnam: true, lat: 36.8778, lng: 10.3245 },
    { id: "h4", type: "Hôpital", name: "Institut National de Neurologie", city: "Tunis", address: "Bd du 9 Avril, Bab Saadoun", phone: "+216 71 568 686", cnam: true, lat: 36.8295, lng: 10.1641 },
    { id: "h5", type: "Hôpital", name: "Hôpital d'Enfants de Tunis", city: "Tunis", address: "Bab Saadoun", phone: "+216 71 563 001", cnam: true, lat: 36.8309, lng: 10.1659 },
    { id: "h6", type: "Hôpital", name: "Hôpital Farhat Hached (Sousse)", city: "Sousse", address: "Ave Ibn el Jazzar, Sousse", phone: "+216 73 221 411", cnam: true, lat: 35.8288, lng: 10.6360 },
    { id: "h7", type: "Hôpital", name: "CHU Hédi Chaker (Sfax)", city: "Sfax", address: "Ave Majida Boulila, Sfax", phone: "+216 74 241 333", cnam: true, lat: 34.7406, lng: 10.7603 },
    { id: "h8", type: "Hôpital", name: "Hôpital Régional de Bizerte", city: "Bizerte", address: "Ave Habib Bourguiba, Bizerte", phone: "+216 72 431 422", cnam: true, lat: 37.2746, lng: 9.8739 },
    { id: "h9", type: "Hôpital", name: "Hôpital Régional de Nabeul", city: "Nabeul", address: "Ave Habib Bourguiba, Nabeul", phone: "+216 72 222 733", cnam: true, lat: 36.4539, lng: 10.7342 },
    { id: "h10", type: "Hôpital", name: "Hôpital Maternité de Tunis", city: "Tunis", address: "Rue de Serbie, Centre Ville", phone: "+216 71 561 339", cnam: true, lat: 36.8158, lng: 10.1798 },

    // ── CLINIQUES PRIVÉES ──
    { id: "c1", type: "Clinique", name: "Clinique Avicenne", city: "Tunis", address: "El Manar, Tunis", phone: "+216 71 885 500", cnam: true, lat: 36.8441, lng: 10.2001 },
    { id: "c2", type: "Clinique", name: "Clinique du Parc", city: "Tunis", address: "Les Berges du Lac, Tunis", phone: "+216 71 965 200", cnam: true, lat: 36.8456, lng: 10.2312 },
    { id: "c3", type: "Clinique", name: "Clinique Hannibal", city: "Tunis", address: "La Marsa, Tunis Nord", phone: "+216 71 743 555", cnam: false, lat: 36.8812, lng: 10.3289 },
    { id: "c4", type: "Clinique", name: "Clinique Taoufik", city: "Tunis", address: "Cité Jardins, El Menzah", phone: "+216 71 703 700", cnam: true, lat: 36.8601, lng: 10.1913 },
    { id: "c5", type: "Clinique", name: "Clinique El Amen", city: "Sfax", address: "Centre Sfax", phone: "+216 74 402 555", cnam: true, lat: 34.7449, lng: 10.7666 },
    { id: "c6", type: "Clinique", name: "Clinique Ennasr", city: "Tunis", address: "Ennasr 2, Ariana", phone: "+216 71 826 200", cnam: true, lat: 36.8789, lng: 10.1937 },
    { id: "c7", type: "Clinique", name: "Clinique El Manar", city: "Tunis", address: "El Manar 1, Tunis", phone: "+216 71 886 050", cnam: false, lat: 36.8430, lng: 10.1967 },
    { id: "c8", type: "Clinique", name: "Clinique Bougatfa (Bizerte)", city: "Bizerte", address: "Bougatfa, Bizerte", phone: "+216 72 432 200", cnam: true, lat: 37.2763, lng: 9.8754 },

    // ── PHARMACIES ──
    { id: "p1", type: "Pharmacie", name: "Pharmacie de Garde Centrale", city: "Tunis", address: "Ave de Paris, Centre-Ville", phone: "+216 71 340 250", cnam: false, guard: true, lat: 36.8014, lng: 10.1846 },
    { id: "p2", type: "Pharmacie", name: "Pharmacie El Menzah", city: "Tunis", address: "El Menzah 5, Ariana", phone: "+216 71 236 400", cnam: false, lat: 36.8572, lng: 10.1882 },
    { id: "p3", type: "Pharmacie", name: "Pharmacie Les Jardins d'El Menzah", city: "Tunis", address: "El Menzah 6, Ariana", phone: "+216 71 236 112", cnam: false, lat: 36.8590, lng: 10.1900 },
    { id: "p4", type: "Pharmacie", name: "Pharmacie du Lac", city: "Tunis", address: "Les Berges du Lac 1", phone: "+216 71 960 700", cnam: false, lat: 36.8423, lng: 10.2298 },
    { id: "p5", type: "Pharmacie", name: "Pharmacie Ennasr", city: "Tunis", address: "Ennasr, Ariana", phone: "+216 71 826 100", cnam: false, guard: true, lat: 36.8810, lng: 10.1950 },
    { id: "p6", type: "Pharmacie", name: "Pharmacie Ibn Khaldoun (Sfax)", city: "Sfax", address: "Centre Sfax", phone: "+216 74 222 890", cnam: false, lat: 34.7420, lng: 10.7599 },
    { id: "p7", type: "Pharmacie", name: "Pharmacie Centrale (Sousse)", city: "Sousse", address: "Ave Bourguiba, Sousse", phone: "+216 73 225 200", cnam: false, guard: true, lat: 35.8272, lng: 10.6337 },
    { id: "p8", type: "Pharmacie", name: "Pharmacie La Marsa", city: "La Marsa", address: "Ave Taieb Mehiri, La Marsa", phone: "+216 71 741 100", cnam: false, lat: 36.8789, lng: 10.3248 },

    // ── LABORATOIRES ──
    { id: "l1", type: "Laboratoire", name: "Laboratoire Pasteur (Centre)", city: "Tunis", address: "Rue de Hollande, Centre-Ville", phone: "+216 71 833 200", cnam: true, lat: 36.7995, lng: 10.1824 },
    { id: "l2", type: "Laboratoire", name: "Laboratoire Ennasr Analyses", city: "Tunis", address: "Ennasr 1, Ariana", phone: "+216 71 857 700", cnam: true, lat: 36.8800, lng: 10.1945 },
    { id: "l3", type: "Laboratoire", name: "Laboratoire Biomed El Menzah", city: "Tunis", address: "El Menzah 9, Ariana", phone: "+216 71 706 400", cnam: true, lat: 36.8630, lng: 10.2001 },
    { id: "l4", type: "Laboratoire", name: "Laboratoire El Manar", city: "Tunis", address: "El Manar 2, Tunis", phone: "+216 71 886 800", cnam: true, lat: 36.8411, lng: 10.2010 },
    { id: "l5", type: "Laboratoire", name: "Synlab Tunis (Lac)", city: "Tunis", address: "Les Berges du Lac 2", phone: "+216 71 194 444", cnam: false, lat: 36.8489, lng: 10.2401 },
    { id: "l6", type: "Laboratoire", name: "Laboratoire d'Analyses Sfax", city: "Sfax", address: "Soukra, Sfax", phone: "+216 74 243 100", cnam: true, lat: 34.7500, lng: 10.7620 },
    { id: "l7", type: "Laboratoire", name: "BioLab Sousse", city: "Sousse", address: "Khézama, Sousse", phone: "+216 73 212 900", cnam: true, lat: 35.8320, lng: 10.5990 },
];

const TYPES = ["Tous", "Hôpital", "Clinique", "Pharmacie", "Laboratoire", "Médecin"] as const;
const CITIES = ["Toutes", "Tunis", "La Marsa", "Sousse", "Sfax", "Bizerte", "Nabeul"];

const TYPE_ICONS: Record<string, React.ReactNode> = {
    "Hôpital": <Building2 className="h-5 w-5" />,
    "Clinique": <Building className="h-5 w-5" />,
    "Pharmacie": <Pill className="h-5 w-5" />,
    "Laboratoire": <FlaskConical className="h-5 w-5" />,
    "Médecin": <Stethoscope className="h-5 w-5" />,
};

const TYPE_COLORS: Record<string, string> = {
    "Hôpital": "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
    "Clinique": "bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    "Pharmacie": "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    "Laboratoire": "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    "Médecin": "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
};

export default function DirectoryPage() {
    const [search, setSearch] = useState("");
    const [activeType, setActiveType] = useState<string>("Tous");
    const [activeCity, setActiveCity] = useState<string>("Toutes");
    const [selected, setSelected] = useState<Facility | null>(null);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [locating, setLocating] = useState(false);

    const handleLocate = () => {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                setLocating(false);
            },
            () => setLocating(false)
        );
    };

    const filtered = useMemo(() => {
        return ALL_FACILITIES.filter(f => {
            const matchType = activeType === "Tous" || f.type === activeType;
            const matchCity = activeCity === "Toutes" || f.city === activeCity;
            const matchSearch = search === "" ||
                f.name.toLowerCase().includes(search.toLowerCase()) ||
                f.city.toLowerCase().includes(search.toLowerCase()) ||
                f.address.toLowerCase().includes(search.toLowerCase());
            return matchType && matchCity && matchSearch;
        });
    }, [search, activeType, activeCity]);

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans dark:bg-slate-950">
            <Header />

            <main className="flex-1 flex flex-col lg:flex-row pt-[72px]">
                {/* ── MAP PANEL (left, sticky) ── */}
                <div className="relative w-full lg:w-[55%] h-[50vh] lg:h-[calc(100vh-72px)] lg:sticky lg:top-[72px]">
                    <HealthMap
                        facilities={filtered}
                        selected={selected}
                        onSelect={setSelected}
                        userLocation={userLocation}
                    />
                    {/* Locate Me button */}
                    <button
                        onClick={handleLocate}
                        disabled={locating}
                        className="absolute bottom-6 right-6 z-[1000] flex items-center gap-2 bg-white text-slate-900 px-5 py-3 rounded-2xl shadow-xl border border-slate-100 font-bold text-sm hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 disabled:opacity-60"
                    >
                        <Navigation className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
                        {locating ? "Localisation..." : "Me localiser"}
                    </button>
                    {/* Map Legend */}
                    <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/60 dark:bg-slate-900/90 dark:border-slate-800 flex flex-col gap-1.5">
                        {Object.entries(TYPE_COLORS).slice(0, 4).map(([type]) => (
                            <div key={type} className="flex items-center gap-2 text-xs font-bold">
                                <span className={`flex h-6 w-6 items-center justify-center rounded-full ${TYPE_COLORS[type]}`}>
                                    {TYPE_ICONS[type]}
                                </span>
                                <span className="text-slate-700 dark:text-slate-300">{type}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── LIST PANEL (right, scrollable) ── */}
                <div className="w-full lg:w-[45%] flex flex-col bg-slate-50 dark:bg-slate-900 overflow-y-auto h-auto lg:h-[calc(100vh-72px)]">
                    {/* Search & Filter Header */}
                    <div className="sticky top-0 z-10 bg-slate-50/95 dark:bg-slate-900/95 backdrop-blur-md p-6 border-b border-slate-200/50 dark:border-slate-800 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
                                Annuaire Santé <span className="text-primary">Tunisie</span>
                            </h1>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-full">
                                {filtered.length} résultats
                            </span>
                        </div>

                        {/* Search Bar */}
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Hôpital, Pharmacie, Ville..."
                                className="w-full h-12 pl-11 pr-10 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:border-primary/40 outline-none transition-all text-sm font-medium shadow-sm"
                            />
                            {search && (
                                <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                    <X className="h-4 w-4" />
                                </button>
                            )}
                        </div>

                        {/* Type Filter Pills */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {TYPES.map(type => (
                                <button
                                    key={type}
                                    onClick={() => setActiveType(type)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all border-2 ${
                                        activeType === type
                                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/20"
                                            : "bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-primary/30"
                                    }`}
                                >
                                    {type !== "Tous" && TYPE_ICONS[type]}
                                    {type}
                                </button>
                            ))}
                        </div>

                        {/* City Filter */}
                        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                            {CITIES.map(city => (
                                <button
                                    key={city}
                                    onClick={() => setActiveCity(city)}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap transition-all border ${
                                        activeCity === city
                                            ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900"
                                            : "bg-white dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-400"
                                    }`}
                                >
                                    {city !== "Toutes" && <MapPin className="h-3 w-3" />}
                                    {city}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Facilities List */}
                    <div className="flex-1 p-4 flex flex-col gap-3">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                <Search className="h-10 w-10 opacity-30" />
                                <p className="font-bold">Aucun établissement trouvé</p>
                            </div>
                        ) : (
                            filtered.map(fac => (
                                <button
                                    key={fac.id}
                                    onClick={() => setSelected(selected?.id === fac.id ? null : fac)}
                                    className={`group w-full text-left p-5 rounded-[1.5rem] border-2 transition-all duration-300 ${
                                        selected?.id === fac.id
                                            ? "border-primary bg-white shadow-[0_8px_30px_rgba(200,16,46,0.12)] dark:bg-slate-800 scale-[1.01]"
                                            : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-slate-300 hover:shadow-md"
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors ${
                                            selected?.id === fac.id ? "bg-primary text-white" : `${TYPE_COLORS[fac.type]}`
                                        }`}>
                                            {TYPE_ICONS[fac.type]}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3 className="font-black text-slate-900 dark:text-white text-base leading-tight">{fac.name}</h3>
                                                <div className="flex flex-col items-end gap-1 shrink-0">
                                                    {fac.guard && (
                                                        <span className="flex items-center gap-1 text-[10px] font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                                                            <Star className="h-2.5 w-2.5 fill-emerald-500" />
                                                            Garde
                                                        </span>
                                                    )}
                                                    {fac.cnam && (
                                                        <span className="text-[10px] font-black uppercase text-blue-600 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">CNAM</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium mb-3">
                                                <MapPin className="h-3 w-3 shrink-0" />
                                                <span className="truncate">{fac.address}, {fac.city}</span>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2">
                                                <a
                                                    href={`tel:${fac.phone}`}
                                                    onClick={e => e.stopPropagation()}
                                                    className="flex-1 flex items-center justify-center gap-1.5 h-9 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-xs font-black hover:bg-primary hover:dark:bg-primary hover:dark:text-white transition-colors"
                                                >
                                                    <Phone className="h-3.5 w-3.5" />
                                                    Appeler
                                                </a>
                                                <a
                                                    href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    onClick={e => e.stopPropagation()}
                                                    className="flex-1 flex items-center justify-center gap-1.5 h-9 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-xs font-black text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
                                                >
                                                    <Navigation className="h-3.5 w-3.5" />
                                                    Itinéraire
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
