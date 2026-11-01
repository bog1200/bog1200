import type { CSSProperties, ReactNode } from "react";
import { kindColor } from "./colors";
import type { Kind, Tag } from "./data";
import { buildGraph, KINDS, type Graph, type Lane, type RowLayout } from "./graph";
import { formatMonth, type Dict, type Locale } from "./i18n";
import LogFilter from "./LogFilter";
import Today from "./Today";

const MAIN = "rgb(226 232 240 / 0.45)";

const LANE = 15;
const PAD = 11;
/** Extra space between category bands. */
const GAP = 10;
/** Vertical position of the commit node within every row; content is aligned to it. */
const NODE_Y = 24;
/** How far open branches rise above the HEAD row while fading out. */
const OPEN_RISE = 14;

// Horizontal positions are CSS calc()s over custom properties set by <LogFilter>:
// --off-<KIND> is where a band starts, --gw the gutter width, --gs a scale for small screens.
// Filtering only changes those variables, so the server-rendered graph never has to be redrawn.
const scaled = (expr: string) => `calc((${expr}) * var(--gs))`;
const laneOffset = ({ kind, sub }: Lane) => `${kind ? `var(--off-${kind})` : "0px"} + ${sub} * var(--lane)`;
const laneX = (lane: Lane) => scaled(`var(--pad) + ${laneOffset(lane)}`);
const colorOf = (kind?: Kind) => (kind ? kindColor[kind] : MAIN);

/** CSS variables for the full graph, and for each single-category view (that band moved next to main). */
function laneVars(groups: Graph["groups"]): Record<"all" | Kind, Record<string, string>> {
    const base = { "--lane": `${LANE}px`, "--pad": `${PAD}px` };
    const all: Record<string, string> = { ...base };
    let x = LANE + GAP;
    for (const { kind, lanes } of groups) {
        all[`--off-${kind}`] = `${x}px`;
        x += lanes * LANE + GAP;
    }
    all["--gw"] = `${x - LANE - GAP + PAD * 2}px`;
    const only = Object.fromEntries(
        groups.map(({ kind, lanes }) => [kind, { ...all, [`--off-${kind}`]: `${LANE + GAP}px`, "--gw": `${GAP + lanes * LANE + PAD * 2}px` }]),
    );
    return { all, ...only } as Record<"all" | Kind, Record<string, string>>;
}

function Gutter({ layout, groups }: { layout: RowLayout; groups: Graph["groups"] }) {
    const { lines, node, curve } = layout;
    return (
        <div aria-hidden className="relative shrink-0 self-stretch" style={{ width: "calc(var(--gw) * var(--gs))" }}>
            {groups.map(({ kind, lanes }) => (
                <span
                    key={kind}
                    data-kind={kind}
                    className="absolute inset-y-0"
                    style={{
                        left: scaled(`var(--pad) + var(--off-${kind}) - var(--lane) / 2`),
                        width: scaled(`${lanes} * var(--lane)`),
                        background: `${kindColor[kind]}0b`,
                    }}
                />
            ))}
            {lines.map(({ lane, segment, dashed }) => (
                <span
                    key={`${lane.kind}-${lane.sub}`}
                    data-kind={lane.kind}
                    className="absolute"
                    style={{
                        left: `calc(${laneX(lane)} - 1px)`,
                        top: segment === "lower" ? NODE_Y : segment === "open" ? -OPEN_RISE : 0,
                        bottom: segment === "upper" ? undefined : 0,
                        height: segment === "upper" ? NODE_Y : undefined,
                        ...(dashed
                            ? { borderLeft: `2px dashed ${colorOf(lane.kind)}`, opacity: 0.55 }
                            : segment === "open"
                              ? // Still open past HEAD: solid from the node line down, fading out towards the top.
                                { width: 2, opacity: 0.8, background: `linear-gradient(to bottom, transparent, ${colorOf(lane.kind)} ${NODE_Y + OPEN_RISE}px)` }
                              : {
                                  width: 2,
                                  borderRadius: 9999,
                                  background: colorOf(lane.kind),
                                  boxShadow: lane.kind ? `0 0 8px ${colorOf(lane.kind)}66` : undefined,
                                  opacity: lane.kind ? 0.8 : 1,
                              }),
                    }}
                />
            ))}
            {curve && (
                // Spans from main to the branch lane; the path is drawn in a 1-unit-wide box stretched to fit.
                <svg
                    data-kind={curve.lane.kind}
                    className="absolute top-0 overflow-visible"
                    // The glow goes on the <svg>, not the path: inside the stretched viewBox it would smear sideways.
                    style={{
                        left: laneX({ sub: 0 }),
                        width: scaled(laneOffset(curve.lane)),
                        filter: `drop-shadow(0 0 4px ${colorOf(curve.lane.kind)}88)`,
                    }}
                    height={NODE_Y}
                    viewBox={`0 0 1 ${NODE_Y}`}
                    preserveAspectRatio="none"
                >
                    <path
                        d={curve.dir === "merge" ? `M1 ${NODE_Y} C1 ${NODE_Y * 0.25} 0 ${NODE_Y * 0.75} 0 0` : `M1 0 C1 ${NODE_Y * 0.75} 0 ${NODE_Y * 0.25} 0 ${NODE_Y}`}
                        fill="none"
                        stroke={colorOf(curve.lane.kind)}
                        strokeWidth={2}
                        strokeLinecap="round"
                        vectorEffect="non-scaling-stroke"
                        opacity={0.8}
                    />
                </svg>
            )}
            {node && (
                <span
                    className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full"
                    style={{ left: laneX(node.lane), top: NODE_Y, ...nodeStyle(node.style, colorOf(node.lane.kind)) }}
                />
            )}
        </div>
    );
}

