import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";
import { useTheme } from "next-themes";
import { 
  FileText, PanelRightClose, MessageCircle, Plus, Trash2, Edit3, List, Calendar, Clock, Save
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { TiptapEditor, TiptapEditorHandle } from "./tiptap-editor";
import { Separator } from "../ui/separator";
import { AIChat } from "../chat/ai-chat";

// Feature imports
import {
  ContentPillBar,
  MemoList,
  SaveStatusIndicator,
  useMemoStorage,
  useContentPills,
  createDragDropHandlers,
  type ContentPill,
  type MemoMode,
} from "@/features/memo";

const SIDEBAR_WIDTH_STORAGE_KEY = 'enhanced-memo-sidebar-width';
const DEFAULT_SIDEBAR_WIDTH = 400;
const MIN_SIDEBAR_WIDTH = 320;

interface EnhancedMemoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: MemoMode;
  onModeChange: (mode: MemoMode) => void;
  width?: number;
  onWidthChange?: (width: number) => void;
  maxWidth?: number;
}

export function EnhancedMemoSidebar({ 
  isOpen, 
  onClose, 
  mode, 
  onModeChange,
  width: controlledWidth, 
  onWidthChange: setControlledWidth, 
  maxWidth = 1200
}: EnhancedMemoSidebarProps) {
  // Width management
  const [internalWidth, setInternalWidth] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_SIDEBAR_WIDTH;
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    return savedWidth ? Math.max(MIN_SIDEBAR_WIDTH, parseInt(savedWidth, 10)) : DEFAULT_SIDEBAR_WIDTH;
  });

  const width = controlledWidth ?? internalWidth;
  const setWidth = setControlledWidth ?? setInternalWidth;

  // State
  const [editorContent, setEditorContent] = useState("<p># New Memo</p><p>Write your content here...</p>");
  const [showMemoList, setShowMemoList] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [isEditorDragOver, setIsEditorDragOver] = useState(false);
  const [isPillBarDragOver, setIsPillBarDragOver] = useState(false);
  
  // Refs
  const tiptapEditorRef = useRef<TiptapEditorHandle>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  
  // Custom hooks
  const {
    savedMemos,
    currentMemoId,
    saveStatus,
    saveMemo,
    loadMemo,
    deleteMemo,
    createNewMemo: resetMemo,
    scheduleAutoSave,
  } = useMemoStorage({ autoSaveEnabled: true });

  const {
    contentPills,
    addContentPill,
    removeContentPill,
    clearContentPills,
    createPillFromFile,
    createPillFromUrl,
    createPillFromFiles,
  } = useContentPills();

  // Drag & Drop handlers
  const dragDropHandlers = useMemo(() => createDragDropHandlers(), []);

  // Effect for auto-save
  useEffect(() => {
    if (mode === 'memo' && !showMemoList) {
      scheduleAutoSave(editorContent);
    }
  }, [editorContent, mode, showMemoList, scheduleAutoSave]);

  // Memo operations
  const handleSaveMemo = useCallback(() => {
    saveMemo(editorContent);
  }, [editorContent, saveMemo]);

  const handleLoadMemo = useCallback((memoId: string) => {
    const memo = loadMemo(memoId);
    if (memo) {
      setEditorContent(memo.content);
      setShowMemoList(false);
    }
  }, [loadMemo]);

  const handleCreateNewMemo = useCallback(() => {
    tiptapEditorRef.current?.editor?.commands.setContent("<p># New Memo</p><p>Write your content here...</p>");
    resetMemo();
    clearContentPills();
    setShowMemoList(false);
  }, [resetMemo, clearContentPills]);

  // Pill operations
  const insertPillIntoEditor = useCallback((pill: ContentPill, position?: number) => {
    const editor = tiptapEditorRef.current?.editor;
    if (!editor) return;

    let transaction = editor.chain();
    if (position !== undefined) {
      const docSize = editor.state.doc.content.size;
      const safePosition = Math.max(0, Math.min(position, docSize));
      transaction = transaction.setTextSelection(safePosition);
    }
    transaction.setPill(pill).focus().run();
  }, []);

  const handlePillDragStart = useCallback((e: React.DragEvent, pill: ContentPill) => {
    e.dataTransfer.setData('application/x-content-pill', JSON.stringify(pill));
    e.dataTransfer.setData('application/json', JSON.stringify({
      id: pill.id,
      type: pill.type,
      title: pill.title,
      content: pill.content,
      metadata: pill.metadata
    }));
  }, []);

  // Drag & Drop operations
  const handleEditorDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditorDragOver(false);

    const editor = tiptapEditorRef.current?.editor;
    if (!editor || !e.dataTransfer) return;

    const position = editor.view.posAtCoords({ 
      left: e.clientX, 
      top: e.clientY 
    })?.pos ?? editor.state.doc.content.size;
    
    // Try different data types
    const contentItemData = e.dataTransfer.getData('application/content-item');
    if (contentItemData) {
      const pill = dragDropHandlers.handleContentItemDrop(contentItemData);
      if (pill) {
        addContentPill(pill);
        insertPillIntoEditor(pill, position);
        return;
      }
    }

    const pillData = e.dataTransfer.getData('application/x-content-pill');
    if (pillData) {
      const pill = dragDropHandlers.handlePillDrop(pillData);
      if (pill) {
            insertPillIntoEditor(pill, position);
            return;
      }
    }

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const pills = dragDropHandlers.handleFilesDrop(files);
      pills.forEach(pill => {
        addContentPill(pill);
        insertPillIntoEditor(pill, position);
      });
        return;
      }

    const plainText = e.dataTransfer.getData('text/plain');
    if (plainText) {
      const pathPill = dragDropHandlers.handlePathDrop(plainText);
      if (pathPill) {
        addContentPill(pathPill);
        insertPillIntoEditor(pathPill, position);
      } else {
        const textPill = dragDropHandlers.handleTextDrop(plainText);
        addContentPill(textPill);
        insertPillIntoEditor(textPill, position);
      }
    }
  }, [dragDropHandlers, addContentPill, insertPillIntoEditor]);

  const handlePillBarDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    setIsPillBarDragOver(false);

    if (!e.dataTransfer) return;

    const contentItemData = e.dataTransfer.getData('application/content-item');
    if (contentItemData) {
      const pill = dragDropHandlers.handleContentItemDrop(contentItemData);
      if (pill) {
        addContentPill(pill);
          return;
      }
    }

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      const pills = dragDropHandlers.handleFilesDrop(files);
      pills.forEach(addContentPill);
      return;
    }

    const plainText = e.dataTransfer.getData('text/plain');
    if (plainText) {
      const pathPill = dragDropHandlers.handlePathDrop(plainText);
      if (pathPill) {
        addContentPill(pathPill);
      } else {
        const textPill = dragDropHandlers.handleTextDrop(plainText);
        addContentPill(textPill);
      }
    }
  }, [dragDropHandlers, addContentPill]);

  // Resize handler
  const handleResizeMouseDown = useCallback((e: React.MouseEvent) => {
    if (!sidebarRef.current) return;
    e.preventDefault();
    document.body.style.cursor = 'col-resize';
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const newWidth = startWidth - (moveEvent.clientX - startX);
      if (newWidth >= MIN_SIDEBAR_WIDTH && newWidth <= maxWidth) {
        setWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.body.style.cursor = '';
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      
      const finalWidth = sidebarRef.current?.getBoundingClientRect().width;
      if (finalWidth) {
          localStorage.setItem(SIDEBAR_WIDTH_STORAGE_KEY, String(finalWidth));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [width, setWidth, maxWidth]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleEditorDragOver = useCallback((e: React.DragEvent) => {
    handleDragOver(e);
    setIsEditorDragOver(true);
  }, [handleDragOver]);

  const handleEditorDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsEditorDragOver(false);
  }, []);

  const handlePillBarDragOver = useCallback((e: React.DragEvent) => {
    handleDragOver(e);
    setIsPillBarDragOver(true);
  }, [handleDragOver]);

  const handlePillBarDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsPillBarDragOver(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div
      ref={sidebarRef}
      style={{ width: `${width}px` }}
                                      className="relative h-full flex flex-col bg-white/15 border-l border-white/20 shadow-lg"
    >
      {/* Resize handle */}
      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute top-0 -left-1 h-full w-2 cursor-col-resize z-20"
      />
      {isResizing && (
        <div className="absolute top-0 left-0 h-full w-full bg-blue-500/20 z-10 select-none" />
      )}

      {/* Header */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-white/[0.15]" 
        style={{ padding: `6px 8px` }}
      >
      {showMemoList ? (
          <>
            <h3 className="font-semibold text-lg ml-2">
              {mode === 'ai' ? 'AI Chat' : 'Saved Memos'}
            </h3>
            <div className="bg-white/10 text-white/80 text-xs font-medium px-2 py-1 rounded-full">
                {savedMemos.length}개
          </div>
          </>
        ) : (
          <>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/[0.15] transition-all duration-200"
              style={{ height: `24px`, width: `24px` }}
            >
              <PanelRightClose style={{ width: `14px`, height: `14px` }} />
            </Button>

                <div className="relative flex items-center bg-white/8 rounded-lg p-0.5 backdrop-blur-sm border border-white/10">
                    <motion.div 
                      className="absolute top-0.5 bottom-0.5 bg-white/15 backdrop-blur-sm rounded-md border border-white/20"
                      animate={{
                        left: mode === 'memo' ? '2px' : '46px',
                        width: mode === 'memo' ? '48px' : '28px'
                      }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 30,
                        mass: 0.6
                      }}
                />
                    
                <button
                  onClick={() => onModeChange('memo')}
                  className={`relative z-10 text-sm font-medium transition-all duration-200 rounded-md ${
                    mode === 'memo' ? 'text-white' : 'text-white/60 hover:text-white/80'
                  }`}
                  style={{ padding: `4px 8px`, fontSize: `12px`, width: `42px` }}
                >
                Memo
                </button>
                <button
                        onClick={() => onModeChange('ai')}
                className={`relative z-10 text-sm font-medium transition-all duration-200 rounded-md ${
                  mode === 'ai' ? 'text-white' : 'text-white/60 hover:text-white/80'
                }`}
                style={{ padding: `4px 8px`, fontSize: `12px`, width: `30px` }}
                    >
                        AI
                    </button>
                </div>
          </>
        )}
        </div>

      {/* Main Content */}
      {mode === 'ai' ? (
        <AIChat />
      ) : showMemoList ? (
        <MemoList
          memos={savedMemos}
          currentMemoId={currentMemoId}
          onSelectMemo={handleLoadMemo}
          onDeleteMemo={deleteMemo}
          onClose={() => setShowMemoList(false)}
        />
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          {/* Editor */}
          <div 
            className="flex-1 flex flex-col relative overflow-hidden" 
            onDragOver={handleEditorDragOver} 
            onDragLeave={handleEditorDragLeave} 
            onDrop={handleEditorDrop}
          >
            <TiptapEditor
                ref={tiptapEditorRef}
                content={editorContent}
                onContentChange={setEditorContent}
            />
            {isEditorDragOver && (
                <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-400 rounded-lg flex items-center justify-center pointer-events-none z-10 m-2">
                  <span className="text-white font-semibold text-sm">Drop here to add content</span>
                </div>
            )}
          </div>
              
          {/* Pill Bar */}
          <ContentPillBar
            pills={contentPills}
            onRemovePill={removeContentPill}
            onPillDragStart={handlePillDragStart}
            onDrop={handlePillBarDrop}
            onDragOver={handlePillBarDragOver}
            onDragLeave={handlePillBarDragLeave}
            isDragOver={isPillBarDragOver}
            className="flex-shrink-0 p-3 min-h-[3.5rem] border-t border-white/10"
          />
        </div>
      )}

      {/* Footer */}
      {mode !== 'ai' && (
        <div className="flex-shrink-0 flex items-center justify-between p-2 border-t border-white/10 h-12">
          <div className="flex items-center gap-1">
            <Button 
              variant="link" 
              className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10 rounded-md" 
              onClick={() => setShowMemoList(!showMemoList)}
            >
              <List className="h-5 w-5" />
            </Button>
            <Button 
              variant="link" 
              className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10 rounded-md" 
              onClick={handleCreateNewMemo}
            >
              <Plus className="h-5 w-5" />
            </Button>
            <Button 
              variant="link" 
              className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10 rounded-md" 
              onClick={handleSaveMemo}
            >
              <Save className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center gap-2 pr-2">
            <SaveStatusIndicator status={saveStatus} />
            <Separator orientation="vertical" className="h-5" />
            <span className="text-xs font-mono"># MD</span>
          </div>
        </div>
      )}
    </div>
  );
}