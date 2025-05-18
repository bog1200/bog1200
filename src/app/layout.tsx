import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import localFont  from 'next/font/local'


export const metadata: Metadata = {
  title: "Romail.app",
  description: "Romail.app",
};

const nebulaSans = localFont({
    src: [
        { path: './fonts/NebulaSans-Black.woff2', weight: '900', style: 'normal' },
        { path: './fonts/NebulaSans-BlackItalic.woff2', weight: '900', style: 'italic' },
        { path: './fonts/NebulaSans-Bold.woff2', weight: '700', style: 'normal' },
        { path: './fonts/NebulaSans-BoldItalic.woff2', weight: '700', style: 'italic' },
        { path: './fonts/NebulaSans-Book.woff2', weight: '400', style: 'normal' },
        { path: './fonts/NebulaSans-BookItalic.woff2', weight: '400', style: 'italic' },
        { path: './fonts/NebulaSans-Light.woff2', weight: '300', style: 'normal' },
        { path: './fonts/NebulaSans-LightItalic.woff2', weight: '300', style: 'italic' },
        { path: './fonts/NebulaSans-Medium.woff2', weight: '500', style: 'normal' },
        { path: './fonts/NebulaSans-MediumItalic.woff2', weight: '500', style: 'italic' },
        { path: './fonts/NebulaSans-Semibold.woff2', weight: '600', style: 'normal' },
        { path: './fonts/NebulaSans-SemiboldItalic.woff2', weight: '600', style: 'italic' },
    ],
    variable: '--font-nebula-sans',
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${nebulaSans.variable} bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}
