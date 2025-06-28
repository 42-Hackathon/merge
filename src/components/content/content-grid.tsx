import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Grid3X3, 
  List, 
  LayoutGrid,
  MoreHorizontal,
  Star,
  Archive,
  Share2,
  Trash2
} from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentItem } from "@/types/content";

interface ContentGridProps {
  items: ContentItem[];
  viewMode: 'masonry' | 'grid' | 'list';
  onViewModeChange: (mode: 'masonry' | 'grid' | 'list') => void;
  onItemSelect: (item: ContentItem) => void;
  selectedItems: string[];
}

export function ContentGrid({ 
  items, 
  viewMode, 
  onViewModeChange, 
  onItemSelect, 
  selectedItems 
}: ContentGridProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const getGridClassName = () => {
    switch (viewMode) {
      case 'masonry':
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4';
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4';
      case 'list':
        return 'flex flex-col gap-2';
      default:
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4';
    }
  };

  return (
    <div className="flex-1 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-white">Content Collection</h1>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {items.length} items
          </Badge>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'masonry' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('masonry')}
            className="text-white hover:bg-white/10"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('grid')}
            className="text-white hover:bg-white/10"
          >
            <Grid3X3 className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'secondary' : 'ghost'}
            size="icon"
            onClick={() => onViewModeChange('list')}
            className="text-white hover:bg-white/10"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className={getGridClassName()}>
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={viewMode === 'masonry' ? 'break-inside-avoid mb-4' : ''}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <GlassCard 
              className={`p-4 cursor-pointer transition-all duration-200 hover:bg-white/20 ${
                selectedItems.includes(item.id) ? 'ring-2 ring-blue-400' : ''
              } ${viewMode === 'list' ? 'flex items-center gap-4' : ''}`}
              onClick={() => onItemSelect(item)}
            >
              {/* Content Preview */}
              {item.type === 'image' && (
                <div className={`${viewMode === 'list' ? 'w-16 h-16' : 'w-full h-48'} bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg mb-3 flex items-center justify-center`}>
                  <span className="text-white text-sm">Image</span>
                </div>
              )}
              
              {item.type === 'text' && (
                <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                  <p className="text-white/90 text-sm line-clamp-3 mb-3">
                    {item.content}
                  </p>
                </div>
              )}
              
              {item.type === 'link' && (
                <div className={`${viewMode === 'list' ? 'w-16 h-16' : 'w-full h-32'} bg-gradient-to-br from-green-400 to-blue-600 rounded-lg mb-3 flex items-center justify-center`}>
                  <span className="text-white text-sm">Link</span>
                </div>
              )}

              {/* Item Info */}
              <div className={`${viewMode === 'list' ? 'flex-1' : ''}`}>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-medium text-sm line-clamp-2">
                    {item.title}
                  </h3>
                  {hoveredItem === item.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-1"
                    >
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:bg-white/10">
                        <Star className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:bg-white/10">
                        <Share2 className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-white/70 hover:bg-white/10">
                        <MoreHorizontal className="h-3 w-3" />
                      </Button>
                    </motion.div>
                  )}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="secondary" 
                      className="bg-white/20 text-white text-xs"
                    >
                      {item.stage}
                    </Badge>
                    {item.tags.slice(0, 2).map(tag => (
                      <Badge 
                        key={tag}
                        variant="outline" 
                        className="border-white/30 text-white/70 text-xs"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <span className="text-white/50 text-xs">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}