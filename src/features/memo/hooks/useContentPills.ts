import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ContentPill } from '../types';
import { 
  getFileTypeFromExtension, 
  getFileTypeFromMimeType, 
  cleanFilePath 
} from '../utils/content-helpers';

export const useContentPills = () => {
  const [contentPills, setContentPills] = useState<ContentPill[]>([]);

  const addContentPill = useCallback((pill: ContentPill) => {
    setContentPills(prev => [...prev, pill]);
  }, []);

  const removeContentPill = useCallback((pillId: string) => {
    setContentPills(prev => prev.filter(p => p.id !== pillId));
  }, []);

  const clearContentPills = useCallback(() => {
    setContentPills([]);
  }, []);

  const createPillFromFile = useCallback((filePath: string, filename?: string): ContentPill | null => {
    const cleanPath = cleanFilePath(filePath);
    if (!cleanPath) return null;

    const ext = (window as any).electron?.path?.extname(cleanPath) || '';
    const name = filename || (window as any).electron?.path?.basename(cleanPath) || 'Unknown';
    const fileType = getFileTypeFromExtension(ext);

    return {
      id: uuidv4(),
      type: fileType,
      title: name,
      content: `file://${cleanPath}`,
    };
  }, []);

  const createPillFromUrl = useCallback((url: string): ContentPill => {
    try {
      const urlObject = new URL(url);
      return {
        id: uuidv4(),
        type: 'link',
        title: url,
        content: url,
        metadata: { 
          url, 
          domain: urlObject.hostname 
        },
      };
    } catch {
      // 유효하지 않은 URL인 경우 텍스트로 처리
      return {
        id: uuidv4(),
        type: 'text',
        title: url.length > 40 ? `${url.substring(0, 37)}...` : url,
        content: url,
      };
    }
  }, []);

  const createPillFromFiles = useCallback((files: File[]): ContentPill[] => {
    return files.map(file => {
      const fileType = getFileTypeFromMimeType(file.type);
      return {
        id: uuidv4(),
        type: fileType,
        title: file.name,
        content: `file:${(file as any).path || file.name}`,
      };
    });
  }, []);

  return {
    contentPills,
    addContentPill,
    removeContentPill,
    clearContentPills,
    createPillFromFile,
    createPillFromUrl,
    createPillFromFiles,
  };
}; 