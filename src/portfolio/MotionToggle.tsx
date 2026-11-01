"use client";
import { useLayoutEffect, useSyncExternalStore } from "react";
import { motionPaused, restoreMotionChoice, setMotionPaused, subscribeMotion } from "./motion";

export default function MotionToggle({ pauseLabel, playLabel }: { pauseLabel: string; playLabel: string }) {
    // Layout effects run before the hero canvas's effect, so a paused visitor never sees it start.
    useLayoutEffect(restoreMotionChoice, []);
    const paused = useSyncExternalStore(subscribeMotion, motionPaused, () => false);
    const label = paused ? playLabel : pauseLabel;
    return (
        <button
            type="button"
            onClick={() => setMotionPaused(!paused)}
            aria-pressed={paused}
            aria-label={label}
            title={label}
            className="fixed bottom-3 right-3 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 font-mono text-xs font-semibold tracking-wider text-white/80 shadow-lg backdrop-blur-md transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-cyan-300 sm:bottom-5 sm:right-5"
        >
            <span aria-hidden className="w-4 text-center">
                {paused ? "▶" : "❚❚"}
            </span>
            <span className="hidden sm:inline">{label}</span>
        </button>
    );
}