/** Category codes over their bands, aligned with the gutter; staggered on two rows so narrow bands don't collide. */
function LaneHeader({ groups }: { groups: Graph["groups"] }) {
    return (
        <div aria-hidden className="relative h-4 shrink-0 font-mono text-[10px] font-semibold leading-none sm:h-7" style={{ width: "calc(var(--gw) * var(--gs))" }}>
            <span className="absolute bottom-0 -translate-x-1/2 text-slate-500" style={{ left: laneX({ sub: 0 }) }}>
                <span className="hidden sm:inline">main</span>
                <span className="inline-block size-1.5 rounded-full bg-slate-400 sm:hidden" />
            </span>
            {groups.map(({ kind, lanes }, i) => (
                <span
                    key={kind}
                    data-kind={kind}
                    className={`absolute -translate-x-1/2 ${i % 2 ? "bottom-0" : "bottom-0 sm:top-0 sm:bottom-auto"}`}
                    style={{ left: scaled(`var(--pad) + var(--off-${kind}) + ${lanes - 1} * var(--lane) / 2`), color: kindColor[kind] }}
                >
                    <span className="hidden sm:inline">{kind}</span>
                    <span className="inline-block size-1.5 rounded-full sm:hidden" style={{ background: kindColor[kind] }} />
                </span>
            ))}
        </div>
    );
}

function nodeStyle(style: "solid" | "ring" | "dot", color: string): CSSProperties {
    switch (style) {
        case "solid":
            return { width: 12, height: 12, background: color, boxShadow: `0 0 0 3px #03050b, 0 0 12px ${color}` };
        case "ring":
            return { width: 13, height: 13, border: `2px solid ${color}`, background: "#03050b" };
        case "dot":
            return { width: 7, height: 7, background: color, boxShadow: "0 0 0 2px #03050b" };
    }
}

function BranchPill({ name, kind }: { name: string; kind: Kind }) {
    return (
        <span
            className="whitespace-nowrap rounded-md border px-1.5 py-px font-mono text-[11px] font-medium tracking-wide"
            style={{ color: kindColor[kind], borderColor: `${kindColor[kind]}55`, background: `${kindColor[kind]}12` }}
        >
            {name}
        </span>
    );
}

function Hash({ value }: { value: string }) {
    return <span className="font-mono text-[11px] text-slate-500">{value}</span>;
}

function Card({ children, compact }: { children: ReactNode; compact?: boolean }) {
    return (
        <article
            className={`min-w-0 rounded-xl border border-white/10 bg-slate-950/40 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.6)] backdrop-blur-md transition-colors hover:border-white/20 ${
                compact ? "px-4 py-3" : "p-4 sm:p-5"
            }`}
        >
            {children}
        </article>
    );
}

function Diff({ lines }: { lines: string[] }) {
    if (!lines.length) return null;
    return (
        <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-slate-300">
            {lines.map((line) => (
                <li key={line} className="flex gap-2.5">
                    <span aria-hidden className="select-none font-mono text-emerald-400/80">
                        +
                    </span>
                    <span className="min-w-0">{line}</span>
                </li>
            ))}
        </ul>
    );
}

function Tags({ tags, locale }: { tags?: Tag[]; locale: Locale }) {
    return tags?.map((tag) => {
        const label = typeof tag === "string" ? tag : tag[locale];
        return (
            <span key={label} className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-300 ring-1 ring-white/10">
                {label}
            </span>
        );
    });
}

