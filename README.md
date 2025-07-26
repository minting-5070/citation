# Jung's Research Assistant

## 🎯 프로젝트 개요
논문 검색, 요약, 인용, 참고문헌 정리 등 리서치에 특화된 AI 어시스턴트입니다.

## 🚀 주요 기능
- **논문 검색**: 다양한 학술 데이터베이스에서 논문 검색
- **AI 요약**: 논문 내용을 AI가 자동으로 요약
- **인용 관리**: 참고문헌 자동 생성 및 관리
- **리서치 지원**: 연구 과정 전반을 지원하는 AI 도구

## 📊 분석 도구
- **Google Tag Manager (GTM)**: 이벤트 추적 및 태그 관리
- **Google Analytics**: 사용자 행동 분석 및 웹사이트 성과 측정

## 🛠 기술 스택
- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **AI**: Azure OpenAI API
- **Analytics**: Google Tag Manager, Google Analytics

## Getting Started

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Azure OpenAI API 설정
AZURE_OPENAI_API_KEY=your-api-key-here

# Azure OpenAI 엔드포인트 (예: https://your-resource-name.openai.azure.com)
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com

# Azure OpenAI 배포 이름 (예: gpt-35-turbo)
AZURE_OPENAI_DEPLOYMENT=gpt-35-turbo
```

**중요**: 
- `AZURE_OPENAI_API_KEY`를 실제 Azure OpenAI API 키로 변경하세요
- `AZURE_OPENAI_ENDPOINT`를 실제 Azure OpenAI 리소스의 엔드포인트로 변경하세요
- `AZURE_OPENAI_DEPLOYMENT`를 실제 배포 이름으로 변경하세요

### 2. 개발 서버 실행

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
