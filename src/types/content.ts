export type ContentType = 'text' | 'image' | 'link' | 'video' | 'file' | 'directory' | 'sticky-note' | 'canvas';

export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: ContentType;
  stage: string;
  tags: string[];
  folderId: string;
  createdAt: string;
  updatedAt: string;
  summary?: string;
  metadata?: {
    author?: string;
    dimensions?: { width: number; height: number };
    fileSize?: number;
    url?: string;
    imageUrl?: string;
    duration?: number;
    resolution?: string;
  };
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  itemCount: number;
} 