import localFont from "next/font/local";

export const nebulaSans = localFont({
    src: [
        { path: "../app/fonts/NebulaSans-Black.woff2", weight: "900", style: "normal" },
        { path: "../app/fonts/NebulaSans-BlackItalic.woff2", weight: "900", style: "italic" },
        { path: "../app/fonts/NebulaSans-Bold.woff2", weight: "700", style: "normal" },
        { path: "../app/fonts/NebulaSans-BoldItalic.woff2", weight: "700", style: "italic" },
        { path: "../app/fonts/NebulaSans-Book.woff2", weight: "400", style: "normal" },
        { path: "../app/fonts/NebulaSans-BookItalic.woff2", weight: "400", style: "italic" },
        { path: "../app/fonts/NebulaSans-Light.woff2", weight: "300", style: "normal" },
        { path: "../app/fonts/NebulaSans-LightItalic.woff2", weight: "300", style: "italic" },
        { path: "../app/fonts/NebulaSans-Medium.woff2", weight: "500", style: "normal" },
        { path: "../app/fonts/NebulaSans-MediumItalic.woff2", weight: "500", style: "italic" },
        { path: "../app/fonts/NebulaSans-Semibold.woff2", weight: "600", style: "normal" },
        { path: "../app/fonts/NebulaSans-SemiboldItalic.woff2", weight: "600", style: "italic" },
    ],
    variable: "--font-nebula-sans",
});
