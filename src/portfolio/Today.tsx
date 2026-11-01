"use client";
import { useSyncExternalStore } from "react";
import { formatMonth, type Locale } from "./i18n";

/** The visitor's local month (toISOString would give UTC, which lags behind east of Greenwich around midnight). */
const currentMonth = () => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
};
// The month doesn't need live updates while the page is open.
const subscribe = () => () => {};

/**
 * The current month. The page is pre-rendered, so the server HTML carries the build month;
 * after hydration it shows the visitor's month so it never goes stale.
 */
export default function Today({ buildMonth, locale }: { buildMonth: string; locale: Locale }) {
    const month = useSyncExternalStore(subscribe, currentMonth, () => buildMonth);
    return <time dateTime={month}>{formatMonth(month, locale)}</time>;
}
