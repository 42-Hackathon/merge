export type ContentType = 'text' | 'image' | 'link' | 'file' | 'video' | 'audio';

export interface ContentItem {
    id: string;
    title: string;
    content: string;
    type: ContentType;
    stage: 'review' | 'refine' | 'consolidate';
    tags: string[];
    folderId?: string;
    path?: string;
    createdAt: string;
    updatedAt: string;
    metadata?: {
        url?: string;
        fileSize?: number;
        dimensions?: { width: number; height: number };
        author?: string;
        views?: number;
        duration?: number; // 동영상 재생 시간 (초)
        resolution?: string; // 동영상 해상도
    };
    source?: string;
}

export interface Folder {
    id: string;
    name: string;
    color: string;
    itemCount: number;
    createdAt: string;
    parentId?: string;
}

export interface Tag {
    id: string;
    name: string;
    color: string;
    count: number;
}

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role: 'owner' | 'editor' | 'viewer';
}
