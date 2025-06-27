import { useState } from "react";
import { motion, AnimatePresence, MotionValue } from "framer-motion";
import { 
  Folder, 
  FolderOpen, 
  Archive, 
  FileText,
  Image,
  Link,
  Video,
  Clipboard,
  Camera,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ReactNode } from "react";

interface BaseSidebarProps {
  isOpen: boolean;
  onClose?: () => void;
  title: string;
  icon: React.ElementType;
  position?: 'left' | 'right';
  children: ReactNode;
  className?: string;
  width?: MotionValue<number>;
  onResizeMouseDown?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

interface FolderItem {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  children?: FolderItem[];
  isExpanded?: boolean;
}

export function BaseSidebar({ 
  isOpen,
  onClose,
  title,
  icon: Icon,
  position = 'left',
  children,
  width: motionWidth,
  onResizeMouseDown,
  className = ''
}: BaseSidebarProps) {
  const variants = {
    left: {
      initial: { x: '-100%' },
      animate: { x: 0 },
      exit: { x: '-100%' },
    },
    right: {
      initial: { x: '100%' },
      animate: { x: 0 },
      exit: { x: '100%' },
    },
  };

  const borderClass = position === 'left' ? 'border-r' : 'border-l';

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

          {/* Sidebar Panel */}
    <motion.div
            initial={variants[position].initial}
            animate={variants[position].animate}
            exit={variants[position].exit}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`fixed top-0 ${position === 'left' ? 'left-0' : 'right-0'} h-full z-50 ${className}`}
            style={motionWidth ? { width: motionWidth } : {}}
          >
            <div className={`h-full flex flex-col relative bg-zinc-800/80 backdrop-blur-2xl ${borderClass} border-white/[0.15] ${className}`}>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/[0.15] px-3 py-1.5 flex-shrink-0">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-white/90" />
                  <h2 className="font-semibold text-white/90 text-sm">{title}</h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-white/80 hover:text-white hover:bg-white/[0.15] h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto">
                {children}
        </div>

              {/* Resizer Handle */}
              {onResizeMouseDown && position === 'left' && (
          <motion.div
            className="absolute top-0 right-0 h-full w-1 cursor-col-resize z-20"
            onPanStart={onResizeMouseDown}
          />
        )}
              {onResizeMouseDown && position === 'right' && (
                <motion.div
                  className="absolute top-0 left-0 h-full w-1 cursor-col-resize z-20"
                  onPanStart={onResizeMouseDown}
                />
              )}
      </div>
    </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}