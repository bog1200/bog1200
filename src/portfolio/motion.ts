// Global animation state, stored as <html data-motion="paused|playing">.
// No attribute means "follow the OS": paused when prefers-reduced-motion is set.
// An explicit choice from the toggle is remembered in localStorage and wins over the OS setting.

const KEY = "motion";
const EVENT = "motionchange";
const REDUCE = "(prefers-reduced-motion: reduce)";

/** Inlined in <head> so a stored choice applies before first paint (no flash of animation). */
export const motionInitScript = `try{var m=localStorage.getItem("${KEY}");if(m==="paused"||m==="playing")document.documentElement.dataset.motion=m}catch(e){}`;

/**
 * Re-applies the stored choice. Client-side navigation (e.g. switching language) re-renders <html>
 * without data-motion, and the head script only runs on full page loads.
 */
export function restoreMotionChoice() {
    let choice: string | null = null;
    try {
        choice = localStorage.getItem(KEY);
    } catch {
        return;
    }
    if ((choice === "paused" || choice === "playing") && document.documentElement.dataset.motion !== choice) {
        document.documentElement.dataset.motion = choice;
        window.dispatchEvent(new Event(EVENT));
    }
}

export function motionPaused(): boolean {
    const choice = document.documentElement.dataset.motion;
    return choice ? choice === "paused" : window.matchMedia(REDUCE).matches;
}

export function setMotionPaused(paused: boolean) {
    const choice = paused ? "paused" : "playing";
    document.documentElement.dataset.motion = choice;
    try {
        localStorage.setItem(KEY, choice);
    } catch {
        // Storage can be unavailable (private mode); the choice then lasts for this page only.
    }
    window.dispatchEvent(new Event(EVENT));
}

/** Calls `onChange` when the toggle is used or the OS reduced-motion setting changes. */
export function subscribeMotion(onChange: () => void): () => void {
    const query = window.matchMedia(REDUCE);
    window.addEventListener(EVENT, onChange);
    query.addEventListener("change", onChange);
    return () => {
        window.removeEventListener(EVENT, onChange);
        query.removeEventListener("change", onChange);
    };
}
