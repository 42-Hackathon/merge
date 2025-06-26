import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ContentItem } from "@/types/content";

interface ContentGridHeaderProps {
  folderName: string;
  itemCount: number;
  viewMode: 'masonry' | 'grid' | 'list' | 'justified';
  onViewModeChange: (mode: 'masonry' | 'grid' | 'list' | 'justified') => void;
  scale: (base: number) => number;
}

function ContentGridHeader({
  folderName,
  itemCount,
  viewMode, 
  onViewModeChange, 
  scale
}: ContentGridHeaderProps) {
  return (
    <div 
      className="flex items-center justify-between border-b border-black/5 dark:border-white/5"
      style={{
        padding: `${scale(8)}px ${scale(16)}px`
      }}
    >
      <div className="flex items-center" style={{columnGap: `${scale(12)}px`}}>
        <h1 className="font-bold text-zinc-800 dark:text-zinc-200" style={{fontSize: `${scale(20)}px`}}>{folderName}</h1>
        <Badge 
          variant="secondary" 
          className="bg-black/5 dark:bg-white/10 text-zinc-600 dark:text-zinc-300 font-mono"
          style={{
            fontSize: `${scale(12)}px`,
            padding: `${scale(2)}px ${scale(6)}px`
          }}
        >
          {itemCount}개 항목
        </Badge>
      </div>
      
      <div className="flex items-center" style={{columnGap: `${scale(4)}px`}}>
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
  );
}

interface EmptyContentProps {
  scale: (base: number) => number;
}

function EmptyContent({ scale }: EmptyContentProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  // 여기에 실제 저장 로직을 추가해야 함
  const handleSave = () => {
    console.log("Saving content:", editorContent);
    setIsEditing(false);
    setEditorContent("");
  };
  
  return (
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
        <Edit3 style={{ height: `${scale(24)}px`, width: `${scale(24)}px` }} />
      </div>
      <p style={{fontSize: `${scale(16)}px`}} className="mb-1">새로운 아이디어를 시작해보세요</p>
      <p style={{fontSize: `${scale(12)}px`}}>여기에 바로 작성하거나 콘텐츠를 수집해보세요</p>
      
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
          <div className="flex justify-end mt-2" style={{columnGap: `${scale(8)}px`}}>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsEditing(false);
                setEditorContent("");
              }}
              className="text-zinc-600 dark:text-zinc-400 hover:bg-black/10 dark:hover:bg-white/10 rounded-md flex items-center justify-center"
              style={{ height: `${scale(28)}px`, padding: `0 ${scale(12)}px`, fontSize: `${scale(12)}px` }}
            >
              취소
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center"
              style={{ height: `${scale(28)}px`, padding: `0 ${scale(12)}px`, fontSize: `${scale(12)}px` }}
            >
              저장
            </Button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

interface ContentItemCardProps {
  item: ContentItem;
  viewMode: 'masonry' | 'grid' | 'list' | 'justified';
  selectedItems: string[];
  scale: (base: number) => number;
  onItemSelect: (item: ContentItem) => void;
  onDragStart: (e: MouseEvent | TouchEvent | PointerEvent, item: ContentItem) => void;
  onDragEnd: () => void;
}

function ContentItemCard({ 
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
  folderName = "모든 콘텐츠",
  zoomLevel = 100
}: DraggableContentGridProps) {
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

  const handleDragStart = (e: MouseEvent | TouchEvent | PointerEvent, item: ContentItem) => {
    // Framer Motion의 onDragStart는 네이티브 dataTransfer를 직접 제공하지 않습니다.
    // 따라서 네이티브 HTML5 드래그 앤 드롭 API를 사용하려면
    // motion.div에 onDragStart 대신 네이티브 onDragStart 이벤트를 사용해야 합니다.
    // 여기서는 Framer Motion의 드래그 상태만 활용하고,
    // 데이터 전송이 필요하다면 다른 접근 방식(예: Context API)을 고려해야 합니다.
    console.log("Drag started for item:", item.id);
  };

  const handleDragEnd = () => {
    // 필요한 경우 드래그 종료 로직 추가
  };

  return (
    <div className="flex-1 flex flex-col bg-transparent border-0 shadow-none ring-0">
      <ContentGridHeader 
        folderName={folderName}
        itemCount={items.length}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
        scale={scale}
      />

      {/* Content Grid */}
      <div className="flex-1 flex">
        <div className="flex-1" style={{ padding: `${scale(16)}px` }}>
          {items.length === 0 ? (
            <EmptyContent scale={scale} />
          ) : (
            <div className={`relative ${getGridClassName()}`} style={{ columnGap: `${scale(16)}px` }}>
              <AnimatePresence>
                {items.map((item) => (
                  <ContentItemCard
                    key={item.id}
                    item={item}
                    viewMode={viewMode}
                    selectedItems={selectedItems}
                    scale={scale}
                    onItemSelect={onItemSelect}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}