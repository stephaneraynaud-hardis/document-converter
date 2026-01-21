import Favicon from "@/common/favicon.svg";
import { Open_Sans } from "next/font/google";
import "./globals.css";

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        <title>Convertisseur de documents</title>
        <link rel="icon" href={Favicon.src} sizes="any" />
        <script src="/f522a40171.js" crossOrigin="anonymous" async></script>
      </head>
      <body className={`${openSans.variable}`}>
        <main>{children}</main>
      </body>
    </html>
  );
}
