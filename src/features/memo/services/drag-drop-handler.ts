import { ContentPill } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { 
  getFileTypeFromExtension, 
  getFileTypeFromMimeType,
  cleanFilePath 
} from '../utils/content-helpers';

export interface DragDropHandlers {
  handlePathDrop: (filePath: string) => ContentPill | null;
  handleTextDrop: (text: string) => ContentPill;
  handleFilesDrop: (files: File[]) => ContentPill[];
  handleContentItemDrop: (itemData: string) => ContentPill | null;
  handlePillDrop: (pillData: string) => ContentPill | null;
}

export const createDragDropHandlers = (): DragDropHandlers => {
  const handlePathDrop = (filePath: string): ContentPill | null => {
    const cleanPath = cleanFilePath(filePath);
    if (!cleanPath) return null;

    // Electron 환경에서만 파일 존재 확인
    if ((window as any).electron?.fs?.existsSync && 
        !(window as any).electron.fs.existsSync(cleanPath)) {
      return null;
    }

    const ext = (window as any).electron?.path?.extname(cleanPath) || '';
    const filename = (window as any).electron?.path?.basename(cleanPath) || 'Unknown';
    const fileType = getFileTypeFromExtension(ext);

    return {
      id: uuidv4(),
      type: fileType,
      title: filename,
      content: `file://${cleanPath}`,
    };
  };

  const handleTextDrop = (text: string): ContentPill => {
    try {
      const urlObject = new URL(text);
      return {
        id: uuidv4(),
        type: 'link',
        title: text,
        content: text,
        metadata: { 
          url: text, 
          domain: urlObject.hostname 
        },
      };
    } catch {
      // URL이 아닌 일반 텍스트
      return {
        id: uuidv4(),
        type: 'text',
        title: text.length > 40 ? `${text.substring(0, 37)}...` : text,
        content: text,
      };
    }
  };

  const handleFilesDrop = (files: File[]): ContentPill[] => {
    return files.map(file => {
      const fileType = getFileTypeFromMimeType(file.type);
      return {
        id: uuidv4(),
        type: fileType,
        title: file.name,
        content: `file:${(file as any).path || file.name}`,
      };
    });
  };

  const handleContentItemDrop = (itemData: string): ContentPill | null => {
    try {
      const item = JSON.parse(itemData);
      
      // 이미지나 링크 타입일 때 metadata.url 사용
      let pillContent = item.content;
      if ((item.type === 'image' || item.type === 'link') && item.metadata?.url) {
        pillContent = item.metadata.url;
      }
      
      return {
        id: item.id || uuidv4(),
        type: item.type,
        title: item.title,
        content: pillContent,
        metadata: item.metadata
      };
    } catch (err) {
      console.error("Error parsing content-item data:", err);
      return null;
    }
  };

  const handlePillDrop = (pillData: string): ContentPill | null => {
    try {
      return JSON.parse(pillData);
    } catch (err) {
      console.error("Error parsing pill data:", err);
      return null;
    }
  };

  return {
    handlePathDrop,
    handleTextDrop,
    handleFilesDrop,
    handleContentItemDrop,
    handlePillDrop,
  };
}; 