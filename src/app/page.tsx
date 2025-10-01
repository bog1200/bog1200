"use client";

export default function Home() {
    return (
        <main className="relative min-h-screen bg-slate-950 text-emerald-100 antialiased">
            <section className="relative isolate overflow-hidden pb-24 pt-16 sm:pt-28">
                <div className="absolute inset-x-0 top-0 h-[60vh] min-h-[360px] max-h-[520px]">
                    <div className="aurora aurora-one" />
                    <div className="aurora aurora-two" />
                    <div className="aurora aurora-three" />
                    <div className="aurora-fade" />
                </div>

                <div className="relative z-10 mx-auto flex max-w-3xl justify-center px-6">
                    <div className="w-full rounded-xl border border-emerald-500/40 bg-slate-900/70 shadow-[0_0_70px_rgba(16,185,129,0.25)] backdrop-blur-2xl">
                        <div className="flex items-center gap-2 border-b border-emerald-500/30 px-5 py-3 text-emerald-200/80">
                            <span className="h-3 w-3 rounded-full bg-red-400/80" />
                            <span className="h-3 w-3 rounded-full bg-yellow-300/80" />
                            <span className="h-3 w-3 rounded-full bg-green-400/80" />
                            <span className="ml-auto font-mono text-xs uppercase tracking-[0.35em]">~/intro</span>
                        </div>
                        <div className="space-y-3 px-6 py-8 text-sm leading-relaxed text-emerald-100/90 sm:px-8">
                            <p className="font-light text-emerald-100/90">
                                Hey! I&apos;m <span className="font-semibold text-emerald-200">Alex Bogdan</span>, a full-stack engineer crafting
                                resilient experiences with a curious mind and a love for vibrant interfaces.
                            </p>
                            <p className="font-mono text-xs uppercase tracking-[0.3em] text-emerald-300/70">
                                scroll to continue ▾
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            <section id="introduction" className="relative z-10 mx-auto max-w-4xl space-y-6 px-6 pb-16 text-base leading-relaxed text-emerald-100/90">
                <h1 className="font-mono text-lg text-emerald-200 sm:text-xl">~ Introduction</h1>
                <p className="font-light text-emerald-100/90">
                    I’m <span className="font-semibold text-emerald-200">Alex Bogdan</span>, a full-stack developer who thrives on blending
                    immersive storytelling with principled engineering. I build interfaces that feel alive—grounded in good UX, powered by
                    strong systems thinking, and sustained by collaborative teams.
                </p>
                <p className="font-light text-emerald-100/80">
                    When I’m not iterating on design systems or mentoring engineers, you’ll catch me chasing auroras with a camera in hand,
                    experimenting with ambient soundscapes, or perfecting a cup of slow-pour coffee.
                </p>
            </section>

            <section id="serious" className="relative z-10 mx-auto max-w-4xl space-y-6 px-6 pb-16">
                <h2 className="font-mono text-lg text-emerald-200 sm:text-xl">~ Serious Stuff</h2>
                <div className="grid gap-8 rounded-2xl border border-emerald-500/20 bg-slate-900/40 p-8 backdrop-blur">
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300/90">Recent Work</h3>
                            <ul className="space-y-3 font-light text-emerald-100/80">
                                <li>
                                    → Lead engineer for a real-time analytics suite processing millions of events per day with{' '}
                                    <span className="font-semibold text-emerald-200">Next.js</span>,{' '}
                                    <span className="font-semibold text-emerald-200">WebSockets</span>, and{' '}
                                    <span className="font-semibold text-emerald-200">serverless</span> infrastructure.
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
                            <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300/90">Skills Snapshot</h3>
                            <ul className="grid grid-cols-2 gap-3 font-light text-emerald-100/80">
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
                    <p className="font-light text-emerald-100/75">
                        Currently open to senior engineering roles, creative collaborations, and ambitious product builds that need a thoughtful
                        technical partner.
                    </p>
                </div>
            </section>

            <section id="random" className="relative z-10 mx-auto max-w-4xl space-y-6 px-6 pb-20">
                <h2 className="font-mono text-lg text-emerald-200 sm:text-xl">~ Random Stuff</h2>
                <div className="rounded-2xl border border-emerald-500/10 bg-slate-900/30 p-8 backdrop-blur-sm">
                    <ul className="space-y-3 font-light text-emerald-100/80">
                        <li>→ Amateur astrophotographer with a soft spot for aurora chasing—hence the vibe.</li>
                        <li>→ Collector of vintage keyboards that make satisfying clicks during late-night coding sessions.</li>
                        <li>→ Can whip up a mean ramen broth and pair it with a playlist of glitchy ambient beats.</li>
                    </ul>
                </div>
                <footer className="border-t border-emerald-500/20 pt-6 font-mono text-xs uppercase tracking-[0.25em] text-emerald-300/70">
                    <p>Last updated: {new Date().getFullYear()} · alex@bogdan.dev · /dev/curiosity</p>
                </footer>
            </section>
        </main>
    );
}
