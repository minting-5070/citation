'use client';

import { useGTM } from '../hooks/useGTM';
import { useEffect } from 'react';

export default function TestGTMPage() {
  const { trackEvent, trackPageView } = useGTM();

  useEffect(() => {
    // Track page view when component mounts
    trackPageView('GTM Test Page', window.location.href);
  }, [trackPageView]);

  const handleButtonClick = () => {
    trackEvent('button_click', {
      button_name: 'test_button',
      page: 'gtm_test_page'
    });
    alert('Event tracked! Check GTM debugger.');
  };

  const handleFormSubmit = () => {
    trackEvent('form_submit', {
      form_name: 'test_form',
      page: 'gtm_test_page'
    });
    alert('Form submit event tracked!');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          GTM 테스트 페이지
        </h1>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-blue-900 mb-2">
              이벤트 추적 테스트
            </h2>
            <p className="text-blue-700 text-sm mb-4">
              아래 버튼들을 클릭하여 GTM 이벤트 추적을 테스트해보세요.
            </p>
            
            <button
              onClick={handleButtonClick}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              버튼 클릭 이벤트 추적
            </button>
          </div>

          <div className="bg-green-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-green-900 mb-2">
              폼 제출 이벤트 추적
            </h2>
            <p className="text-green-700 text-sm mb-4">
              폼 제출 이벤트를 시뮬레이션합니다.
            </p>
            
            <button
              onClick={handleFormSubmit}
              className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              폼 제출 이벤트 추적
            </button>
          </div>

          <div className="bg-yellow-50 p-4 rounded-md">
            <h2 className="text-lg font-semibold text-yellow-900 mb-2">
              GTM 디버거 확인
            </h2>
            <p className="text-yellow-700 text-sm">
              브라우저에서 GTM 디버거를 열어 이벤트가 제대로 추적되는지 확인하세요.
            </p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <a
            href="/"
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            ← 메인 페이지로 돌아가기
          </a>
        </div>
      </div>
    </div>
  );
} 