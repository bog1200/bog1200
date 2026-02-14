"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";

const AuroraCanvas = dynamic(() => import("@/components/AuroraCanvas"), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-gradient-to-b from-emerald-500/10 via-purple-500/5 to-transparent" />,
});

export default function Home() {
    return (
        <main className="relative min-h-screen bg-[#05020c] text-rose-100 antialiased">
            <section className="relative isolate overflow-hidden pb-24 pt-16 sm:pt-28">
                <div className="absolute inset-x-0 top-0 h-[60vh] min-h-[360px] max-h-[520px]">
                    <Suspense>
                        <AuroraCanvas />
                    </Suspense>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent via-[#05020c]/70 to-[#05020c]" />
                    <div className="aurora-grain" />
                </div>

                <div className="relative z-10 mx-auto flex max-w-3xl justify-center px-6">
                    <div className="w-full rounded-xl border border-pink-500/40 bg-[#140522]/70 shadow-[0_0_70px_rgba(236,72,153,0.25)] backdrop-blur-2xl">
                        <div className="flex items-center gap-2 border-b border-pink-500/30 px-5 py-3 text-rose-200/80">
                            <span className="h-3 w-3 rounded-full bg-rose-400/80" />
                            <span className="h-3 w-3 rounded-full bg-amber-300/80" />
                            <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
                            <span className="ml-auto font-mono text-xs uppercase tracking-[0.35em]">~/intro</span>
                        </div>
                        <div className="space-y-3 px-6 py-8 text-sm leading-relaxed text-rose-100/90 sm:px-8">
                            <p className="font-light text-rose-100/90">
                                Hey! I&apos;m <span className="font-semibold text-rose-200">Alex Bogdan</span>, a full-stack engineer crafting
                                resilient experiences with a curious mind and a love for vibrant interfaces.
                            </p>
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-pink-300/70">
                                scroll to continue ▾
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="introduction" className="relative z-10 mx-auto max-w-4xl space-y-6 px-6 pb-16 text-base leading-relaxed text-rose-100/90">
                <h1 className="font-mono text-lg text-rose-200 sm:text-xl">~ Introduction</h1>
                <p className="font-light text-rose-100/90">
                    I’m <span className="font-semibold text-rose-200">Alex Bogdan</span>, a full-stack developer who thrives on blending
                    immersive storytelling with principled engineering. I build interfaces that feel alive—grounded in good UX, powered by
                    strong systems thinking, and sustained by collaborative teams.
                </p>
                <p className="font-light text-rose-100/80">
                    When I’m not iterating on design systems or mentoring engineers, you’ll catch me chasing auroras with a camera in hand,
                    experimenting with ambient soundscapes, or perfecting a cup of slow-pour coffee.
                </p>
            </section>

            <section id="serious" className="relative z-10 mx-auto max-w-4xl space-y-6 px-6 pb-16">
                <h2 className="font-mono text-lg text-rose-200 sm:text-xl">~ Serious Stuff</h2>
                <div className="grid gap-8 rounded-2xl border border-pink-500/25 bg-[#140522]/40 p-8 backdrop-blur">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-pink-300/90">Recent Work</h3>
                            <ul className="space-y-3 font-light text-rose-100/80">
                                <li>
                                    → Lead engineer for a real-time analytics suite processing millions of events per day with{' '}
                                    <span className="font-semibold text-rose-200">Next.js</span>,{' '}
                                    <span className="font-semibold text-rose-200">WebSockets</span>, and{' '}
                                    <span className="font-semibold text-rose-200">serverless</span> infrastructure.
                                </li>
                                <li>
                                    → Built a design system adopted across five product teams, reducing UI defects by 60% and speeding up
                                    delivery timelines.
                                </li>
                                <li>
                                    → Championed accessibility audits that increased compliance scores by 30% across flagship experiences.
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-pink-300/90">Skills Snapshot</h3>
                            <ul className="grid grid-cols-2 gap-3 font-light text-rose-100/80">
                                <li>TypeScript</li>
                                <li>React / Next.js</li>
                                <li>Node.js</li>
                                <li>Systems Design</li>
                                <li>Accessible UX</li>
                                <li>Team Leadership</li>
                                <li>Design Systems</li>
                                <li>Product Strategy</li>
                            </ul>
                        </div>
                    </div>
                    <p className="font-light text-rose-100/75">
                        Currently open to senior engineering roles, creative collaborations, and ambitious product builds that need a thoughtful
                        technical partner.
                    </p>
                </div>
            </section>

            <section id="random" className="relative z-10 mx-auto max-w-4xl space-y-6 px-6 pb-20">
                <h2 className="font-mono text-lg text-rose-200 sm:text-xl">~ Random Stuff</h2>
                <div className="rounded-2xl border border-pink-500/15 bg-[#160524]/35 p-8 backdrop-blur-sm">
                    <ul className="space-y-3 font-light text-rose-100/80">
                        <li>→ Amateur astrophotographer with a soft spot for aurora chasing—hence the vibe.</li>
                        <li>→ Collector of vintage keyboards that make satisfying clicks during late-night coding sessions.</li>
                        <li>→ Can whip up a mean ramen broth and pair it with a playlist of glitchy ambient beats.</li>
                    </ul>
                </div>
                <footer className="border-t border-pink-500/25 pt-6 font-mono text-xs uppercase tracking-[0.25em] text-pink-300/70">
                    <p>Last updated: {new Date().getFullYear()} · alex@bogdan.dev · /dev/curiosity</p>
                </footer>
            </section>
        </main>
    );
}
