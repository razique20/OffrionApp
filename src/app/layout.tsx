import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ConditionalNavFooter } from "@/components/ConditionalNavFooter";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Offrion | Local deals that bring in real customers",
  description: "Offrion connects local businesses with the apps people already use. Merchants pay only for real visits; partner apps reward users and earn 70% on every redemption.",
  keywords: ["local deals", "merchant offers", "partner api", "deal redemption", "offrion"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="font-sans min-h-full flex flex-col">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ConditionalNavFooter>
            {children}
          </ConditionalNavFooter>
        </ThemeProvider>
      </body>
    </html>
  );
}
