import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Afya – Santé Digitale Tunisienne",
  description:
    "La plateforme de santé numérique de référence en Tunisie. Accédez à des soins de qualité, consultez des médecins en ligne.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
