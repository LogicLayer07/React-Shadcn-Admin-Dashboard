import { useEffect, useRef, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import ReactMarkdown from 'react-markdown';
import { GoogleGenerativeAI } from '@google/generative-ai'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
const VITE_APP_GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(VITE_APP_GOOGLE_API_KEY || "");
export default function SupportChats() {
  const [message, setMessage] = useState('');
  const [chatLog, setChatLog] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [currentResponse, setCurrentResponse] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatLog]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;
    const userMessage = { role: 'user' as const, content: message };
    setChatLog(prevLog => [...prevLog, userMessage]);
    setMessage('');
    setIsStreaming(true);
    setCurrentResponse('');

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result = await model.generateContentStream(message);

      let fullResponse = '';
      for await (const chunk of result.stream) {
        if (chunk.candidates && chunk.candidates[0] && chunk.candidates[0].content && chunk.candidates[0].content.parts && chunk.candidates[0].content.parts[0]) {
          const chunkText = chunk.candidates[0].content.parts[0].text;
          fullResponse += chunkText;
          setCurrentResponse(fullResponse);
        }
      }

      setChatLog(prevLog => [...prevLog, { role: 'bot', content: fullResponse }]);
    } catch (error) {
      console.error("Error generating AI response:", error);
      setChatLog(prevLog => [
        ...prevLog,
        { role: 'bot', content: 'Sorry, something went wrong.' }
      ]);
    } finally {
      setIsStreaming(false);
      setCurrentResponse('');
    }
  };

  const MessageContent = ({ content }: { content: string }) => (
    <ReactMarkdown
      components={{
        h2: ({ children }) => <h2 className="text-lg font-bold">{children}</h2>,
        h3: ({ children }) => <h3 className="text-md font-semibold">{children}</h3>,
        p: ({ children }) => <p>{children}</p>,
      }}
    >
      {content}
    </ReactMarkdown>
  );

  return (
    <Layout fixed>

      <Layout.Header>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body className='sm:overflow-hidden'>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Chat with Gemini</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px] mb-4 p-4 rounded-md border" ref={scrollAreaRef}>
                {chatLog.map((entry, index) => (
                  <div key={index} className={`mb-4 ${entry.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <div
                      className={`inline-block p-2 rounded-lg ${entry.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                        }`}
                    >
                      <strong>{entry.role === 'user' ? 'You:' : 'Bot:'}</strong>{' '}
                      <div className="whitespace-pre-wrap">
                        <MessageContent content={entry.content} />
                      </div>
                    </div>
                  </div>
                ))}
                {isStreaming && currentResponse && (
                  <div className="text-left">
                    <div className="inline-block p-2 rounded-lg">
                      <strong>Bot:</strong>{' '}
                      <div className="whitespace-pre-wrap">
                        <MessageContent content={currentResponse} />
                      </div>
                    </div>
                  </div>
                )}
                {isStreaming && !currentResponse && (
                  <div className="text-left">
                    <div className="inline-block p-2 rounded-lg">
                      <strong>Bot:</strong> Typing...
                    </div>
                  </div>
                )}
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} disabled={isStreaming}>Send</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout.Body>
    </Layout>
  )
}
