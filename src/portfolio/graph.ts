// Lays the CV out as `git log --graph`: newest at the top, main on the left, then one band of
// lanes per category (EDU | EXP | PRJ | CERT | EVT). Each long-running entry gets a lane in its
// category's band between its fork and its tip; one-off commits sit on their band's first lane.
import { branches, commits, type BranchEntry, type CommitEntry, type Kind } from "./data";
import type { T } from "./i18n";

export const KINDS: Kind[] = ["EDU", "EXP", "PRJ", "CERT", "EVT"];

export type Row =
    | { type: "head" }
    | { type: "tip"; entry: BranchEntry }
    | { type: "milestone"; entry: BranchEntry; date: string; text: T }
    | { type: "commit"; entry: CommitEntry }
    | { type: "fork"; entry: BranchEntry }
    | { type: "root" };

/**
 * How a lane is drawn within one row: "lower" runs from the node down, "upper" from the top edge to the node,
 * "open" is a still-open branch passing HEAD (drawn fading out upwards).
 */
export type Segment = "full" | "lower" | "upper" | "open";

/** A lane: `sub`-th lane of a category band, or main when `kind` is undefined. */
export interface Lane {
    kind?: Kind;
    sub: number;
}

export interface RowLayout {
    row: Row;
    hash: string;
    /** Category of the row (undefined for HEAD and the initial commit), used to filter. */
    kind?: Kind;
    /** Dashed lines are tracks joining one-off commits of a category without branches. */
    lines: { lane: Lane; segment: Segment; dashed?: boolean }[];
    node?: { lane: Lane; style: "solid" | "ring" | "dot" };
    curve?: { lane: Lane; dir: "merge" | "fork" };
}

export interface Graph {
    rows: RowLayout[];
    /** Lanes per category band, in KINDS order. */
    groups: { kind: Kind; lanes: number }[];
    /** Branches still open at HEAD, in total and per category. */
    open: Record<"all" | Kind, number>;
}

const MAIN: Lane = { sub: 0 };

const ONGOING = "9999-99";

function sortKey(row: Row): string {
    // Within one month: tips/merges sit above milestones, then main commits, then forks.
    switch (row.type) {
        case "head":
            return "~";
        case "root":
            return "0";
        case "tip":
            return row.entry.end === null ? `${ONGOING}|${row.entry.start}` : `${row.entry.end}|3`;
        case "milestone":
            return `${row.date}|2`;
        case "commit":
            return `${row.entry.date}|1`;
        case "fork":
            return `${row.entry.start}|0`;
    }
}

export function shortHash(s: string): string {
    let h = 0x811c9dc5;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 0x01000193);
    }
    return (h >>> 0).toString(16).padStart(8, "0").slice(0, 7);
}

function rowId(row: Row): string {
    switch (row.type) {
        case "head":
        case "root":
            return row.type;
        case "milestone":
            return `${row.entry.id}:${row.date}`;
        default:
            return `${row.entry.id}:${row.type}`;
    }
}

export function buildGraph(): Graph {
    const rows: Row[] = [
        { type: "head" },
        { type: "root" },
        ...branches.flatMap((entry): Row[] => [
            { type: "tip", entry },
            { type: "fork", entry },
            ...(entry.milestones ?? []).map((m): Row => ({ type: "milestone", entry, ...m })),
        ]),
        ...commits.map((entry): Row => ({ type: "commit", entry })),
    ];
    // Stable sort, so entries with equal keys keep their order in data.ts.
    rows.sort((a, b) => (sortKey(a) < sortKey(b) ? 1 : sortKey(a) > sortKey(b) ? -1 : 0));

    // Assign lanes top-down within each category: a branch takes its band's lowest free lane at its tip
    // and frees it after its fork.
    const lane = new Map<string, Lane>();
    const taken = new Map<Kind, boolean[]>(KINDS.map((k) => [k, []]));
    const width = new Map<Kind, number>(KINDS.map((k) => [k, 1]));
    for (const row of rows) {
        if (row.type === "tip") {
            const kind = row.entry.kind;
            const band = taken.get(kind)!;
            let sub = 0;
            while (band[sub]) sub++;
            band[sub] = true;
            lane.set(row.entry.id, { kind, sub });
            width.set(kind, Math.max(width.get(kind)!, sub + 1));
        } else if (row.type === "fork") {
            taken.get(row.entry.kind)![lane.get(row.entry.id)!.sub] = false;
        }
    }

    const index = new Map(rows.map((r, i) => [rowId(r), i]));
    const spans = branches.map((e) => ({
        lane: lane.get(e.id)!,
        // Ongoing branches stay open all the way up to HEAD.
        top: e.end === null ? 0 : index.get(`${e.id}:tip`)!,
        bottom: index.get(`${e.id}:fork`)!,
        dashed: false,
    }));
    // A category's one-off commits are joined by a dashed track from the oldest to the newest one.
    for (const kind of KINDS) {
        const at = rows.flatMap((r, i) => (r.type === "commit" && r.entry.kind === kind ? [i] : []));
        if (at.length > 1) spans.push({ lane: { kind, sub: 0 }, top: at[0], bottom: at[at.length - 1], dashed: true });
    }

    const last = rows.length - 1;
    const layouts = rows.map((row, i): RowLayout => {
        const lines: RowLayout["lines"] = [{ lane: MAIN, segment: i === 0 ? "lower" : i === last ? "upper" : "full" }];
        for (const s of spans) {
            // Branch tips start their line at the node; a track also ends at its last node.
            if (i === s.top) lines.push({ lane: s.lane, segment: i === 0 ? "open" : "lower", dashed: s.dashed });
            else if (i > s.top && i < s.bottom) lines.push({ lane: s.lane, segment: "full", dashed: s.dashed });
            else if (s.dashed && i === s.bottom) lines.push({ lane: s.lane, segment: "upper", dashed: true });
        }

        const layout: RowLayout = { row, hash: shortHash(rowId(row)), lines };
        switch (row.type) {
            case "head":
            case "root":
                layout.node = { lane: MAIN, style: "ring" };
                break;
            case "tip":
                layout.kind = row.entry.kind;
                layout.node = { lane: lane.get(row.entry.id)!, style: "solid" };
                if (row.entry.end !== null) layout.curve = { lane: lane.get(row.entry.id)!, dir: "merge" };
                break;
            case "milestone":
                layout.kind = row.entry.kind;
                layout.node = { lane: lane.get(row.entry.id)!, style: "dot" };
                break;
            case "commit":
                layout.kind = row.entry.kind;
                layout.node = { lane: { kind: row.entry.kind, sub: 0 }, style: "solid" };
                break;
            case "fork":
                layout.kind = row.entry.kind;
                layout.node = { lane: MAIN, style: "dot" };
                layout.curve = { lane: lane.get(row.entry.id)!, dir: "fork" };
                break;
        }
        return layout;
    });

    const ongoing = branches.filter((b) => b.end === null);
    const open = Object.fromEntries([["all", ongoing.length], ...KINDS.map((k) => [k, ongoing.filter((b) => b.kind === k).length])]);
    return { rows: layouts, groups: KINDS.map((kind) => ({ kind, lanes: width.get(kind)! })), open } as Graph;
}
