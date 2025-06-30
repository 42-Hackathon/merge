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
    Calendar,
    Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { GlassCard } from '@/components/ui/glass-card';
import { ContentItem } from '@/types/content';

interface DraggableContentGridProps {
    items: ContentItem[];
    viewMode: 'masonry' | 'grid' | 'list' | 'justified';
    onViewModeChange: (mode: 'masonry' | 'grid' | 'list' | 'justified') => void;
    onItemSelect: (item: ContentItem) => void;
    selectedItems: string[];
    folderName?: string;
    zoomLevel?: number;
}

export function DraggableContentGrid({
    items,
    viewMode,
    onViewModeChange,
    onItemSelect,
    selectedItems,
    folderName = '모든 콘텐츠',
    zoomLevel = 100,
}: DraggableContentGridProps) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editorContent, setEditorContent] = useState('');

    const scale = (base: number) => base * (zoomLevel / 100);

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
        setTimeout(() => {
            const draggedElement = e.target as HTMLElement;
            if (draggedElement) {
                draggedElement.style.opacity = '0.5';
            }
        }, 0);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setDraggedItem(null);
        const draggedElement = e.target as HTMLElement;
        if (draggedElement) {
            draggedElement.style.opacity = '1';
        }
    };

    const getContentPreview = (item: ContentItem) => {
        const baseHeight = viewMode === 'list' ? scale(48) : scale(144);

        switch (item.type) {
            case 'image':
                return (
                    <div
                        style={{
                            width: viewMode === 'list' ? `${scale(48)}px` : '100%',
                            height: `${baseHeight}px`,
                        }}
                        className={`relative overflow-hidden rounded-lg group-hover:scale-105 transition-transform duration-500`}
                    >
                        {/* 실제 이미지 표시 */}
                        {item.metadata?.url ? (
                            <img
                                src={item.metadata.url}
                                alt={item.title}
                                className="w-full h-full object-cover"
                                style={{ 
                                    borderRadius: viewMode === 'list' ? `${scale(6)}px` : `${scale(8)}px`
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
                        className={`bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 
                                      absolute inset-0 flex items-center justify-center ${item.metadata?.url ? 'hidden' : 'flex'}`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 text-center">
                            <div className="w-12 h-12 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 mx-auto">
                                <span style={{ fontSize: `${scale(20)}px` }}>🖼️</span>
                            </div>
                            <span
                                style={{ fontSize: `${scale(12)}px` }}
                                className="text-zinc-700 dark:text-zinc-300 font-medium"
                            >
                                이미지
                            </span>
                        </div>
                        </div>
                        
                        {/* 호버 오버레이 */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                );
            case 'link':
                return (
                    <div
                        style={{
                            width: viewMode === 'list' ? `${scale(48)}px` : '100%',
                            height: `${baseHeight}px`,
                        }}
                        className={`bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 
                                  relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 text-center">
                            <div className="w-12 h-12 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 mx-auto">
                                <span style={{ fontSize: `${scale(20)}px` }}>🔗</span>
                            </div>
                            <span
                                style={{ fontSize: `${scale(12)}px` }}
                                className="text-zinc-700 dark:text-zinc-300 font-medium"
                            >
                                링크
                            </span>
                            <div style={{ fontSize: `${scale(10)}px` }} className="text-zinc-600 dark:text-zinc-400 mt-1">
                                {item.metadata?.url ? new URL(item.metadata.url).hostname : 'Link'}
                            </div>
                        </div>
                    </div>
                );
            case 'video':
                return (
                    <div
                        style={{
                            width: viewMode === 'list' ? `${scale(48)}px` : '100%',
                            height: `${baseHeight}px`,
                        }}
                        className={`bg-gradient-to-br from-rose-50 to-pink-100 dark:from-rose-900/30 dark:to-pink-900/30 
                                  relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 text-center">
                            <div className="w-12 h-12 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-2 mx-auto">
                                <span style={{ fontSize: `${scale(20)}px` }}>📹</span>
                            </div>
                            <span
                                style={{ fontSize: `${scale(12)}px` }}
                                className="text-zinc-700 dark:text-zinc-300 font-medium"
                            >
                                동영상
                            </span>
                        </div>
                    </div>
                );
            default:
                return (
                    <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <p
                            style={{ fontSize: `${scale(12)}px` }}
                            className="text-zinc-700 dark:text-zinc-300 line-clamp-3"
                        >
                            {item.content}
                        </p>
                    </div>
                );
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-transparent border-0 shadow-none ring-0">
            {/* Header */}
            <div
                className="flex items-center justify-between border-b border-black/5 dark:border-white/5"
                style={{
                    padding: `${scale(8)}px ${scale(16)}px`,
                }}
            >
                <div className="flex items-center" style={{ columnGap: `${scale(12)}px` }}>
                    <h1
                        className="font-bold text-zinc-800 dark:text-zinc-200"
                        style={{ fontSize: `${scale(20)}px` }}
                    >
                        {folderName}
                    </h1>
                    <Badge
                        variant="secondary"
                        className="bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 font-mono"
                        style={{
                            fontSize: `${scale(12)}px`,
                            padding: `${scale(2)}px ${scale(6)}px`,
                        }}
                    >
                        {items.length}개 항목
                    </Badge>
                </div>

                <div className="flex items-center" style={{ columnGap: `${scale(4)}px` }}>
                    {/* View Mode Buttons */}
                    <Button
                        variant={viewMode === 'masonry' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => onViewModeChange('masonry')}
                        className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 rounded-md flex items-center justify-center"
                        style={{ height: `${scale(28)}px`, width: `${scale(28)}px` }}
                        title="폭포수 보기"
                    >
                        <LayoutGrid style={{ height: `${scale(14)}px`, width: `${scale(14)}px` }} />
                    </Button>
                    <Button
                        variant={viewMode === 'justified' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => onViewModeChange('justified')}
                        className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 rounded-md flex items-center justify-center"
                        style={{ height: `${scale(28)}px`, width: `${scale(28)}px` }}
                        title="양쪽 정렬"
                    >
                        <Columns style={{ height: `${scale(14)}px`, width: `${scale(14)}px` }} />
                    </Button>
                    <Button
                        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => onViewModeChange('grid')}
                        className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 rounded-md flex items-center justify-center"
                        style={{ height: `${scale(28)}px`, width: `${scale(28)}px` }}
                        title="그리드 보기"
                    >
                        <Grid3X3 style={{ height: `${scale(14)}px`, width: `${scale(14)}px` }} />
                    </Button>
                    <Button
                        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                        size="icon"
                        onClick={() => onViewModeChange('list')}
                        className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 rounded-md flex items-center justify-center"
                        style={{ height: `${scale(28)}px`, width: `${scale(28)}px` }}
                        title="목록 보기"
                    >
                        <List style={{ height: `${scale(14)}px`, width: `${scale(14)}px` }} />
                    </Button>
                </div>
            </div>

            {/* Content Grid */}
            <div className="flex-1 flex overflow-hidden">
                <div className="flex-1 overflow-y-auto" style={{ padding: `${scale(16)}px` }}>
                    {items.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-zinc-500 dark:text-zinc-400"
                        >
                            <div
                                className="bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mb-3"
                                style={{
                                    width: `${scale(48)}px`,
                                    height: `${scale(48)}px`,
                                }}
                            >
                                <Edit3
                                    style={{ height: `${scale(24)}px`, width: `${scale(24)}px` }}
                                />
                            </div>
                            <p style={{ fontSize: `${scale(16)}px` }} className="mb-1">
                                새로운 아이디어를 시작해보세요
                            </p>
                            <p style={{ fontSize: `${scale(12)}px` }}>
                                여기에 바로 작성하거나 콘텐츠를 수집해보세요
                            </p>

                            {/* Inline Editor */}
                            <div className="mt-6 w-full max-w-2xl">
                                <Textarea
                                    placeholder="여기에 바로 작성을 시작하세요... (Obsidian, Notion처럼)"
                                    value={editorContent}
                                    onChange={(e) => setEditorContent(e.target.value)}
                                    className="min-h-[200px] bg-black/5 dark:bg-white/5 border-black/10 dark:border-white/20 text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 resize-none rounded-xl"
                                    style={{ fontSize: `${scale(14)}px` }}
                                    onFocus={() => setIsEditing(true)}
                                />
                                {isEditing && (
                                    <div
                                        className="flex justify-end mt-2"
                                        style={{ columnGap: `${scale(8)}px` }}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setEditorContent('');
                                            }}
                                            className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 rounded-md flex items-center justify-center"
                                            style={{
                                                height: `${scale(28)}px`,
                                                padding: `0 ${scale(12)}px`,
                                                fontSize: `${scale(12)}px`,
                                            }}
                                        >
                                            취소
                                        </Button>
                                        <Button
                                            size="sm"
                                            className="bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
                                            style={{
                                                height: `${scale(28)}px`,
                                                padding: `0 ${scale(12)}px`,
                                                fontSize: `${scale(12)}px`,
                                            }}
                                        >
                                            저장
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    ) : (
                        <div className={getGridClassName()} style={{ gap: `${scale(12)}px` }}>
                            <AnimatePresence>
                                {items.map((item: ContentItem) => (
                                    <GlassCard
                                        key={item.id}
                                        variant="liquid"
                                        vibrancy="primary"
                                        selected={selectedItems.includes(item.id)}
                                        hoverable={true}
                                        className={`cursor-pointer relative group 
                                          ${viewMode === 'list' ? 'flex items-center' : ''} 
                                          ${draggedItem === item.id ? 'opacity-50' : ''}
                                        `}
                                        style={{
                                            padding: viewMode === 'list' ? `${scale(12)}px` : '0',
                                            gap: `${scale(12)}px`,
                                            marginBottom:
                                                viewMode === 'masonry' ? `${scale(12)}px` : '0',
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
                                                            height: `${scale(24)}px`,
                                                            width: `${scale(24)}px`,
                                                        }}
                                                    >
                                                        <Star
                                                            style={{
                                                                height: `${scale(12)}px`,
                                                                width: `${scale(12)}px`,
                                                            }}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="glass"
                                                        size="icon"
                                                        className="rounded-md"
                                                        style={{
                                                            height: `${scale(24)}px`,
                                                            width: `${scale(24)}px`,
                                                        }}
                                                    >
                                                        <Share2
                                                            style={{
                                                                height: `${scale(12)}px`,
                                                                width: `${scale(12)}px`,
                                                            }}
                                                        />
                                                    </Button>
                                                    <Button
                                                        variant="glass"
                                                        size="icon"
                                                        className="rounded-md"
                                                        style={{
                                                            height: `${scale(24)}px`,
                                                            width: `${scale(24)}px`,
                                                        }}
                                                    >
                                                        <MoreHorizontal
                                                            style={{
                                                                height: `${scale(12)}px`,
                                                                width: `${scale(12)}px`,
                                                            }}
                                                        />
                                                    </Button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                                                                {/* Pinterest-style content layout */}
                                        <div className="w-full">
                                            {/* 이미지/미디어 콘텐츠는 카드 전체 폭 차지 */}
                                            {item.type !== 'text' && (
                                                <div className="w-full mb-3">
                                                    {getContentPreview(item)}
                                                </div>
                                            )}

                                            {/* Liquid Glass 텍스트 정보 영역 */}
                                            <div 
                                                className="flex flex-col"
                                                style={{ 
                                                    padding: viewMode === 'list' ? '0' : `0 ${scale(12)}px ${scale(0)}px ${scale(12)}px` 
                                                }}
                                            >
                                                {/* 1. 제목 - 향상된 타이포그래피 */}
                                                <h3
                                                    className="font-semibold text-zinc-900 dark:text-white line-clamp-2 leading-tight tracking-tight mb-2"
                                                    style={{ fontSize: `${scale(16)}px`, fontWeight: '600' }}
                                                >
                                                    {item.title}
                                                </h3>

                                                {/* 2. 텍스트 내용 (텍스트 타입일 때만) */}
                                                {item.type === 'text' && (
                                                    <p
                                                        className="text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-relaxed mb-2"
                                                        style={{ fontSize: `${scale(13)}px` }}
                                                    >
                                                        {item.content}
                                                    </p>
                                                )}

                                                {/* 3. AI 요약 - 글래스 모피즘 스타일 */}
                                                {item.aiSummary && (
                                                    <div className="relative mb-2 group">
                                                        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:from-blue-400/20 dark:to-purple-400/20 
                                                                      backdrop-blur-sm border border-blue-200/30 dark:border-blue-400/20 rounded-xl px-4 py-3
                                                                      shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                                                            <div className="flex items-start gap-2">
                                                                <div className="w-5 h-5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                                    <span style={{ fontSize: `${scale(10)}px` }} className="text-white">✨</span>
                                                                </div>
                                                                <p
                                                                    className="text-zinc-700 dark:text-zinc-200 line-clamp-1 font-medium"
                                                                    style={{ fontSize: `${scale(12)}px` }}
                                                                >
                                                                    {item.aiSummary}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}

                                                {/* 4. 키워드 + 메타데이터 영역 */}
                                                <div className="flex items-center justify-between">
                                                    {/* 키워드 - 글래스 배지 */}
                                                    <div className="flex items-center gap-2 flex-1">
                                                        {item.keywords && item.keywords.slice(0, 3).map((keyword: string) => (
                                                            <div
                                                                key={keyword}
                                                                className="px-3 py-1.5 bg-zinc-100/80 dark:bg-zinc-800/80 backdrop-blur-sm 
                                                                         border border-zinc-200/50 dark:border-zinc-700/50 rounded-full
                                                                         shadow-sm hover:shadow-md transition-all duration-300"
                                                                style={{ fontSize: `${scale(10)}px` }}
                                                            >
                                                                <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                                                                    #{keyword}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* 메타데이터 - 세련된 스타일 */}
                                                    <div className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
                                                        {/* 도메인 + 파비콘 - 깔끔한 스타일 */}
                                                        {item.metadata?.domain && (
                                                            <div className="flex items-center gap-1.5">
                                                                {item.metadata?.favicon && (
                                                                    <img
                                                                        src={item.metadata.favicon}
                                                                        alt="favicon"
                                                                        className="rounded-sm"
                                                                        style={{ width: `${scale(12)}px`, height: `${scale(12)}px` }}
                                                                    />
                                                                )}
                                                                <span style={{ fontSize: `${scale(10)}px` }} className="font-medium text-zinc-500 dark:text-zinc-400">
                                                                    {item.metadata.domain.replace(/^www\./, '')}
                                                                </span>
                                                            </div>
                                                        )}

                                                        {/* 생성일 */}
                                                        <div className="flex items-center gap-1.5">
                                                            <Calendar 
                                                                style={{ height: `${scale(10)}px`, width: `${scale(10)}px` }} 
                                                                className="text-zinc-400 dark:text-zinc-500"
                                                            />
                                                            <span style={{ fontSize: `${scale(10)}px` }} className="font-medium text-zinc-500 dark:text-zinc-400">
                                                                {new Date(item.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
