"use client";

import { useEffect, useRef, useState } from "react";

export interface Facility {
    id: string;
    name: string;
    type: "Hôpital" | "Clinique" | "Pharmacie" | "Laboratoire" | "Médecin";
    city: string;
    address: string;
    phone: string;
    cnam: boolean;
    guard?: boolean;
    lat: number;
    lng: number;
}

interface HealthMapProps {
    facilities: Facility[];
    selected: Facility | null;
    onSelect: (f: Facility) => void;
    userLocation: { lat: number; lng: number } | null;
}

const TYPE_EMOJI: Record<string, string> = {
    "Hôpital": "🏥",
    "Clinique": "🏨",
    "Pharmacie": "💊",
    "Laboratoire": "🔬",
    "Médecin": "👨‍⚕️",
};

const TYPE_COLOR: Record<string, string> = {
    "Hôpital": "#C8102E",
    "Clinique": "#8B5CF6",
    "Pharmacie": "#10B981",
    "Laboratoire": "#F59E0B",
    "Médecin": "#3B82F6",
};

export function HealthMap({ facilities, selected, onSelect, userLocation }: HealthMapProps) {
    const mapRef = useRef<HTMLDivElement>(null);
    const leafletRef = useRef<any>(null);
    const markersRef = useRef<Map<string, any>>(new Map());
    const [ready, setReady] = useState(false);

    // Dynamically load Leaflet CSS + JS
    useEffect(() => {
        if (document.getElementById("leaflet-css")) { setReady(true); return; }
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);

        const script = document.createElement("script");
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        script.onload = () => setReady(true);
        document.head.appendChild(script);
    }, []);

    // Initialize map after Leaflet loads
    useEffect(() => {
        if (!ready || !mapRef.current || leafletRef.current) return;
        const L = (window as any).L;
        if (!L) return;

        const map = L.map(mapRef.current, {
            center: [36.8065, 10.1815],
            zoom: 11,
            zoomControl: false,
        });
        L.control.zoom({ position: "bottomright" }).addTo(map);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap contributors",
            maxZoom: 19,
        }).addTo(map);
        leafletRef.current = map;
    }, [ready]);

    // Add/refresh markers when facilities change
    useEffect(() => {
        if (!ready || !leafletRef.current) return;
        const L = (window as any).L;
        if (!L) return;

        // Clear old markers
        markersRef.current.forEach(m => m.remove());
        markersRef.current.clear();

        facilities.forEach(fac => {
            const color = TYPE_COLOR[fac.type] || "#C8102E";
            const emoji = TYPE_EMOJI[fac.type] || "📍";
            const icon = L.divIcon({
                html: `<div style="
                    width:38px;height:38px;background:${color};
                    border:3px solid white;border-radius:50% 50% 50% 0;
                    transform:rotate(-45deg);box-shadow:0 4px 14px rgba(0,0,0,0.25);
                    display:flex;align-items:center;justify-content:center;">
                    <span style="transform:rotate(45deg);font-size:15px;line-height:1">${emoji}</span>
                </div>`,
                className: "",
                iconSize: [38, 38],
                iconAnchor: [19, 38],
                popupAnchor: [0, -40],
            });

            const marker = L.marker([fac.lat, fac.lng], { icon })
                .addTo(leafletRef.current)
                .bindPopup(`
                    <div style="font-family:system-ui,sans-serif;min-width:200px;padding:4px 2px">
                        <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;color:${color};margin-bottom:4px">${fac.type}</div>
                        <div style="font-size:15px;font-weight:800;color:#0f172a;margin-bottom:4px;line-height:1.3">${fac.name}</div>
                        <div style="font-size:12px;color:#64748b;margin-bottom:10px">📍 ${fac.address}</div>
                        ${fac.cnam ? `<div style="font-size:10px;font-weight:800;color:#2563eb;background:#eff6ff;padding:3px 8px;border-radius:20px;display:inline-block;margin-bottom:8px">✓ CNAM</div>` : ""}
                        <a href="tel:${fac.phone}" style="display:flex;align-items:center;justify-content:center;gap:6px;background:${color};color:white;padding:10px;border-radius:10px;font-weight:800;font-size:13px;text-decoration:none">
                            📞 ${fac.phone}
                        </a>
                    </div>
                `, { maxWidth: 240 });

            marker.on("click", () => onSelect(fac));
            markersRef.current.set(fac.id, marker);
        });

        // User location marker
        if (userLocation) {
            const userIcon = L.divIcon({
                html: `<div style="width:18px;height:18px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(59,130,246,0.25);"></div>`,
                className: "",
                iconSize: [18, 18],
                iconAnchor: [9, 9],
            });
            L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                .addTo(leafletRef.current)
                .bindPopup("<b style='font-family:system-ui'>📍 Votre position</b>");
        }
    }, [ready, facilities, userLocation, onSelect]);

    // Pan to selected facility
    useEffect(() => {
        if (!leafletRef.current || !selected) return;
        leafletRef.current.setView([selected.lat, selected.lng], 15, { animate: true });
        const marker = markersRef.current.get(selected.id);
        if (marker) marker.openPopup();
    }, [selected]);

    return <div ref={mapRef} className="w-full h-full" />;
}
