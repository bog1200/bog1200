"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";

// Cloudflare's documented test site key (always passes), used when no real key is configured in development.
const TEST_SITE_KEY = "1x00000000000000000000AA";
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? (process.env.NODE_ENV === "production" ? "" : TEST_SITE_KEY);
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

interface Turnstile {
    render(el: HTMLElement, options: Record<string, unknown>): string;
    reset(id: string): void;
    remove(id: string): void;
}
declare global {
    interface Window {
        turnstile?: Turnstile;
    }
}

function loadTurnstile(): Promise<Turnstile> {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    return new Promise((resolve, reject) => {
        let script = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT}"]`);
        if (!script) {
            script = document.createElement("script");
            script.src = SCRIPT;
            script.async = true;
            document.head.appendChild(script);
        }
        script.addEventListener("load", () => (window.turnstile ? resolve(window.turnstile) : reject()));
        script.addEventListener("error", () => reject());
    });
}

export interface ContactLabels {
    name: string;
    email: string;
    message: string;
    send: string;
    sending: string;
    sent: string;
    error: string;
    invalid: string;
    rateLimited: string;
    captcha: string;
}

type Status = "idle" | "sending" | "sent" | "invalid" | "rate-limited" | "captcha" | "error";

export default function ContactForm({ labels, locale }: { labels: ContactLabels; locale: string }) {
    const widget = useRef<HTMLDivElement>(null);
    const widgetId = useRef<string | null>(null);
    const startedAt = useRef(0);
    const [token, setToken] = useState("");
    const [status, setStatus] = useState<Status>("idle");

    useEffect(() => {
        startedAt.current = Date.now();
        if (!SITE_KEY) return;
        let cancelled = false;
        loadTurnstile()
            .then((turnstile) => {
                if (cancelled || !widget.current) return;
                widgetId.current = turnstile.render(widget.current, {
                    sitekey: SITE_KEY,
                    theme: "dark",
                    language: locale === "se" ? "sv" : locale,
                    callback: setToken,
                    "expired-callback": () => setToken(""),
                    "error-callback": () => setToken(""),
                });
            })
            .catch(() => setStatus("error"));
        return () => {
            cancelled = true;
            if (widgetId.current) window.turnstile?.remove(widgetId.current);
        };
    }, [locale]);

    const submit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
        if (!token) return setStatus("captcha");
        setStatus("sending");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...data, token, locale, startedAt: startedAt.current }),
            });
            const result = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
            if (res.ok && result.ok) {
                form.reset();
                setStatus("sent");
            } else {
                const known: Status[] = ["invalid", "rate-limited", "captcha"];
                setStatus(known.includes(result.error as Status) ? (result.error as Status) : "error");
            }
        } catch {
            setStatus("error");
        } finally {
            // A Turnstile token is single-use.
            setToken("");
            if (widgetId.current) window.turnstile?.reset(widgetId.current);
        }
    };

    const message: Partial<Record<Status, string>> = {
        sent: labels.sent,
        invalid: labels.invalid,
        "rate-limited": labels.rateLimited,
        captcha: labels.captcha,
        error: labels.error,
    };
    const input =
        "w-full min-w-0 rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 backdrop-blur-sm focus:border-cyan-300/60 focus:outline-none";
    const label = "mb-1 block font-mono text-xs text-slate-400";

    return (
        <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
                <div>
                    <label htmlFor="contact-name" className={label}>
                        {labels.name}
                    </label>
                    <input id="contact-name" name="name" required maxLength={100} autoComplete="name" className={input} />
                </div>
                <div>
                    <label htmlFor="contact-email" className={label}>
                        {labels.email}
                    </label>
                    <input id="contact-email" name="email" type="email" required maxLength={200} autoComplete="email" className={input} />
                </div>
            </div>
            <div>
                <label htmlFor="contact-message" className={label}>
                    {labels.message}
                </label>
                <textarea id="contact-message" name="message" required minLength={10} maxLength={4000} rows={5} className={`${input} resize-y`} />
            </div>
            {/* Honeypot: invisible to people, tempting to bots. */}
            <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div ref={widget} className="min-h-[65px]" />
                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="rounded-full bg-cyan-300 px-5 py-2 font-mono text-sm font-semibold text-black transition-colors hover:bg-cyan-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:opacity-60"
                >
                    {status === "sending" ? labels.sending : labels.send}
                </button>
            </div>
            <p role="status" aria-live="polite" className={`min-h-5 text-sm ${status === "sent" ? "text-emerald-300" : "text-rose-300"}`}>
                {message[status] ?? ""}
            </p>
        </form>
    );
}
