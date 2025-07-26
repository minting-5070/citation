'use client';

import { useEffect } from 'react';

const GTM_ID = 'GTM-THPN28M8';

export default function GTMChecker() {
  useEffect(() => {
    // GTM 로드 확인
    const checkGTM = () => {
      console.log('🔍 GTM 상태 확인 중...');
      
      // dataLayer 확인
      if (typeof window !== 'undefined' && window.dataLayer) {
        console.log('✅ dataLayer 존재:', window.dataLayer);
        console.log('📊 dataLayer 길이:', window.dataLayer.length);
      } else {
        console.log('❌ dataLayer 없음');
      }
      
      // GTM 스크립트 확인
      const gtmScripts = document.querySelectorAll('script[src*="googletagmanager.com"]');
      console.log('🔍 GTM 스크립트 수:', gtmScripts.length);
      
      gtmScripts.forEach((script, index) => {
        const scriptElement = script as HTMLScriptElement;
        console.log(`  ${index + 1}. ${scriptElement.src}`);
      });
      
      // GTM ID 확인
      const gtmContainer = document.querySelector(`iframe[src*="${GTM_ID}"]`);
      if (gtmContainer) {
        console.log('✅ GTM noscript iframe 발견');
      } else {
        console.log('❌ GTM noscript iframe 없음');
      }
      
      // 페이지뷰 이벤트 푸시
      if (typeof window !== 'undefined' && window.dataLayer) {
        window.dataLayer.push({
          event: 'page_view',
          page_title: document.title,
          page_location: window.location.href,
          gtm_id: GTM_ID
        });
        console.log('📊 페이지뷰 이벤트 푸시됨');
      }
    };
    
    // 페이지 로드 후 확인
    setTimeout(checkGTM, 1000);
    
    // 3초 후 다시 확인
    setTimeout(checkGTM, 3000);
    
  }, []);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
} 