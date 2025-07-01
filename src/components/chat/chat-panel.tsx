import { useState } from 'react';
import { Bot, Send, Settings, PanelRightOpen } from 'lucide-react';
import { Button } from '../ui/button';

interface ChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function ChatPanel({ isOpen, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
            content: 'Hello! How can I help you today?',
      sender: 'ai',
            timestamp: new Date(),
        },
  ]);
    const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        const userMessage: Message = {
      id: Date.now().toString(),
            content: newMessage,
      sender: 'user',
            timestamp: new Date(),
    };
        setMessages((prev) => [...prev, userMessage]);
        setNewMessage('');
    };

    if (!isOpen) return null;

  return (
        <div className="h-full w-full flex flex-col bg-zinc-100/60 backdrop-blur-xl border-l border-black/10 rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-black/10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                        <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                        <h2 className="text-zinc-800 font-medium">AI Assistant</h2>
                        <p className="text-zinc-500 text-xs">Online</p>
                  </div>
                </div>
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="text-zinc-600 hover:bg-black/10 h-8 w-8 rounded-lg">
                        <Settings className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                        className="text-zinc-600 hover:bg-black/10 h-8 w-8 rounded-lg"
                  >
                        <PanelRightOpen className="w-4 h-4" />
                  </Button>
                </div>
              </div>

            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex items-start gap-3 ${
                            message.sender === 'user' ? 'justify-end' : ''
                        }`}
                    >
                        {message.sender === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 flex-shrink-0" />
                        )}
                        <div
                            className={`max-w-xs md:max-w-md p-3 rounded-lg ${
                                message.sender === 'user'
                            ? 'bg-blue-500 text-white'
                                    : 'bg-black/5 text-zinc-800'
                            }`}
                        >
                            <p>{message.content}</p>
                            <p className="text-zinc-500 text-xs mt-1">
                                {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

            <div className="p-4 border-t border-black/10">
                <div className="relative">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSendMessage())}
                        placeholder="Type your message..."
                        className="pl-4 pr-10 h-12 bg-black/5 border-black/10 text-zinc-800 placeholder:text-zinc-500 rounded-xl w-full resize-none"
                  />
                  <Button
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 bg-blue-500 hover:bg-blue-600"
                    onClick={handleSendMessage}
                  >
                        <Send className="w-4 h-4 text-white" />
                  </Button>
                </div>
              </div>
            </div>
  );
}