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

let leafletLoaded = false;
let leafletLoading = false;
const leafletCallbacks: Array<() => void> = [];

function loadLeaflet(cb: () => void) {
    if (leafletLoaded) { cb(); return; }
    leafletCallbacks.push(cb);
    if (leafletLoading) return;
    leafletLoading = true;

    const css = document.createElement("link");
    css.rel = "stylesheet";
    css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => {
        leafletLoaded = true;
        leafletCallbacks.forEach(fn => fn());
        leafletCallbacks.length = 0;
    };
    document.head.appendChild(script);
}

export function HealthMap({ facilities, selected, onSelect, userLocation }: HealthMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any>(null);
    const markersRef = useRef<Map<string, any>>(new Map());

    // Initialize map once
    useEffect(() => {
        loadLeaflet(() => {
            if (mapRef.current || !containerRef.current) return;
            const L = (window as any).L;

            const map = L.map(containerRef.current, {
                center: [36.8065, 10.1815],
                zoom: 11,
                zoomControl: false,
            });

            L.control.zoom({ position: "bottomright" }).addTo(map);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: "© OpenStreetMap",
                maxZoom: 19,
            }).addTo(map);

            mapRef.current = map;

            // Force resize after paint
            requestAnimationFrame(() => map.invalidateSize());
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Refresh markers when facilities change
    useEffect(() => {
        if (!mapRef.current || !leafletLoaded) return;
        const L = (window as any).L;

        markersRef.current.forEach(m => m.remove());
        markersRef.current.clear();

        facilities.forEach(fac => {
            const color = TYPE_COLOR[fac.type] || "#C8102E";
            const emoji = TYPE_EMOJI[fac.type] || "📍";
            const icon = L.divIcon({
                html: `<div style="
                    width:36px;height:36px;background:${color};
                    border:3px solid white;border-radius:50% 50% 50% 0;
                    transform:rotate(-45deg);box-shadow:0 4px 14px rgba(0,0,0,0.25);
                    display:flex;align-items:center;justify-content:center;">
                    <span style="transform:rotate(45deg);font-size:14px">${emoji}</span>
                </div>`,
                className: "",
                iconSize: [36, 36],
                iconAnchor: [18, 36],
                popupAnchor: [0, -40],
            });

            const marker = L.marker([fac.lat, fac.lng], { icon })
                .addTo(mapRef.current)
                .bindPopup(`
                    <div style="font-family:system-ui,sans-serif;min-width:200px;padding:4px">
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

        if (userLocation) {
            const L2 = (window as any).L;
            const userIcon = L2.divIcon({
                html: `<div style="width:16px;height:16px;background:#3B82F6;border:3px solid white;border-radius:50%;box-shadow:0 0 0 6px rgba(59,130,246,0.25);"></div>`,
                className: "",
                iconSize: [16, 16],
                iconAnchor: [8, 8],
            });
            L2.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                .addTo(mapRef.current)
                .bindPopup("<b>📍 Votre position</b>");
        }
    }, [facilities, userLocation, onSelect]);

    // Pan to selected
    useEffect(() => {
        if (!mapRef.current || !selected) return;
        mapRef.current.setView([selected.lat, selected.lng], 15, { animate: true });
        const marker = markersRef.current.get(selected.id);
        if (marker) marker.openPopup();
    }, [selected]);

    return (
        <div
            ref={containerRef}
            style={{ width: "100%", height: "100%", minHeight: "400px" }}
        />
    );
}
