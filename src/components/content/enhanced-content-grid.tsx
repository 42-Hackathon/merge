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
  Eye,
  Calendar,
  Edit3
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ContentItem } from "@/types/content";

interface EnhancedContentGridProps {
  items: ContentItem[];
  viewMode: 'masonry' | 'grid' | 'list' | 'justified';
  onViewModeChange: (mode: 'masonry' | 'grid' | 'list' | 'justified') => void;
  onItemSelect: (item: ContentItem) => void;
  selectedItems: string[];
  folderName?: string;
}

export function EnhancedContentGrid({ 
  items, 
  viewMode, 
  onViewModeChange, 
  onItemSelect, 
  selectedItems,
  folderName = "All Content"
}: EnhancedContentGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const getGridClassName = () => {
    switch (viewMode) {
      case 'masonry':
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3';
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3';
      case 'justified':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3';
      case 'list':
        return 'flex flex-col gap-1.5';
      default:
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-3';
    }
  };

  const getContentPreview = (item: ContentItem) => {
    const baseClasses = viewMode === 'list' ? 'w-12 h-12' : 'w-full h-36';
    
    switch (item.type) {
      case 'image':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-blue-400 to-purple-600 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}>
            <span className="text-white text-xs">Image</span>
            <div className="absolute inset-0 bg-black/20" />
          </div>
        );
      case 'link':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-green-400 to-blue-600 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}>
            <span className="text-white text-xs">Link</span>
            <div className="absolute inset-0 bg-black/20" />
          </div>
        );
      case 'video':
        return (
          <div className={`${baseClasses} bg-gradient-to-br from-red-400 to-pink-600 rounded-md mb-2 flex items-center justify-center relative overflow-hidden`}>
            <span className="text-white text-xs">Video</span>
            <div className="absolute inset-0 bg-black/20" />
          </div>
        );
      default:
        return (
          <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
            <p className="text-white/90 text-xs line-clamp-3 mb-2">
              {item.content}
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">{folderName}</h1>
          <Badge variant="secondary" className="bg-white/20 text-white text-xs">
            {items.length} items
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
          {/* View Mode Buttons */}
          <Button
            variant={viewMode === 'masonry' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('masonry')}
            className="text-white hover:bg-white/10 h-7 w-7"
            title="Masonry View"
          >
            <LayoutGrid className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={viewMode === 'justified' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('justified')}
            className="text-white hover:bg-white/10 h-7 w-7"
            title="Justified Layout"
          >
            <Columns className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className="text-white hover:bg-white/10 h-7 w-7"
            title="Grid View"
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('list')}
            className="text-white hover:bg-white/10 h-7 w-7"
            title="List View"
          >
            <List className="h-3.5 w-3.5" />
          </Button>
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
                <Edit3 className="h-6 w-6" />
              </div>
              <p className="text-base mb-1">Start a new idea</p>
              <p className="text-xs">Write directly here or collect content</p>
              
              {/* Inline Editor */}
              <div className="mt-6 w-full max-w-2xl">
                <Textarea
                  placeholder="Start writing here... (like Obsidian, Notion)"
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
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white h-7 px-3 text-xs"
                    >
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          ) : (
            <div className={getGridClassName()}>
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.03 }}
                    className={viewMode === 'masonry' ? 'break-inside-avoid mb-3' : ''}
                    onMouseEnter={() => setHoveredItem(item.id)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <GlassCard 
                      className={`p-3 cursor-pointer transition-all duration-200 hover:bg-white/20 hover:scale-[1.01] ${
                        selectedItems.includes(item.id) ? 'ring-1 ring-blue-400 bg-white/10' : ''
                      } ${viewMode === 'list' ? 'flex items-center gap-3' : ''}`}
                      onClick={() => onItemSelect(item)}
                    >
                      {/* Content Preview */}
                      {getContentPreview(item)}

                      {/* Item Info */}
                      <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-1.5">
                          <h3 className="text-white font-medium text-xs line-clamp-2 flex-1">
                            {item.title}
                          </h3>
                          
                          <AnimatePresence>
                            {hoveredItem === item.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-0.5 ml-2"
                              >
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:bg-white/10">
                                  <Eye className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:bg-white/10">
                                  <Star className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:bg-white/10">
                                  <Share2 className="h-3 w-3" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5 text-white/70 hover:bg-white/10">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 flex-wrap">
                            <Badge 
                              variant="secondary" 
                              className="bg-white/20 text-white text-[10px] px-1.5 py-0 h-4"
                            >
                              {item.stage}
                            </Badge>
                            {item.tags.slice(0, 2).map(tag => (
                              <Badge 
                                key={tag}
                                variant="outline" 
                                className="border-white/30 text-white/70 text-[10px] px-1.5 py-0 h-4"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-1 text-white/50 text-[10px]">
                            <Calendar className="h-2.5 w-2.5" />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
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