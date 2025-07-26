# Google Tag Manager (GTM) Implementation Guide

## 개요
이 프로젝트에는 Google Tag Manager (GTM)가 성공적으로 구현되어 있습니다. GTM ID: `GTM-THPN28M8`

## 구현된 파일들

### 1. GTM 컴포넌트
- **파일**: `src/app/components/GoogleTagManager.tsx`
- **기능**: GTM 스크립트와 noscript 태그를 렌더링
- **전략**: `afterInteractive` - 페이지가 인터랙티브된 후 로드

### 2. GTM 훅
- **파일**: `src/app/hooks/useGTM.ts`
- **기능**: 이벤트 추적을 위한 커스텀 훅
- **제공 함수**:
  - `trackEvent(eventName, parameters)`: 커스텀 이벤트 추적
  - `trackPageView(pageTitle, pageLocation)`: 페이지뷰 추적
  - `pushToDataLayer(data)`: 직접 dataLayer에 데이터 푸시

### 3. 레이아웃 통합
- **파일**: `src/app/layout.tsx`
- **통합**: GoogleTagManager 컴포넌트를 body 시작 부분에 배치

## 사용 방법

### 기본 이벤트 추적
```typescript
import { useGTM } from '@/app/hooks/useGTM';

function MyComponent() {
  const { trackEvent } = useGTM();

  const handleClick = () => {
    trackEvent('button_click', {
      button_name: 'submit_button',
      page: 'homepage'
    });
  };

  return <button onClick={handleClick}>클릭</button>;
}
```

### 페이지뷰 추적
```typescript
import { useGTM } from '@/app/hooks/useGTM';
import { useEffect } from 'react';

function MyPage() {
  const { trackPageView } = useGTM();

  useEffect(() => {
    trackPageView('페이지 제목', window.location.href);
  }, [trackPageView]);

  return <div>페이지 내용</div>;
}
```

## 테스트

### 1. 자동화된 테스트
```bash
node test-gtm-automated.js
```

### 2. 수동 테스트
- 브라우저에서 `http://localhost:3000/test-gtm` 방문
- GTM 디버거 확장 프로그램 설치
- 이벤트 추적 확인

### 3. GTM 디버거 사용
1. Chrome 웹스토어에서 "Google Tag Manager" 확장 프로그램 설치
2. 웹사이트에서 디버거 활성화
3. 이벤트 발생 시 실시간으로 추적 확인

## 확인된 기능

✅ GTM 스크립트 정상 로드  
✅ DataLayer 초기화  
✅ 페이지뷰 자동 추적  
✅ 커스텀 이벤트 추적  
✅ Google Analytics 연동  

## 주의사항

1. **개발 환경**: `http://localhost:3000`에서 정상 작동 확인
2. **프로덕션 환경**: 배포 후 GTM에서 태그가 제대로 작동하는지 확인 필요
3. **개인정보**: 민감한 사용자 정보는 추적하지 않도록 주의

## 문제 해결

### GTM이 로드되지 않는 경우
1. 브라우저 개발자 도구에서 네트워크 탭 확인
2. `googletagmanager.com` 요청이 있는지 확인
3. 콘솔에서 오류 메시지 확인

### 이벤트가 추적되지 않는 경우
1. GTM 디버거로 이벤트 발생 확인
2. DataLayer에 데이터가 푸시되는지 확인
3. GTM에서 트리거와 태그 설정 확인 