import type { Metadata } from "next";
import { Be_Vietnam_Pro, Patrick_Hand, Lato } from "next/font/google";
import "./globals.css";

const bvp = Be_Vietnam_Pro({
  variable: "--font-bvp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
const patrick = Patrick_Hand({
  variable: "--font-patrick",
  subsets: ["latin"],
  weight: ["400"],
});
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Fetch — Pet insurance that actually shows up",
  description: "A redesign concept of Fetch's pet insurance onboarding by Gautham Srinivas.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bvp.variable} ${patrick.variable} ${lato.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
