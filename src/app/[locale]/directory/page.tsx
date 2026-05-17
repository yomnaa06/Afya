"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MapPin, Phone, Navigation, Search, X, Building2, Building, Pill, FlaskConical, Star } from "lucide-react";

interface Facility {
    id: string; name: string;
    type: "Hôpital" | "Clinique" | "Pharmacie" | "Laboratoire";
    city: string; address: string; phone: string;
    cnam: boolean; guard?: boolean; lat: number; lng: number;
}

const FACILITIES: Facility[] = [
    { id:"h1", type:"Hôpital", name:"Hôpital Charles Nicolle", city:"Tunis", address:"Bd 9 Avril, Bab Saadoun", phone:"+216 71 578 000", cnam:true, lat:36.8299, lng:10.1636 },
    { id:"h2", type:"Hôpital", name:"Hôpital La Rabta", city:"Tunis", address:"Jebel Lakdar, Bab Saadoun", phone:"+216 71 578 522", cnam:true, lat:36.8311, lng:10.1621 },
    { id:"h3", type:"Hôpital", name:"Hôpital Mongi Slim", city:"La Marsa", address:"La Marsa, Tunis Nord", phone:"+216 71 774 011", cnam:true, lat:36.8778, lng:10.3245 },
    { id:"h4", type:"Hôpital", name:"Hôpital Farhat Hached", city:"Sousse", address:"Ave Ibn el Jazzar, Sousse", phone:"+216 73 221 411", cnam:true, lat:35.8288, lng:10.6360 },
    { id:"h5", type:"Hôpital", name:"CHU Hédi Chaker", city:"Sfax", address:"Ave Majida Boulila, Sfax", phone:"+216 74 241 333", cnam:true, lat:34.7406, lng:10.7603 },
    { id:"h6", type:"Hôpital", name:"Hôpital Régional Bizerte", city:"Bizerte", address:"Ave Habib Bourguiba, Bizerte", phone:"+216 72 431 422", cnam:true, lat:37.2746, lng:9.8739 },
    { id:"h7", type:"Hôpital", name:"Hôpital d'Enfants de Tunis", city:"Tunis", address:"Bab Saadoun, Tunis", phone:"+216 71 563 001", cnam:true, lat:36.8309, lng:10.1659 },
    { id:"c1", type:"Clinique", name:"Clinique Avicenne", city:"Tunis", address:"El Manar, Tunis", phone:"+216 71 885 500", cnam:true, lat:36.8441, lng:10.2001 },
    { id:"c2", type:"Clinique", name:"Clinique du Parc", city:"Tunis", address:"Les Berges du Lac, Tunis", phone:"+216 71 965 200", cnam:true, lat:36.8456, lng:10.2312 },
    { id:"c3", type:"Clinique", name:"Clinique Hannibal", city:"La Marsa", address:"La Marsa, Tunis Nord", phone:"+216 71 743 555", cnam:false, lat:36.8812, lng:10.3289 },
    { id:"c4", type:"Clinique", name:"Clinique Taoufik", city:"Tunis", address:"El Menzah, Ariana", phone:"+216 71 703 700", cnam:true, lat:36.8601, lng:10.1913 },
    { id:"c5", type:"Clinique", name:"Clinique El Amen", city:"Sfax", address:"Centre Sfax", phone:"+216 74 402 555", cnam:true, lat:34.7449, lng:10.7666 },
    { id:"c6", type:"Clinique", name:"Clinique Ennasr", city:"Tunis", address:"Ennasr 2, Ariana", phone:"+216 71 826 200", cnam:true, lat:36.8789, lng:10.1937 },
    { id:"p1", type:"Pharmacie", name:"Pharmacie de Garde Centrale", city:"Tunis", address:"Ave de Paris, Centre-Ville", phone:"+216 71 340 250", cnam:false, guard:true, lat:36.8014, lng:10.1846 },
    { id:"p2", type:"Pharmacie", name:"Pharmacie El Menzah", city:"Tunis", address:"El Menzah 5, Ariana", phone:"+216 71 236 400", cnam:false, lat:36.8572, lng:10.1882 },
    { id:"p3", type:"Pharmacie", name:"Pharmacie du Lac", city:"Tunis", address:"Les Berges du Lac 1", phone:"+216 71 960 700", cnam:false, lat:36.8423, lng:10.2298 },
    { id:"p4", type:"Pharmacie", name:"Pharmacie Ennasr", city:"Tunis", address:"Ennasr, Ariana", phone:"+216 71 826 100", cnam:false, guard:true, lat:36.8810, lng:10.1950 },
    { id:"p5", type:"Pharmacie", name:"Pharmacie Centrale Sousse", city:"Sousse", address:"Ave Bourguiba, Sousse", phone:"+216 73 225 200", cnam:false, guard:true, lat:35.8272, lng:10.6337 },
    { id:"p6", type:"Pharmacie", name:"Pharmacie La Marsa", city:"La Marsa", address:"Ave Taieb Mehiri, La Marsa", phone:"+216 71 741 100", cnam:false, lat:36.8789, lng:10.3248 },
    { id:"l1", type:"Laboratoire", name:"Laboratoire Pasteur", city:"Tunis", address:"Rue de Hollande, Centre-Ville", phone:"+216 71 833 200", cnam:true, lat:36.7995, lng:10.1824 },
    { id:"l2", type:"Laboratoire", name:"Laboratoire Ennasr Analyses", city:"Tunis", address:"Ennasr 1, Ariana", phone:"+216 71 857 700", cnam:true, lat:36.8800, lng:10.1945 },
    { id:"l3", type:"Laboratoire", name:"Laboratoire Biomed El Menzah", city:"Tunis", address:"El Menzah 9, Ariana", phone:"+216 71 706 400", cnam:true, lat:36.8630, lng:10.2001 },
    { id:"l4", type:"Laboratoire", name:"Synlab Tunis (Lac)", city:"Tunis", address:"Les Berges du Lac 2", phone:"+216 71 194 444", cnam:false, lat:36.8489, lng:10.2401 },
    { id:"l5", type:"Laboratoire", name:"BioLab Sousse", city:"Sousse", address:"Khézama, Sousse", phone:"+216 73 212 900", cnam:true, lat:35.8320, lng:10.5990 },
];

