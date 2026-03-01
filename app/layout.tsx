import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import "./globals.css";

const titilliumWeb = Titillium_Web({
  weight: ["200", "300", "400", "600", "700", "900"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-titillium",
});

export const metadata: Metadata = {
  title: "Oncoactivate",
  description: "Plataforma de educación oncológica",
  icons: {
    icon: "/brand/icon-square.png",
    shortcut: "/brand/icon-square.png",
    apple: "/brand/icon-square.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${titilliumWeb.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