function RowContent({ layout, locale, t, open }: { layout: RowLayout; locale: Locale; t: Dict; open: Graph["open"] }) {
    const { row, hash } = layout;
    const meta = "flex flex-wrap items-center gap-x-2 gap-y-1";

    switch (row.type) {
        case "head":
            return (
                <div className={`${meta} pb-6 pt-[13px] font-mono text-xs`}>
                    <span className="rounded-md border border-cyan-300/40 bg-cyan-300/10 px-1.5 py-px text-cyan-200">HEAD → main</span>
                    <span className="text-slate-300">
                        · <Today buildMonth={new Date().toISOString().slice(0, 7)} locale={locale} />
                    </span>
                    <span className="text-slate-500">· {t.head}</span>
                    {/* One count per filter view; log.module.css shows the one matching the active filter. */}
                    {(["all", ...KINDS] as const).map((mode) =>
                        open[mode] ? (
                            <span key={mode} data-mode={mode} className="text-emerald-300/80">
                                · {t.openBranches(open[mode])}
                            </span>
                        ) : null,
                    )}
                </div>
            );
        case "root":
            return (
                <div className={`${meta} pb-2 pt-[13px] font-mono text-xs text-slate-400`}>
                    <Hash value={hash} />
                    <span className="text-slate-200">{t.initTitle}</span>
                    <span className="text-slate-500">· {t.initSub}</span>
                </div>
            );
        case "fork":
            return (
                <div className={`${meta} pb-5 pt-[13px] font-mono text-xs text-slate-500`}>
                    <span>
                        git checkout -b <span style={{ color: kindColor[row.entry.kind] }}>{row.entry.branch}</span>
                    </span>
                    <time dateTime={row.entry.start}>· {formatMonth(row.entry.start, locale)}</time>
                </div>
            );
        case "milestone":
            return (
                <div className={`${meta} pb-5 pt-[13px] font-mono text-xs`}>
                    <Hash value={hash} />
                    <span className="text-slate-200">{row.text[locale]}</span>
                    <time dateTime={row.date} className="text-slate-500">
                        · {formatMonth(row.date, locale)}
                    </time>
                </div>
            );
        case "commit": {
            const e = row.entry;
            return (
                <div className="pb-4">
                    <Card compact>
                        <div className={`${meta} font-mono text-xs`}>
                            <Hash value={hash} />
                            <BranchPill name={e.branch} kind={e.kind} />
                            <time dateTime={e.date} className="ml-auto whitespace-nowrap text-slate-400">
                                {formatMonth(e.date, locale)}
                            </time>
                        </div>
                        <h3 className="mt-1.5 text-sm font-medium text-pretty text-slate-100 sm:text-[15px]">{e.title[locale]}</h3>
                        {(e.org || e.location) && (
                            <p className="mt-0.5 text-xs text-slate-400">{[e.org?.[locale], e.location?.[locale]].filter(Boolean).join(" · ")}</p>
                        )}
                        <Diff lines={(e.bullets ?? []).map((b) => b[locale])} />
                        {!!e.tags?.length && (
                            <div className="mt-3 flex flex-wrap gap-1.5">
                                <Tags tags={e.tags} locale={locale} />
                            </div>
                        )}
                    </Card>
                </div>
            );
        }
        case "tip": {
            const e = row.entry;
            return (
                <div className="pb-6">
                    <Card>
                        <div className={`${meta} font-mono text-xs`}>
                            <Hash value={hash} />
                            <BranchPill name={e.branch} kind={e.kind} />
                            {e.end === null ? (
                                <span className="inline-flex items-center gap-1.5 whitespace-nowrap text-emerald-300">
                                    <span className="size-1.5 animate-pulse rounded-full bg-emerald-300 motion-reduce:[html:not([data-motion=playing])_&]:animate-none" />
                                    {t.open}
                                </span>
                            ) : (
                                <span className="whitespace-nowrap text-slate-500">↳ {t.merged}</span>
                            )}
                            <span className="ml-auto whitespace-nowrap text-slate-400">
                                <time dateTime={e.start}>{formatMonth(e.start, locale)}</time>
                                {" – "}
                                {e.end ? <time dateTime={e.end}>{formatMonth(e.end, locale)}</time> : t.present}
                            </span>
                        </div>
                        <h3 className="mt-2 text-base font-semibold text-pretty text-white sm:text-lg">{e.title[locale]}</h3>
                        {(e.org || e.location) && (
                            <p className="mt-0.5 text-sm text-slate-400">{[e.org, e.location?.[locale]].filter(Boolean).join(" · ")}</p>
                        )}
                        <Diff lines={e.bullets.map((b) => b[locale])} />
                        {!!(e.tags?.length || e.links?.length) && (
                            <div className="mt-4 flex flex-wrap items-center gap-1.5">
                                <Tags tags={e.tags} locale={locale} />
                                {e.links?.map((link) => (
                                    <a
                                        key={link.href}
                                        href={link.href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="max-w-full truncate font-mono text-[11px] text-cyan-300 underline-offset-4 hover:underline sm:ml-auto"
                                    >
                                        {link.label} ↗
                                    </a>
                                ))}
                            </div>
                        )}
                    </Card>
                </div>
            );
        }
    }
}

export default function GitLog({ locale, t }: { locale: Locale; t: Dict }) {
    const { rows, groups, open } = buildGraph();
    return (
        <LogFilter
            kinds={KINDS}
            vars={laneVars(groups)}
            labels={{ all: t.filterAll, group: t.filterLabel }}
            header={<LaneHeader groups={groups} />}
        >
            <ol className="relative">
                {rows.map((layout) => (
                    <li key={layout.hash} data-kind={layout.kind} className="flex gap-2 sm:gap-4">
                        <Gutter layout={layout} groups={groups} />
                        <div className="min-w-0 flex-1">
                            <RowContent layout={layout} locale={locale} t={t} open={open} />
                        </div>
                    </li>
                ))}
            </ol>
        </LogFilter>
    );
}
