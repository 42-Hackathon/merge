export type ContentType = 'text' | 'image' | 'link' | 'video' | 'audio' | 'clipboard' | 'screenshot' | 'other';

export interface ContentPill {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  metadata?: {
    url?: string;
    domain?: string;
    favicon?: string;
  };
}

export interface SavedMemo {
  id: string;
  title: string;
  content: string; // HTML content
  language: 'html';
  createdAt: string;
  updatedAt: string;
}

export type MemoMode = 'memo' | 'chat' | 'view' | 'ai';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'; 