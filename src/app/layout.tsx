import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import {Henny_Penny} from "next/font/google";



export const metadata: Metadata = {
  title: "Romail.app",
  description: "Romail.app",
};

const font = Henny_Penny({
    weight: "400",
    variable: "--font-henny-penny",
    subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${font.variable} bg-white text-black`}
      >
        {children}
      </body>
    </html>
  );
}
