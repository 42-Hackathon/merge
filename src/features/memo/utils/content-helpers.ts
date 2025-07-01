import { ContentType } from '../types';

export const getFileTypeFromExtension = (extension: string): ContentType => {
  const ext = extension.toLowerCase();
  
  if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
    return 'image';
  } else if (['.mp4', '.mov', '.avi', '.webm'].includes(ext)) {
    return 'video';
  } else if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
    return 'audio';
  } else if (['.txt', '.md', '.pdf', '.doc', '.docx'].includes(ext)) {
    return 'text';
  }
  
  return 'other';
};

export const getFileTypeFromMimeType = (mimeType: string): ContentType => {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf' || mimeType.startsWith('text/')) return 'text';
  
  return 'other';
};

export const extractTitleFromHtml = (htmlContent: string): string => {
  if (!htmlContent?.trim()) return 'Untitled';
  
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  
  let firstLine = '';
  const treeWalker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null);
  
  while (treeWalker.nextNode()) {
    const textNode = treeWalker.currentNode as Text;
    const text = textNode.textContent?.trim();
    if (text) {
      firstLine = text;
      break;
    }
  }
  
  if (!firstLine) return 'Untitled';
  return firstLine.length > 50 ? firstLine.substring(0, 50) + '...' : firstLine;
};

export const cleanFilePath = (filePath: string): string | null => {
  let cleanPath = filePath.trim();
  
  if (cleanPath.startsWith('file://')) {
    try {
      cleanPath = new URL(cleanPath).pathname;
    } catch (e) {
      console.error("Failed to parse file URI:", cleanPath, e);
      return null;
    }
  }
  
  return cleanPath;
}; 