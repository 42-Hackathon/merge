import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem } from '@/types/content';
import { 
  MoreHorizontal,
  Star,
  Share2,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface ContentItemCardProps {
  item: ContentItem;
  viewMode: 'masonry' | 'grid' | 'list' | 'justified';
  selectedItems: string[];
  scale: (base: number) => number;
  onItemSelect: (item: ContentItem) => void;
  onDragStart: (e: MouseEvent | TouchEvent | PointerEvent, item: ContentItem) => void;
  onDragEnd: () => void;
}

export function ContentItemCard({ 
  item, 
  viewMode,
  selectedItems,
  scale, 
  onItemSelect, 
  onDragStart, 
  onDragEnd 
}: ContentItemCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getContentPreview = (item: ContentItem) => {
    const baseHeight = viewMode === 'list' ? scale(48) : scale(144);
    
    switch (item.type) {
      case 'image':
        return (
          <div style={{width: viewMode === 'list' ? `${scale(48)}px` : '100%', height: `${baseHeight}px`}} className={`bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}>
            <span style={{fontSize: `${scale(12)}px`}} className="text-zinc-600 dark:text-zinc-400">이미지</span>
          </div>
        );
      case 'link':
        return (
          <div style={{width: viewMode === 'list' ? `${scale(48)}px` : '100%', height: `${baseHeight}px`}} className={`bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}>
            <div className="text-center text-zinc-700 dark:text-zinc-300">
              <div style={{fontSize: `${scale(12)}px`}} className="font-medium">🔗</div>
              <div style={{fontSize: `${scale(10)}px`}} className="opacity-80">
                {item.metadata?.url ? new URL(item.metadata.url).hostname : 'Link'}
              </div>
            </div>
          </div>
        );
      case 'video':
        return (
          <div style={{width: viewMode === 'list' ? `${scale(48)}px` : '100%', height: `${baseHeight}px`}} className={`bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}>
            <span style={{fontSize: `${scale(12)}px`}} className="text-zinc-600 dark:text-zinc-400">동영상</span>
          </div>
        );
      default:
        return (
          <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
            <p style={{fontSize: `${scale(12)}px`}} className="text-zinc-700 dark:text-zinc-300 line-clamp-3 mb-2">
              {item.content}
            </p>
          </div>
        );
    }
  };

  const isSelected = selectedItems.includes(item.id);

  return (
    <motion.div
      layout
      key={item.id}
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onItemSelect(item)}
      className={`relative p-2 rounded-lg transition-all duration-200 ease-in-out cursor-pointer group
        bg-zinc-100/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-black/10 dark:border-white/10
        ${viewMode === 'masonry' ? 'break-inside-avoid mb-4' : ''}
        ${isHovered ? 'bg-zinc-200/70 dark:bg-zinc-800/70' : ''}
        ${isSelected ? 'bg-blue-500/10 dark:bg-blue-500/10 ring-2 ring-blue-500' : ''}`}
      style={{
        padding: `${scale(8)}px`,
        marginBottom: viewMode === 'masonry' ? `${scale(16)}px` : '0',
      }}
      whileHover={{ y: -scale(2) }}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-2 right-2 z-10 flex items-center gap-1"
          >
            <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20">
              <Star className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />
          </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20">
              <Share2 className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />
          </Button>
            <Button variant="ghost" size="icon" className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20">
              <MoreHorizontal className="w-3 h-3 text-zinc-600 dark:text-zinc-300" />
          </Button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {viewMode === 'list' ? (
        <div className="flex items-center" style={{columnGap: `${scale(12)}px`}}>
          {getContentPreview(item)}
          <div className="flex-1">
            <h3 style={{fontSize: `${scale(14)}px`}} className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{item.title}</h3>
            <p style={{fontSize: `${scale(12)}px`}} className="text-zinc-500 dark:text-zinc-400 truncate">{item.content}</p>
          </div>
          <div className="flex items-center text-zinc-500 dark:text-zinc-400" style={{columnGap: `${scale(12)}px`}}>
            <div className="flex items-center" style={{columnGap: `${scale(4)}px`}}>
              <Calendar style={{width: `${scale(12)}px`, height: `${scale(12)}px`}} />
              <span style={{fontSize: `${scale(11)}px`}}>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      ) : (
        <>
          {getContentPreview(item)}
          <h3 style={{fontSize: `${scale(14)}px`}} className="font-semibold text-zinc-800 dark:text-zinc-200 truncate mt-1">{item.title}</h3>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 mt-2">
            <div className="flex items-center gap-2" style={{fontSize: `${scale(11)}px`}}>
              <div className="flex items-center gap-1">
                <Calendar style={{width: `${scale(12)}px`, height: `${scale(12)}px`}} />
                <span>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

            {item.tags && (
              <div className="flex gap-1">
                {item.tags.slice(0, 2).map((tag: string) => (
                  <Badge key={tag} variant="secondary" className="px-1.5 py-0.5 bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300" style={{fontSize: `${scale(9)}px`}}>{tag}</Badge>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </motion.div>
  );
} 