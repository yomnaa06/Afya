"use client";

import { useEffect, useRef } from "react";
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

// Gorgeous, cute, simple vector SVGs representing each facility type perfectly
const TYPE_SVG: Record<string, string> = {
    "Hôpital": `<svg style="width:20px;height:20px;color:white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M12 8v8M8 12h8"/></svg>`,
    "Clinique": `<svg style="width:20px;height:20px;color:white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M12 9v6M9 12h6"/></svg>`,
    "Pharmacie": `<svg style="width:20px;height:20px;color:white;transform:rotate(45deg)" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="10" width="18" height="4" rx="2"/><line x1="12" y1="10" x2="12" y2="14"/></svg>`,
    "Laboratoire": `<svg style="width:20px;height:20px;color:white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.31L4.75 19.3a1 1 0 0 0 .81 1.7h12.88a1 1 0 0 0 .81-1.7L14 9.31V2ZM8.5 2h7M7 14h10"/></svg>`,
    "Médecin": `<svg style="width:20px;height:20px;color:white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>`,
};

// Elegant category color tags
const TYPE_COLOR: Record<string, string> = {
    "Hôpital": "#EF4444", // Vibrant Red
    "Clinique": "#8B5CF6", // Royal Purple
    "Pharmacie": "#10B981", // Emerald Green
    "Laboratoire": "#F59E0B", // Amber Gold
    "Médecin": "#3B82F6", // Deep Blue
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
    const { resolvedTheme } = useTheme();

    // Initialize map once
    useEffect(() => {
        loadLeaflet(() => {
            if (mapRef.current || !containerRef.current) return;
            const L = (window as any).L;

            const map = L.map(containerRef.current, {
                center: [36.8065, 10.1815],
                zoom: 11,
                zoomControl: false,
                preferCanvas: true, // Optimizes the entire map rendering to render buttery smooth on canvas
                wheelDebounceTime: 40,
                wheelPxPerZoomLevel: 150,
                zoomAnimation: true,
                fadeAnimation: true,
            });

            // Put zoom control in bottom-right
            L.control.zoom({ position: "bottomright" }).addTo(map);

            // Use the colorful standard OpenStreetMap tiles
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© OpenStreetMap contributors',
                maxZoom: 19,
            }).addTo(map);

            mapRef.current = map;

            // Force resize
            requestAnimationFrame(() => map.invalidateSize());
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Refresh markers
    useEffect(() => {
        if (!mapRef.current || !leafletLoaded) return;
        const L = (window as any).L;

        markersRef.current.forEach(m => m.remove());
        markersRef.current.clear();

        facilities.forEach(fac => {
            const isSelected = selected?.id === fac.id;
            const color = TYPE_COLOR[fac.type] || "#EF4444";
            const svgIcon = TYPE_SVG[fac.type] || "";

            // Beautiful simple circular pin with elegant high contrast custom white SVGs inside
            const icon = L.divIcon({
                html: `<div class="health-marker-wrapper" style="
                    width: ${isSelected ? '46px' : '38px'};
                    height: ${isSelected ? '46px' : '38px'};
                    background: ${color};
                    border: 3.5px solid #ffffff;
                    border-radius: 50%;
                    box-shadow: ${isSelected 
                        ? `0 0 0 8px ${color}35, 0 8px 24px rgba(0,0,0,0.3)` 
                        : `0 4px 14px rgba(0,0,0,0.2)`
                    };
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                ">
                    ${svgIcon}
                </div>`,
                className: "",
                iconSize: isSelected ? [46, 46] : [38, 38],
                iconAnchor: isSelected ? [23, 23] : [19, 19],
                popupAnchor: [0, -28],
            });

            const marker = L.marker([fac.lat, fac.lng], { icon })
                .addTo(mapRef.current)
                .bindPopup(`
                    <div style="font-family:system-ui,-apple-system,sans-serif;min-width:230px;padding:6px">
                        
                        <!-- Header -->
                        <div style="display:flex;align-items:center;justify-content:between;gap:8px;margin-bottom:6px;">
                            <span style="font-size:9.5px;font-weight:900;text-transform:uppercase;letter-spacing:0.15em;color:${color}">${fac.type}</span>
                            ${fac.guard ? `<span style="font-size:8px;font-weight:900;color:#10b981;background:#ecfdf5;border:1px solid #a7f3d0;padding:2px 7px;border-radius:20px;text-transform:uppercase;letter-spacing:0.05em;">Garde</span>` : ""}
                        </div>
                        
                        <div style="font-size:16px;font-weight:800;color:${resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a'};line-height:1.3;margin-bottom:10px;">${fac.name}</div>
                        
                        <!-- Address -->
                        <div style="display:flex;align-items:flex-start;gap:6px;font-size:12px;color:${resolvedTheme === 'dark' ? '#cbd5e1' : '#64748b'};margin-bottom:12px;line-height:1.4;">
                            <svg style="width:14px;height:14px;color:${color};margin-top:2px;flex-shrink:0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                            <span>${fac.address}</span>
                        </div>

                        <!-- Cnam -->
                        ${fac.cnam ? `
                        <div style="display:inline-flex;align-items:center;gap:4px;font-size:10px;font-weight:750;color:#2563eb;background:#eff6ff;border:1px solid #bfdbfe;padding:2px 8px;border-radius:12px;margin-bottom:14px;">
                            <svg style="width:10px;height:10px;stroke-width:3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                            CNAM Conventionné
                        </div>
                        ` : ""}

                        <!-- Elegant Call Button -->
                        <a href="tel:${fac.phone}" style="display:flex;align-items:center;justify-content:center;gap:8px;background:${color};color:white;padding:12px 14px;border-radius:14px;font-weight:800;font-size:13px;text-decoration:none;box-shadow:0 8px 20px ${color}25;transition:all 0.2s ease-in-out;">
                            <svg style="width:14px;height:14px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                            <span>Appeler : ${fac.phone}</span>
                        </a>
                    </div>
                `, { 
                    maxWidth: 280,
                });

            marker.on("click", () => onSelect(fac));
            markersRef.current.set(fac.id, marker);
        });

        // Plot user location
        if (userLocation) {
            const L2 = (window as any).L;
            const userIcon = L2.divIcon({
                html: `<div style="
                    width: 22px;
                    height: 22px;
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
                        animation: pulse-radar 2.2s infinite ease-out;
                    "></span>
                </div>`,
                className: "",
                iconSize: [22, 22],
                iconAnchor: [11, 11],
            });
            L2.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
                .addTo(mapRef.current)
                .bindPopup("<b>📍 Votre position</b>");
        }
    }, [facilities, userLocation, onSelect, selected, resolvedTheme]);

    // Butter-smooth gliding panning animation
    useEffect(() => {
        if (!mapRef.current || !selected) return;
        
        mapRef.current.setView([selected.lat, selected.lng], 14, {
            animate: true,
            pan: {
                duration: 0.8,
                easeLinearity: 0.25
            }
        });

        const marker = markersRef.current.get(selected.id);
        if (marker) {
            setTimeout(() => {
                marker.openPopup();
            }, 120);
        }
    }, [selected]);

    // Pan map to user's exact location when they click "Me localiser"
    useEffect(() => {
        if (!mapRef.current || !userLocation) return;
        
        mapRef.current.setView([userLocation.lat, userLocation.lng], 15, {
            animate: true,
            pan: {
                duration: 1.2,
                easeLinearity: 0.25
            }
        });
    }, [userLocation]);

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
                    padding: 0px !important;
                }
                .leaflet-popup-tip {
                    background: ${resolvedTheme === 'dark' ? '#0f172a' : '#ffffff'} !important;
                    border: 1px solid ${resolvedTheme === 'dark' ? '#334155' : '#e2e8f0'} !important;
                }
                .leaflet-popup-close-button {
                    color: ${resolvedTheme === 'dark' ? '#94a3b8' : '#64748b'} !important;
                    padding: 8px !important;
                    top: 6px !important;
                    right: 6px !important;
                    font-size: 16px !important;
                }
                .leaflet-bar {
                    border: none !important;
                    box-shadow: none !important;
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 6px !important;
                }
                .leaflet-bar a {
                    background: ${resolvedTheme === 'dark' ? 'rgba(30, 41, 59, 0.85)' : 'rgba(255, 255, 255, 0.85)'} !important;
                    backdrop-filter: blur(12px) !important;
                    color: ${resolvedTheme === 'dark' ? '#f8fafc' : '#0f172a'} !important;
                    border: 1px solid ${resolvedTheme === 'dark' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(226, 232, 240, 0.8)'} !important;
                    border-radius: 12px !important;
                    width: 38px !important;
                    height: 38px !important;
                    line-height: 36px !important;
                    box-shadow: 0 8px 16px rgba(0,0,0,0.06) !important;
                    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
                }
                .leaflet-bar a:hover {
                    background: #C8102E !important;
                    color: white !important;
                    border-color: #C8102E !important;
                    transform: scale(1.05);
                }
                @keyframes pulse-radar {
                    0% { transform: scale(1); opacity: 1; }
                    100% { transform: scale(2.4); opacity: 0; }
                }
            `}</style>

            <div
                ref={containerRef}
                style={{ width: "100%", height: "100%", minHeight: "400px" }}
            />
        </div>
    );
}
