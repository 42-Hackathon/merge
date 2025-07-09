import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Grid3X3,
    List,
    LayoutGrid,
    Columns,
    MoreHorizontal,
    Star,
    Share2,
    Edit3,
} from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { GlassCard } from '../ui/glass-card';
import { ContentItem } from '../../types/content';

interface DraggableContentGridProps {
    items: ContentItem[];
    viewMode: 'masonry' | 'grid' | 'list' | 'justified';
    onViewModeChange: (mode: 'masonry' | 'grid' | 'list' | 'justified') => void;
    onItemSelect: (item: ContentItem) => void;
    selectedItems: string[];
    folderName?: string;
    onFileDrop?: (files: FileList) => void;
}

export function DraggableContentGrid({
    items,
    viewMode,
    onViewModeChange,
    onItemSelect,
    selectedItems,
    folderName = 'All Content',
    onFileDrop, // eslint-disable-line @typescript-eslint/no-unused-vars
}: DraggableContentGridProps) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editorContent, setEditorContent] = useState('');

    // 도메인에서 www. 제거하는 함수
    const cleanDomain = (url: string): string => {
        try {
            // http/https가 없으면 추가해서 URL 파싱 시도
            const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`);
            return urlObj.hostname.replace(/^www\./, '');
        } catch {
            // URL 파싱에 실패하면 문자열에서 www. 제거
            return url.replace(/^www\./, '');
        }
    };

    const getGridClassName = () => {
        switch (viewMode) {
            case 'masonry':
                return `columns-1 sm:columns-2 lg:columns-3 xl:columns-4`;
            case 'grid':
                return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
            case 'justified':
                return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5';
            case 'list':
                return 'flex flex-col';
            default:
                return `columns-1 sm:columns-2 lg:columns-3 xl:columns-4`;
        }
    };

    const handleDragStart = (e: React.DragEvent, item: ContentItem) => {
        setDraggedItem(item.id);

        // ContentItem 데이터를 드래그 데이터로 설정
        e.dataTransfer.setData('application/content-item', JSON.stringify(item));
        e.dataTransfer.setData('text/plain', item.content);

        // 드래그 이미지 설정
        e.dataTransfer.effectAllowed = 'copy';

        // 드래그 중 투명도 효과
            const draggedElement = e.target as HTMLElement;
            if (draggedElement) {
                draggedElement.style.opacity = '0.5';
            }
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedItem(null);
        const draggedElement = e.target as HTMLElement;
        if (draggedElement) {
            draggedElement.style.opacity = '1';
        }
    };

    const getContentPreview = (item: ContentItem) => {
        const baseHeight = viewMode === 'list' ? 48 : 144;

        // YouTube 동영상 ID 추출 함수
        const getYouTubeVideoId = (url: string): string | null => {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
        };

        // 파비콘 URL 생성 함수
        const getFaviconUrl = (url: string): string => {
            try {
                const domain = new URL(url).hostname;
                return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
            } catch {
                return '';
            }
        };

        switch (item.type) {
            case 'image': {
                return (
                    <div
                        style={{
                            width: viewMode === 'list' ? `48px` : '100%',
                            height: `${baseHeight}px`,
                        }}
                        className="relative overflow-hidden rounded-lg"
                    >
                        {/* 실제 이미지 표시 */}
                        {item.metadata?.url ? (
                            <img
                                src={item.metadata.url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                style={{ 
                                    borderRadius: viewMode === 'list' ? `6px` : `8px`
                                }}
                                onError={(e) => {
                                    // 이미지 로드 실패 시 플레이스홀더 표시
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    target.nextElementSibling?.setAttribute('style', 'display: flex');
                                }}
                            />
                        ) : null}
                        
                        {/* 플레이스홀더 (이미지 없거나 로드 실패 시) */}
                        <div 
                            className={`bg-gradient-to-br from-blue-50 to-indigo-100 
                                          absolute inset-0 flex items-center justify-center ${item.metadata?.url ? 'hidden' : 'flex'}`}
                    >
                            <motion.div 
                                className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                                initial={{ opacity: 0 }}
                                whileHover={{ opacity: 1 }}
                                transition={{ 
                                    type: 'tween',
                                    duration: 0.25,
                                    ease: 'easeOut'
                                }}
                            />
                        <div className="relative z-10 text-center">
                                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 mx-auto">
                                    <span style={{ fontSize: `20px` }}>🖼️</span>
                            </div>
                            <span
                                    style={{ fontSize: `12px` }}
                                    className="text-white font-medium"
                            >
                                    Image
                            </span>
                            </div>
                        </div>
                        
                        {/* 호버 오버레이 */}
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ 
                                type: 'tween',
                                duration: 0.25,
                                ease: 'easeOut'
                            }}
                        />
                    </div>
                );
            }
            case 'link': {
                const faviconUrl = item.metadata?.url ? getFaviconUrl(item.metadata.url) : '';
                const domain = item.metadata?.url ? new URL(item.metadata.url).hostname.replace('www.', '') : 'Link';
                
                // 링크는 매우 컴팩트한 높이 사용
                const linkHeight = viewMode === 'list' ? 36 : 42;
                
                return (
                    <div
                        style={{
                            width: viewMode === 'list' ? `48px` : '100%',
                            height: `${linkHeight}px`,
                        }}
                        className="bg-white/[0.06] rounded-lg relative overflow-hidden flex items-center justify-start px-3 py-2 border border-white/10"
                    >
                        {/* 파비콘 */}
                        <div className="w-8 h-8 bg-white/15 rounded-md flex items-center justify-center mr-3 flex-shrink-0">
                            {faviconUrl ? (
                                <img
                                    src={faviconUrl}
                                    alt={domain}
                                    className="w-4 h-4 rounded-sm"
                                    onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling?.setAttribute('style', 'display: inline');
                                    }}
                                />
                            ) : null}
                            <span style={{ fontSize: `14px`, display: faviconUrl ? 'none' : 'inline' }}>🔗</span>
                            </div>
                        
                        {/* URL만 표시 */}
                        <div className="flex-1 min-w-0">
                            <div className="text-white/90 text-sm truncate font-mono">
                                {domain}
                            </div>
                        </div>
                        
                        {/* 외부 링크 아이콘 (더 작게) */}
                        <div className="w-3 h-3 text-white/30 flex-shrink-0 ml-2">
                            <svg viewBox="0 0 16 16" fill="currentColor">
                                <path d="M6.22 8.22a.75.75 0 0 0 1.06 1.06L10.94 6H8.75a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V7.56L8.84 11.22a.75.75 0 0 1-1.06-1.06L11.44 6.5H9.25a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0V7.56l-3.66 3.66Z"/>
                            </svg>
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
                            width: viewMode === 'list' ? `48px` : '100%',
                            height: `${baseHeight}px`,
                        }}
                        className="bg-gradient-to-br from-rose-50 to-pink-100 rounded-lg relative overflow-hidden"
                    >
                        {/* YouTube 썸네일 표시 */}
                        {thumbnailUrl ? (
                            <>
                                <img
                                    src={thumbnailUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                    style={{ 
                                        borderRadius: viewMode === 'list' ? `6px` : `8px`
                                    }}
                                    onError={(e) => {
                                        // 썸네일 로드 실패 시 플레이스홀더 표시
                                        const target = e.target as HTMLImageElement;
                                        target.style.display = 'none';
                                        target.nextElementSibling?.setAttribute('style', 'display: flex');
                                    }}
                                />
                                {/* 재생 버튼 오버레이 */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-12 h-12 bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center">
                                        <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-1"></div>
                                    </div>
                                </div>
                                {/* 동영상 길이 표시 */}
                                {item.metadata?.duration && (
                                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded">
                                        {Math.floor(item.metadata.duration / 60)}:{String(item.metadata.duration % 60).padStart(2, '0')}
                                    </div>
                                )}
                            </>
                        ) : (
                            // 플레이스홀더 (YouTube가 아니거나 썸네일 로드 실패 시)
                            <div className="w-full h-full flex items-center justify-center">
                                <motion.div 
                                    className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"
                                    initial={{ opacity: 0 }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ 
                                        type: 'tween',
                                        duration: 0.25,
                                        ease: 'easeOut'
                                    }}
                                />
                        <div className="relative z-10 text-center">
                                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 mx-auto">
                                        <span style={{ fontSize: `20px` }}>📹</span>
                            </div>
                            <span
                                        style={{ fontSize: `12px` }}
                                        className="text-white font-medium"
                            >
                                        Video
                            </span>
                                    {item.metadata?.platform && (
                                        <div style={{ fontSize: `10px` }} className="text-white/80 mt-1">
                                            {item.metadata.platform}
                                        </div>
                                    )}
                                </div>
                        </div>
                        )}
                        
                        {/* 호버 오버레이 */}
                        <motion.div 
                            className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ 
                                type: 'tween',
                                duration: 0.25,
                                ease: 'easeOut'
                            }}
                        />
                    </div>
                );
            }
            default:
                return (
                    <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <p
                            style={{ fontSize: `12px` }}
                            className="text-white line-clamp-3"
                        >
                            {item.content}
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-transparent border-0 shadow-none ring-0 gpu-accelerated">
            {/* Header */}
            <div
                className="flex items-center justify-between optimize-text"
                style={{
                    padding: `8px 16px`,
                }}
            >
                <div className="flex items-center" style={{ columnGap: `12px` }}>
                    <h1
                        className="font-bold text-white"
                        style={{ fontSize: `20px` }}
                    >
                        {folderName}
                    </h1>
                    <Badge
                        variant="secondary"
                        className="bg-white/10 text-white font-mono"
                        style={{
                            fontSize: `12px`,
                            padding: `2px 6px`,
                        }}
                    >
                        {items.length} items
                    </Badge>
                </div>

                <div className="flex items-center" style={{ columnGap: `4px` }}>
                    {/* View Mode Buttons */}
                    <Button
                        variant={viewMode === 'masonry' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => onViewModeChange('masonry')}
                        className="text-white hover:bg-white/10 rounded-md flex items-center justify-center"
                        style={{ height: `28px`, width: `28px` }}
                        title="Masonry View"
                    >
                        <LayoutGrid style={{ height: `14px`, width: `14px` }} />
                    </Button>
                    <Button
                        variant={viewMode === 'justified' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => onViewModeChange('justified')}
                        className="text-white hover:bg-white/10 rounded-md flex items-center justify-center"
                        style={{ height: `28px`, width: `28px` }}
                        title="Justified Layout"
                    >
                        <Columns style={{ height: `14px`, width: `14px` }} />
                    </Button>
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => onViewModeChange('grid')}
                        className="text-white hover:bg-white/10 rounded-md flex items-center justify-center"
                        style={{ height: `28px`, width: `28px` }}
                        title="Grid View"
                    >
                        <Grid3X3 style={{ height: `14px`, width: `14px` }} />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => onViewModeChange('list')}
                        className="text-white hover:bg-white/10 rounded-md flex items-center justify-center"
                        style={{ height: `28px`, width: `28px` }}
                        title="List View"
                    >
                        <List style={{ height: `14px`, width: `14px` }} />
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-y-auto content-scrollbar smooth-scroll" style={{ padding: `16px` }}>
                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-white"
                        >
                            <div
                                className="bg-white/5 rounded-full flex items-center justify-center mb-3"
                                style={{
                                    width: `48px`,
                                    height: `48px`,
                                }}
                            >
                                <Edit3
                                    style={{ height: `24px`, width: `24px` }}
                                />
                            </div>
                            <p style={{ fontSize: `16px` }} className="mb-1">
                                Start a new idea
                            </p>
                            <p style={{ fontSize: `12px` }}>
                                Write directly here or collect content
                            </p>

                            {/* Inline Editor */}
                            <div className="mt-6 w-full max-w-2xl">
                                <Textarea
                                    placeholder="Start writing here... (like Obsidian, Notion)"
                                    value={editorContent}
                                    onChange={(e) => setEditorContent(e.target.value)}
                                    className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder:text-white/60 resize-none rounded-xl"
                                    style={{ fontSize: `14px` }}
                                    onFocus={() => setIsEditing(true)}
                                />
                                {isEditing && (
                                    <div
                                        className="flex justify-end mt-2"
                                        style={{ columnGap: `8px` }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditorContent('');
                                            }}
                                            className="text-white hover:bg-white/10 rounded-md flex items-center justify-center"
                                            style={{
                                                height: `28px`,
                                                padding: `0 12px`,
                                                fontSize: `12px`,
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
                                            style={{
                                                height: `28px`,
                                                padding: `0 12px`,
                                                fontSize: `12px`,
                                            }}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className={getGridClassName()} style={{ gap: `12px` }}>
                            <AnimatePresence>
                                {items.map((item: ContentItem) => (
                                    <motion.div
                                        key={item.id}
                                        whileHover={{ 
                                            scale: viewMode !== 'list' ? 1.02 : 1.005,
                                            y: viewMode !== 'list' ? -4 : 0
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                        transition={{ 
                                            type: 'spring', 
                                            stiffness: 300, 
                                            damping: 20,
                                            mass: 0.8
                                        }}
                                        className="optimize-animation"
                                        style={{ 
                                            willChange: 'transform',
                                            transform: 'translate3d(0,0,0)',
                                            backfaceVisibility: 'hidden'
                                        }}
                                    >
                                    <GlassCard
                                        className={`cursor-pointer relative group glass-transition hover-lift
                                          bg-white/[0.08] backdrop-blur-lg border border-white/20
                                          ${viewMode === 'list' ? 'flex items-center' : ''} 
                                          ${draggedItem === item.id ? 'opacity-50 scale-95' : ''}
                                          ${selectedItems.includes(item.id) ? 'ring-2 ring-blue-400/50 ring-offset-2 ring-offset-transparent' : ''}
                                        `}
                                        style={{
                                            padding: viewMode === 'list' ? `12px` : '0px',
                                            gap: `12px`,
                                            marginBottom:
                                                viewMode === 'masonry' ? `12px` : '0px',
                                        }}
                                        onMouseEnter={() => setHoveredItem(item.id)}
                                        onMouseLeave={() => setHoveredItem(null)}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, item)}
                                        onDragEnd={handleDragEnd}
                                        onClick={() => onItemSelect(item)}
                                    >
                                        <AnimatePresence>
                                            {hoveredItem === item.id && viewMode !== 'list' && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="absolute top-2 right-2 flex items-center gap-1 z-10"
                                                >
                                                    <Button
                                                        variant="glass"
                                                        size="icon"
                                                        className="rounded-md"
                                                        style={{
                                                            height: `24px`,
                                                            width: `24px`,
                                                        }}
                                                    >
                                                        <Star
                                                            style={{
                                                                height: `12px`,
                                                                width: `12px`,
                                                            }}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="glass"
                                                        size="icon"
                                                        className="rounded-md"
                                                        style={{
                                                            height: `24px`,
                                                            width: `24px`,
                                                        }}
                                                    >
                                                        <Share2
                                                            style={{
                                                                height: `12px`,
                                                                width: `12px`,
                                                            }}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="glass"
                                                        size="icon"
                                                        className="rounded-md"
                                                        style={{
                                                            height: `24px`,
                                                            width: `24px`,
                                                        }}
                                                    >
                                                        <MoreHorizontal
                                                            style={{
                                                                height: `12px`,
                                                                width: `12px`,
                                                            }}
                                                        />
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                                                                {/* 새로운 카드 레이아웃 */}
                                        <div className="w-full">
                                            <div 
                                                className="flex flex-col"
                                                style={{ 
                                                    padding: viewMode === 'list' ? '0' : `8px 8px` 
                                                }}
                                            >
                                                {/* 1. 내용 (이미지/미디어 또는 텍스트) */}
                                                {item.type !== 'text' ? (
                                                    <div className="w-full mb-3">
                                                        {getContentPreview(item)}
                                                    </div>
                                                ) : (
                                                    <p
                                                        className="text-white/90 line-clamp-3 leading-relaxed mb-3"
                                                        style={{ fontSize: `13px` }}
                                                    >
                                                        {item.content}
                                                    </p>
                                                )}

                                                {/* 2. 제목 */}
                                                <h3
                                                    className="font-semibold text-white line-clamp-2 leading-tight tracking-tight mb-2"
                                                    style={{ fontSize: `16px`, fontWeight: '600' }}
                                                                >
                                                    {item.title}
                                                </h3>

                                                {/* 3. 키워드3개, (우측정렬)도메인, 생성일 */}
                                                <div className="flex items-center justify-between">
                                                    {/* 좌측: 키워드 3개 */}
                                                    <div className="flex items-center gap-2 flex-1">
                                                        {item.tags && item.tags.slice(0, 3).map((tag: string) => (
                                                            <span
                                                                key={tag}
                                                                className="text-white/70 font-medium cursor-default hover:text-white/90 transition-colors duration-200"
                                                                style={{ fontSize: `10px` }}
                                                            >
                                                                {tag}
                                                                </span>
                                                        ))}
                                                    </div>

                                                    {/* 우측: 도메인(링크 타입일 때), 생성일 */}
                                                    <div className="flex items-center gap-2 text-white/70">
                                                        {item.type === 'link' && item.metadata?.url && (
                                                            <span style={{ fontSize: `10px` }}>
                                                                {cleanDomain(item.metadata.url)}
                                                                </span>
                                                        )}
                                                        {item.type !== 'link' && (
                                                            <span style={{ fontSize: `10px` }}>
                                                                {new Date(item.createdAt).toLocaleDateString()}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}