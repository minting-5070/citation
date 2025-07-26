// GTM 자동 테스트 스크립트
const puppeteer = require('puppeteer');

async function testGTM() {
  console.log('🚀 GTM 테스트 시작...');
  
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 720 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Network 요청 모니터링
    const gtmRequests = [];
    page.on('request', request => {
      if (request.url().includes('googletagmanager.com')) {
        gtmRequests.push(request.url());
        console.log(`✅ GTM 요청 감지: ${request.url()}`);
      }
    });
    
    // Console 로그 모니터링
    page.on('console', msg => {
      console.log(`📝 Console: ${msg.text()}`);
    });
    
    console.log('🌐 페이지 로딩 중...');
    await page.goto('https://citation-psi.vercel.app/', { 
      waitUntil: 'networkidle2',
      timeout: 30000 
    });
    
    console.log('⏳ 5초 대기 중...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // 모든 스크립트 태그 확인
    const allScripts = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.map(script => ({
        src: script.src,
        id: script.id,
        innerHTML: script.innerHTML ? script.innerHTML.substring(0, 100) + '...' : null
      }));
    });
    
    console.log('🔍 모든 스크립트 태그:');
    allScripts.forEach((script, index) => {
      console.log(`  ${index + 1}. ID: ${script.id}, SRC: ${script.src}`);
      if (script.innerHTML) {
        console.log(`     Content: ${script.innerHTML}`);
      }
    });
    
    // DataLayer 확인
    const dataLayer = await page.evaluate(() => {
      return window.dataLayer || [];
    });
    
    console.log(`📊 DataLayer 길이: ${dataLayer.length}`);
    console.log('📋 DataLayer 내용:');
    dataLayer.forEach((item, index) => {
      console.log(`  ${index + 1}. ${JSON.stringify(item)}`);
    });
    
    // GTM 스크립트 로드 확인
    const gtmScript = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll('script'));
      return scripts.some(script => 
        script.src && script.src.includes('googletagmanager.com')
      );
    });
    
    console.log(`🔍 GTM 스크립트 로드됨: ${gtmScript}`);
    
    // window 객체 확인
    const windowCheck = await page.evaluate(() => {
      return {
        hasDataLayer: typeof window.dataLayer !== 'undefined',
        dataLayerType: typeof window.dataLayer,
        hasGtag: typeof window.gtag !== 'undefined',
        hasGTM: typeof window.gtm !== 'undefined'
      };
    });
    
    console.log('🔍 Window 객체 상태:');
    console.log(`  - dataLayer 존재: ${windowCheck.hasDataLayer}`);
    console.log(`  - dataLayer 타입: ${windowCheck.dataLayerType}`);
    console.log(`  - gtag 존재: ${windowCheck.hasGtag}`);
    console.log(`  - gtm 존재: ${windowCheck.hasGTM}`);
    
    // 결과 요약
    console.log('\n📈 테스트 결과:');
    console.log(`- GTM 요청 수: ${gtmRequests.length}`);
    console.log(`- DataLayer 이벤트 수: ${dataLayer.length}`);
    console.log(`- GTM 스크립트 로드: ${gtmScript ? '✅ 성공' : '❌ 실패'}`);
    
    if (gtmRequests.length > 0 && dataLayer.length > 0) {
      console.log('🎉 GTM이 정상적으로 작동하고 있습니다!');
    } else {
      console.log('⚠️ GTM에 문제가 있을 수 있습니다.');
    }
    
  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.message);
  } finally {
    await browser.close();
    console.log('🔚 브라우저 종료');
  }
}

// 테스트 실행
testGTM().catch(console.error); 