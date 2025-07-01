export type ContentType = 'text' | 'image' | 'link' | 'video' | 'audio' | 'other';

export interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  description?: string;
  date: string;
  keywords?: string[];
  metadata?: {
    aiSummary?: string;
    domain?: string;
    url?: string;
    author?: string;
    [key: string]: any;
  };
  isFavorite?: boolean;
  isPinned?: boolean;
}

export interface ContentGridProps {
  contents: ContentItem[];
  onItemClick?: (item: ContentItem) => void;
  onItemsChange?: (items: ContentItem[]) => void;
  onViewContent?: (content: ContentItem) => void;
  onAiSummarize?: (content: ContentItem) => void;
  viewMode?: 'grid' | 'list';
}

export interface ContentFilter {
  type?: ContentType[];
  searchQuery?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  keywords?: string[];
  isFavorite?: boolean;
} 