export type ContentType = 'file' | 'directory' | 'sticky-note' | 'canvas' | 'link' | 'image';

export interface ContentItem {
  id: string;
  name: string;
  title?: string;
  type: ContentType;
  parentId: string | null;
  content?: string;
  children?: ContentItem[];
  url?: string;
  metadata?: {
    width?: number;
    height?: number;
    description?: string;
  };
} 