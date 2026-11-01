"use client";
import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import { kindColor } from "./colors";
import type { Kind } from "./data";
import styles from "./log.module.css";

const PARAM = "branches";
const EVENT = "branchfilterchange";

// The selected category lives in the URL (?branches=EXP), so shared links restore it.
// The server snapshot is "no filter", so the pre-rendered HTML is always the full graph.
const subscribe = (onChange: () => void) => {
    window.addEventListener(EVENT, onChange);
    window.addEventListener("popstate", onChange);
    return () => {
        window.removeEventListener(EVENT, onChange);
        window.removeEventListener("popstate", onChange);
    };
};
const readParam = () => new URLSearchParams(window.location.search).get(PARAM);

/** Matches Tailwind's `sm` breakpoint: from here up the panel is always sticky. */
const WIDE = "(min-width: 640px)";
/** Scroll distance (px) that counts as a change of direction; smaller moves are trackpad / iOS bounce jitter. */
const JITTER = 8;

/** `git log --branches=…` chips: show one category, keeping the server-rendered graph and only switching CSS variables. */
export default function LogFilter({
    kinds,
    vars,
    labels,
    header,
    children,
}: {
    kinds: Kind[];
    vars: Record<"all" | Kind, Record<string, string>>;
    labels: { all: string; group: string };
    header: ReactNode;
    children: ReactNode;
}) {
    const param = useSyncExternalStore(subscribe, readParam, () => null);
    const only = param && (kinds as string[]).includes(param) ? (param as Kind) : null;

    // On small screens the sticky panel covers a large part of the log, so it only stays stuck while scrolling up
    // ("headroom"): scrolling down slides it away, scrolling up brings it back.
    const [hidden, setHidden] = useState(false);
    const root = useRef<HTMLDivElement>(null);
    const panel = useRef<HTMLDivElement>(null);
    const lastY = useRef(0);

    useEffect(() => {
        const wide = window.matchMedia(WIDE);
        lastY.current = window.scrollY;
        let frame = 0;
        const update = () => {
            frame = 0;
            const y = window.scrollY;
            const delta = y - lastY.current;
            if (wide.matches || !root.current || !panel.current) {
                lastY.current = y;
                return setHidden(false);
            }
            if (Math.abs(delta) < JITTER) return;
            lastY.current = y;
            // Stuck = the log has scrolled past the panel's sticky offset. The panel's own rect can't be used: it moves with the transform.
            const stuck = root.current.getBoundingClientRect().top < parseFloat(getComputedStyle(panel.current).top);
            setHidden(delta > 0 && stuck);
        };
        const onScroll = () => {
            if (!frame) frame = requestAnimationFrame(update);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        wide.addEventListener("change", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            wide.removeEventListener("change", onScroll);
            cancelAnimationFrame(frame);
        };
    }, []);

    const select = (kind: Kind | null) => {
        const url = new URL(window.location.href);
        if (kind) url.searchParams.set(PARAM, kind);
        else url.searchParams.delete(PARAM);
        window.history.replaceState(window.history.state, "", url);
        window.dispatchEvent(new Event(EVENT));
        // The log changes height, which scrolls the page: don't read that as the user scrolling down.
        setHidden(false);
        requestAnimationFrame(() => (lastY.current = window.scrollY));
    };

    const chip = "rounded-full px-2.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-300";
    return (
        <div ref={root} className={`${styles.log} [--gs:0.62] sm:[--gs:1]`} data-only={only ?? undefined} style={vars[only ?? "all"] as CSSProperties}>
            <div
                ref={panel}
                className={`sticky top-12 z-20 -mx-2 mb-3 rounded-2xl border border-white/10 bg-[#03050b]/80 px-2 py-2 backdrop-blur-md transition-transform duration-200 ease-out focus-within:translate-y-0 motion-reduce:[html:not([data-motion=playing])_&]:transition-none sm:top-0 sm:translate-y-0 ${
                    hidden ? "-translate-y-[calc(100%+4rem)]" : ""
                }`}
            >
                <p className="mb-2 truncate px-1 font-mono text-[11px] text-slate-500">
                    $ git log --graph {only ? <span style={{ color: kindColor[only] }}>{`--branches='${only}/*'`}</span> : "--all"}
                </p>
                <div role="group" aria-label={labels.group} className="flex flex-wrap gap-1.5 font-mono text-[11px] font-semibold tracking-wider">
                    <button
                        type="button"
                        aria-pressed={only === null}
                        onClick={() => select(null)}
                        className={`${chip} ${only === null ? "bg-white text-black" : "text-slate-300 ring-1 ring-white/15 hover:text-white"}`}
                    >
                        {labels.all}
                    </button>
                    {kinds.map((kind) => (
                        <button
                            key={kind}
                            type="button"
                            aria-pressed={only === kind}
                            onClick={() => select(only === kind ? null : kind)}
                            className={`${chip} ${only === kind ? "text-black" : "ring-1 hover:brightness-125"}`}
                            style={
                                only === kind
                                    ? { background: kindColor[kind] }
                                    : { color: kindColor[kind], "--tw-ring-color": `${kindColor[kind]}55` } as CSSProperties
                            }
                        >
                            {kind}
                        </button>
                    ))}
                </div>
                <div className="mt-2 flex">{header}</div>
            </div>
            {children}
        </div>
    );
}
