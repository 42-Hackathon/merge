import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Send, 
  X, 
  FileText, 
  Image, 
  Link as LinkIcon, 
  Film, 
  Music, 
  Camera, 
  Clipboard,
  Bot,
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { aiService, AIMessage, ContextItem } from '../../services/ai-service';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function AIChat() {
  const [messages, setMessages] = useState<AIMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextItems, setContextItems] = useState<ContextItem[]>([]);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyPanel, setShowApiKeyPanel] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // API key setup
  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    aiService.setApiKey(newApiKey);
  };

  // Initialize API key
  useEffect(() => {
    if (apiKey) {
      aiService.setApiKey(apiKey);
    }
  }, [apiKey]);

  // Scroll to bottom when messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim() || isLoading) return;
    
    // Demo mode notification if no API key (only once)
    if (!apiKey.trim() && messages.length === 0) {
      toast.success('Running in demo mode. Set up API key for actual AI responses.');
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
      toast.error(error instanceof Error ? error.message : 'Unable to get AI response.');
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

  // Drag and drop handlers
  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    
    try {
      // 1. Handle ContentPill drag
      const jsonData = e.dataTransfer.getData('application/json');
      if (jsonData) {
        const item: ContextItem = JSON.parse(jsonData);
        addContextItem(item);
        toast.success(`"${item.title}" added to context`);
        return;
      }

      // 2. Handle file drag
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
        toast.success(`${files.length} files added to context`);
        return;
      }

      // 3. Handle text drag
      const textData = e.dataTransfer.getData('text/plain');
      if (textData) {
        // Create clearer title
        const firstLine = textData.split('\n')[0].trim();
        let title = firstLine || 'Text content';
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
        toast.success('Text added to context');
        return;
      }

    } catch (error) {
      console.error('Drop data parsing error:', error);
      toast.error('Unable to process file.');
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
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // File type detection function
  const getFileType = (file: File): ContextItem['type'] => {
    const type = file.type.toLowerCase();
    const name = file.name.toLowerCase();
    
    if (type.startsWith('image/')) return 'image';
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.includes('text/') || name.endsWith('.txt') || name.endsWith('.md')) return 'text';
    return 'other';
  };

  // File content reading function
  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          resolve(result);
        } else {
          resolve(`[File: ${file.name}] (${(file.size / 1024).toFixed(1)}KB)`);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Unable to read file.'));
      };
      
      // Only read content for text files, store file info for others
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        reader.readAsText(file);
      } else {
        resolve(`[File: ${file.name}]\nFile type: ${file.type}\nSize: ${(file.size / 1024).toFixed(1)}KB`);
      }
    });
  };

  return (
    <div className="flex flex-col h-full relative">
      {/* Top-right hover area */}
      <div 
        className="absolute top-0 right-0 w-16 h-16 z-20"
        onMouseEnter={() => setShowApiKeyPanel(true)}
        onMouseLeave={() => setShowApiKeyPanel(false)}
      >
        {/* Hover indicator */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/5 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Settings className="h-3 w-3 text-white/40" />
        </div>
      </div>

      {/* API key setup panel */}
      <AnimatePresence>
        {showApiKeyPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-0 right-0 w-80 p-3 bg-black/60 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-30 m-3"
            onMouseEnter={() => setShowApiKeyPanel(true)}
            onMouseLeave={() => setShowApiKeyPanel(false)}
          >
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 text-white/60" />
                <span className="text-sm font-medium text-white/80">API Key Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => handleApiKeyChange(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="flex-1 px-3 py-2 bg-white/10 rounded-lg border border-white/20 text-white placeholder-white/50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                />
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 underline flex-shrink-0"
                >
                  Get Key
                </a>
              </div>
              <p className="text-xs text-white/50">
                Enter your OpenRouter API key to chat with real AI. Demo mode available without key.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages area */}
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
                <h3 className="font-medium mb-2 text-sm">Start chatting with AI Assistant</h3>
                <p className="text-xs mb-4 text-white/40">Drag your collected content here to add as context</p>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className="mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-white/70">
                      {message.role === 'user' ? 'You' : 'AI'}
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
                  <span className="text-xs text-white/50">Thinking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Context bar */}
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

      {/* Input area */}
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
                    ? `[Demo Mode] Ask with ${contextItems.length} context items...` 
                    : "[Demo Mode] Ask AI... (Shift+Enter for new line)")
                : (contextItems.length > 0 
                    ? `Ask AI with ${contextItems.length} context items...` 
                    : "Ask AI... (Shift+Enter for new line)")
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