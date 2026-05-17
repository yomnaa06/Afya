"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";

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
    const tileLayerRef = useRef<any>(null);
    const markersRef = useRef<Map<string, any>>(new Map());
    const { resolvedTheme } = useTheme();

    // Map base style selection
    const getTileUrl = (theme: string | undefined) => {
        return theme === "dark"
            ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    };

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

            // Use CartoDB premium styled tile layers
            const initialUrl = getTileUrl(resolvedTheme);
            const tileLayer = L.tileLayer(initialUrl, {
                attribution: '© CartoDB • © OpenStreetMap',
                maxZoom: 19,
            }).addTo(map);

            tileLayerRef.current = tileLayer;
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

    // Switch map tile layer theme dynamically when resolvedTheme changes
    useEffect(() => {
        if (tileLayerRef.current) {
            tileLayerRef.current.setUrl(getTileUrl(resolvedTheme));
        }
    }, [resolvedTheme]);

    // Refresh markers when facilities or selection changes
    useEffect(() => {
        if (!mapRef.current || !leafletLoaded) return;
        const L = (window as any).L;

        markersRef.current.forEach(m => m.remove());
        markersRef.current.clear();

        facilities.forEach(fac => {
            const isSelected = selected?.id === fac.id;
            const color = TYPE_COLOR[fac.type] || "#C8102E";
            const emoji = TYPE_EMOJI[fac.type] || "📍";

            // Beautiful glowing and scaling design for selected markers
            const icon = L.divIcon({
                html: `<div class="health-marker-wrapper" style="
                    width: ${isSelected ? '44px' : '36px'};
                    height: ${isSelected ? '44px' : '36px'};
                    background: ${color};
                    border: 3px solid #ffffff;
                    border-radius: 50%;
                    box-shadow: ${isSelected 
                        ? `0 0 0 6px ${color}35, 0 12px 24px rgba(0,0,0,0.3)` 
                        : `0 4px 12px rgba(0,0,0,0.15)`
                    };
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                ">
                    <span style="font-size: ${isSelected ? '18px' : '15px'}">${emoji}</span>
                </div>`,
                className: "",
                iconSize: isSelected ? [44, 44] : [36, 36],
                iconAnchor: isSelected ? [22, 22] : [18, 18],
                popupAnchor: [0, -25],
            });

            const marker = L.marker([fac.lat, fac.lng], { icon })
                .addTo(mapRef.current)
                .bindPopup(`
                    <div style="font-family:system-ui,sans-serif;min-width:200px;padding:6px">
                        <div style="font-size:10px;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;color:${color};margin-bottom:6px">${fac.type}</div>
                        <div style="font-size:16px;font-weight:800;color:${resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a'};margin-bottom:6px;line-height:1.35">${fac.name}</div>
                        <div style="font-size:12px;color:${resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'};margin-bottom:12px">📍 ${fac.address}</div>
                        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">
                            ${fac.cnam ? `<div style="font-size:10px;font-weight:800;color:#2563eb;background:#eff6ff;padding:3px 9px;border-radius:20px;display:inline-block">✓ CNAM</div>` : ""}
                            ${fac.guard ? `<div style="font-size:10px;font-weight:800;color:#10b981;background:#ecfdf5;padding:3px 9px;border-radius:20px;display:inline-block">🌟 Garde</div>` : ""}
                        </div>
                        <a href="tel:${fac.phone}" style="display:flex;align-items:center;justify-content:center;gap:6px;background:${color};color:white;padding:11px;border-radius:12px;font-weight:800;font-size:13px;text-decoration:none;box-shadow:0 4px 12px ${color}30;transition:opacity 0.2s">
                            📞 Appeler : ${fac.phone}
                        </a>
                    </div>
                `, { 
                    maxWidth: 260,
                    className: resolvedTheme === "dark" ? "dark-theme-popup" : "light-theme-popup"
                });

            marker.on("click", () => onSelect(fac));
            markersRef.current.set(fac.id, marker);
        });

        // Plot user location if available
        if (userLocation) {
            const L2 = (window as any).L;
            const userIcon = L2.divIcon({
                html: `<div style="
                    width: 20px;
                    height: 20px;
                    background: #3B82F6;
                    border: 3.5px solid white;
                    border-radius: 50%;
                    box-shadow: 0 0 0 8px rgba(59,130,246,0.3), 0 0 20px rgba(59,130,246,0.5);
                    position: relative;
                ">
                    <span style="
                        position: absolute;
                        inset: -6px;
                        border-radius: 50%;
                        border: 1.5px solid #3B82F6;
                        animation: pulse-radar 2s infinite ease-out;
                    "></span>
                </div>`,
                className: "",
                iconSize: [20, 20],
                iconAnchor: [10, 10],
            });
            L2.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                .addTo(mapRef.current)
                .bindPopup("<b>📍 Votre position</b>");
        }
    }, [facilities, userLocation, onSelect, selected, resolvedTheme]);

    // Pan to selected facility
    useEffect(() => {
        if (!mapRef.current || !selected) return;
        mapRef.current.setView([selected.lat, selected.lng], 15, { animate: true });
        const marker = markersRef.current.get(selected.id);
        if (marker) {
            // Delay slightly to allow transition animations to settle
            setTimeout(() => {
                marker.openPopup();
            }, 100);
        }
    }, [selected]);

    return (
        <div className="relative w-full h-full">
            {/* Custom Global overrides for Leaflet premium popups & zoom controls */}
            <style>{`
                .leaflet-popup-content-wrapper {
                    background: ${resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'} !important;
                    color: ${resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a'} !important;
                    border-radius: 20px !important;
                    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1) !important;
                    border: 1px solid ${resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'} !important;
                    padding: 2px !important;
                }
                .leaflet-popup-tip {
                    background: ${resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'} !important;
                    border: 1px solid ${resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'} !important;
                }
                .leaflet-popup-close-button {
                    color: ${resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'} !important;
                    padding: 8px !important;
                }
                .leaflet-bar {
                    border: none !important;
                    box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
                }
                .leaflet-bar a {
                    background: ${resolvedTheme === 'dark' ? '#1e293b' : '#ffffff'} !important;
                    color: ${resolvedTheme === 'dark' ? '#ffffff' : '#0f172a'} !important;
                    border-bottom: 1px solid ${resolvedTheme === 'dark' ? '#334155' : '#f1f5f9'} !important;
                    transition: all 0.2s ease !important;
                }
                .leaflet-bar a:hover {
                    background: #C8102E !important;
                    color: white !important;
                }
                @keyframes pulse-radar {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(2.5); opacity: 0; }
                }
            `}</style>

            <div
                ref={containerRef}
                style={{ width: "100%", height: "100%", minHeight: "400px" }}
            />
        </div>
    );
}
