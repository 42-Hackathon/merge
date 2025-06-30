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
        originalPath?: string; // 원본 파일 경로
        // 링크 관련 필드들
        domain?: string; // 도메인명
        favicon?: string; // 파비콘 URL
        // 동영상 관련 필드들
        platform?: string; // 플랫폼 (YouTube, Vimeo 등)
        // 텍스트 관련 필드들
        wordCount?: number; // 단어 수
        language?: string; // 코드 언어
        // 메모 관련 필드들
        priority?: 'low' | 'medium' | 'high'; // 우선순위
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
