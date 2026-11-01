import type { Metadata } from "next";
import { notFound } from "next/navigation";
import React from "react";
import "../globals.css";
import { nebulaSans } from "@/portfolio/fonts";
import { motionInitScript } from "@/portfolio/motion";
import { siteUrl } from "@/portfolio/site";
import { disabledLocales, htmlLang, isLocale, locales, ui } from "@/portfolio/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
    return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    if (!isLocale(locale)) return {};
    return {
        // Absolute canonical/hreflang URLs on Vercel; relative ones elsewhere.
        metadataBase: siteUrl ? new URL(siteUrl) : undefined,
        title: ui[locale].metaTitle,
        description: ui[locale].metaDescription,
        alternates: {
            canonical: `/${locale}`,
            languages: Object.fromEntries(locales.filter((l) => !disabledLocales.has(l)).map((l) => [htmlLang[l], `/${l}`])),
        },
    };
}

export default async function LocaleLayout({
    children,
    params,
}: Readonly<{
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}>) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    return (
        // suppressHydrationWarning: the head script may set data-motion before React hydrates.
        <html lang={htmlLang[locale]} className="bg-[#03050b] [color-scheme:dark]" suppressHydrationWarning>
            <head>
                {/* Runs before first paint. Only ever rendered on the server: language links are full page loads (see LangSwitch). */}
                <script dangerouslySetInnerHTML={{ __html: motionInitScript }} />
            </head>
            <body className={`${nebulaSans.variable} antialiased`}>{children}</body>
        </html>
    );
}
