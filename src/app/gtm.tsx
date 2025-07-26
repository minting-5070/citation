'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export default function GoogleTagManager() {
  useEffect(() => {
    // GTM 스크립트 로드
    const loadGTM = () => {
      window.dataLayer = window.dataLayer || [];
      (function(w: any,d: any,s: any,l: any,i: any){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode?.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-THPN28M8');
      console.log('GTM 스크립트 로드됨');
    };

    // Google Analytics 스크립트 로드
    const loadGA = () => {
      const script1 = document.createElement('script') as HTMLScriptElement;
      script1.src = 'https://www.googletagmanager.com/gtag/js?id=G-ZDGZ5YPFFS';
      script1.async = true;
      document.head.appendChild(script1);
      
      script1.onload = () => {
        console.log('Google Analytics 스크립트 로드됨');
        
        const script2 = document.createElement('script') as HTMLScriptElement;
        script2.innerHTML = `
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-ZDGZ5YPFFS');
          console.log('Google Analytics 초기화됨');
        `;
        document.head.appendChild(script2);
      };
    };

    // 스크립트 로드
    loadGTM();
    loadGA();
  }, []);

  return null;
} 