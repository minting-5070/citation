# GTM 설정 가이드 - Jung's Research Assistant

## GTM ID: GTM-THPN28M8

### 1. GTM 대시보드 접속
- https://tagmanager.google.com/
- GTM-THPN28M8 컨테이너 선택

### 2. 변수 설정 (Data Layer Variables)

#### 필수 변수들:
```
prompt_hash
prompt_length
query_number
search_query
redirect_number
citation_number
citation_url
click_number
timestamp
```

**설정 방법:**
1. **변수** 탭 클릭
2. **새로 만들기** 클릭
3. **변수 유형**: Data Layer 변수
4. **Data Layer 변수 이름**: 위의 변수명들
5. **기본값**: 설정하지 않음

### 3. 트리거 설정

#### AI Query 트리거:
- **트리거 유형**: 사용자 정의 이벤트
- **이벤트 이름**: `ai_query`
- **조건**: 없음

#### Google Scholar Redirect 트리거:
- **트리거 유형**: 사용자 정의 이벤트
- **이벤트 이름**: `google_scholar_redirect`
- **조건**: 없음

#### Citation Click 트리거:
- **트리거 유형**: 사용자 정의 이벤트
- **이벤트 이름**: `citation_click`
- **조건**: 없음

### 4. 태그 설정

#### AI Query 태그:
```
태그 유형: Google Analytics: GA4 이벤트
이벤트 이름: ai_query
트리거: ai_query
매개변수:
- prompt_hash: {{DLV - prompt_hash}}
- prompt_length: {{DLV - prompt_length}}
- query_number: {{DLV - query_number}}
- timestamp: {{DLV - timestamp}}
```

#### Google Scholar Redirect 태그:
```
태그 유형: Google Analytics: GA4 이벤트
이벤트 이름: google_scholar_redirect
트리거: google_scholar_redirect
매개변수:
- search_query: {{DLV - search_query}}
- redirect_number: {{DLV - redirect_number}}
- timestamp: {{DLV - timestamp}}
```

#### Citation Click 태그:
```
태그 유형: Google Analytics: GA4 이벤트
이벤트 이름: citation_click
트리거: citation_click
매개변수:
- citation_number: {{DLV - citation_number}}
- citation_url: {{DLV - citation_url}}
- click_number: {{DLV - click_number}}
- timestamp: {{DLV - timestamp}}
```

### 5. 테스트 방법

1. **GTM 미리보기 모드** 활성화
2. https://googletag.vercel.app/ 접속
3. AI에게 질문 입력
4. Google Scholar 버튼 클릭
5. 참고문헌 링크 클릭
6. GTM 미리보기에서 이벤트 확인

### 6. 배포

모든 설정 완료 후:
1. **제출** 클릭
2. **버전 이름**: "AI 이벤트 추적 추가"
3. **버전 설명**: "AI 쿼리, Google Scholar 클릭, 참고문헌 클릭 이벤트 추적"
4. **게시** 클릭

### 7. Google Analytics 확인

배포 후:
1. Google Analytics 대시보드 접속
2. **실시간** → **이벤트** 확인
3. **보고서** → **참여도** → **이벤트** 확인

### 8. 예상 이벤트 목록

설정 완료 후 다음 이벤트들이 Google Analytics에 나타날 것입니다:
- `ai_query`
- `ai_response`
- `google_scholar_redirect`
- `citation_click`
- `time_on_page`
- `session_stats` 