import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/components/theme-provider";
import { Noto_Sans, Tajawal } from "next/font/google";
import "../globals.css";

const notoSans = Noto_Sans({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-noto-sans",
});

const tajawal = Tajawal({
    subsets: ["arabic"],
    weight: ["400", "500", "700", "800", "900"],
    variable: "--font-tajawal",
});

export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;

    if (!routing.locales.includes(locale as "fr" | "ar")) {
        notFound();
    }

    const messages = await getMessages();
    const dir = locale === "ar" ? "rtl" : "ltr";
    const fontClass = locale === "ar" ? tajawal.variable : notoSans.variable;

    return (
        <html lang={locale} dir={dir} suppressHydrationWarning className={fontClass}>
            <body className="antialiased bg-background text-foreground font-sans">
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <NextIntlClientProvider messages={messages}>
                        {children}
                    </NextIntlClientProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
