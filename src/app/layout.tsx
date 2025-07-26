import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import GoogleTagManager from "./components/GoogleTagManager";
import GTMChecker from "./components/GTMChecker";

const GTM_ID = 'GTM-THPN28M8';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Jung's Research Assistant",
  description: "논문 검색, 요약, 인용, 참고문헌 정리 등 리서치에 특화된 AI 어시스턴트",
  keywords: ["논문", "리서치", "AI", "Research Assistant", "논문 검색", "논문 요약", "참고문헌"],
  authors: [{ name: "Jung's Research Assistant" }],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* Google Tag Manager - Head */}
        <Script
          id="gtm-head"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${GTM_ID}');
              console.log('GTM Head 스크립트 로드됨 - ID: ${GTM_ID}');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Google Tag Manager - Body */}
        <GoogleTagManager />
        <GTMChecker />
        
        {children}
      </body>
    </html>
  );
}
