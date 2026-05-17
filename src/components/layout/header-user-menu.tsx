"use client";

import { useTransition } from "react";
import { LogOut, User, Loader2 } from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";
import { useLocale } from "next-intl";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

interface HeaderUserMenuProps {
  name: string;
  avatarInitials: string;
  role: string;
}

export function HeaderUserMenu({ name, avatarInitials, role }: HeaderUserMenuProps) {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction(locale);
    });
  };

  const roleLabel =
    locale === "ar"
      ? role === "admin"
        ? "مشرف"
        : role === "doctor"
          ? "طبيب"
          : "مستخدم"
      : role === "admin"
        ? "Administrateur"
        : role === "doctor"
          ? "Médecin"
          : "Utilisateur";

  return (
    <div className="flex items-center gap-3">
      {/* Avatar + name */}
      <Link
        href="/profile"
        className={cn(
          "flex items-center gap-2.5 rounded-full bg-primary/8 border border-primary/20 px-3 py-1.5 hover:bg-primary/15 transition-colors group",
        )}
      >
        {/* Initials avatar */}
        <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0">
          <span className="text-white text-[11px] font-bold">{avatarInitials}</span>
        </div>
        <div className="hidden xl:flex flex-col leading-none">
          <span className="text-xs font-semibold text-foreground">{name.split(" ")[0]}</span>
          <span className="text-[10px] text-muted-foreground">{roleLabel}</span>
        </div>
        <User className="xl:hidden w-4 h-4 text-primary" />
      </Link>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        disabled={isPending}
        className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors disabled:opacity-50"
        aria-label="Logout"
      >
        {isPending ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <LogOut className="w-4 h-4" />
        )}
        <span className="hidden md:inline">
          {locale === "ar" ? "خروج" : "Déconnexion"}
        </span>
      </button>
    </div>
  );
}
