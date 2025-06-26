export type ContentType = 'file' | 'directory' | 'sticky-note' | 'canvas';

export interface ContentItem {
  id: string;
  name: string;
  type: ContentType;
  parentId: string | null;
  content?: string;
  children?: ContentItem[];
} 