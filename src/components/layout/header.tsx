import { motion } from "framer-motion";
import { 
  Search, 
  Settings,
  StickyNote,
  Sparkles,
  Minus,
  Square,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onSearchToggle: () => void;
  onStickyNoteToggle: () => void;
  zoomLevel: number;
}

export function Header({ 
  onSearchToggle, 
  onStickyNoteToggle,
  zoomLevel,
}: HeaderProps) {
  const scale = (base: number) => base * (zoomLevel / 100);

  return (
    <motion.div
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="flex items-center border-b bg-zinc-100/60 dark:bg-zinc-900/60 backdrop-blur-xl border-black/10 dark:border-white/10"
      style={{ height: `${scale(40)}px`}}
    >
      <div className="relative z-10 flex items-center w-full">
        {/* Left - App Title & Navigation */}
        <div className="flex-1 flex items-center">
          <div 
            className="w-72 flex items-center border-r border-black/10 dark:border-white/10"
            style={{ paddingLeft: `${scale(16)}px`, paddingRight: `${scale(16)}px`, height: '100%' }}
          >
            <div className="flex items-center" style={{ columnGap: `${scale(8)}px`}}>
              <div 
                className="bg-gradient-to-br from-blue-400 to-purple-600 rounded-md flex items-center justify-center"
                style={{
                  width: `${scale(24)}px`,
                  height: `${scale(24)}px`,
                }}
              >
                <Sparkles style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }} className="text-white" />
              </div>
              <span 
                className="font-semibold text-zinc-800 dark:text-zinc-200"
                style={{ fontSize: `${scale(14)}px`}}
              >
                FLux
              </span>
            </div>
          </div>
        </div>

        {/* Center - Enhanced Search */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <Button 
            variant="glass" 
            size="sm"
            onClick={onSearchToggle}
            className="text-zinc-700 dark:text-zinc-300 border border-black/15 dark:border-white/20 hover:bg-black/5 dark:hover:bg-white/5 backdrop-blur-xl rounded-full relative overflow-hidden group"
            style={{
              height: `${scale(32)}px`,
              paddingLeft: `${scale(16)}px`,
              paddingRight: `${scale(16)}px`,
              fontSize: `${scale(12)}px`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center" style={{ columnGap: `${scale(8)}px`}}>
              <Search style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }} />
              <span>검색하기...</span>
            </div>
          </Button>
        </div>

        {/* Right - Enhanced Controls */}
        <div className="flex items-center px-4" style={{ columnGap: `${scale(8)}px`}}>
          <Button
            onClick={onStickyNoteToggle}
            variant="ghost"
            size="xs"
            className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-xl transition-all duration-200 rounded-md flex items-center justify-center"
            style={{
              height: `${scale(28)}px`,
              width: `${scale(28)}px`,
            }}
            title="스티키 노트"
          >
            <StickyNote style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }} />
          </Button>
          
          <Button
            variant="ghost"
            size="xs"
            className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-xl transition-all duration-200 rounded-md flex items-center justify-center"
            style={{
              height: `${scale(28)}px`,
              width: `${scale(28)}px`,
            }}
            title="설정"
          >
            <Settings style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }} />
          </Button>
          
          <div className="w-px bg-black/10 dark:bg-white/20" style={{ height: `${scale(20)}px`}} />
          
          {/* Window Controls */}
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="xs"
              className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-xl transition-all duration-200 flex items-center justify-center rounded-r-none"
              style={{
                height: `${scale(28)}px`,
                width: `${scale(32)}px`,
              }}
              title="최소화"
            >
              <Minus style={{ width: `${scale(12)}px`, height: `${scale(12)}px` }} />
            </Button>
            
            <Button
              variant="ghost"
              size="xs"
              className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 backdrop-blur-xl transition-all duration-200 flex items-center justify-center rounded-none border-x border-black/10 dark:border-white/10"
              style={{
                height: `${scale(28)}px`,
                width: `${scale(32)}px`,
              }}
              title="최대화"
            >
              <Square style={{ width: `${scale(10)}px`, height: `${scale(10)}px` }} />
            </Button>
            
            <Button
              variant="ghost"
              size="xs"
              className="text-zinc-600 dark:text-zinc-400 hover:bg-red-500/80 dark:hover:bg-red-500/50 hover:text-white dark:hover:text-white backdrop-blur-xl transition-all duration-200 flex items-center justify-center rounded-l-none"
              style={{
                height: `${scale(28)}px`,
                width: `${scale(32)}px`,
              }}
              title="닫기"
            >
              <X style={{ width: `${scale(12)}px`, height: `${scale(12)}px` }} />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}