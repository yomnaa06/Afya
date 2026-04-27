"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { Heart, Facebook, Twitter, Instagram, Linkedin, Phone, MapPin, Mail } from "lucide-react";

export function Footer() {
    const t = useTranslations();

    return (
        <footer className="bg-gray-950 text-gray-400 py-20">
            <div className="max-w-7xl mx-auto px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-4">
                    {/* Brand */}
                    <div>
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-9 h-9 bg-primary rounded-2xl flex items-center justify-center">
                                <Heart className="w-5 h-5 text-white" fill="white" />
                            </div>
                            <span className="text-3xl font-semibold text-white tracking-tighter">AFYA <span className="text-[#d4af37]">+</span></span>
                        </div>
                        <p className="text-sm leading-relaxed max-w-[200px]">
                            {t("footer.about")}
                        </p>
                    </div>

                    {/* Platform */}
                    <div className="space-y-4">
                        <h4 className="text-[#d4af37] font-bold text-xs uppercase tracking-[0.2em] mb-2">{t("footer.links")}</h4>
                        <ul className="flex flex-col gap-3 text-sm">
                            {["symptoms", "encyclopedia", "medicines", "directory", "tools"].map((link) => (
                                <li key={link}>
                                    <Link href={`/${link}`} className="hover:text-white transition-colors">
                                        {t(`nav.${link}`)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support */}
                    <div className="space-y-4">
                        <h4 className="text-[#d4af37] font-bold text-xs uppercase tracking-[0.2em] mb-2">{t("footer.legal")}</h4>
                        <ul className="flex flex-col gap-3 text-sm">
                            {["Terms", "Privacy", "Disclaimer", "Contact"].map((link) => (
                                <li key={link}>
                                    <Link href={`/${link.toLowerCase()}`} className="hover:text-white transition-colors">
                                        {link}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Emergencies */}
                    <div className="space-y-4">
                        <h4 className="text-[#d4af37] font-bold text-xs uppercase tracking-[0.2em] mb-2">{t("footer.emergencies")}</h4>
                        <div className="flex flex-col gap-4">
                            {[
                                { label: t("footer.samu"), phone: "190" },
                                { label: t("footer.poison"), phone: "71 245 000" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex flex-col">
                                    <span className="text-white font-bold">{item.phone}</span>
                                    <span className="text-[10px] uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="mt-20 border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-medium uppercase tracking-[0.3em]">
                        © 2026 AFYA TUNISIA. {t("footer.rights")}
                    </p>
                    <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest">
                        <span>Facebook</span>
                        <span>LinkedIn</span>
                        <span>Twitter</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
