import { BaseContentGrid } from "./base-content-grid";
import { ContentItem } from "@/types/content";

interface ContentGridProps {
  items: ContentItem[];
  setItems: (items: ContentItem[]) => void;
  viewMode: 'masonry' | 'grid' | 'list';
  onViewModeChange: (mode: 'masonry' | 'grid' | 'list') => void;
  onItemSelect: (item: ContentItem) => void;
  selectedItems: string[];
}

export function ContentGrid({ 
  items, 
  setItems,
  viewMode, 
  onViewModeChange, 
  onItemSelect, 
  selectedItems 
}: ContentGridProps) {
  // This component now wraps BaseContentGrid and configures it for the non-draggable view.
  return (
    <BaseContentGrid
      items={items}
      setItems={setItems}
      viewMode={viewMode}
      onViewModeChange={onViewModeChange}
      onItemSelect={onItemSelect}
      selectedItems={selectedItems}
      isDraggable={false}
    />
  );
}