// Contact form endpoint: validates, filters spam, then forwards the message to a private Discord webhook.
// Secrets stay server-side (never NEXT_PUBLIC_): DISCORD_WEBHOOK_URL and TURNSTILE_SECRET_KEY.
import { NextResponse, type NextRequest } from "next/server";

const LIMITS = { name: 100, email: 200, message: 4000, minMessage: 10 };
/** Humans take a few seconds to write a message; instant submissions are bots. */
const MIN_FILL_MS = 3000;
const RATE = { max: 5, windowMs: 10 * 60 * 1000 };

// Cloudflare's documented test secret (always passes), so local development works without real keys.
const TURNSTILE_TEST_SECRET = "1x0000000000000000000000000000000AA";

// In-memory, per server instance: good enough to slow down a bot hammering one portfolio form.
const recent = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
    const now = Date.now();
    const hits = (recent.get(ip) ?? []).filter((t) => now - t < RATE.windowMs);
    hits.push(now);
    recent.set(ip, hits);
    if (recent.size > 5000) recent.clear(); // Don't let the map grow without bound.
    return hits.length > RATE.max;
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY ?? (process.env.NODE_ENV === "production" ? undefined : TURNSTILE_TEST_SECRET);
    if (!secret || !token) return false;
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
        method: "POST",
        body: new URLSearchParams({ secret, response: token, remoteip: ip }),
    });
    const data = (await res.json().catch(() => null)) as { success?: boolean } | null;
    return data?.success === true;
}

const error = (code: string, status: number) => NextResponse.json({ error: code }, { status });

export async function POST(request: NextRequest) {
    const webhook = process.env.DISCORD_WEBHOOK_URL;
    if (!webhook) return error("not-configured", 500);

    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return error("invalid", 400);
    const field = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim() : "");
    const name = field("name");
    const email = field("email");
    const message = field("message");
    const locale = field("locale").slice(0, 5);

    // Honeypot and timing: answer "ok" so bots don't learn they were caught.
    const startedAt = Number(body.startedAt);
    if (field("website") || !Number.isFinite(startedAt) || Date.now() - startedAt < MIN_FILL_MS) {
        return NextResponse.json({ ok: true });
    }

    if (
        !name ||
        name.length > LIMITS.name ||
        email.length > LIMITS.email ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
        message.length < LIMITS.minMessage ||
        message.length > LIMITS.message
    ) {
        return error("invalid", 400);
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0].trim() || request.headers.get("x-real-ip") || "unknown";
    if (rateLimited(ip)) return error("rate-limited", 429);
    if (!(await verifyTurnstile(field("token"), ip))) return error("captcha", 403);

    const res = await fetch(webhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: "Portfolio contact",
            // Never let form input ping @everyone, roles or users.
            allowed_mentions: { parse: [] },
            embeds: [
                {
                    title: `Message from ${name}`.slice(0, 256),
                    description: message,
                    color: 0x22d3ee,
                    fields: [
                        { name: "Reply to", value: email, inline: true },
                        { name: "Site language", value: locale || "?", inline: true },
                    ],
                    timestamp: new Date().toISOString(),
                },
            ],
        }),
    });
    if (!res.ok) return error("delivery", 502);
    return NextResponse.json({ ok: true });
}
