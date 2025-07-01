import { useState, useCallback, DragEvent } from 'react';
import { ContentItem } from '../types';

interface UseContentDragDropOptions {
  onDragStart?: (item: ContentItem, index: number) => void;
  onDragEnd?: (item: ContentItem, index: number) => void;
  onDrop?: (draggedItem: ContentItem, targetIndex: number) => void;
  onReorder?: (items: ContentItem[]) => void;
}

export const useContentDragDrop = (
  items: ContentItem[],
  options: UseContentDragDropOptions = {}
) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = useCallback(
    (e: DragEvent<HTMLElement>, item: ContentItem, index: number) => {
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('application/content-item', JSON.stringify(item));
      setDraggedIndex(index);
      options.onDragStart?.(item, index);
    },
    [options]
  );

  const handleDragEnd = useCallback(
    (e: DragEvent<HTMLElement>, item: ContentItem, index: number) => {
      setDraggedIndex(null);
      setDragOverIndex(null);
      options.onDragEnd?.(item, index);
    },
    [options]
  );

  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDragEnter = useCallback((index: number) => {
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    // We don't immediately clear dragOverIndex to prevent flickering
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent<HTMLElement>, targetIndex: number) => {
      e.preventDefault();
      e.stopPropagation();

      if (draggedIndex === null || draggedIndex === targetIndex) {
        setDragOverIndex(null);
        return;
      }

      const newItems = [...items];
      const [draggedItem] = newItems.splice(draggedIndex, 1);
      
      // Adjust target index if dragging to a position after the original
      const adjustedTargetIndex = 
        draggedIndex < targetIndex ? targetIndex - 1 : targetIndex;
      
      newItems.splice(adjustedTargetIndex, 0, draggedItem);

      options.onDrop?.(draggedItem, targetIndex);
      options.onReorder?.(newItems);
      
      setDraggedIndex(null);
      setDragOverIndex(null);
    },
    [items, draggedIndex, options]
  );

  return {
    draggedIndex,
    dragOverIndex,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  };
}; 