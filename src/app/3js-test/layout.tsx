import React from "react";
import "../globals.css";

// Separate root layout: the site's main root layout lives in [locale].
export default function TestLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body>{children}</body>
        </html>
    );
}
