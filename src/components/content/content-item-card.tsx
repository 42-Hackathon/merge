import * as React from 'react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem } from '@/types/content';
import { 
  MoreHorizontal,
  Star,
  Share2,
  Image as ImageIcon,
  Link as LinkIcon,
  Video as VideoIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Helper to get hostname from a URL
const getHostname = (url: string | undefined): string => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
};

interface ContentItemCardProps {
  item: ContentItem;
  viewMode: 'masonry' | 'grid' | 'list' | 'justified';
  selectedItems: string[];
  scale: (base: number) => number;
  onItemSelect: (item: ContentItem) => void;
  onDragStart: (e: React.MouseEvent | React.TouchEvent | MouseEvent, item: ContentItem) => void;
  onDragEnd: () => void;
}

const ContentPreview: React.FC<{ item: ContentItem; viewMode: ContentItemCardProps['viewMode']; scale: ContentItemCardProps['scale'] }> = React.memo(({ item, viewMode, scale }) => {
  const baseHeight = viewMode === 'list' ? scale(48) : scale(120);
  const commonWrapperClass = `bg-zinc-200 dark:bg-zinc-800 rounded-md flex items-center justify-center relative overflow-hidden`;
  const commonIconClass = "text-zinc-600 dark:text-zinc-400";

  if (item.type === 'image' && item.metadata?.imageUrl) {
    return (
      <div style={{width: viewMode === 'list' ? `${scale(48)}px` : '100%', height: `${baseHeight}px`}} className={commonWrapperClass}>
        <img src={item.metadata.imageUrl} alt={item.title} className="w-full h-full object-cover" />
      </div>
    );
  }
  
  if (item.type === 'image' && !item.metadata?.imageUrl) {
     return (
        <div style={{width: viewMode === 'list' ? `${scale(48)}px` : '100%', height: `${baseHeight}px`}} className={commonWrapperClass}>
            <ImageIcon style={{width: scale(24), height: scale(24)}} className={commonIconClass} />
        </div>
     )
  }

  if (item.type === 'link') {
    return (
      <div style={{width: viewMode === 'list' ? `${scale(48)}px` : '100%', height: `${baseHeight}px`}} className={`${commonWrapperClass} text-center`}>
        <LinkIcon style={{width: scale(24), height: scale(24)}} className={commonIconClass} />
        <p style={{fontSize: `${scale(10)}px`}} className="text-zinc-500 dark:text-zinc-400 mt-1 truncate w-full px-2">
            {getHostname(item.metadata?.url) || 'Link'}
        </p>
      </div>
    );
  }

  if (item.type === 'video') {
    return (
      <div style={{width: viewMode === 'list' ? `${scale(48)}px` : '100%', height: `${baseHeight}px`}} className={commonWrapperClass}>
        <VideoIcon style={{width: scale(24), height: scale(24)}} className={commonIconClass} />
      </div>
    );
  }
  
  // Default to text content
  return (
    <div className={`text-zinc-700 dark:text-zinc-300 ${viewMode !== 'list' ? 'max-h-48 overflow-hidden' : ''}`}>
      <p style={{fontSize: `${scale(12)}px`}} className="line-clamp-5">
        {item.content}
      </p>
    </div>
  );
});

const CardHoverControls: React.FC = () => (
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
);


