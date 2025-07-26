# Google Tag Manager (GTM) Implementation Guide

## 개요
이 프로젝트에는 Google Tag Manager (GTM)가 성공적으로 구현되어 있습니다. GTM ID: `GTM-THPN28M8`

## 구현된 추적 기능

### 1. 기본 추적
- **페이지뷰 추적**: 사용자가 페이지에 방문할 때마다 추적
- **세션 추적**: 사용자의 세션 시작/종료 시간 추적
- **페이지 체류 시간**: 5분마다 자동으로 체류 시간 추적

### 2. AI 상호작용 추적
- **AI 쿼리 추적**: 사용자가 AI에게 질문할 때마다 추적
  - 프롬프트 해시 (SHA-256, 16자리)
  - 프롬프트 길이
  - 프롬프트 미리보기 (처음 100자)
  - 쿼리 번호 (세션 내 순서)
  - 타임스탬프
- **AI 응답 추적**: AI가 응답을 완료할 때 추적
  - 응답 길이
  - 인용 개수
  - 참고문헌 포함 여부
  - 타임스탬프

### 3. 출처 및 참고문헌 추적
- **출처 클릭 추적**: 사용자가 AI 응답의 출처 링크를 클릭할 때 추적
  - 인용 번호
  - 출처 URL
  - 클릭 순서
  - 타임스탬프

### 4. Google Scholar 연동 추적
- **Google Scholar 이동 추적**: 사용자가 Google Scholar로 이동할 때 추적
  - 검색 쿼리
  - 이동 순서
  - 타임스탬프

### 5. 세션 통계 추적
- **세션 종료 시 통계**: 사용자가 페이지를 떠날 때 전체 통계 추적
  - 총 AI 쿼리 수
  - 총 Google Scholar 클릭 수
  - 총 출처 클릭 수
  - 세션 지속 시간

## 구현된 파일들

### 1. GTM 컴포넌트
- **파일**: `src/app/components/GoogleTagManager.tsx`
- **기능**: GTM 스크립트와 noscript 태그를 렌더링
- **전략**: `beforeInteractive` - 페이지가 인터랙티브되기 전에 로드

### 2. GTM 훅 (강화된 버전)
- **파일**: `src/app/hooks/useGTM.ts`
- **기능**: 모든 추적 기능을 제공하는 커스텀 훅
- **제공 함수**:
  - `trackEvent(eventName, parameters)`: 커스텀 이벤트 추적
  - `trackPageView(pageTitle, pageLocation)`: 페이지뷰 추적
  - `trackAIQuery(prompt, responseLength?)`: AI 쿼리 추적
  - `trackAIResponse(response, promptHash)`: AI 응답 추적
  - `trackCitationClick(citationNumber, citationUrl, promptHash?)`: 출처 클릭 추적
  - `trackGoogleScholarRedirect(searchQuery, promptHash?)`: Google Scholar 이동 추적
  - `trackTimeOnPage()`: 페이지 체류 시간 추적
  - `trackSessionStats()`: 세션 통계 추적
  - `getStats()`: 현재 세션 통계 조회

### 3. 메인 페이지 통합
- **파일**: `src/app/page.tsx`
- **통합**: 모든 GTM 추적 기능이 메인 페이지에 통합됨
- **추가 기능**: Google Scholar 검색 버튼

### 4. 채팅 메시지 컴포넌트
- **파일**: `src/app/components/ChatMessages.tsx`
- **기능**: 출처 클릭과 Google Scholar 링크 클릭 추적
- **추가 기능**: Google Scholar 링크 자동 감지 및 처리

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

### AI 쿼리 추적
```typescript
import { useGTM } from '@/app/hooks/useGTM';

function ChatComponent() {
  const { trackAIQuery } = useGTM();

  const handleSubmit = async (prompt: string) => {
    await trackAIQuery(prompt);
    // AI API 호출
  };
}
```

### 출처 클릭 추적
```typescript
import { useGTM } from '@/app/hooks/useGTM';

function ChatMessages() {
  const { trackCitationClick } = useGTM();

  const handleCitationClick = (citationNumber: string, citationUrl: string) => {
    trackCitationClick(citationNumber, citationUrl);
  };
}
```

## 추적되는 이벤트 목록

### 1. `page_view`
- 페이지 제목과 URL 추적
- 페이지 로드 시 자동 발생

### 2. `ai_query`
- 사용자가 AI에게 질문할 때 발생
- 프롬프트 해시, 길이, 미리보기 포함

