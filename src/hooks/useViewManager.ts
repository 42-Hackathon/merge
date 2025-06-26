import { useState, useCallback, useMemo } from "react";
import { ContentItem } from "@/types/content";

export function useViewManager(initialItems: ContentItem[] = []) {
  const [items, setItems] = useState<ContentItem[]>(initialItems);
  const [viewMode, setViewMode] = useState<'masonry' | 'grid' | 'list' | 'justified'>('masonry');
  const [selectedFolder, setSelectedFolder] = useState('all');

  const handleFolderSelect = useCallback((folderId: string) => {
    setSelectedFolder(folderId);
    if (folderId === 'all') {
      setItems(initialItems);
    } else {
      setItems(initialItems.filter(item => item.folderId === folderId));
    }
  }, [initialItems]);

  const getFolderName = useCallback((folderId: string) => {
    switch (folderId) {
      case 'all': return '모든 콘텐츠';
      case 'text': return '텍스트 하이라이팅';
      case 'images': return '이미지';
      case 'links': return '링크';
      case 'videos': return '동영상';
      case 'clipboard': return '클립보드';
      case 'screenshots': return '스크린샷';
      default: {
        const folder = items.find(item => item.folderId === folderId);
        return folder?.title ?? '콘텐츠';
    }
    }
  }, [items]);

  const filteredItems = useMemo(() => items.filter(item => {
    if (selectedFolder === 'all') return true;
    if (selectedFolder === 'text') return item.type === 'text';
    if (selectedFolder === 'images') return item.type === 'image';
    if (selectedFolder === 'links') return item.type === 'link';
    if (selectedFolder === 'videos') return item.type === 'video';
    return item.folderId === selectedFolder;
  }), [items, selectedFolder]);

  return { 
    filteredItems, 
    viewMode, 
    selectedFolder, 
    setViewMode, 
    handleFolderSelect, 
    getFolderName 
  };
} 