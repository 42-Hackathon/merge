import { useState } from "react";
import { motion, Reorder } from "framer-motion";
import { 
  Grid3X3, 
  List, 
  LayoutGrid,
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ContentItem } from "@/types/content";

interface EnhancedContentGridProps {
  items: ContentItem[];
  setItems: (items: ContentItem[]) => void;
  viewMode: 'masonry' | 'grid' | 'list' | 'justified';
  onViewModeChange: (mode: 'masonry' | 'grid' | 'list' | 'justified') => void;
  onItemSelect: (item: ContentItem) => void;
  selectedItems: string[];
  folderName?: string;
  isDraggable?: boolean;
}

const getHostname = (url: string | undefined): string => {
  if (!url) return '';
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    console.error("Invalid URL:", url);
    return '';
  }
};

export function BaseContentGrid({ 
  items, 
  setItems,
  viewMode, 
  onViewModeChange, 
  onItemSelect, 
  selectedItems,
  folderName = "모든 콘텐츠",
  isDraggable = true,
}: EnhancedContentGridProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const getGridClassName = () => {
    switch (viewMode) {
      case 'masonry':
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2';
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2';
      case 'justified':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2';
      case 'list':
        return 'flex flex-col gap-1.5';
      default:
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-black/50 backdrop-blur-lg p-2 -mx-2">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white">{folderName}</h1>
            <Badge variant="secondary" className="bg-white/20 text-white text-xs">
              {items.length}개 항목
            </Badge>
          </div>
          
          <div className="flex items-center gap-1">
            {/* View Mode Buttons */}
            <Button
              variant={viewMode === 'masonry' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('masonry')}
              className="text-white hover:bg-white/10 h-7 w-7"
              title="폭포수 보기"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === 'justified' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('justified')}
              className="text-white hover:bg-white/10 h-7 w-7"
              title="양쪽 정렬"
            >
              <LayoutGrid className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('grid')}
              className="text-white hover:bg-white/10 h-7 w-7"
              title="그리드 보기"
            >
              <Grid3X3 className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              onClick={() => onViewModeChange('list')}
              className="text-white hover:bg-white/10 h-7 w-7"
              title="목록 보기"
            >
              <List className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex">
        {/* Content Grid */}
        <div className="flex-1 p-4">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-white/60"
            >
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-3">
                <LayoutGrid className="h-6 w-6" />
              </div>
              <p className="text-base mb-1">새로운 아이디어를 시작해보세요</p>
              <p className="text-xs">여기에 바로 작성하거나 콘텐츠를 수집해보세요</p>
              
              {/* Inline Editor */}
              <div className="mt-6 w-full max-w-2xl">
                <Textarea
                  placeholder="여기에 바로 작성을 시작하세요... (Obsidian, Notion처럼)"
                  value={editorContent}
                  onChange={(e) => setEditorContent(e.target.value)}
                  className="min-h-[200px] bg-white/5 border-white/20 text-white placeholder:text-white/50 resize-none"
                  onFocus={() => setIsEditing(true)}
                />
                {isEditing && (
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setEditorContent("");
                      }}
                      className="text-white/70 hover:bg-white/10 h-7 px-3 text-xs"
                    >
                      취소
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white h-7 px-3 text-xs"
                    >
                      저장
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <Reorder.Group 
              as="div" 
              axis={viewMode === 'list' ? 'y' : 'x'}
              values={items} 
              onReorder={setItems} 
              className={getGridClassName()}
              style={{ listStyle: 'none' }}
            >
              {items.map((item, index) => {
                const hostname = item.type === 'link' ? getHostname(item.metadata?.url) : '';
                
                const cardContent = (
                  <GlassCard 
                    variant="elevated"
                    className={`p-1.5 cursor-pointer transition-all duration-200 hover:bg-white/20 ${
                      selectedItems.includes(item.id) ? 'ring-2 ring-blue-400' : ''
                    } ${viewMode === 'list' ? 'flex items-center gap-2' : ''}`}
                    onClick={() => onItemSelect(item)}
                  >
                    {/* Content Preview */}
                    {item.type === 'image' && item.metadata?.imageUrl && (
                      <div className={`${viewMode === 'list' ? 'w-12 h-12' : 'w-full h-32'} bg-black/20 rounded-sm mb-1 flex-shrink-0`}>
                        <img src={item.metadata.imageUrl} alt={item.title} className="w-full h-full object-cover rounded-sm"/>
                      </div>
                    )}
                    
                    <div className={`flex flex-col flex-1 min-w-0 ${viewMode === 'list' ? '' : 'h-28'}`}>
                      <div className="flex-1 min-h-0">
                        <p className="text-white/80 text-xs line-clamp-3 mb-1">
                          {item.content}
                        </p>
                      </div>

                      {/* Item Info */}
                      <div className="space-y-1.5">
                        <div className="flex items-start justify-between">
                          <h3 className="text-white font-semibold text-xs line-clamp-2">
                            {item.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 overflow-hidden flex-nowrap min-w-0">
                            {item.type === 'link' && hostname && (
                              <div className="flex items-center gap-1.5 flex-shrink-0">
                                <img 
                                  src={`https://www.google.com/s2/favicons?domain=${hostname}&sz=16`} 
                                  alt={`${hostname} favicon`}
                                  width={14}
                                  height={14}
                                  className="rounded-sm"
                                />
                                <span className="text-white/50 text-[10px]">{hostname}</span>
                              </div>
                            )}
                            
                            {item.tags.slice(0, item.type === 'link' ? 1: 2).map(tag => (
                              <Badge 
                                key={tag}
                                variant="outline" 
                                className="border-white/20 text-white/60 text-[10px] whitespace-nowrap px-1 py-0"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <span className="text-white/50 text-[10px] flex-shrink-0">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                );

                return isDraggable ? (
                  <Reorder.Item
                    key={item.id}
                    value={item}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, delay: index * 0.02 }}
                    className={viewMode === 'masonry' ? 'break-inside-avoid mb-2' : ''}
                  >
                    {cardContent}
                  </Reorder.Item>
                ) : (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={viewMode === 'masonry' ? 'break-inside-avoid mb-2' : ''}
                  >
                    {cardContent}
                  </motion.div>
                )
              })}
            </Reorder.Group>
          )}
        </div>
      </div>
    </div>
  );
}