### 3. `ai_response`
- AI가 응답을 완료할 때 발생
- 응답 길이, 인용 개수, 참고문헌 포함 여부

### 4. `citation_click`
- 사용자가 출처 링크를 클릭할 때 발생
- 인용 번호, URL, 클릭 순서 포함

### 5. `google_scholar_redirect`
- 사용자가 Google Scholar로 이동할 때 발생
- 검색 쿼리, 이동 순서 포함

### 6. `time_on_page`
- 5분마다 자동으로 발생
- 페이지 체류 시간 포함

### 7. `session_end`
- 사용자가 페이지를 떠날 때 발생
- 전체 세션 통계 포함

### 8. `session_stats`
- 채팅 초기화 시 발생
- 현재 세션 통계 포함

## GTM 설정 가이드

### 1. 트리거 설정
각 이벤트에 대해 다음과 같은 트리거를 설정하세요:

- **AI Query Trigger**: `ai_query` 이벤트
- **AI Response Trigger**: `ai_response` 이벤트
- **Citation Click Trigger**: `citation_click` 이벤트
- **Google Scholar Redirect Trigger**: `google_scholar_redirect` 이벤트
- **Time on Page Trigger**: `time_on_page` 이벤트
- **Session End Trigger**: `session_end` 이벤트

### 2. 태그 설정
각 트리거에 대해 Google Analytics 4 태그를 설정하세요:

```javascript
// AI Query Tag
{
  event_name: 'ai_query',
  custom_parameters: {
    prompt_hash: '{{DLV - prompt_hash}}',
    prompt_length: '{{DLV - prompt_length}}',
    query_number: '{{DLV - query_number}}'
  }
}

// Citation Click Tag
{
  event_name: 'citation_click',
  custom_parameters: {
    citation_number: '{{DLV - citation_number}}',
    citation_url: '{{DLV - citation_url}}',
    click_number: '{{DLV - click_number}}'
  }
}
```

### 3. 변수 설정
Data Layer에서 다음 변수들을 추출하세요:

- `prompt_hash`
- `prompt_length`
- `prompt_preview`
- `response_length`
- `citation_count`
- `citation_number`
- `citation_url`
- `search_query`
- `session_duration_ms`
- `ai_query_count`
- `google_scholar_clicks`
- `citation_clicks`

## 테스트

### 1. 자동화된 테스트
```bash
node test-gtm-automated.js
```

### 2. 수동 테스트
- 브라우저에서 `http://localhost:3000` 방문
- GTM 디버거 확장 프로그램 설치
- AI에게 질문하고 응답 확인
- 출처 링크 클릭 테스트
- Google Scholar 버튼 클릭 테스트

### 3. GTM 디버거 사용
1. Chrome 웹스토어에서 "Google Tag Manager" 확장 프로그램 설치
2. 웹사이트에서 디버거 활성화
3. 이벤트 발생 시 실시간으로 추적 확인

## 확인된 기능

✅ GTM 스크립트 정상 로드  
✅ DataLayer 초기화  
✅ 페이지뷰 자동 추적  
✅ AI 쿼리/응답 추적  
✅ 출처 클릭 추적  
✅ Google Scholar 이동 추적  
✅ 페이지 체류 시간 추적  
✅ 세션 통계 추적  
✅ Google Analytics 연동  

## 주의사항

1. **개발 환경**: `http://localhost:3000`에서 정상 작동 확인
2. **프로덕션 환경**: 배포 후 GTM에서 태그가 제대로 작동하는지 확인 필요
3. **개인정보**: 민감한 사용자 정보는 추적하지 않도록 주의
4. **성능**: 5분마다 체류 시간 추적이 성능에 영향을 줄 수 있음

## 문제 해결

### GTM이 로드되지 않는 경우
1. 브라우저 개발자 도구에서 네트워크 탭 확인
2. `googletagmanager.com` 요청이 있는지 확인
3. 콘솔에서 오류 메시지 확인

### 이벤트가 추적되지 않는 경우
1. GTM 디버거로 이벤트 발생 확인
2. DataLayer에 데이터가 푸시되는지 확인
3. GTM에서 트리거와 태그 설정 확인

### 출처 클릭이 추적되지 않는 경우
1. 출처 링크에 `citation-link` 클래스가 있는지 확인
2. `data-citation-number`와 `data-citation-url` 속성이 있는지 확인
3. `onCitationClick` 콜백이 제대로 전달되었는지 확인 