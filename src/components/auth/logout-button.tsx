"use client";

import { useTransition } from "react";
import { LogOut, Loader2 } from "lucide-react";
import { logoutAction } from "@/lib/auth-actions";
import { Button } from "@/components/ui/button";

interface LogoutButtonProps {
  locale: string;
  t: { logout: string };
}

export function LogoutButton({ locale, t }: LogoutButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutAction(locale);
    });
  };

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={isPending}
      className="rounded-full px-8 py-3 h-11 text-sm font-medium border-destructive/40 text-destructive hover:bg-destructive/5 transition-all flex items-center gap-2"
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <LogOut className="w-4 h-4" />
      )}
      {t.logout}
    </Button>
  );
}
