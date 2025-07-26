'use client';

import { useCallback } from 'react';

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export const useGTM = () => {
  const pushToDataLayer = useCallback((data: any) => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push(data);
    }
  }, []);

  const trackEvent = useCallback((eventName: string, parameters: Record<string, any> = {}) => {
    pushToDataLayer({
      event: eventName,
      ...parameters,
    });
  }, [pushToDataLayer]);

  const trackPageView = useCallback((pageTitle: string, pageLocation: string) => {
    pushToDataLayer({
      event: 'page_view',
      page_title: pageTitle,
      page_location: pageLocation,
    });
  }, [pushToDataLayer]);

  return {
    pushToDataLayer,
    trackEvent,
    trackPageView,
  };
}; 