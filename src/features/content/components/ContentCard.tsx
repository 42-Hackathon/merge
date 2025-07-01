import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Star, Share2, MoreHorizontal } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { Badge } from '@/components/ui/badge';
import { ContentItem } from '../types';

interface ContentCardProps {
  item: ContentItem;
  isSelected: boolean;
  isDragging: boolean;
  isHovered: boolean;
  viewMode: 'masonry' | 'grid' | 'list' | 'justified';
  onHover: (id: string | null) => void;
  onSelect: (item: ContentItem) => void;
  onDragStart: (e: React.DragEvent, item: ContentItem) => void;
  onDragEnd: (e: React.DragEvent) => void;
}

export const ContentCard = memo(({
  item,
  isSelected,
  isDragging,
  isHovered,
  viewMode,
  onHover,
  onSelect,
  onDragStart,
  onDragEnd
}: ContentCardProps) => {
  const isListView = viewMode === 'list';

  // Clean domain helper
  const cleanDomain = (url: string): string => {
    try {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
      return urlObj.hostname.replace(/^www\./, '');
    } catch {
      return url.replace(/^www\./, '');
    }
  };

  const cardContent = (
    <GlassCard
      variant="subtle"
      className={`
        group relative cursor-pointer
        ${isListView ? 'flex items-center py-1 px-3' : 'py-1 px-2'}
        ${isSelected ? 'ring-2 ring-blue-500' : ''}
        ${isDragging ? 'opacity-50' : ''}
        transition-all duration-200
      `}
      onClick={() => onSelect(item)}
      onMouseEnter={() => onHover(item.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Content Preview */}
      <div className={isListView ? 'mr-3' : 'mb-2'}>
        <ContentPreview item={item} viewMode={viewMode} />
      </div>

      {/* Content Info */}
      <div className={isListView ? 'flex-1 flex items-center justify-between' : ''}>
        <div className={isListView ? 'flex-1' : ''}>
          <h3 className={`font-semibold text-white truncate ${isListView ? 'text-sm' : 'text-xs'}`}>
            {item.title}
          </h3>
          
          {/* Keywords */}
          {item.keywords && item.keywords.length > 0 && !isListView && (
            <div className="flex flex-wrap gap-1 mt-1">
              {item.keywords.slice(0, 3).map((keyword, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/10 text-white/80 text-[10px] px-1.5 py-0.5"
                >
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className={`flex items-center gap-2 text-white/60 ${isListView ? 'text-xs' : 'text-[10px] mt-1'}`}>
            {item.metadata?.domain && (
              <span>{cleanDomain(item.metadata.domain)}</span>
            )}
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className={`${isListView ? 'flex' : 'absolute top-2 right-2'} items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
          <button className="p-1 hover:bg-white/10 rounded">
            <Star className="h-3 w-3" />
          </button>
          <button className="p-1 hover:bg-white/10 rounded">
            <Share2 className="h-3 w-3" />
          </button>
          <button className="p-1 hover:bg-white/10 rounded">
            <MoreHorizontal className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Hover Overlay */}
      {isHovered && !isListView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg pointer-events-none"
        />
      )}
    </GlassCard>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ 
        scale: !isListView ? 1.02 : 1.005,
        y: !isListView ? -4 : 0
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ 
        type: 'tween',
        duration: 0.15,
        ease: 'easeOut'
      }}
      style={{ willChange: 'transform' }}
      className={isListView ? 'mb-2' : 'break-inside-avoid'}
    >
      <div
        draggable
        onDragStart={(e) => onDragStart(e, item)}
        onDragEnd={onDragEnd}
      >
        {cardContent}
      </div>
    </motion.div>
  );
});

ContentCard.displayName = 'ContentCard';

// Separate ContentPreview component
const ContentPreview = memo(({ item, viewMode }: { item: ContentItem; viewMode: string }) => {
  const baseHeight = viewMode === 'list' ? 48 : 144;

  const getYouTubeVideoId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const getFaviconUrl = (url: string): string => {
    try {
      const domain = new URL(url).hostname;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return '';
    }
  };

  switch (item.type) {
    case 'image':
      return (
        <div
          style={{
            width: viewMode === 'list' ? '48px' : '100%',
            height: `${baseHeight}px`,
          }}
          className="relative overflow-hidden rounded-lg bg-gray-900"
        >
          {item.metadata?.url ? (
            <img
              src={item.metadata.url}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">🖼️</span>
            </div>
          )}
        </div>
      );

    case 'link': {
      const faviconUrl = item.metadata?.url ? getFaviconUrl(item.metadata.url) : '';
      return (
        <div
          style={{
            width: viewMode === 'list' ? '48px' : '100%',
            height: '42px',
          }}
          className="bg-white/[0.06] rounded-lg flex items-center px-3 py-2 border border-white/10"
        >
          <div className="w-8 h-8 bg-white/15 rounded-md flex items-center justify-center mr-3">
            {faviconUrl ? (
              <img src={faviconUrl} alt="" className="w-4 h-4" />
            ) : (
              <span>🔗</span>
            )}
          </div>
        </div>
      );
    }

    case 'video': {
      const videoId = item.metadata?.url ? getYouTubeVideoId(item.metadata.url) : null;
      const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
      
      return (
        <div
          style={{
            width: viewMode === 'list' ? '48px' : '100%',
            height: `${baseHeight}px`,
          }}
          className="relative overflow-hidden rounded-lg bg-gray-900"
        >
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={item.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-2xl">📹</span>
            </div>
          )}
        </div>
      );
    }

    default:
      return (
        <div className={viewMode === 'list' ? 'flex-1' : ''}>
          <p className="text-white text-xs line-clamp-3">
            {item.content}
          </p>
        </div>
      );
  }
});

ContentPreview.displayName = 'ContentPreview'; 