export const ContentItemCard: React.FC<ContentItemCardProps> = React.memo(({ 
  item, 
  viewMode,
  selectedItems,
  scale, 
  onItemSelect, 
  onDragStart, 
  onDragEnd 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const isSelected = selectedItems.includes(item.id);
  const hostname = getHostname(item.metadata?.url);

  // Common styles
  const cardClasses = `relative p-2 rounded-lg transition-all duration-200 ease-in-out cursor-pointer group
    bg-zinc-100/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-black/10 dark:border-white/10
    ${viewMode === 'masonry' ? 'break-inside-avoid mb-4' : ''}
    ${isHovered ? 'bg-zinc-200/70 dark:bg-zinc-800/70' : ''}
    ${isSelected ? 'bg-blue-500/10 dark:bg-blue-500/10 ring-2 ring-blue-500' : ''}`;

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        key={item.id}
        draggable
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onDragStart={(e: any) => onDragStart(e, item)}
        onDragEnd={onDragEnd}
        onClick={() => onItemSelect(item)}
        className={`${cardClasses} flex items-center`}
        style={{ padding: `${scale(8)}px`, columnGap: `${scale(12)}px` }}
        whileTap={{ scale: 0.98 }}
      >
        <div style={{ flexShrink: 0 }}>
          <ContentPreview item={item} viewMode={viewMode} scale={scale} />
        </div>
        <div className="flex-1 overflow-hidden">
          <h3 style={{fontSize: `${scale(13)}px`}} className="font-semibold text-zinc-800 dark:text-zinc-200 truncate">{item.title}</h3>
          <p style={{fontSize: `${scale(12)}px`}} className="text-zinc-500 dark:text-zinc-400 truncate mt-0.5">{item.summary || item.content}</p>
        </div>
        <div className="flex items-center text-zinc-500 dark:text-zinc-400" style={{columnGap: `${scale(16)}px`}}>
            {hostname && (
                 <img 
                    src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`} 
                    alt={`${hostname} favicon`}
                    width={scale(14)}
                    height={scale(14)}
                    className="rounded-sm"
                />
            )}
          <span style={{fontSize: `${scale(11)}px`}}>{new Date(item.createdAt).toLocaleDateString()}</span>
        </div>
      </motion.div>
    );
  }
  
  return (
    <motion.div
      layout
      key={item.id}
      draggable
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onDragStart={(e: any) => onDragStart(e, item)}
      onDragEnd={onDragEnd}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onItemSelect(item)}
      className={cardClasses}
      style={{
        padding: `${scale(12)}px`,
        marginBottom: viewMode === 'masonry' ? `${scale(16)}px` : '0',
      }}
      whileHover={{ y: -scale(2) }}
      whileTap={{ scale: 0.98 }}
    >
      <AnimatePresence>
        {isHovered && <CardHoverControls />}
      </AnimatePresence>
      
      <div className="flex flex-col h-full">
        {/* Title */}
        <h3 style={{fontSize: `${scale(14)}px`}} className="font-semibold text-zinc-800 dark:text-zinc-200 truncate mb-2">{item.title}</h3>

        {/* Content Preview */}
        <div className="mb-2">
            <ContentPreview item={item} viewMode={viewMode} scale={scale}/>
        </div>
        
        {/* AI Summary */}
        {item.summary && (
            <div className="mt-1 mb-2 p-2 bg-black/5 dark:bg-white/5 rounded-md">
                <p style={{fontSize: `${scale(11)}px`}} className="text-zinc-600 dark:text-zinc-400 line-clamp-3">
                    <span className="font-semibold">AI 요약:</span> {item.summary}
                </p>
            </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-end justify-between text-zinc-500 dark:text-zinc-400">
            {/* Keywords (tags) */}
            <div className="flex flex-wrap gap-1">
                {item.tags?.slice(0, 3).map((tag: string) => (
                    <Badge key={tag} variant="secondary" className="px-1.5 py-0.5 bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300" style={{fontSize: `${scale(10)}px`}}>{tag}</Badge>
                ))}
            </div>

            {/* Favicon & Date */}
            <div className="flex items-center flex-shrink-0 ml-2" style={{gap: `${scale(6)}px`}}>
                {hostname && (
                    <img 
                        src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`} 
                        alt={`${hostname} favicon`}
                        width={scale(14)}
                        height={scale(14)}
                        className="rounded-sm"
                    />
                )}
                <span style={{fontSize: `${scale(11)}px`}} className="whitespace-nowrap">{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
        </div>
      </div>
    </motion.div>
  );
}); 