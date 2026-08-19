import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "700"],
});

export const metadata: Metadata = {
  title: "TrabalhaRN — Vagas de emprego no Rio Grande do Norte",
  description:
    "Vagas de emprego reais em Natal, Mossoró, Parnamirim e em todo o Rio Grande do Norte, atualizadas direto das empresas parceiras.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col" cz-shortcut-listen="false">{children}</body>
    </html>
  );
}