const TYPES = ["Tous", "Hôpital", "Clinique", "Pharmacie", "Laboratoire"] as const;
const CITIES = ["Toutes", "Tunis", "La Marsa", "Sousse", "Sfax", "Bizerte"];

const TYPE_COLOR: Record<string, string> = {
    "Hôpital": "text-red-600 bg-red-50 border-red-200",
    "Clinique": "text-purple-600 bg-purple-50 border-purple-200",
    "Pharmacie": "text-emerald-600 bg-emerald-50 border-emerald-200",
    "Laboratoire": "text-amber-600 bg-amber-50 border-amber-200",
};

const TYPE_ICON: Record<string, React.ReactNode> = {
    "Hôpital": <Building2 className="h-5 w-5" />,
    "Clinique": <Building className="h-5 w-5" />,
    "Pharmacie": <Pill className="h-5 w-5" />,
    "Laboratoire": <FlaskConical className="h-5 w-5" />,
};

function getMapSrc(fac: Facility | null) {
    if (!fac) {
        // Default: Tunisia overview
        return "https://www.openstreetmap.org/export/embed.html?bbox=8.5%2C30.5%2C11.5%2C37.5&layer=mapnik";
    }
    const d = 0.012;
    const bbox = `${fac.lng - d}%2C${fac.lat - d}%2C${fac.lng + d}%2C${fac.lat + d}`;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${fac.lat}%2C${fac.lng}`;
}

export default function DirectoryPage() {
    const [search, setSearch] = useState("");
    const [activeType, setActiveType] = useState("Tous");
    const [activeCity, setActiveCity] = useState("Toutes");
    const [selected, setSelected] = useState<Facility | null>(null);
    const [locating, setLocating] = useState(false);
    const [userCity, setUserCity] = useState<string | null>(null);

    const handleLocate = () => {
        setLocating(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;
                // Find nearest facility
                let nearest: Facility | null = null;
                let minDist = Infinity;
                FACILITIES.forEach(f => {
                    const d = Math.hypot(f.lat - latitude, f.lng - longitude);
                    if (d < minDist) { minDist = d; nearest = f; }
                });
                if (nearest) setSelected(nearest);
                setLocating(false);
            },
            () => setLocating(false),
            { timeout: 8000 }
        );
    };

    const filtered = useMemo(() => FACILITIES.filter(f => {
        const matchType = activeType === "Tous" || f.type === activeType;
        const matchCity = activeCity === "Toutes" || f.city === activeCity;
        const matchSearch = !search ||
            f.name.toLowerCase().includes(search.toLowerCase()) ||
            f.city.toLowerCase().includes(search.toLowerCase()) ||
            f.address.toLowerCase().includes(search.toLowerCase());
        return matchType && matchCity && matchSearch;
    }), [search, activeType, activeCity]);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans">
            <Header />

            <main className="flex-1 flex flex-col lg:flex-row" style={{ paddingTop: "72px" }}>

                {/* ── LEFT: MAP ── */}
                <div className="relative w-full lg:w-[58%] bg-slate-200 dark:bg-slate-900" style={{ height: "calc(100vh - 72px)", position: "sticky", top: "72px" }}>

                    {/* Map iframe */}
                    <iframe
                        key={selected?.id ?? "default"}
                        src={getMapSrc(selected)}
                        title="Carte Santé Tunisie"
                        style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                        loading="lazy"
                    />

                    {/* Overlay: Top bar */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-3 pointer-events-none z-10">
                        <div className="flex items-center gap-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-white/60 pointer-events-auto">
                            <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                            </span>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200">
                                {selected ? selected.name : "Tunisie — Vue d'ensemble"}
                            </span>
                        </div>

                        <button
                            onClick={handleLocate}
                            disabled={locating}
                            className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-2xl shadow-lg font-bold text-xs uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-60 pointer-events-auto"
                        >
                            <Navigation className={`h-4 w-4 ${locating ? "animate-spin" : ""}`} />
                            {locating ? "Localisation..." : "Me localiser"}
                        </button>
                    </div>

                    {/* Legend */}
                    <div className="absolute bottom-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl p-3 shadow-lg border border-white/60 flex flex-col gap-1.5 z-10">
                        {TYPES.slice(1).map(t => (
                            <div key={t} className="flex items-center gap-2">
                                <span className={`flex h-6 w-6 items-center justify-center rounded-lg border ${TYPE_COLOR[t]}`}>
                                    {TYPE_ICON[t]}
                                </span>
                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{t}</span>
                            </div>
                        ))}
                    </div>

                    {/* Link to open full map */}
                    {selected && (
                        <a
                            href={`https://www.openstreetmap.org/?mlat=${selected.lat}&mlon=${selected.lng}#map=17/${selected.lat}/${selected.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-4 right-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl px-4 py-2 shadow-lg border border-white/60 text-xs font-bold text-slate-600 hover:text-primary transition-colors z-10"
                        >
                            Ouvrir dans OpenStreetMap ↗
                        </a>
                    )}
                </div>

                {/* ── RIGHT: LIST ── */}
                <div className="w-full lg:w-[42%] flex flex-col bg-white dark:bg-slate-950 overflow-y-auto" style={{ height: "calc(100vh - 72px)" }}>

                    {/* Sticky search header */}
                    <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-950/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 p-5 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-black tracking-tighter text-slate-900 dark:text-white">
                                    Annuaire <span className="text-primary">Santé</span>
                                </h1>
                                <p className="text-xs text-slate-400 font-medium">{filtered.length} établissements</p>
                            </div>
                            {selected && (
                                <button onClick={() => setSelected(null)} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-primary transition-colors">
                                    <X className="h-3.5 w-3.5" /> Réinitialiser
                                </button>
                            )}
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Rechercher un établissement..."
                                className="w-full h-11 pl-10 pr-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium outline-none focus:border-primary/50 transition-all"
                            />
                        </div>

                        {/* Type filter */}
                        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
                            {TYPES.map(t => (
                                <button
                                    key={t}
                                    onClick={() => setActiveType(t)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap border transition-all ${
                                        activeType === t
                                            ? "bg-primary text-white border-primary shadow-md shadow-primary/20"
                                            : "bg-slate-50 dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700 hover:border-primary/30"
                                    }`}
                                >
                                    {t !== "Tous" && <span className="text-[10px]">{TYPE_ICON[t]}</span>}
                                    {t}
                                </button>
                            ))}
                        </div>

                        {/* City filter */}
                        <div className="flex gap-1.5 overflow-x-auto scrollbar-none">
                            {CITIES.map(c => (
                                <button
                                    key={c}
                                    onClick={() => setActiveCity(c)}
                                    className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold whitespace-nowrap border transition-all ${
                                        activeCity === c
                                            ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white"
                                            : "bg-white dark:bg-slate-900 text-slate-500 border-slate-200 dark:border-slate-700"
                                    }`}
                                >
                                    {c !== "Toutes" && <MapPin className="h-2.5 w-2.5" />}{c}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Facilities */}
                    <div className="flex-1 p-4 flex flex-col gap-2.5">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3">
                                <Search className="h-10 w-10 opacity-30" />
                                <p className="font-bold text-sm">Aucun établissement trouvé</p>
                            </div>
                        ) : filtered.map(fac => (
                            <button
                                key={fac.id}
                                onClick={() => setSelected(selected?.id === fac.id ? null : fac)}
                                className={`group w-full text-left p-4 rounded-2xl border-2 transition-all duration-300 ${
                                    selected?.id === fac.id
                                        ? "border-primary bg-primary/[0.03] shadow-lg shadow-primary/10 scale-[1.01]"
                                        : "border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-200 hover:shadow-md"
                                }`}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition-all ${
                                        selected?.id === fac.id ? "bg-primary text-white border-primary" : TYPE_COLOR[fac.type]
                                    }`}>
                                        {TYPE_ICON[fac.type]}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-2 mb-0.5">
                                            <h3 className="font-black text-slate-900 dark:text-white text-sm leading-tight">{fac.name}</h3>
                                            <div className="flex flex-col items-end gap-0.5 shrink-0">
                                                {fac.guard && (
                                                    <span className="flex items-center gap-0.5 text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                                        <Star className="h-2 w-2 fill-emerald-500" />Garde
                                                    </span>
                                                )}
                                                {fac.cnam && (
                                                    <span className="text-[9px] font-black uppercase text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full">CNAM</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium mb-2.5">
                                            <MapPin className="h-3 w-3 shrink-0" />
                                            <span className="truncate">{fac.address}, {fac.city}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <a
                                                href={`tel:${fac.phone}`}
                                                onClick={e => e.stopPropagation()}
                                                className="flex-1 flex items-center justify-center gap-1.5 h-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-lg text-[11px] font-black hover:bg-primary transition-colors"
                                            >
                                                <Phone className="h-3 w-3" />Appeler
                                            </a>
                                            <a
                                                href={`https://www.google.com/maps/dir/?api=1&destination=${fac.lat},${fac.lng}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={e => e.stopPropagation()}
                                                className="flex-1 flex items-center justify-center gap-1.5 h-8 border-2 border-slate-200 dark:border-slate-700 rounded-lg text-[11px] font-black text-slate-600 dark:text-slate-300 hover:border-primary hover:text-primary transition-colors"
                                            >
                                                <Navigation className="h-3 w-3" />Itinéraire
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
