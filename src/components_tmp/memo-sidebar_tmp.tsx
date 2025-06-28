import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus,
  Highlighter,
  Square,
  CheckSquare,
  XSquare,
  Circle,
  Triangle,
  Star,
  Palette,
  Trash2,
  MessageCircle,
  PanelRightClose,
  Save,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MemoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'memo' | 'chat';
  onModeChange: (mode: 'memo' | 'chat') => void;
}

interface MemoItem {
  id: string;
  content: string;
  type: 'text' | 'highlight' | 'sticker';
  stickerType?: 'checkbox' | 'checked' | 'x' | 'circle' | 'triangle' | 'star';
  color?: string;
  timestamp: Date;
}

export function MemoSidebar({ isOpen, onClose, mode, onModeChange }: MemoSidebarProps) {
  const [memos, setMemos] = useState<MemoItem[]>([]);
  const [currentMemo, setCurrentMemo] = useState("");
  const [selectedColor, setSelectedColor] = useState("#3b82f6");
  const [isDragging, setIsDragging] = useState(false);

  const colors = [
    "#3b82f6", "#10b981", "#f59e0b", "#ef4444", 
    "#8b5cf6", "#06b6d4", "#ec4899", "#84cc16"
  ];

  const stickerIcons = {
    checkbox: Square,
    checked: CheckSquare,
    x: XSquare,
    circle: Circle,
    triangle: Triangle,
    star: Star
  };

  const addMemo = () => {
    if (!currentMemo.trim()) return;

    const newMemo: MemoItem = {
      id: Date.now().toString(),
      content: currentMemo,
      type: 'text',
      timestamp: new Date()
    };

    setMemos(prev => [newMemo, ...prev]);
    setCurrentMemo("");
  };

  const addSticker = (type: keyof typeof stickerIcons) => {
    const newMemo: MemoItem = {
      id: Date.now().toString(),
      content: '',
      type: 'sticker',
      stickerType: type,
      color: selectedColor,
      timestamp: new Date()
    };

    setMemos(prev => [newMemo, ...prev]);
  };

  const addHighlight = () => {
    if (!currentMemo.trim()) return;

    const newMemo: MemoItem = {
      id: Date.now().toString(),
      content: currentMemo,
      type: 'highlight',
      color: selectedColor,
      timestamp: new Date()
    };

    setMemos(prev => [newMemo, ...prev]);
    setCurrentMemo("");
  };

  const deleteMemo = (id: string) => {
    setMemos(prev => prev.filter(memo => memo.id !== id));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedText = e.dataTransfer.getData('text');
    if (droppedText) {
      setCurrentMemo(prev => prev + (prev ? '\n\n' : '') + droppedText);
    }
  };

  const renderMemoItem = (memo: MemoItem) => {
    if (memo.type === 'sticker') {
      const StickerIcon = stickerIcons[memo.stickerType!];
      return (
        <motion.div
          key={memo.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-between p-1.5 bg-white/5 rounded-md group backdrop-blur-xl mb-1"
        >
          <StickerIcon 
            className="h-3.5 w-3.5" 
            style={{ color: memo.color }}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteMemo(memo.id)}
            className="h-4 w-4 opacity-0 group-hover:opacity-100 text-white/50 hover:bg-white/10"
          >
            <Trash2 className="h-2.5 w-2.5" />
          </Button>
        </motion.div>
      );
    }

    return (
      <motion.div
        key={memo.id}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-2 rounded-md group backdrop-blur-xl relative overflow-hidden mb-1 ${
          memo.type === 'highlight' 
            ? 'bg-opacity-20' 
            : 'bg-white/5'
        }`}
        style={memo.type === 'highlight' ? { backgroundColor: memo.color + '33' } : {}}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-md" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <p className="text-white text-xs flex-1 leading-relaxed">{memo.content}</p>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteMemo(memo.id)}
              className="h-4 w-4 opacity-0 group-hover:opacity-100 text-white/50 hover:bg-white/10"
            >
              <Trash2 className="h-2.5 w-2.5" />
            </Button>
          </div>
          <div className="text-white/40 text-[9px] mt-1">
            {memo.timestamp.toLocaleTimeString()}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: 320 }}
          animate={{ x: 0 }}
          exit={{ x: 320 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="w-80 h-full border-l border-white/10 bg-white/[0.08] backdrop-blur-xl flex flex-col relative overflow-hidden"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {/* Liquid Glass Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          <div className="absolute inset-0 backdrop-blur-3xl bg-white/[0.02]" />
          
          {/* Drag Overlay */}
          {isDragging && (
            <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-400 border-dashed z-50 flex items-center justify-center">
              <div className="text-white text-center">
                <FileText className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">여기에 드롭하여 추가</p>
              </div>
            </div>
          )}
          
          <div className="relative z-10 flex flex-col h-full">
            {/* Minimal Header */}
            <div className="flex items-center justify-between p-2 border-b border-white/20">
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/10 h-5 w-5"
              >
                <PanelRightClose className="h-3 w-3" />
              </Button>
              <div className="flex items-center gap-0.5">
                <Button
                  variant={mode === 'memo' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onModeChange('memo')}
                  className="text-white h-5 px-2 text-[10px] backdrop-blur-xl"
                >
                  메모
                </Button>
                <Button
                  variant={mode === 'chat' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => onModeChange('chat')}
                  className="text-white h-5 px-2 text-[10px] backdrop-blur-xl"
                >
                  AI
                </Button>
              </div>
            </div>

            {mode === 'memo' ? (
              <>
                {/* Main Writing Area - Takes Most Space */}
                <div className="flex-1 flex flex-col p-2">
                  <Textarea
                    placeholder="여기에 바로 작성하세요... 드래그 앤 드롭도 지원합니다"
                    value={currentMemo}
                    onChange={(e) => setCurrentMemo(e.target.value)}
                    className="flex-1 bg-white/5 border-white/20 text-white placeholder:text-white/50 resize-none text-sm backdrop-blur-xl leading-relaxed"
                    style={{ minHeight: '60vh' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                        addMemo();
                      }
                    }}
                  />
                  
                  {/* Quick Actions Bar */}
                  <div className="flex items-center justify-between mt-2 p-2 bg-white/5 rounded-md backdrop-blur-xl">
                    <div className="flex items-center gap-1">
                      {/* Color Palette - Compact */}
                      <div className="flex gap-0.5">
                        {colors.slice(0, 4).map(color => (
                          <button
                            key={color}
                            onClick={() => setSelectedColor(color)}
                            className={`w-3 h-3 rounded-full border backdrop-blur-xl ${
                              selectedColor === color ? 'border-white' : 'border-white/30'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      
                      {/* Quick Stickers */}
                      <div className="flex gap-0.5 ml-2">
                        {Object.entries(stickerIcons).slice(0, 3).map(([type, Icon]) => (
                          <Button
                            key={type}
                            onClick={() => addSticker(type as keyof typeof stickerIcons)}
                            variant="ghost"
                            size="icon"
                            className="text-white hover:bg-white/10 h-5 w-5 backdrop-blur-xl"
                          >
                            <Icon className="h-3 w-3" />
                          </Button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <Button
                        onClick={addHighlight}
                        size="sm"
                        variant="ghost"
                        className="text-white hover:bg-white/10 h-5 px-2 text-[10px] backdrop-blur-xl"
                        disabled={!currentMemo.trim()}
                      >
                        <Highlighter className="h-3 w-3 mr-1" />
                        하이라이트
                      </Button>
                      <Button
                        onClick={addMemo}
                        size="sm"
                        className="bg-blue-500/80 hover:bg-blue-600/80 text-white h-5 px-2 text-[10px] backdrop-blur-xl"
                        disabled={!currentMemo.trim()}
                      >
                        <Save className="h-3 w-3 mr-1" />
                        저장
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Saved Memos - Compact List */}
                {memos.length > 0 && (
                  <div className="border-t border-white/20 p-2 max-h-32">
                    <div className="text-white/60 text-[10px] mb-1 flex items-center justify-between">
                      <span>저장된 메모 ({memos.length})</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 text-white/50 hover:bg-white/10"
                        onClick={() => setMemos([])}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                    <ScrollArea className="h-24">
                      <div className="space-y-0.5">
                        {memos.map(renderMemoItem)}
                      </div>
                    </ScrollArea>
                  </div>
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/60">
                <div className="text-center">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">AI 채팅 기능</p>
                  <p className="text-[10px] mt-1">곧 구현될 예정입니다</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}