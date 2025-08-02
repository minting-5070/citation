import { Message } from 'ai/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
// @ts-ignore
import rehypeRaw from 'rehype-raw';

type Props = {
  messages: Message[];
  onCitationClick?: (citationNumber: string, citationUrl: string, promptHash?: string) => void;
  onGoogleScholarRedirect?: (searchQuery: string, promptHash?: string) => void;
};

function buildCitationMap(referencesSection: string) {
  const map: Record<string, string> = {};
  const regex = /^-\s*\[(\d+)\]\s*\[[^\]]+\]\(([^)]+)\)/gm;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(referencesSection)) !== null) {
    const num = m[1];
    const url = m[2];
    map[num] = url;
  }
  return map;
}

function addReferenceLinks(text: string, citationMap: Record<string, string>) {
  return text.replace(/\[(\d+)\]/g, (_m, n) => {
    const url = citationMap[n];
    return url ? `[${n}](${url})` : `[${n}]`;
  });
}

function formatReferences(content: string) {
  // Detect a references section starting with "참고문헌:" or "References:" (case-insensitive).
  const match = content.match(/\n{1,2}(참고문헌:|References:)[\s\S]*/i);

  if (!match) return { mainContent: content, references: null };

  const mainContentRaw = content.slice(0, match.index).trim();
  const referencesRaw = content.slice(match.index!).trim();

  // Build map number -> url
  const citationMap = buildCitationMap(referencesRaw);

  const superscript = (num: string) => {
    const supMap: Record<string, string> = {'0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹'};
    return num.split('').map(d=>supMap[d]||d).join('');
  };

  // Convert citation numbers into superscript 🔗 icon links
  let mainContent = mainContentRaw.replace(/\[(\d+)\]/g, (_m, n) => {
    const url = citationMap[n];
    if (!url) return '';
    const supNum = superscript(n);
    return `<sup><a href=\"${url}\" target=\"_blank\" rel=\"noopener noreferrer\" class=\"text-blue-400 hover:text-blue-300 citation-link\" data-citation-number=\"${n}\" data-citation-url=\"${url}\">🔗${supNum}</a></sup>`;
  });

  // Ensure paragraphs are separated by a blank line for readability
  mainContent = mainContent.replace(/\n(?=[^\n])/g, '\n\n');

  const references = null; // hide reference list

  return { mainContent, references };
}

export default function ChatMessages({ messages, onCitationClick, onGoogleScholarRedirect }: Props) {
  // 출처 클릭 핸들러
  const handleCitationClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    console.log('handleCitationClick called', e.currentTarget);
    const citationNumber = e.currentTarget.getAttribute('data-citation-number');
    const citationUrl = e.currentTarget.getAttribute('data-citation-url');
    
    console.log('Citation data:', { citationNumber, citationUrl });
    
    if (citationNumber && citationUrl && onCitationClick) {
      console.log('Calling onCitationClick');
      onCitationClick(citationNumber, citationUrl);
    } else {
      console.log('Missing data or callback:', { citationNumber, citationUrl, onCitationClick: !!onCitationClick });
    }
  };

  // Google Scholar 이동 핸들러
  const handleGoogleScholarRedirect = (searchQuery: string) => {
    if (onGoogleScholarRedirect) {
      onGoogleScholarRedirect(searchQuery);
    }
    
    // Google Scholar로 새 창에서 열기
    const encodedQuery = encodeURIComponent(searchQuery);
    window.open(`https://scholar.google.com/scholar?q=${encodedQuery}`, '_blank');
  };

  return (
    <div className="space-y-4">
      {messages.map((msg, index) => {
        const { mainContent, references } = formatReferences(msg.content);
        
        return (
          <div
            key={msg.id}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
            style={{ 
              animationDelay: msg.role === 'assistant' ? '100ms' : '0ms',
              animationFillMode: 'both'
            }}
          >
            <div className={`flex max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
              {/* 아바타 */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0 ${
                msg.role === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-muted text-muted-foreground'
              }`}>
                {msg.role === 'user' ? 'U' : 'AI'}
              </div>

              {/* 메시지 버블 */}
              <div className={`px-4 py-3 rounded-2xl max-w-full ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-muted text-foreground rounded-bl-md'
              }`}>
                <div className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={rehypeRaw ? [rehypeRaw] : []}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1 {...props} className="text-lg font-bold mb-3 mt-4 first:mt-0 text-foreground" />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 {...props} className="text-base font-semibold mb-2 mt-3 first:mt-0 text-foreground" />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 {...props} className="text-sm font-semibold mb-2 mt-3 first:mt-0 text-foreground" />
                      ),
                      p: ({ node, ...props }) => (
                        <p {...props} className="mb-3 last:mb-0 text-foreground leading-relaxed" />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul {...props} className="mb-3 pl-4 space-y-1" />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol {...props} className="mb-3 pl-4 space-y-1" />
                      ),
                      li: ({ node, ...props }) => (
                        <li {...props} className="text-foreground leading-relaxed" />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong {...props} className="font-semibold text-foreground" />
                      ),
                      a: ({ node, ...props }) => {
                        const href = props.href || '';
                        const isCitation = props.className?.includes('citation-link');
                        
                        if (isCitation) {
                          return (
                            <a
                              {...props}
                              className="text-blue-400 hover:text-blue-300 underline cursor-pointer"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => {
                                console.log('Citation link clicked!', props);
                                handleCitationClick(e);
                              }}
                            />
                          );
                        }
                        
                        // Google Scholar 링크 감지 및 처리
                        if (href.includes('scholar.google.com') || href.includes('google.com/scholar')) {
                          return (
                            <a
                              {...props}
                              className="text-green-400 hover:text-green-300 underline cursor-pointer"
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() => {
                                const searchQuery = href.includes('q=') 
                                  ? decodeURIComponent(href.split('q=')[1]?.split('&')[0] || '')
                                  : props.children?.toString() || '';
                                handleGoogleScholarRedirect(searchQuery);
                              }}
                            />
                          );
                        }
                        
                        return (
                          <a
                            {...props}
                            className="text-blue-400 hover:text-blue-300 underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        );
                      },
                      code: ({ node, ...props }) => (
                        <code {...props} className="bg-gray-800 rounded px-1 py-0.5 text-sm" />
                      ),
                      table: ({ node, ...props }) => (
                        <div className="overflow-x-auto mb-3">
                          <table {...props} className="w-full border-collapse border border-gray-600" />
                        </div>
                      ),
                      th: ({ node, ...props }) => (
                        <th {...props} className="border border-gray-600 px-3 py-2 bg-gray-700 font-semibold text-left" />
                      ),
                      td: ({ node, ...props }) => (
                        <td {...props} className="border border-gray-600 px-3 py-2" />
                      ),
                    }}
                  >
                    {mainContent}
                  </ReactMarkdown>

                  {/* 참고문헌 섹션 제거 */}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
