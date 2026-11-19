import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "КОСМО-ХЛАМ — кооператив для 1 экрана и 4 телефонов",
  description:
    "Пати-игра: экипаж разваливающегося космического грузовика. Экран показывает корабль, телефоны — это пульты управления.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#04060e",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body className="bg-[#04060e] font-term text-slate-200 antialiased">
        {children}
      </body>
    </html>
  );
}
