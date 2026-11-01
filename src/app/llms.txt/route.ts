// /llms.txt (https://llmstxt.org): the portfolio as Markdown for LLMs and AI assistants.
// Generated from the same data as the site, so it never drifts. English only; no email address
// (contact goes through the form) and the residents' association stays as generic as on the site.
import type { NextRequest } from "next/server";
import { branches, commits, profile, type BranchEntry, type CommitEntry, type Kind, type Tag } from "@/portfolio/data";
import { KINDS } from "@/portfolio/graph";
import { disabledLocales, formatMonth, locales, ui } from "@/portfolio/i18n";
import { siteUrl } from "@/portfolio/site";

const t = ui.en;
const month = (ym: string) => formatMonth(ym, "en");
const tag = (x: Tag) => (typeof x === "string" ? x : x.en);

const sectionTitle: Record<Kind, string> = {
    EXP: "Experience",
    EDU: "Education",
    PRJ: "Projects",
    CERT: "Certifications",
    EVT: "Competitions and volunteering",
};
// Most relevant first for a reader skimming a profile.
const sectionOrder: Kind[] = ["EXP", "PRJ", "EDU", "EVT", "CERT"];

function branchEntry(e: BranchEntry): string {
    const where = [e.org, e.location?.en].filter(Boolean).join(", ");
    const lines = [`### ${e.title.en}`, [where, `${month(e.start)} – ${e.end ? month(e.end) : t.present}`].filter(Boolean).join(" · ")];
    lines.push(...e.bullets.map((b) => `- ${b.en}`));
    for (const m of e.milestones ?? []) lines.push(`- ${month(m.date)}: ${m.text.en}`);
    if (e.tags?.length) lines.push(`- Tags: ${e.tags.map(tag).join(", ")}`);
    for (const l of e.links ?? []) lines.push(`- [${l.label}](${l.href})`);
    return lines.join("\n");
}

function commitEntry(e: CommitEntry): string {
    const lines = [`### ${e.title.en}`, [e.org?.en, e.location?.en, month(e.date)].filter(Boolean).join(" · ")];
    lines.push(...(e.bullets ?? []).map((b) => `- ${b.en}`));
    if (e.tags?.length) lines.push(`- Tags: ${e.tags.map(tag).join(", ")}`);
    return lines.join("\n");
}

/** Newest first, ongoing entries on top: the same order as the site's git log. */
const byRecency = (a: BranchEntry, b: BranchEntry) => (b.end ?? "9999-99").localeCompare(a.end ?? "9999-99") || b.start.localeCompare(a.start);

export function GET(request: NextRequest) {
    // Outside Vercel there's no configured domain, so fall back to the URL this request came in on.
    const origin = siteUrl ?? request.nextUrl.origin;
    const pages = locales.filter((l) => !disabledLocales.has(l));
    const languageName: Record<string, string> = { en: "English", ro: "Romanian", se: "Swedish" };

    const sections = sectionOrder
        .filter((k) => KINDS.includes(k))
        .map((kind) => {
            const items = [
                ...branches.filter((b) => b.kind === kind).sort(byRecency).map(branchEntry),
                ...commits.filter((c) => c.kind === kind).map(commitEntry),
            ];
            return items.length ? `## ${sectionTitle[kind]}\n\n${items.join("\n\n")}` : "";
        })
        .filter(Boolean);

    const body = [
        `# ${profile.name}`,
        `> ${t.headline}. Based in ${t.location}.`,
        `This file summarises the portfolio at ${origin} for language models. The site shows the same information as an interactive git-log graph.`,
        [
            "## Links",
            "",
            ...pages.map((l) => `- [Portfolio (${languageName[l]})](${origin}/${l}): full CV as an interactive git-log graph`),
            ...KINDS.map((k) => `- [${sectionTitle[k]} only](${origin}/en?branches=${k}): the graph filtered to one category`),
            ...profile.remotes.map((r) => `- [${r.name === "github" ? "GitHub" : r.name === "linkedin" ? "LinkedIn" : r.name}](${r.href})`),
            `- [Contact form](${origin}/en#contact): the way to get in touch (no public email address)`,
        ].join("\n"),
        ...sections,
        `## Skills\n\n${profile.skills.map((s) => `- ${s.group}: ${s.items.map((i) => i.en).join(", ")}`).join("\n")}`,
        `## Languages\n\n${profile.languages.map((l) => `- ${l.name.en}: ${l.level === "native" ? "native" : l.level}`).join("\n")}`,
    ].join("\n\n");

    return new Response(`${body}\n`, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            // Only cache publicly when links use the configured domain, not the request's own host.
            "Cache-Control": siteUrl ? "public, max-age=3600" : "private, no-cache",
        },
    });
}
