import React, { useRef, useEffect, useState, memo } from 'react';
import { 
  FileText, Image, Link as LinkIcon, X, ChevronUp, Film, 
  Music, Camera, Clipboard 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentPill, ContentType } from '../types';

interface ContentPillBarProps {
  pills: ContentPill[];
  onRemovePill: (pillId: string) => void;
  onPillDragStart: (e: React.DragEvent, pill: ContentPill) => void;
  onDrop: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  isDragOver: boolean;
  className?: string;
}

const PillIcon = memo(({ type }: { type: ContentType }) => {
  switch (type) {
    case 'image': return <Image className="h-4 w-4" />;
    case 'link': return <LinkIcon className="h-4 w-4" />;
    case 'video': return <Film className="h-4 w-4" />;
    case 'audio': return <Music className="h-4 w-4" />;
    case 'clipboard': return <Clipboard className="h-4 w-4" />;
    case 'screenshot': return <Camera className="h-4 w-4" />;
    case 'text':
    default:
      return <FileText className="h-4 w-4" />;
  }
});

PillIcon.displayName = 'PillIcon';

const getPillStyleClass = (type: ContentType) => {
  switch (type) {
    case 'link':
      return `border-blue-500/80 text-blue-300`;
    case 'image':
      return `border-purple-500/80 text-purple-300`;
    case 'video':
      return `border-red-500/80 text-red-300`;
    case 'audio':
      return `border-orange-500/80 text-orange-300`;
    case 'clipboard':
      return `border-yellow-500/80 text-yellow-300`;
    case 'screenshot':
      return `border-cyan-500/80 text-cyan-300`;
    case 'text':
      return `border-green-500/80 text-green-300`;
    case 'other':
    default:
      return `border-gray-500/80 text-gray-300`;
  }
};

export const ContentPillBar = memo(({
  pills,
  onRemovePill,
  onPillDragStart,
  onDrop,
  onDragOver,
  onDragLeave,
  isDragOver,
  className = ''
}: ContentPillBarProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPillOverflowing, setIsPillOverflowing] = useState(false);
  const [isPillListVisible, setIsPillListVisible] = useState(false);
  const pillListPopupRef = useRef<HTMLDivElement>(null);
  const pillOverflowButtonRef = useRef<HTMLButtonElement>(null);

  const MAX_VISIBLE_PILLS = 5;

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const checkOverflow = () => {
      const isOverflowing = scrollContainer.scrollWidth > scrollContainer.clientWidth;
      if (isOverflowing !== isPillOverflowing) {
        setIsPillOverflowing(isOverflowing);
      }
    };
    
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(scrollContainer);
    
    // 초기 체크
    checkOverflow();

    return () => {
      resizeObserver.disconnect();
    };
  }, [pills, isPillOverflowing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pillListPopupRef.current &&
        !pillListPopupRef.current.contains(event.target as Node) &&
        pillOverflowButtonRef.current &&
        !pillOverflowButtonRef.current.contains(event.target as Node)
      ) {
        setIsPillListVisible(false);
      }
    };

    if (isPillListVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPillListVisible]);

  const visiblePills = pills.slice(0, MAX_VISIBLE_PILLS);
  const hiddenPills = pills.slice(MAX_VISIBLE_PILLS);

  return (
    <div 
      className={`relative flex items-center gap-2 ${className}`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <div 
        ref={scrollContainerRef} 
        className="flex-1 flex items-center gap-2 overflow-x-auto scrollbar-none"
      >
        <AnimatePresence mode="popLayout">
          {visiblePills.map((pill, index) => (
            <motion.div
              key={pill.id}
              draggable
              onDragStart={(e) => onPillDragStart(e as any, pill)}
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={`
                inline-flex items-center gap-2 px-3 py-1.5 rounded-full border 
                cursor-move bg-black/40 backdrop-blur-md
                ${getPillStyleClass(pill.type)}
                hover:bg-black/60 transition-colors group
              `}
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.1, zIndex: 50 }}
            >
              <PillIcon type={pill.type} />
              <span className="text-sm truncate max-w-[150px]">{pill.title}</span>
              <button
                onClick={() => onRemovePill(pill.id)}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hiddenPills.length > 0 && (
        <div className="relative">
          <button
            ref={pillOverflowButtonRef}
            onClick={() => setIsPillListVisible(!isPillListVisible)}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-md
              bg-white/10 hover:bg-white/20 transition-colors
              text-xs text-white/70
            `}
          >
            +{hiddenPills.length}
            <ChevronUp 
              className={`h-3 w-3 transition-transform ${isPillListVisible ? 'rotate-180' : ''}`} 
            />
          </button>

          <AnimatePresence>
            {isPillListVisible && (
              <motion.div
                ref={pillListPopupRef}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 top-full mt-2 w-64 max-h-80 overflow-y-auto
                  bg-gray-900 border border-white/10 rounded-lg shadow-xl z-50"
              >
                {hiddenPills.map((pill) => (
                  <div
                    key={pill.id}
                    draggable
                    onDragStart={(e) => onPillDragStart(e, pill)}
                    className={`
                      flex items-center gap-2 px-3 py-2 hover:bg-white/5
                      cursor-move border-b border-white/5 last:border-0
                    `}
                  >
                    <PillIcon type={pill.type} />
                    <span className="text-sm flex-1 truncate">{pill.title}</span>
                    <button
                      onClick={() => onRemovePill(pill.id)}
                      className="opacity-60 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {isDragOver && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 border-2 border-dashed border-blue-400 
            rounded-lg pointer-events-none"
        />
      )}
    </div>
  );
});

ContentPillBar.displayName = 'ContentPillBar'; 