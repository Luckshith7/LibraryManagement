import type { Metadata } from "next";
import { Newsreader, Manrope } from "next/font/google";
import "./globals.css";
import ToastManager from "./(components)/ToastManager";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lexicon | Community Library",
  description: "A public library and digital collection for borrowing books and sharing knowledge. Open to everyone.",
};

import AuthHandler from "./(components)/AuthHandler";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-primary selection:text-on-primary">
        <div className={`${newsreader.variable} ${manrope.variable} min-h-screen`}>
          <AuthHandler />
          {children}
          <ToastManager />
        </div>
      </body>
    </html>
  );
}
