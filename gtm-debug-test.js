const puppeteer = require('puppeteer');

async function testGTMRealTime() {
  console.log('🔍 GTM 실시간 디버그 테스트 시작...');
  
  const browser = await puppeteer.launch({ 
    headless: false, 
    defaultViewport: null,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    
    // GTM 디버그 모드로 페이지 열기
    console.log('📱 GTM 디버그 모드로 페이지 로딩...');
    await page.goto('http://localhost:3000?gtm_debug=x', { waitUntil: 'networkidle0' });
    
    // DataLayer 모니터링
    console.log('📊 DataLayer 실시간 모니터링 시작...');
    
    // DataLayer 변경 감지
    await page.evaluateOnNewDocument(() => {
      const originalPush = window.dataLayer.push;
      window.dataLayer.push = function(...args) {
        console.log('🔔 DataLayer Push:', ...args);
        return originalPush.apply(this, args);
      };
    });
    
    // 콘솔 로그 수집
    page.on('console', msg => {
      if (msg.text().includes('DataLayer Push') || msg.text().includes('ai_query')) {
        console.log(`[${msg.type()}] ${msg.text()}`);
      }
    });
    
    // 네트워크 요청 모니터링 (GTM/GA만)
    page.on('request', request => {
      if (request.url().includes('google-analytics.com/g/collect')) {
        const url = request.url();
        console.log(`🌐 GA 이벤트 전송: ${url}`);
        
        // ai_query 이벤트 확인
        if (url.includes('en=ai_query')) {
          console.log('🎉 AI Query 이벤트 감지됨!');
        }
      }
    });
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n🤖 AI 쿼리 테스트 시작...');
    console.log('='.repeat(50));
    
    // 여러 AI 쿼리 테스트
    const testQueries = [
      '논문 검색 방법을 알려주세요',
      '인용 형식에 대해 설명해주세요',
      '참고문헌 작성법을 알려주세요'
    ];
    
    for (let i = 0; i < testQueries.length; i++) {
      const query = testQueries[i];
      console.log(`\n📝 테스트 ${i + 1}: "${query}"`);
      
      // 텍스트 입력
      await page.type('textarea', query);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 전송 버튼 클릭
      await page.click('button[type="submit"]');
      console.log('✅ 전송 버튼 클릭됨');
      
      // 이벤트 발생 대기
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // DataLayer에서 ai_query 이벤트 확인
      const aiQueryEvents = await page.evaluate(() => {
        if (window.dataLayer) {
          return window.dataLayer.filter(item => item.event === 'ai_query');
        }
        return [];
      });
      
      console.log(`📊 현재 ai_query 이벤트 수: ${aiQueryEvents.length}`);
      
      if (aiQueryEvents.length > 0) {
        const latestEvent = aiQueryEvents[aiQueryEvents.length - 1];
        console.log(`🎯 최신 이벤트:`);
        console.log(`   - prompt_hash: ${latestEvent.prompt_hash}`);
        console.log(`   - prompt_len: ${latestEvent.prompt_len}`);
        console.log(`   - prompt_text: ${latestEvent.prompt_text}`);
      }
      
      // 입력 필드 초기화
      await page.evaluate(() => {
        const textarea = document.querySelector('textarea');
        if (textarea) textarea.value = '';
      });
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // 최종 DataLayer 상태 확인
    console.log('\n📋 최종 DataLayer 상태:');
    console.log('='.repeat(50));
    
    const finalDataLayer = await page.evaluate(() => {
      if (window.dataLayer) {
        return {
          totalLength: window.dataLayer.length,
          aiQueryEvents: window.dataLayer.filter(item => item.event === 'ai_query'),
          allEvents: window.dataLayer.map(item => ({
            event: item.event,
            timestamp: new Date().toISOString()
          }))
        };
      }
      return null;
    });
    
    if (finalDataLayer) {
      console.log(`📊 총 DataLayer 항목: ${finalDataLayer.totalLength}`);
      console.log(`🤖 AI 쿼리 이벤트: ${finalDataLayer.aiQueryEvents.length}개`);
      
      if (finalDataLayer.aiQueryEvents.length > 0) {
        console.log('\n🎉 AI 쿼리 이벤트 상세:');
        finalDataLayer.aiQueryEvents.forEach((event, index) => {
          console.log(`  ${index + 1}. prompt_hash: ${event.prompt_hash}`);
          console.log(`     prompt_len: ${event.prompt_len}`);
          console.log(`     prompt_text: ${event.prompt_text}`);
        });
      }
      
      console.log('\n📈 모든 이벤트 타임라인:');
      finalDataLayer.allEvents.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.event} (${item.timestamp})`);
      });
    }
    
    console.log('\n✅ GTM 실시간 테스트 완료!');
    console.log('\n💡 GTM 관리자에서 확인하세요:');
    console.log('   https://tagmanager.google.com');
    console.log('   → 컨테이너: GTM-THPN28M8');
    console.log('   → 미리보기 모드에서 실시간 확인 가능');
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error);
  } finally {
    // 브라우저는 열어둔 상태로 유지 (수동 확인용)
    console.log('\n🔍 브라우저를 열어둔 상태로 유지합니다.');
    console.log('   GTM 미리보기 모드에서 실시간으로 확인하세요.');
  }
}

// 테스트 실행
testGTMRealTime().catch(console.error); 