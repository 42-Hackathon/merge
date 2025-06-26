import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ContentItem } from "@/types/content";
import { ContentCard } from "./content-card";
import { Grid3X3, List, LayoutGrid } from "lucide-react";

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
  const getGridClassName = () => {
    switch (viewMode) {
      case 'masonry':
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2';
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2';
      case 'list':
        return 'flex flex-col gap-2';
      default:
        return 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2';
    }
  };

  return (
    <div className="flex-1 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white">Content Collection</h1>
          <Badge variant="secondary" className="bg-white/20 text-white">
            {items.length} items
          </Badge>
        </div>
        
        <div className="flex items-center gap-1">
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
        {items.map((item) => (
          <ContentCard
            key={item.id}
            item={item}
            viewMode={viewMode}
            isSelected={selectedItems.includes(item.id)}
            onItemSelect={onItemSelect}
          />
        ))}
      </div>
    </div>
  );
}