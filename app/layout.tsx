import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import WhatsAppWidget from "../components/WhatsAppWidget";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

// --- METADATA OFICIAL Y VISTA PREVIA PARA WHATSAPP / REDES ---
export const metadata: Metadata = {
  title: {
    default: "ANLUVIA Clinique & Wellness | Kinesiología & Estética Médica",
    template: "%s | ANLUVIA Clinique"
  },
  description: "Centro médico de alta resolución en Las Condes. Kinesiología avanzada, estética funcional, armonización facial y medicina preventiva integral.",
  keywords: [
    "ANLUVIA",
    "ANLUVIA Clinique",
    "Kinesiología Las Condes",
    "Estética Médica Santiago",
    "Rehabilitación Física",
    "Armonización Facial",
    "Reserva Médica Online"
  ],
  authors: [{ name: "ANLUVIA Clinique & Wellness" }],
  creator: "ANLUVIA",
  publisher: "ANLUVIA Clinique",
  metadataBase: new URL("https://anluvia-ecosystem.vercel.app"),

  // Vista Previa OpenGraph (WhatsApp, Instagram, Facebook, LinkedIn)
  openGraph: {
    title: "ANLUVIA Clinique & Wellness | Kinesiología & Estética Médica",
    description: "Agendas abiertas para atención médica personalizada, kinesiología de alta resolución y medicina estética en Las Condes.",
    url: "https://anluvia.cl",
    siteName: "ANLUVIA Clinique",
    images: [
      {
        url: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "ANLUVIA Clinique & Wellness"
      }
    ],
    locale: "es_CL",
    type: "website"
  },

  // Tarjeta para Twitter / X
  twitter: {
    card: "summary_large_image",
    title: "ANLUVIA Clinique & Wellness",
    description: "Centro médico de alta resolución en Las Condes. Kinesiología avanzada y estética médica.",
    images: ["https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&h=630&q=80"]
  },

  // Iconos del Navegador (Favicon)
  icons: {
    icon: "/favicon.ico"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
        <WhatsAppWidget />
      </body>
    </html>
  );
}