#!/bin/bash

echo "🚀 새로운 Vercel 프로젝트 배포 시작..."

# 현재 git 상태 확인
echo "📋 현재 git 상태 확인..."
git status

# 변경사항 커밋
echo "💾 변경사항 커밋..."
git add .
git commit -m "Prepare for new Vercel deployment with GTM and GA integration"

# 새로운 Vercel 프로젝트 생성
echo "🆕 새로운 Vercel 프로젝트 생성..."
echo "다음 명령어를 실행하세요:"
echo ""
echo "1. vercel --new"
echo "2. 프로젝트 이름을 'jung-research-assistant'로 설정"
echo "3. 배포 후 새로운 URL 확인"
echo ""
echo "또는 Vercel 대시보드에서 새 프로젝트를 생성하고 이 저장소를 연결하세요."
echo ""

# 배포 후 테스트 안내
echo "✅ 배포 완료 후 다음을 확인하세요:"
echo "1. 새로운 URL에서 GTM 작동 확인"
echo "2. Google Analytics 데이터 수집 확인"
echo "3. 이벤트 추적 테스트"
echo ""
echo "테스트 명령어:"
echo "node test-gtm-automated.js"
echo "(URL을 새로운 배포 URL로 수정 필요)" 