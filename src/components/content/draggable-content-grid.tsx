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
    Eye,
    Calendar,
    Edit3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ContentItem } from '@/types/content';

interface DraggableContentGridProps {
    items: ContentItem[];
    viewMode: 'masonry' | 'grid' | 'list' | 'justified';
    onViewModeChange: (mode: 'masonry' | 'grid' | 'list' | 'justified') => void;
    onItemSelect: (item: ContentItem) => void;
    selectedItems: string[];
    folderName?: string;
    zoomLevel?: number;
    onFileDrop?: (files: FileList) => void;
}

export function DraggableContentGrid({
    items,
    viewMode,
    onViewModeChange,
    onItemSelect,
    selectedItems,
    folderName = '모든 콘텐츠',
    zoomLevel = 100,
    onFileDrop,
}: DraggableContentGridProps) {
    const [hoveredItem, setHoveredItem] = useState<string | null>(null);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editorContent, setEditorContent] = useState('');
    const [isDragOver, setIsDragOver] = useState(false);

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

    // 파일 드래그 오버 핸들러
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // 파일 드롭 허용 명시
        e.dataTransfer.dropEffect = 'copy';

        // 외부 파일 드래그인지 확인
        const hasFiles = e.dataTransfer.types.includes('Files');
        const hasContentItem = e.dataTransfer.types.includes('application/content-item');

        console.log('🎯 드래그 오버:', hasFiles, hasContentItem, e.dataTransfer.types);

        // 파일 드래그일 때 드롭 존 활성화 (조건 완화)
        if (hasFiles && !isDragOver) {
            console.log('✅ 드롭 존 활성화');
            setIsDragOver(true);
        }
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // 컨테이너를 완전히 벗어났을 때만 isDragOver를 false로 설정
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX;
        const y = e.clientY;
        if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
            setIsDragOver(false);
        }
    };

    // 파일 드롭 핸들러
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        console.log('💧 파일 드롭됨!');

        // 외부 파일 드래그인지 확인
        const hasFiles = e.dataTransfer.types.includes('Files');
        const hasContentItem = e.dataTransfer.types.includes('application/content-item');

        console.log(
            '📋 드롭 이벤트:',
            hasFiles,
            hasContentItem,
            e.dataTransfer.files.length,
            e.dataTransfer.types
        );

        // 실제 파일이 있으면 처리 (조건 완화)
        const files = e.dataTransfer.files;
        if (files.length > 0 && onFileDrop) {
            console.log('🎯 파일 처리 시작:', files.length, '개');
            onFileDrop(files);
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
                        className={`bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}
                    >
                        <span
                            style={{ fontSize: `${scale(12)}px` }}
                            className="text-zinc-600 dark:text-zinc-400"
                        >
                            이미지
                        </span>
                    </div>
                );
            case 'link':
                return (
                    <div
                        style={{
                            width: viewMode === 'list' ? `${scale(48)}px` : '100%',
                            height: `${baseHeight}px`,
                        }}
                        className={`bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}
                    >
                        <div className="text-center text-zinc-700 dark:text-zinc-300">
                            <div style={{ fontSize: `${scale(12)}px` }} className="font-medium">
                                🔗
                            </div>
                            <div style={{ fontSize: `${scale(10)}px` }} className="opacity-80">
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
                        className={`bg-zinc-200 dark:bg-zinc-800 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}
                    >
                        <span
                            style={{ fontSize: `${scale(12)}px` }}
                            className="text-zinc-600 dark:text-zinc-400"
                        >
                            동영상
                        </span>
                    </div>
                );
            default:
                return (
                    <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <p
                            style={{ fontSize: `${scale(12)}px` }}
                            className="text-zinc-700 dark:text-zinc-300 line-clamp-3 mb-2"
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
                <div
                    className={`flex-1 overflow-y-auto relative ${
                        isDragOver
                            ? 'bg-blue-50/50 dark:bg-blue-900/20 border-2 border-dashed border-blue-400'
                            : ''
                    }`}
                    style={{ padding: `${scale(16)}px` }}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    {/* 드래그 오버 상태 표시 */}
                    {isDragOver && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center z-50 bg-blue-50/80 dark:bg-blue-900/40 backdrop-blur-sm"
                        >
                            <div className="text-center">
                                <div className="text-blue-600 dark:text-blue-400 mb-2">
                                    <svg
                                        width="48"
                                        height="48"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                    >
                                        <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                                    </svg>
                                </div>
                                <p
                                    className="text-blue-600 dark:text-blue-400 font-medium"
                                    style={{ fontSize: `${scale(16)}px` }}
                                >
                                    파일을 여기에 드롭하세요
                                </p>
                                <p
                                    className="text-blue-500 dark:text-blue-300 mt-1"
                                    style={{ fontSize: `${scale(12)}px` }}
                                >
                                    자동으로 타입별로 분류됩니다
                                </p>
                            </div>
                        </motion.div>
                    )}

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
                            <p
                                style={{ fontSize: `${scale(12)}px` }}
                                className="mt-2 text-blue-500 dark:text-blue-400"
                            >
                                💡 팁: 로컬 폴더의 파일들을 여기로 드래그 앤 드롭할 수 있습니다
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
                                    <div
                                        key={item.id}
                                        className={`cursor-pointer transition-all duration-200 relative group rounded-2xl 
                      bg-zinc-100/60 dark:bg-zinc-900/60 backdrop-blur-xl border border-black/10 dark:border-white/10
                      hover:bg-zinc-200/60 dark:hover:bg-zinc-800/60 hover:scale-[1.02]
                      ${selectedItems.includes(item.id) ? 'ring-2 ring-blue-500' : ''} 
                      ${viewMode === 'list' ? 'flex items-center' : ''} 
                      ${draggedItem === item.id ? 'opacity-50' : ''}
                    `}
                                        style={{
                                            padding: `${scale(12)}px`,
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

                                        {getContentPreview(item)}

                                        <div className="w-full">
                                            {viewMode !== 'list' && (
                                                <h3
                                                    className="font-semibold text-zinc-800 dark:text-zinc-200 mb-1 truncate"
                                                    style={{ fontSize: `${scale(13)}px` }}
                                                >
                                                    {item.title}
                                                </h3>
                                            )}

                                            <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400">
                                                <div
                                                    className="flex items-center gap-2"
                                                    style={{ fontSize: `${scale(11)}px` }}
                                                >
                                                    <div className="flex items-center gap-1">
                                                        <Eye className="h-3 w-3" />
                                                        <span>{item.metadata?.views ?? 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-3 w-3" />
                                                        <span>
                                                            {new Date(
                                                                item.createdAt
                                                            ).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {item.tags && (
                                                    <div className="flex gap-1">
                                                        {item.tags
                                                            .slice(0, 2)
                                                            .map((tag: string) => (
                                                                <Badge
                                                                    key={tag}
                                                                    variant="secondary"
                                                                    className="px-1.5 py-0.5"
                                                                    style={{
                                                                        fontSize: `${scale(9)}px`,
                                                                    }}
                                                                >
                                                                    {tag}
                                                                </Badge>
                                                            ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
