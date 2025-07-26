const puppeteer = require('puppeteer');

async function testGTM() {
  console.log('🚀 GTM 자동화 테스트 시작...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // 콘솔 로그 수집
    const logs = [];
    page.on('console', msg => {
      logs.push(`[${msg.type()}] ${msg.text()}`);
      console.log(`[${msg.type()}] ${msg.text()}`);
    });
    
    // 네트워크 요청 모니터링
    const networkRequests = [];
    page.on('request', request => {
      if (request.url().includes('googletagmanager.com') || request.url().includes('google-analytics.com')) {
        networkRequests.push({
          url: request.url(),
          method: request.method(),
          timestamp: new Date().toISOString()
        });
        console.log(`🌐 GTM/GA 요청: ${request.method()} ${request.url()}`);
      }
    });
    
    console.log('📱 페이지 로딩 중...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
    
    // DataLayer 확인
    console.log('🔍 DataLayer 상태 확인...');
    const dataLayerStatus = await page.evaluate(() => {
      if (typeof window !== 'undefined' && window.dataLayer) {
        return {
          exists: true,
          length: window.dataLayer.length,
          content: window.dataLayer.slice(-5) // 마지막 5개 항목
        };
      }
      return { exists: false };
    });
    
    console.log('📊 DataLayer 상태:', dataLayerStatus);
    
    // 페이지 뷰 이벤트 확인
    console.log('👀 페이지 뷰 이벤트 확인...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const pageViewEvents = await page.evaluate(() => {
      if (window.dataLayer) {
        return window.dataLayer.filter(item => item.event === 'page_view');
      }
      return [];
    });
    
    console.log('📄 페이지 뷰 이벤트:', pageViewEvents);
    
    // AI 쿼리 테스트
    console.log('🤖 AI 쿼리 이벤트 테스트...');
    
    // 텍스트 입력
    await page.type('textarea', '논문 검색 방법을 알려주세요');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // 전송 버튼 클릭
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // AI 쿼리 이벤트 확인
    const aiQueryEvents = await page.evaluate(() => {
      if (window.dataLayer) {
        return window.dataLayer.filter(item => item.event === 'ai_query');
      }
      return [];
    });
    
    console.log('🤖 AI 쿼리 이벤트:', aiQueryEvents);
    
    // GTM 디버그 모드로 테스트
    console.log('🔧 GTM 디버그 모드 테스트...');
    await page.goto('http://localhost:3000?gtm_debug=x', { waitUntil: 'networkidle0' });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 다시 AI 쿼리 테스트
    await page.type('textarea', '인용 형식에 대해 알려주세요');
    await new Promise(resolve => setTimeout(resolve, 1000));
    await page.click('button[type="submit"]');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // 최종 결과 요약
    console.log('\n📋 테스트 결과 요약:');
    console.log('='.repeat(50));
    console.log(`✅ DataLayer 존재: ${dataLayerStatus.exists}`);
    console.log(`📊 DataLayer 길이: ${dataLayerStatus.length}`);
    console.log(`📄 페이지 뷰 이벤트: ${pageViewEvents.length}개`);
    console.log(`🤖 AI 쿼리 이벤트: ${aiQueryEvents.length}개`);
    console.log(`🌐 GTM/GA 네트워크 요청: ${networkRequests.length}개`);
    
    if (aiQueryEvents.length > 0) {
      console.log('\n🎉 AI 쿼리 이벤트 상세:');
      aiQueryEvents.forEach((event, index) => {
        console.log(`  ${index + 1}. prompt_hash: ${event.prompt_hash}`);
        console.log(`     prompt_len: ${event.prompt_len}`);
        console.log(`     prompt_text: ${event.prompt_text}`);
      });
    }
    
    if (networkRequests.length > 0) {
      console.log('\n🌐 GTM/GA 네트워크 요청:');
      networkRequests.forEach((req, index) => {
        console.log(`  ${index + 1}. ${req.method} ${req.url}`);
      });
    }
    
    console.log('\n✅ GTM 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
  } finally {
    await browser.close();
  }
}

// 테스트 실행
testGTM().catch(console.error); 