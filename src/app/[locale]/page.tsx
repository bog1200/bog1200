import { notFound } from "next/navigation";
import aurora from "@/portfolio/aurora.module.css";
import ContactForm from "@/portfolio/ContactForm";
import { profile } from "@/portfolio/data";
import { kindColor } from "@/portfolio/colors";
import GitLog from "@/portfolio/GitLog";
import HeroCanvas from "@/portfolio/HeroCanvas";
import { isLocale, ui } from "@/portfolio/i18n";
import LangSwitch from "@/portfolio/LangSwitch";
import { privacy } from "@/portfolio/privacy";
import MotionToggle from "@/portfolio/MotionToggle";

export default async function Portfolio({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();
    const t = ui[locale];

    return (
        <div className="relative min-h-screen overflow-x-clip text-slate-200">
            <div aria-hidden className={aurora.sky}>
                <div className={aurora.stars} />
                <div className={`${aurora.band} ${aurora.b1}`} />
                <div className={`${aurora.band} ${aurora.b2}`} />
                <div className={`${aurora.band} ${aurora.b3}`} />
                <div className={aurora.rays} />
            </div>

            <LangSwitch current={locale} label={t.switchLabel} />
            <MotionToggle pauseLabel={t.pauseMotion} playLabel={t.playMotion} />

            <header className="relative z-10 flex min-h-[100svh] flex-col justify-center overflow-hidden">
                {/* Fade the canvas itself out rather than painting an opaque gradient over it: the fixed sky shows
                    through the transparent canvas, so the hero blends into the page without a visible edge. */}
                <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,black_45%,transparent_95%)]">
                    <HeroCanvas label={t.canvasLabel} />
                </div>

                <div className="relative mx-auto w-full max-w-4xl px-5 pt-[calc(20svh+2rem)] pb-8 sm:px-8">
                    <p className="font-mono text-xs text-emerald-300/80 sm:text-sm">
                        ~/bog1200 <span className="text-cyan-300/80">(main)</span> $ whoami
                    </p>
                    <h1 className="mt-3 bg-gradient-to-r from-emerald-200 via-cyan-200 to-violet-300 bg-clip-text text-[clamp(2.4rem,9vw,5.75rem)] font-semibold leading-[0.95] tracking-tight text-balance text-transparent">
                        {profile.name}
                    </h1>
                    <p className="mt-5 max-w-2xl text-base text-pretty text-slate-300 sm:text-lg">{t.headline}</p>
                    <p className="mt-1 text-sm text-slate-400">{t.location}</p>

                    <dl className="mt-7 grid max-w-xl grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1 font-mono text-xs sm:text-sm">
                        {profile.remotes.map((r) => (
                            <div key={r.name} className="contents">
                                <dt className="text-slate-500">{r.name}</dt>
                                <dd className="min-w-0 truncate">
                                    <a
                                        href={r.href}
                                        {...(r.href.startsWith("http") && { target: "_blank", rel: "noopener noreferrer" })}
                                        className="text-cyan-200 underline-offset-4 hover:text-white hover:underline"
                                    >
                                        {r.label}
                                    </a>
                                </dd>
                            </div>
                        ))}
                        <div className="contents">
                            <dt className="text-slate-500">contact</dt>
                            <dd className="min-w-0 truncate">
                                <a href="#contact" className="text-cyan-200 underline-offset-4 hover:text-white hover:underline">
                                    {t.contactLink} ↓
                                </a>
                            </dd>
                        </div>
                    </dl>

                    <ul className="mt-8 flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-wider text-slate-400">
                        {(Object.keys(kindColor) as (keyof typeof kindColor)[]).map((k) => (
                            <li key={k} className="flex items-center gap-1.5 whitespace-nowrap">
                                <span className="size-2 rounded-full" style={{ background: kindColor[k] }} />
                                <span style={{ color: kindColor[k] }}>{k}/</span>
                                {t.kinds[k]}
                            </li>
                        ))}
                    </ul>

                    <a href="#log" className="mt-10 inline-flex items-center gap-2 font-mono text-xs text-slate-500 hover:text-slate-300">
                        <span aria-hidden className="animate-bounce motion-reduce:[html:not([data-motion=playing])_&]:animate-none">↓</span>
                        {t.scroll}
                    </a>
                </div>
            </header>

            <main className="relative z-10 mx-auto w-full max-w-4xl px-3 pt-6 pb-24 sm:px-8 sm:pt-8">
                <section id="log" aria-labelledby="log-title" className="scroll-mt-8">
                    <h2 id="log-title" className="mb-6 flex flex-wrap items-baseline gap-x-3 px-2 sm:px-0">
                        <span className="text-2xl font-semibold text-white sm:text-3xl">{t.log}</span>
                    </h2>
                    <GitLog locale={locale} t={t} />
                </section>

                <div className="mt-20 grid gap-10 px-2 sm:px-0 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                    <section aria-labelledby="stack-title">
                        <h2 id="stack-title" className="flex flex-wrap items-baseline gap-x-3">
                            <span className="text-2xl font-semibold text-white">{t.skills}</span>
                            <span className="font-mono text-xs text-slate-500">$ git config --list</span>
                        </h2>
                        <dl className="mt-5 space-y-4">
                            {profile.skills.map((s) => (
                                <div key={s.group}>
                                    <dt className="font-mono text-xs text-violet-300">stack.{s.group}</dt>
                                    <dd className="mt-1.5 flex flex-wrap gap-1.5">
                                        {s.items.map((item) => (
                                            <span
                                                key={item.en}
                                                className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-slate-300 ring-1 ring-white/10 backdrop-blur-sm"
                                            >
                                                {item[locale]}
                                            </span>
                                        ))}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </section>

                    <section aria-labelledby="lang-title">
                        <h2 id="lang-title" className="text-2xl font-semibold text-white">
                            {t.languages}
                        </h2>
                        <ul className="mt-5 space-y-2">
                            {profile.languages.map((l) => (
                                <li key={l.name.en} className="flex items-baseline justify-between gap-4 border-b border-white/10 pb-2">
                                    <span className="text-sm text-slate-200">{l.name[locale]}</span>
                                    <span className="font-mono text-xs text-emerald-300">
                                        {l.level === "native" ? t.levels.native : l.level}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </section>
                </div>

                <section id="contact" aria-labelledby="contact-title" className="mt-20 scroll-mt-8 px-2 sm:px-0">
                    <h2 id="contact-title" className="flex flex-wrap items-baseline gap-x-3">
                        <span className="text-2xl font-semibold text-white">{t.contactTitle}</span>
                        <span className="font-mono text-xs text-slate-500">$ git push origin message</span>
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm text-pretty text-slate-400">{t.contactIntro}</p>
                    <div className="mt-6 max-w-2xl rounded-xl border border-white/10 bg-slate-950/40 p-4 backdrop-blur-md sm:p-6">
                        <ContactForm
                            locale={locale}
                            labels={{
                                name: t.formName,
                                email: t.formEmail,
                                message: t.formMessage,
                                send: t.formSend,
                                sending: t.formSending,
                                sent: t.formSent,
                                error: t.formError,
                                invalid: t.formInvalid,
                                rateLimited: t.formRateLimited,
                                captcha: t.formCaptcha,
                            }}
                        />
                        <div className="mt-2 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-400">
                            <p className="text-pretty">{privacy[locale].short}</p>
                            <details className="group mt-2">
                                <summary className="cursor-pointer font-mono text-slate-300 marker:text-cyan-300 hover:text-white">
                                    {privacy[locale].summary}
                                </summary>
                                <dl className="mt-3 space-y-3">
                                    {privacy[locale].items.map((item) => (
                                        <div key={item.title}>
                                            <dt className="font-medium text-slate-200">{item.title}</dt>
                                            <dd className="mt-0.5 text-pretty">
                                                {item.text}
                                                {item.links?.map((link) => (
                                                    <a
                                                        key={link.href}
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="ml-1.5 whitespace-nowrap text-cyan-300 underline-offset-4 hover:underline"
                                                    >
                                                        {link.label} ↗
                                                    </a>
                                                ))}
                                            </dd>
                                        </div>
                                    ))}
                                </dl>
                            </details>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="relative z-10 border-t border-white/10 px-5 pt-8 pb-16 text-center sm:pb-8 font-mono text-[11px] text-slate-500">
                <p>
                    © {new Date().getFullYear()} {profile.name} · {t.footer}
                </p>
                {t.translationNote && t.readOriginal && (
                    <p className="mx-auto mt-2 max-w-2xl text-pretty">
                        {t.translationNote}{" "}
                        {/* Deliberately a full page load, like the language switcher: a client-side render of the
                            root layout would re-render its <head> script. */}
                        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
                        <a href="/en" hrefLang="en" lang="en" className="whitespace-nowrap text-cyan-300 underline-offset-4 hover:underline">
                            {t.readOriginal} →
                        </a>
                    </p>
                )}
            </footer>
        </div>
    );
}
