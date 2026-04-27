"use client";

import { Link } from "@/navigation";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function LanguageSwitcher() {
    const locale = useLocale();

    return (
        <div className="flex items-center gap-1 rounded-full bg-slate-100 p-1 mr-2">
            <Link href="/" locale="fr" replace>
                <button
                    className={cn(
                        "px-4 py-1.5 text-[10px] font-black rounded-full transition-all",
                        locale === "fr" 
                            ? "bg-white text-gray-900 shadow-sm" 
                            : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    FR
                </button>
            </Link>
            <Link href="/" locale="ar" replace>
                <button
                    className={cn(
                        "px-4 py-1.5 text-[10px] font-black rounded-full transition-all",
                        locale === "ar" 
                            ? "bg-white text-gray-900 shadow-sm" 
                            : "text-gray-400 hover:text-gray-600"
                    )}
                >
                    AR
                </button>
            </Link>
        </div>
    );
}
