import { disabledLocales, htmlLang, locales, type Locale } from "./i18n";

export default function LangSwitch({ current, label }: { current: Locale; label: string }) {
    return (
        <nav
            aria-label={label}
            className="fixed right-3 top-3 z-50 flex items-center rounded-full border border-white/15 bg-black/60 px-1.5 py-1 font-mono text-xs font-semibold tracking-widest shadow-lg backdrop-blur-md sm:right-5 sm:top-5"
        >
            {/* Disabled locales are hidden, except on their own page so the current language still shows. */}
            {locales.filter((l) => !disabledLocales.has(l) || l === current).map((l, i) => (
                <span key={l} className="flex items-center">
                    {i > 0 && (
                        <span aria-hidden className="text-white/25">
                            |
                        </span>
                    )}
                    {/* A plain <a>, not <Link>: switching language replaces the whole document (lang, head, metadata),
                        and a client-side render of the root layout would re-render its <head> script. */}
                    <a
                        href={`/${l}`}
                        hrefLang={htmlLang[l]}
                        lang={htmlLang[l]}
                        aria-current={l === current ? "page" : undefined}
                        className={`w-9 rounded-full py-1 text-center transition-colors focus-visible:outline-2 focus-visible:outline-cyan-300 ${
                            l === current ? "bg-white text-black" : "text-white/70 hover:text-white"
                        }`}
                    >
                        {l.toUpperCase()}
                    </a>
                </span>
            ))}
        </nav>
    );
}
