import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, disabledLocales, htmlLang, locales, type Locale } from "@/portfolio/i18n";

/** Pick the best locale from Accept-Language, e.g. "sv-SE,sv;q=0.9,en;q=0.8" -> "se". */
function preferredLocale(header: string | null): Locale {
    const ranked = (header ?? "")
        .split(",")
        .map((part) => {
            const [tag, q] = part.trim().split(";q=");
            return { lang: tag.toLowerCase().split("-")[0], q: q ? Number(q) : 1 };
        })
        .sort((a, b) => b.q - a.q);
    for (const { lang } of ranked) {
        const match = locales.find((l) => htmlLang[l] === lang && !disabledLocales.has(l));
        if (match) return match;
    }
    return defaultLocale;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const hasLocale = locales.some((l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`));
    if (hasLocale) return;

    const url = request.nextUrl.clone();
    url.pathname = `/${preferredLocale(request.headers.get("accept-language"))}${pathname === "/" ? "" : pathname}`;
    return NextResponse.redirect(url);
}

export const config = {
    // Skip Next internals, static files (anything with a dot) and the standalone test page.
    matcher: ["/((?!_next|api|3js-test|.*\\..*).*)"],
};
