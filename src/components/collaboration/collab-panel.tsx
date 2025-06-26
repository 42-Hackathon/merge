import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  MessageCircle, 
  X,
  Send,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Settings,
  UserPlus,
  Crown,
  Circle
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";

interface CollabPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'away' | 'offline';
  role: 'owner' | 'editor' | 'viewer';
  cursor?: { x: number; y: number };
}

interface ChatMessage {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'system';
}

export function CollabPanel({ isOpen, onClose }: CollabPanelProps) {
  const [message, setMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(false);
  
  const [users] = useState<User[]>([
    {
      id: '1',
      name: '김철수',
      status: 'online',
      role: 'owner'
    },
    {
      id: '2',
      name: '이영희',
      status: 'online',
      role: 'editor'
    },
    {
      id: '3',
      name: '박민수',
      status: 'away',
      role: 'viewer'
    }
  ]);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      userId: '2',
      content: '새로운 디자인 시스템 자료를 추가했습니다!',
      timestamp: new Date(Date.now() - 300000),
      type: 'text'
    },
    {
      id: '2',
      userId: 'system',
      content: '박민수님이 참여했습니다.',
      timestamp: new Date(Date.now() - 180000),
      type: 'system'
    }
  ]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      userId: '1', // 현재 사용자
      content: message,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'owner': return Crown;
      default: return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          
          {/* Collaboration Panel */}
          <motion.div
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 h-full w-80 z-50"
          >
            <GlassCard className="h-full m-4 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-600 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-white font-medium">실시간 협업</h2>
                    <p className="text-white/60 text-xs">{users.filter(u => u.status === 'online').length}명 온라인</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white hover:bg-white/10 h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Users List */}
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white/80 text-sm font-medium">참여자</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/10 h-6 w-6"
                  >
                    <UserPlus className="h-3 w-3" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {users.map(user => {
                    const RoleIcon = getRoleIcon(user.role);
                    return (
                      <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {user.name.charAt(0)}
                            </span>
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(user.status)} rounded-full border-2 border-white/20`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-1">
                            <span className="text-white text-sm">{user.name}</span>
                            {RoleIcon && <RoleIcon className="h-3 w-3 text-yellow-400" />}
                          </div>
                          <span className="text-white/50 text-xs capitalize">{user.role}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Voice/Video Controls */}
              <div className="p-4 border-b border-white/20">
                <div className="flex items-center gap-2">
                  <Button
                    variant={isMuted ? "destructive" : "secondary"}
                    size="icon"
                    onClick={() => setIsMuted(!isMuted)}
                    className="h-8 w-8"
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isVideoOn ? "secondary" : "ghost"}
                    size="icon"
                    onClick={() => setIsVideoOn(!isVideoOn)}
                    className="h-8 w-8 text-white hover:bg-white/10"
                  >
                    {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/10"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/10"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Chat */}
              <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 p-4 border-b border-white/20">
                  <MessageCircle className="h-4 w-4 text-white/70" />
                  <span className="text-white/80 text-sm font-medium">채팅</span>
                </div>

                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-3">
                    {messages.map(msg => {
                      if (msg.type === 'system') {
                        return (
                          <div key={msg.id} className="text-center">
                            <span className="text-white/50 text-xs bg-white/5 px-2 py-1 rounded-full">
                              {msg.content}
                            </span>
                          </div>
                        );
                      }

                      const user = users.find(u => u.id === msg.userId);
                      const isCurrentUser = msg.userId === '1';

                      return (
                        <div key={msg.id} className={`flex gap-2 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                          <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-white text-xs">
                              {user?.name.charAt(0) || 'U'}
                            </span>
                          </div>
                          <div className={`flex-1 ${isCurrentUser ? 'text-right' : ''}`}>
                            <div className={`inline-block p-2 rounded-lg max-w-[80%] ${
                              isCurrentUser
                                ? 'bg-blue-500 text-white'
                                : 'bg-white/10 text-white'
                            }`}>
                              <p className="text-sm">{msg.content}</p>
                            </div>
                            <p className="text-white/50 text-xs mt-1">
                              {msg.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>

                <div className="p-4 border-t border-white/20">
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="메시지 입력... (/ 로 빠른 채팅)"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                      className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                    />
                    <Button
                      onClick={sendMessage}
                      size="icon"
                      className="bg-blue-500 hover:bg-blue-600 h-8 w-8"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}