'use client';

import { useCallback, useEffect, useRef } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const useGTM = () => {
  const sessionStartTime = useRef<number>(Date.now());
  const pageStartTime = useRef<number>(Date.now());
  const aiQueryCount = useRef<number>(0);
  const googleScholarClicks = useRef<number>(0);
  const citationClicks = useRef<number>(0);

  // 페이지 체류 시간 추적
  useEffect(() => {
    const handleBeforeUnload = () => {
      const sessionDuration = Date.now() - sessionStartTime.current;
      const pageDuration = Date.now() - pageStartTime.current;
      
      pushToDataLayer({
        event: 'session_end',
        session_duration_ms: sessionDuration,
        page_duration_ms: pageDuration,
        ai_query_count: aiQueryCount.current,
        google_scholar_clicks: googleScholarClicks.current,
        citation_clicks: citationClicks.current
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const pushToDataLayer = useCallback((data: any) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data);
      console.log('[GTM] Data pushed:', data);
    }
  }, []);

  const trackEvent = useCallback((eventName: string, parameters: Record<string, any> = {}) => {
    pushToDataLayer({
      event: eventName,
      ...parameters,
    });
  }, [pushToDataLayer]);

  const trackPageView = useCallback((pageTitle: string, pageLocation: string) => {
    pageStartTime.current = Date.now();
    pushToDataLayer({
      event: 'page_view',
      page_title: pageTitle,
      page_location: pageLocation,
    });
  }, [pushToDataLayer]);

  // AI 쿼리 추적 (강화된 버전)
  const trackAIQuery = useCallback(async (prompt: string, responseLength?: number) => {
    aiQueryCount.current += 1;
    
    // SHA-256 해시로 프롬프트 해시 생성
    const promptHash = await sha256Hex(prompt);
    
    pushToDataLayer({
      event: 'ai_query',
      prompt_hash: promptHash.slice(0, 16),
      prompt_length: prompt.length,
      prompt_preview: prompt.substring(0, 100),
      response_length: responseLength || 0,
      query_number: aiQueryCount.current,
      timestamp: new Date().toISOString()
    });
  }, [pushToDataLayer]);

  // AI 응답 추적
  const trackAIResponse = useCallback((response: string, promptHash: string) => {
    const citationCount = (response.match(/\[(\d+)\]/g) || []).length;
    const hasReferences = response.includes('참고문헌:') || response.includes('References:');
    
    pushToDataLayer({
      event: 'ai_response',
      prompt_hash: promptHash,
      response_length: response.length,
      citation_count: citationCount,
      has_references: hasReferences,
      timestamp: new Date().toISOString()
    });
  }, [pushToDataLayer]);

  // 출처 클릭 추적
  const trackCitationClick = useCallback((citationNumber: string, citationUrl: string, promptHash?: string) => {
    citationClicks.current += 1;
    
    pushToDataLayer({
      event: 'citation_click',
      citation_number: citationNumber,
      citation_url: citationUrl,
      prompt_hash: promptHash,
      click_number: citationClicks.current,
      timestamp: new Date().toISOString()
    });
  }, [pushToDataLayer]);

  // Google Scholar 이동 추적
  const trackGoogleScholarRedirect = useCallback((searchQuery: string, promptHash?: string) => {
    googleScholarClicks.current += 1;
    
    pushToDataLayer({
      event: 'google_scholar_redirect',
      search_query: searchQuery,
      prompt_hash: promptHash,
      redirect_number: googleScholarClicks.current,
      timestamp: new Date().toISOString()
    });
  }, [pushToDataLayer]);

  // 페이지 체류 시간 추적
  const trackTimeOnPage = useCallback(() => {
    const duration = Date.now() - pageStartTime.current;
    
    pushToDataLayer({
      event: 'time_on_page',
      duration_ms: duration,
      duration_seconds: Math.round(duration / 1000),
      timestamp: new Date().toISOString()
    });
  }, [pushToDataLayer]);

  // 세션 통계 추적
  const trackSessionStats = useCallback(() => {
    const sessionDuration = Date.now() - sessionStartTime.current;
    
    pushToDataLayer({
      event: 'session_stats',
      session_duration_ms: sessionDuration,
      session_duration_seconds: Math.round(sessionDuration / 1000),
      ai_query_count: aiQueryCount.current,
      google_scholar_clicks: googleScholarClicks.current,
      citation_clicks: citationClicks.current,
      timestamp: new Date().toISOString()
    });
  }, [pushToDataLayer]);

  return {
    pushToDataLayer,
    trackEvent,
    trackPageView,
    trackAIQuery,
    trackAIResponse,
    trackCitationClick,
    trackGoogleScholarRedirect,
    trackTimeOnPage,
    trackSessionStats,
    // 통계 getter
    getStats: () => ({
      aiQueryCount: aiQueryCount.current,
      googleScholarClicks: googleScholarClicks.current,
      citationClicks: citationClicks.current
    })
  };
};

// SHA-256 해시 함수
async function sha256Hex(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
} 