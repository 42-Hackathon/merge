import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, 
  Sparkles, 
  X, 
  FileText, 
  Image, 
  Link as LinkIcon, 
  Film, 
  Music, 
  Camera, 
  Clipboard,
  Bot,
  User,
  Settings,
  Plus,
  Trash2
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { aiService, AIMessage, ContextItem } from '../../services/ai-service';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface AIChatProps {
  width?: number;
  onAddContext?: (items: ContextItem[]) => void;
}

export function AIChat({ width, onAddContext }: AIChatProps) {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextItems, setContextItems] = useState<ContextItem[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [showSettings, setShowSettings] = useState(false);

  // API 키 설정
  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    aiService.setApiKey(newApiKey);
  };
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 초기 API 키 설정
  useEffect(() => {
    if (apiKey) {
      aiService.setApiKey(apiKey);
    }
  }, [apiKey]);

  // 메시지가 추가될 때마다 스크롤을 맨 아래로
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    
    // API 키가 없으면 데모 모드 알림 (한 번만)
    if (!apiKey.trim() && messages.length === 0) {
      toast.success('데모 모드로 실행 중입니다. 실제 AI 응답을 원하면 API 키를 설정하세요.');
    }

    const userMessage: AIMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date().toISOString(),
      contextItems: contextItems.length > 0 ? [...contextItems] : undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await aiService.sendMessage([...messages, userMessage], contextItems);
      
      const assistantMessage: AIMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'AI 응답을 받을 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [inputValue, isLoading, apiKey, messages, contextItems]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setContextItems([]);
  };

  const removeContextItem = (id: string) => {
    setContextItems(prev => prev.filter(item => item.id !== id));
  };

  const addContextItem = (item: ContextItem) => {
    setContextItems(prev => {
      const exists = prev.find(existingItem => existingItem.id === item.id);
      if (exists) return prev;
      return [...prev, item];
    });
  };

  // 드래그앤드롭 핸들러
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      // 1. ContentPill 드래그 처리
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        const item: ContextItem = JSON.parse(jsonData);
        addContextItem(item);
        toast.success(`"${item.title}" 컨텍스트에 추가됨`);
        return;
      }

      // 2. 파일 드래그 처리
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        for (const file of files) {
          const contextItem: ContextItem = {
            id: uuidv4(),
            type: getFileType(file),
            title: file.name,
            content: await readFileContent(file),
            metadata: {
              url: file.name,
              domain: 'local-file'
            }
          };
          addContextItem(contextItem);
        }
        toast.success(`${files.length}개 파일이 컨텍스트에 추가됨`);
        return;
      }

      // 3. 텍스트 드래그 처리
      const textData = e.dataTransfer.getData('text/plain');
      if (textData) {
        // 제목을 더 명확하게 생성
        const firstLine = textData.split('\n')[0].trim();
        let title = firstLine || '텍스트 내용';
        if (title.length > 50) {
          title = title.substring(0, 50) + '...';
        }
        
        const contextItem: ContextItem = {
          id: uuidv4(),
          type: 'text',
          title: title,
          content: textData,
        };
        addContextItem(contextItem);
        toast.success('텍스트가 컨텍스트에 추가됨');
        return;
      }

    } catch (error) {
      console.error('드롭 데이터 파싱 오류:', error);
      toast.error('파일을 처리할 수 없습니다.');
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const ContextIcon = ({ type }: { type: ContextItem['type'] }) => {
    switch (type) {
      case 'image': return <Image className="h-3 w-3" />;
      case 'link': return <LinkIcon className="h-3 w-3" />;
      case 'video': return <Film className="h-3 w-3" />;
      case 'audio': return <Music className="h-3 w-3" />;
      case 'clipboard': return <Clipboard className="h-3 w-3" />;
      case 'screenshot': return <Camera className="h-3 w-3" />;
      case 'text':
      default:
        return <FileText className="h-3 w-3" />;
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('ko-KR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // 파일 타입 판별 함수
  const getFileType = (file: File): ContextItem['type'] => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();
    
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('text/') || name.endsWith('.txt') || name.endsWith('.md')) return 'text';
    return 'other';
  };

  // 파일 내용 읽기 함수
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          resolve(`[파일: ${file.name}] (${(file.size / 1024).toFixed(1)}KB)`);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('파일을 읽을 수 없습니다.'));
      };
      
      // 텍스트 파일만 내용을 읽고, 나머지는 파일 정보만 저장
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        resolve(`[파일: ${file.name}]\n파일 타입: ${file.type}\n크기: ${(file.size / 1024).toFixed(1)}KB`);
      }
    });
  };

  return (
    <div className="flex flex-col h-full">
      {/* 헤더 */}
      <div className="flex-shrink-0 flex items-center justify-between p-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">AI 어시스턴트</span>
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-white/60 hover:text-white/80"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* API 키 설정 */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex-shrink-0 px-3 py-2 border-b border-white/10 bg-white/5"
          >
            <div className="flex items-center gap-2">
              <span className="text-xs text-white/60 flex-shrink-0">API Key</span>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="sk-or-v1-..."
                className="flex-1 px-2 py-1 bg-white/10 rounded border border-white/20 text-white placeholder-white/50 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
              />
              <a 
                href="https://openrouter.ai/keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs text-white/50 hover:text-white/70 underline flex-shrink-0"
              >
                발급받기
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메시지 영역 */}
      <div 
        className="flex-1 overflow-hidden"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <ScrollArea className="h-full">
          <div className="p-3 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-white/50 pt-16">
                <Bot size={40} className="mx-auto mb-4 text-white/20" />
                <h3 className="font-medium mb-2 text-sm">AI 어시스턴트와 대화를 시작하세요</h3>
                <p className="text-xs mb-4 text-white/40">수집한 콘텐츠를 드래그하여 컨텍스트로 추가할 수 있습니다</p>
                
                {!apiKey && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setShowSettings(true)}
                    className="border-white/20 text-white/70 hover:bg-white/10"
                  >
                    API 키 설정하기
                  </Button>
                )}
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white/70">
                      {message.role === 'user' ? '사용자' : 'AI'}
                    </span>
                    <span className="text-xs text-white/40">
                      {formatTime(message.timestamp)}
                    </span>
                  </div>
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="whitespace-pre-wrap text-white/90 text-xs leading-relaxed">
                      {message.content}
                    </div>
                  </div>
                  {message.contextItems && message.contextItems.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {message.contextItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-1 px-1.5 py-0.5 bg-white/10 rounded text-xs border border-white/20"
                        >
                          <ContextIcon type={item.type} />
                          <span className="truncate max-w-32">{item.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-white/70">AI</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-75"></div>
                    <div className="w-2 h-2 bg-white/50 rounded-full animate-pulse delay-150"></div>
                  </div>
                  <span className="text-xs text-white/50">생각 중...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* 컨텍스트바 */}
      <div className="flex-shrink-0 p-3 min-h-[3.5rem] transition-colors duration-200">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2 w-max">
            {contextItems.map((item) => (
              <div key={item.id} className="group relative flex-shrink-0">
                <div 
                  className="flex items-center text-xs rounded-full pl-2 pr-2 py-1 backdrop-blur-xl border cursor-pointer transition-all duration-200 bg-white/10 border-white/20 hover:bg-white/15" 
                  title={item.title}
                >
                  <ContextIcon type={item.type} />
                  <span className="truncate flex-1 mx-1.5 max-w-32">{item.title}</span>
                </div>
                <button 
                  onClick={() => removeContextItem(item.id)} 
                  className="absolute top-1/2 -translate-y-1/2 right-1.5 bg-gray-700 hover:bg-red-500 border border-gray-600 rounded-full h-4 w-4 flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-all" 
                  title="Remove context"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 입력 영역 */}
      <div className="flex-shrink-0 p-4 border-t border-white/10">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              !apiKey.trim() 
                ? (contextItems.length > 0 
                    ? `[데모 모드] ${contextItems.length}개 컨텍스트와 함께 질문하세요...` 
                    : "[데모 모드] AI에게 질문하세요... (Shift+Enter로 줄바꿈)")
                : (contextItems.length > 0 
                    ? `${contextItems.length}개 컨텍스트와 함께 AI에게 질문하세요...` 
                    : "AI에게 질문하세요... (Shift+Enter로 줄바꿈)")
            }
            className="w-full px-4 py-4 pr-12 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/50 text-xs resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/50 min-h-[60px] max-h-32 leading-relaxed"
            rows={3}
            style={{
              height: 'auto',
              minHeight: '60px'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 128) + 'px';
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            size="sm"
            className="absolute bottom-4 right-3 h-6 w-6 p-0 bg-white hover:bg-white/90 disabled:opacity-30 disabled:bg-white/40 rounded-md transition-all duration-200"
          >
            <Send className="h-3 w-3 text-gray-800" />
          </Button>
        </div>
      </div>
    </div>
  );
} 