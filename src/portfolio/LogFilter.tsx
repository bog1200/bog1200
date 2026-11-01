"use client";
import { useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
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

    const select = (kind: Kind | null) => {
        const url = new URL(window.location.href);
        if (kind) url.searchParams.set(PARAM, kind);
        else url.searchParams.delete(PARAM);
        window.history.replaceState(window.history.state, "", url);
        window.dispatchEvent(new Event(EVENT));
    };

    const chip = "rounded-full px-2.5 py-1 transition-colors focus-visible:outline-2 focus-visible:outline-cyan-300";
    return (
        <div className={`${styles.log} [--gs:0.62] sm:[--gs:1]`} data-only={only ?? undefined} style={vars[only ?? "all"] as CSSProperties}>
            <div className="sticky top-12 z-20 -mx-2 mb-3 rounded-2xl border border-white/10 bg-[#03050b]/80 px-2 py-2 backdrop-blur-md sm:top-0">
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
