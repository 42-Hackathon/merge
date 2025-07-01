import { useState, useCallback, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { SavedMemo, SaveStatus } from '../types';
import { extractTitleFromHtml } from '../utils/content-helpers';

interface UseMemoStorageOptions {
  autoSaveEnabled?: boolean;
  autoSaveDelay?: number;
}

export const useMemoStorage = (options: UseMemoStorageOptions = {}) => {
  const { autoSaveEnabled = true, autoSaveDelay = 1000 } = options;
  
  const [savedMemos, setSavedMemos] = useState<SavedMemo[]>([]);
  const [currentMemoId, setCurrentMemoId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const saveMemo = useCallback((content: string, isManualSave = true) => {
    if (saveStatus === 'saving') return;
    if (isManualSave) setSaveStatus('saving');

    const title = extractTitleFromHtml(content) || 'Untitled';
    const now = new Date().toISOString();
    
    let newMemos: SavedMemo[];
    let newMemoId = currentMemoId;
    
    if (currentMemoId) {
      newMemos = savedMemos.map(memo =>
        memo.id === currentMemoId
          ? { ...memo, title, content, updatedAt: now }
          : memo
      );
    } else {
      const newMemo: SavedMemo = {
        id: uuidv4(),
        title,
        content,
        createdAt: now,
        updatedAt: now,
        language: 'html'
      };
      newMemos = [...savedMemos, newMemo];
      newMemoId = newMemo.id;
    }

    setSavedMemos(newMemos);
    setCurrentMemoId(newMemoId);

    if (isManualSave) {
      toast.success("Memo Saved", {
        description: `"${title}" has been saved.`,
      });
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    }
    
    return newMemoId;
  }, [currentMemoId, savedMemos, saveStatus]);

  const loadMemo = useCallback((memoId: string): SavedMemo | null => {
    const memo = savedMemos.find(m => m.id === memoId);
    if (memo) {
      setCurrentMemoId(memo.id);
      setSaveStatus('idle');
      return memo;
    }
    return null;
  }, [savedMemos]);

  const deleteMemo = useCallback((memoId: string) => {
    setSavedMemos(prev => prev.filter(m => m.id !== memoId));
    if (currentMemoId === memoId) {
      setCurrentMemoId(null);
    }
    toast.success("Memo Deleted", {
      description: "Selected memo has been deleted.",
    });
  }, [currentMemoId]);

  const createNewMemo = useCallback(() => {
    setCurrentMemoId(null);
    setSaveStatus('idle');
  }, []);

  const scheduleAutoSave = useCallback((content: string) => {
    if (!autoSaveEnabled) return;
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    autoSaveTimeoutRef.current = setTimeout(() => {
      saveMemo(content, false);
    }, autoSaveDelay);
  }, [autoSaveEnabled, autoSaveDelay, saveMemo]);

  return {
    savedMemos,
    currentMemoId,
    saveStatus,
    saveMemo,
    loadMemo,
    deleteMemo,
    createNewMemo,
    scheduleAutoSave,
  };
}; 