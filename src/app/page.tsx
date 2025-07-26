'use client';

import { useChat } from 'ai/react';
import ChatInput from './components/ChatInput';
import ChatMessages from './components/ChatMessages';
import { useRef, useEffect, useState } from 'react';

// TypeScript 타입 정의
declare global {
  interface Window {
    dataLayer: any[];
  }
}

// SHA-256 해시 함수
async function sha256Hex(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export default function Home() {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    setMessages,
    isLoading,
  } = useChat({ streamProtocol: 'text' });
  
  const [displayMessages, setDisplayMessages] = useState(messages);
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // GTM DataLayer 초기화 및 디버깅
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.dataLayer = window.dataLayer || [];
      console.log('[DEBUG] dataLayer ready, current length:', window.dataLayer.length);
      
      // 페이지 로드 이벤트
      window.dataLayer.push({
        event: 'page_view',
        page_title: 'Jung\'s Research Assistant',
        page_location: window.location.href
      });
    }
  }, []);

  // 새 메시지가 추가될 때 자동으로 스크롤
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayMessages]);

  // 메시지 상태 관리
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    
    if (isLoading && lastMessage?.role === 'assistant') {
      // AI가 응답 중일 때
      setIsThinking(true);
      // 이전까지의 메시지만 표시 (스트리밍 중인 마지막 응답은 숨김)
      setDisplayMessages(messages.slice(0, -1));
    } else if (!isLoading && lastMessage?.role === 'assistant') {
      // AI 응답이 완료되었을 때
      setIsThinking(false);
      // 완성된 응답을 포함한 모든 메시지 표시
      setTimeout(() => {
        setDisplayMessages(messages);
      }, 200); // 약간의 딜레이 후 한번에 표시
    } else {
      // 사용자 메시지가 추가되었을 때
      setDisplayMessages(messages);
      setIsThinking(false);
    }
  }, [messages, isLoading]);

  // AI 쿼리 이벤트 추적을 위한 커스텀 handleSubmit
  const handleSubmitWithTracking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    try {
      // GTM 이벤트 추적
      if (typeof window !== 'undefined' && window.dataLayer) {
        const promptHash = (await sha256Hex(input)).slice(0, 16);
        
        window.dataLayer.push({
          event: 'ai_query',
          prompt_hash: promptHash,
          prompt_len: input.length,
          prompt_text: input.substring(0, 100) // 처음 100자만 (디버깅용)
        });
        
        console.log('[DEBUG] GTM event pushed:', {
          event: 'ai_query',
          prompt_hash: promptHash,
          prompt_len: input.length
        });
      }
    } catch (error) {
      console.error('[DEBUG] GTM tracking error:', error);
    }

    // 원래 handleSubmit 호출
    handleSubmit(e);
  };

  const clearChat = () => {
    setMessages([]);
    setDisplayMessages([]);
    setIsThinking(false);
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* 헤더 */}
      <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="4" width="13" height="16" rx="2" strokeWidth="2"/>
                  <path d="M16 8h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-1" strokeWidth="2"/>
                  <circle cx="9" cy="12" r="2" strokeWidth="2"/>
                  <path d="M21 21l-4-4" strokeWidth="2"/>
                </svg>
              </div>
              <h1 className="text-xl font-semibold">Jung&apos;s Research Assistant</h1>
            </div>
            <div className="flex items-center space-x-2">
              {displayMessages.length > 0 && (
                <button
                  onClick={clearChat}
                  className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  대화 초기화
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <div className="flex-grow container mx-auto px-4 py-6 max-w-4xl flex flex-col">
          <div className="flex-1 overflow-y-auto mb-4">
            {displayMessages.length === 0 && !isThinking ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="13" height="16" rx="2" strokeWidth="2"/>
                    <path d="M16 8h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-1" strokeWidth="2"/>
                    <circle cx="9" cy="12" r="2" strokeWidth="2"/>
                    <path d="M21 21l-4-4" strokeWidth="2"/>
                  </svg>
                </div>
                <h2 className="text-xl font-semibold mb-2">안녕하세요, Jung&apos;s Research Assistant입니다.</h2>
                <p className="max-w-md">
                  논문 검색, 요약, 인용, 참고문헌 정리 등 리서치에 필요한 모든 것을 도와드립니다.
                </p>
              </div>
            ) : (
              <>
                <ChatMessages messages={displayMessages} />
                {isThinking && (
                  <div className="flex justify-start mb-4">
                    <div className="flex max-w-[80%] flex-row items-end gap-2">
                      {/* AI 아바타 */}
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 bg-muted text-muted-foreground">
                        AI
                      </div>
                      {/* 생각 중 표시 */}
                      <div className="px-4 py-3 rounded-2xl bg-muted text-foreground rounded-bl-md">
                        <div className="flex items-center space-x-1">
                          <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground ml-2">생각하는 중...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-border pt-4">
            <ChatInput
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmitWithTracking}
              isLoading={isLoading}
            />
          </div>
      </div>
    </div>
  );
}
