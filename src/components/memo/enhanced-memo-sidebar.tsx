import React, { useState, useRef, useCallback, useEffect } from "react";
import { useTheme } from "next-themes";
import { 
  FileText, PanelRightClose, MessageCircle, Image, Link as LinkIcon, X, Hash, Type, Sparkles, ChevronUp, Zap, GripVertical, Save, Check, AlertCircle, Plus, Trash2, Edit3, List, Calendar, Clock, Bot, Film, Music, Camera, Clipboard
} from "lucide-react";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { ContentItem } from "@/types/content";
import { AnimatePresence, motion } from "framer-motion";
import { TiptapEditor, TiptapEditorHandle } from "./tiptap-editor";
import { v4 as uuidv4 } from 'uuid';
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { AIChat } from "../chat/ai-chat";

type ContentType = 'text' | 'image' | 'link' | 'video' | 'audio' | 'clipboard' | 'screenshot' | 'other';

const SIDEBAR_WIDTH_STORAGE_KEY = 'enhanced-memo-sidebar-width';
const DEFAULT_SIDEBAR_WIDTH = 400;
const MIN_SIDEBAR_WIDTH = 320;
const MAX_VISIBLE_PILLS = 5;

interface EnhancedMemoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'memo' | 'chat' | 'view' | 'ai';
  onModeChange: (mode: 'memo' | 'chat' | 'view' | 'ai') => void;
  width?: number;
  onWidthChange?: (width: number) => void;
  maxWidth?: number;
}

export interface ContentPill {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  metadata?: { url?: string; domain?: string; favicon?: string; };
}

interface SavedMemo {
  id: string;
  title: string;
  content: string; // This will now be HTML
  language: 'html';
  createdAt: string;
  updatedAt: string;
}

export function EnhancedMemoSidebar({ 
  isOpen, onClose, mode, onModeChange,
  width: controlledWidth, onWidthChange: setControlledWidth, maxWidth = 1200
}: EnhancedMemoSidebarProps) {
  const [internalWidth, setInternalWidth] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_SIDEBAR_WIDTH;
    const savedWidth = localStorage.getItem(SIDEBAR_WIDTH_STORAGE_KEY);
    return savedWidth ? Math.max(MIN_SIDEBAR_WIDTH, parseInt(savedWidth, 10)) : DEFAULT_SIDEBAR_WIDTH;
  });

  const width = controlledWidth ?? internalWidth;
  const setWidth = setControlledWidth ?? setInternalWidth;

  const [editorContent, setEditorContent] = useState("<p># New Memo</p><p>Write your content here...</p>");
  const [isDragging, setIsDragging] = useState(false);
  const [contentPills, setContentPills] = useState<ContentPill[]>([]);
  const [showMemoList, setShowMemoList] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [savedMemos, setSavedMemos] = useState<SavedMemo[]>([]);
  const [currentMemoId, setCurrentMemoId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [isPillsScrollable, setIsPillsScrollable] = useState(false);
  const [isPillListVisible, setIsPillListVisible] = useState(false);
  const [isPillOverflowing, setIsPillOverflowing] = useState(false);
  const [isEditorDragOver, setIsEditorDragOver] = useState(false);
  const [isPillBarDragOver, setIsPillBarDragOver] = useState(false);
  
  const tiptapEditorRef = useRef<TiptapEditorHandle>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);
  const pillsContainerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pillListPopupRef = useRef<HTMLDivElement>(null);
  const pillOverflowButtonRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const checkOverflow = () => {
        const isOverflowing = scrollContainer.scrollWidth > scrollContainer.clientWidth;
        if (isOverflowing !== isPillOverflowing) {
          setIsPillOverflowing(isOverflowing);
        }
    };
    
    const resizeObserver = new ResizeObserver(checkOverflow);
    resizeObserver.observe(scrollContainer);
    
    const timeoutId = setTimeout(checkOverflow, 100);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
    };
  }, [contentPills, width, isPillOverflowing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pillListPopupRef.current &&
        !pillListPopupRef.current.contains(event.target as Node) &&
        pillOverflowButtonRef.current &&
        !pillOverflowButtonRef.current.contains(event.target as Node)
      ) {
        setIsPillListVisible(false);
      }
    };

    if (isPillListVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isPillListVisible]);

  const extractTitle = useCallback((htmlContent: string): string => {
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
  }, []);

  const saveMemo = useCallback((isManualSave = true) => {
    if (saveStatus === 'saving') return;
    if (isManualSave) setSaveStatus('saving');

    const title = extractTitle(editorContent) || 'Untitled';
      const now = new Date().toISOString();
      
    let newMemos: SavedMemo[];
    let newMemoId = currentMemoId;
      
      if (currentMemoId) {
      newMemos = savedMemos.map(memo =>
        memo.id === currentMemoId
          ? { ...memo, title, content: editorContent, updatedAt: now }
          : memo
      );
      } else {
      const newMemo: SavedMemo = {
        id: uuidv4(),
          title,
          content: editorContent,
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
      toast("Memo Saved", {
        description: `"${title}" has been saved.`,
      });
        setSaveStatus('saved');
        setTimeout(() => setSaveStatus('idle'), 2000);
      }
  }, [editorContent, currentMemoId, savedMemos, saveStatus, extractTitle]);
  
  const loadMemo = useCallback((memoId: string) => {
    const memoToLoad = savedMemos.find(m => m.id === memoId);
    if (memoToLoad) {
      setEditorContent(memoToLoad.content);
      setCurrentMemoId(memoToLoad.id);
      setSaveStatus('idle');
      setShowMemoList(false);
    }
  }, [savedMemos]);
  
  const createNewMemo = useCallback(() => {
    tiptapEditorRef.current?.editor?.commands.setContent("<p># New Memo</p><p>Write your content here...</p>");
    setCurrentMemoId(null);
    setSaveStatus('idle');
    setShowMemoList(false);
    setContentPills([]);
  }, []);
  
  const deleteMemo = (memoIdToDelete: string) => {
    setSavedMemos(prev => prev.filter(m => m.id !== memoIdToDelete));
    if (currentMemoId === memoIdToDelete) {
        createNewMemo();
      }
    toast("Memo Deleted", {
      description: "Selected memo has been deleted.",
    });
  };

  const PillIcon = ({ type }: { type: ContentType }) => {
    switch (type) {
      case 'image': return <Image className="h-4 w-4" />;
      case 'link': return <LinkIcon className="h-4 w-4" />;
      case 'video': return <Film className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'clipboard': return <Clipboard className="h-4 w-4" />;
      case 'screenshot': return <Camera className="h-4 w-4" />;
      case 'text':
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getPillStyleClass = (type: ContentType) => {
    switch (type) {
      case 'link':
        return `border-blue-500/80 text-blue-300`;
      case 'image':
        return `border-purple-500/80 text-purple-300`;
      case 'video':
        return `border-red-500/80 text-red-300`;
      case 'audio':
        return `border-orange-500/80 text-orange-300`;
      case 'clipboard':
        return `border-yellow-500/80 text-yellow-300`;
      case 'screenshot':
        return `border-cyan-500/80 text-cyan-300`;
      case 'text':
        return `border-green-500/80 text-green-300`;
      case 'other':
      default:
        return `border-gray-500/80 text-gray-300`;
    }
  };

  const addContentPill = (pill: ContentPill) => {
    setContentPills(prev => [...prev, pill]);
  };

  const insertPillIntoEditor = (pill: ContentPill, position?: number) => {
    const editor = tiptapEditorRef.current?.editor;
    if (!editor) return;

    let transaction = editor.chain();
    if (position !== undefined) {
      const docSize = editor.state.doc.content.size;
      const safePosition = Math.max(0, Math.min(position, docSize));
      transaction = transaction.setTextSelection(safePosition);
    }
    transaction.setPill(pill).focus().run();
  };

  const handlePathDrop = (filePath: string, position?: number) => {
    let cleanPath = filePath.trim();
    if (cleanPath.startsWith('file://')) {
        try {
            cleanPath = new URL(cleanPath).pathname;            
        } catch(e) {
            console.error("Failed to parse file URI:", cleanPath, e);
            return false;
        }
    }

    if (!(window as any).electron?.fs.existsSync(cleanPath)) {
      return false; 
    }

    const ext = (window as any).electron.path.extname(cleanPath).toLowerCase();
    const filename = (window as any).electron.path.basename(cleanPath);

    let fileType: ContentType = 'other';
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(ext)) {
      fileType = 'image';
    } else if (['.mp4', '.mov', '.avi', '.webm'].includes(ext)) {
      fileType = 'video';
    } else if (['.mp3', '.wav', '.ogg', '.m4a'].includes(ext)) {
      fileType = 'audio';
    } else if (['.txt', '.md', '.pdf', '.doc', '.docx'].includes(ext)) {
      fileType = 'text';
    }
    
    const newPill: ContentPill = {
      id: uuidv4(),
      type: fileType,
      title: filename,
      content: `file://${cleanPath}`,
    };

    addContentPill(newPill);
    if (position !== undefined) {
      insertPillIntoEditor(newPill, position);
    }
    return true;
  };

  const handleTextDrop = async (textData: string, position?: number) => {
    try {
      const urlObject = new URL(textData);
      const newPill: ContentPill = {
        id: uuidv4(),
        type: 'link',
        title: textData,
        content: textData,
        metadata: { url: textData, domain: urlObject.hostname },
      };
      addContentPill(newPill);
      
      if (position !== undefined) {
        insertPillIntoEditor(newPill, position);
      }
    } catch (error) {
      if (position !== undefined) {
        const editor = tiptapEditorRef.current?.editor;
        if (editor) {
          editor.chain().focus().insertContentAt(position, textData).run();
        }
      } else {
        const newPill: ContentPill = {
          id: uuidv4(),
          type: 'text',
          title: textData.length > 40 ? `${textData.substring(0, 37)}...` : textData,
          content: textData,
        };
        addContentPill(newPill);
      }
    }
  };
  
  const handleFilesDrop = async (files: File[], position?: number) => {
    for (const file of files) {
        let fileType: ContentType = 'other';
        if (file.type.startsWith('image/')) {
          fileType = 'image';
        } else if (file.type.startsWith('video/')) {
          fileType = 'video';
        } else if (file.type.startsWith('audio/')) {
          fileType = 'audio';
        } else if (file.type === 'application/pdf' || file.type.startsWith('text/')) {
          fileType = 'text';
        }

        const newPill: ContentPill = {
            id: uuidv4(),
            type: fileType,
            title: file.name,
            content: `file:${(file as any).path || file.name}`,
        };
        addContentPill(newPill);

        if (position !== undefined) {
            insertPillIntoEditor(newPill, position);
        }
    }
  };

  const handleEditorDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditorDragOver(false);

    const editor = tiptapEditorRef.current?.editor;
    if (!editor || !e.dataTransfer) return;

    const position = editor.view.posAtCoords({ left: e.clientX, top: e.clientY })?.pos ?? editor.state.doc.content.size;
    
    // 1. Handle content items dragged from within the app
    const contentItemData = e.dataTransfer.getData('application/content-item');
    if (contentItemData) {
        try {
            const item = JSON.parse(contentItemData);
            
            // 이미지 타입일 때는 metadata.url을 content로 사용
            let pillContent = item.content;
            if (item.type === 'image' && item.metadata?.url) {
                pillContent = item.metadata.url;
            } else if (item.type === 'link' && item.metadata?.url) {
                pillContent = item.metadata.url;
            }
            
            const newPill: ContentPill = {
                id: item.id || uuidv4(),
                type: item.type,
                title: item.title,
                content: pillContent,
                metadata: item.metadata
            };
            addContentPill(newPill);
            insertPillIntoEditor(newPill, position);
        return;
        } catch (err) { console.error("Error parsing content-item data:", err) }
    }

    // 2. Handle pills being dragged from the bar
    const pillData = e.dataTransfer.getData('application/x-content-pill');
    if (pillData) {
        try {
            const pill = JSON.parse(pillData);
            insertPillIntoEditor(pill, position);
            return;
        } catch (err) { console.error("Error parsing pill data:", err) }
    }

    // 3. Handle actual files from OS
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
        handleFilesDrop(files, position);
        return;
      }

    // 4. Handle file paths from Electron (fallback)
    const plainText = e.dataTransfer.getData('text/plain');
    if (plainText && handlePathDrop(plainText, position)) {
        return;
      }

    // 5. Handle URLs or plain text as the last resort
    const url = e.dataTransfer.getData('text/uri-list');
    if (url) {
        handleTextDrop(url, position);
        return;
      }
    if (plainText) {
        handleTextDrop(plainText, position);
    }
  };

  const handlePillBarDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    setIsPillBarDragOver(false);

    if (!e.dataTransfer) return;

    const contentItemData = e.dataTransfer.getData('application/content-item');
    if (contentItemData) {
        try {
            const item = JSON.parse(contentItemData);
            
            // 이미지 타입일 때는 metadata.url을 content로 사용
            let pillContent = item.content;
            if (item.type === 'image' && item.metadata?.url) {
                pillContent = item.metadata.url;
            } else if (item.type === 'link' && item.metadata?.url) {
                pillContent = item.metadata.url;
            }
            
             const newPill: ContentPill = {
                id: item.id || uuidv4(),
                type: item.type,
              title: item.title,
              content: pillContent,
                metadata: item.metadata
            };
            addContentPill(newPill);
          return;
        } catch (err) { console.error("Error parsing content-item data:", err) }
    }
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
        handleFilesDrop(files);
      return;
    }
    const plainText = e.dataTransfer.getData('text/plain');
    if (plainText && (window as any).electron && handlePathDrop(plainText)) {
      return;
    }
    const url = e.dataTransfer.getData('text/uri-list');
    if (url) {
        handleTextDrop(url);
      return;
    }
    if (plainText) {
        handleTextDrop(plainText);
    }
   };

  const handlePillDragStart = (e: React.DragEvent, pill: ContentPill) => {
     e.dataTransfer.setData('application/x-content-pill', JSON.stringify(pill));
     // AI 채팅을 위한 ContextItem 형식으로도 데이터 설정
     e.dataTransfer.setData('application/json', JSON.stringify({
       id: pill.id,
       type: pill.type,
       title: pill.title,
       content: pill.content,
       metadata: pill.metadata
     }));
   };
  
  const handleEditorDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsEditorDragOver(true);
  };

  const handleEditorDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Check if the mouse is leaving the drop zone entirely
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsEditorDragOver(false);
  };

  const handlePillBarDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsPillBarDragOver(true);
  };

  const handlePillBarDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    setIsPillBarDragOver(false);
  };

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

  if (!isOpen) return null;

  const renderSaveStatus = () => {
    switch (saveStatus) {
      case 'saving': return <span className="text-xs text-yellow-400">Saving...</span>;
      case 'saved': return <span className="text-xs text-green-400">Saved!</span>;
      default: return null;
    }
  };

  return (
    <div
      ref={sidebarRef}
      style={{ width: `${width}px` }}
      className="relative h-full flex flex-col bg-white/10 backdrop-blur-2xl border-l border-white/20 shadow-2xl"
    >
      <div
        onMouseDown={handleResizeMouseDown}
        className="absolute top-0 -left-1 h-full w-2 cursor-col-resize z-20"
      />
      {isResizing && <div className="absolute top-0 left-0 h-full w-full bg-blue-500/20 z-10 select-none" />}

      {/* Header */}
      {showMemoList ? (
        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-white/10 h-14">
            <h3 className="font-semibold text-lg ml-2">
                {mode === 'ai' ? 'AI Chat' : 'Saved Memos'}
            </h3>
            <div className="bg-white/10 text-white/80 text-xs font-medium px-2 py-1 rounded-full">
                {savedMemos.length}개
          </div>
            </div>
      ) : (
        <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-white/10 h-14">
            <div className="flex items-center gap-3">
                {/* 메모/AI 스위치 */}
                <div className="relative flex items-center bg-white/8 rounded-lg p-0.5 backdrop-blur-sm border border-white/10">
                    {/* 슬라이딩 인디케이터 */}
                    <motion.div
                        className="absolute top-0.5 bottom-0.5 bg-white/15 backdrop-blur-sm rounded-md border border-white/20"
                        animate={{
                            left: mode === 'memo' ? '2px' : '50%',
                            width: mode === 'memo' ? 'calc(50% - 2px)' : 'calc(50% - 2px)'
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
                        className={`relative z-10 flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md min-w-[60px] ${
                            mode === 'memo' 
                                ? 'text-white' 
                                : 'text-white/60 hover:text-white/80'
                        }`}
                    >
                        Memo
                    </button>
                    <button
                        onClick={() => onModeChange('ai')}
                        className={`relative z-10 flex items-center justify-center px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md min-w-[60px] ${
                            mode === 'ai' 
                                ? 'text-white' 
                                : 'text-white/60 hover:text-white/80'
                        }`}
                    >
                        AI
                    </button>
                </div>
        </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
                <PanelRightClose className="h-5 w-5" />
                </Button>
              </div>
      )}

      {/* Main Content */}
      {mode === 'ai' ? (
        <AIChat width={width} />
      ) : showMemoList ? (
        <div className="flex-1 overflow-y-auto p-2">
          {savedMemos.length > 0 ? (
            <ScrollArea className="h-full">
              <ul className="space-y-1 p-1">
                {savedMemos.slice().reverse().map((memo) => (
                  <motion.li 
                    key={memo.id} 
                    onClick={() => loadMemo(memo.id)} 
                    className="relative group p-3 rounded-lg cursor-pointer"
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    transition={{ 
                        type: 'tween',
                        duration: 0.2,
                        ease: 'easeOut'
                    }}
                >
                    <p className="font-medium truncate text-sm mb-2">{memo.title}</p>
                    <div className="flex items-center gap-4 text-xs text-white/50">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{new Date(memo.updatedAt).toLocaleDateString('ko-KR')}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{new Date(memo.updatedAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                              </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-all text-white/60 hover:bg-red-900/50 hover:text-white" 
                      onClick={(e) => { e.stopPropagation(); deleteMemo(memo.id); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </motion.li>
                ))}
              </ul>
                      </ScrollArea>
          ) : (
            <div className="text-center text-white/50 pt-16 flex flex-col items-center">
              <FileText size={48} className="mb-4 text-white/20"/>
              <p className="font-semibold">No saved memos</p>
              <p className="text-sm text-white/40">Create and save a new memo to get started.</p>
                  </div>
                )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex-1 flex flex-col relative overflow-hidden" onDragOver={handleEditorDragOver} onDragLeave={handleEditorDragLeave} onDrop={handleEditorDrop}>
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
          <div 
              className={`flex-shrink-0 p-3 relative flex items-center transition-colors duration-200 min-h-[3.5rem] ${isPillBarDragOver ? 'bg-blue-500/20' : ''}`}
              onDragOver={handlePillBarDragOver} onDragLeave={handlePillBarDragLeave} onDrop={handlePillBarDrop}>
              <div 
                ref={scrollContainerRef}
                className="flex items-center gap-2 overflow-x-auto hide-scrollbar"
                style={{
                  maskImage: isPillOverflowing 
                    ? 'linear-gradient(to right, black calc(100% - 48px), transparent 100%)'
                    : 'none',
                  WebkitMaskImage: isPillOverflowing 
                    ? 'linear-gradient(to right, black calc(100% - 48px), transparent 100%)'
                    : 'none',
                }}
              >
                <div ref={pillsContainerRef} className="flex items-center gap-2 w-max pr-4">
                        {contentPills.map(pill => (
                          <div key={pill.id} className="group relative flex-shrink-0">
                            <div 
                              draggable
                              onDragStart={(e) => handlePillDragStart(e, pill)}
                              className={`flex items-center text-xs rounded-full pl-2 pr-2 py-1 backdrop-blur-xl border cursor-grab active:cursor-grabbing transition-all duration-200 ${getPillStyleClass(pill.type)}`} 
                              onClick={() => insertPillIntoEditor(pill)} 
                              title={pill.title}
                            >
                              <PillIcon type={pill.type} />
                              <span className="truncate flex-1 mx-1.5">{pill.title}</span>
                            </div>
                            
                            {/* 이미지 호버 미리보기 */}
                            {pill.type === 'image' && (
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-2 shadow-2xl">
                                  <img 
                                    src={pill.content.startsWith('file://') ? pill.content : (pill.metadata?.url || pill.content)}
                                    alt={pill.title}
                                    className="max-w-[200px] max-h-[150px] object-contain rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.setAttribute('style', 'display: block');
                                    }}
                                  />
                                  <div className="hidden text-xs text-white/60 text-center mt-1">
                                    Image not available
                                  </div>
                                  <div className="text-xs text-white/80 text-center mt-1 truncate max-w-[200px]">
                                    {pill.title}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <button onClick={() => setContentPills(pills => pills.filter(p => p.id !== pill.id))} className="absolute top-1/2 -translate-y-1/2 right-1.5 bg-gray-700 hover:bg-red-500 border border-gray-600 rounded-full h-4 w-4 flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-all" title="Remove pill"><X className="h-2.5 w-2.5" /></button>
                          </div>
                        ))}
                  {contentPills.length === 0 && (
                    <div className="text-xs text-white/40 px-2">Drag content here to add.</div>
                  )}
                      </div>
                            </div>
              
              {isPillOverflowing && (
                <div 
                  ref={pillOverflowButtonRef}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center text-xs font-semibold rounded-full h-6 w-6 bg-gray-800/80 backdrop-blur-sm border border-gray-600/90 text-gray-300 cursor-pointer hover:bg-gray-700/90"
                  onClick={() => setIsPillListVisible(prev => !prev)}
                >
                  +{contentPills.length}
                </div>
              )}
              
              <AnimatePresence>
                {isPillListVisible && (
                  <motion.div
                    ref={pillListPopupRef}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full right-3 mb-2 w-80 p-2 bg-black/40 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl z-30"
                  >
                    <div className="flex justify-between items-center mb-2 px-1 pt-1">
                      <h4 className="font-semibold text-sm text-white/90">
                        콘텐츠 <span className="text-white/50 ml-1">{contentPills.length}</span>
                      </h4>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-transparent hover:bg-white/10" onClick={() => setIsPillListVisible(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <ScrollArea className="max-h-60 pr-2">
                      <div className="space-y-1.5">
                                {contentPills.map(pill => (
                          <motion.li 
                            key={pill.id} 
                            className="group relative flex items-center p-1 rounded-lg"
                            whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                            transition={{ 
                                type: 'tween',
                                duration: 0.2,
                                ease: 'easeOut'
                            }}
                          >
                            <div
                              className={`w-full flex items-center text-xs px-2 py-1.5 rounded-lg border border-transparent cursor-pointer ${getPillStyleClass(pill.type)}`}
                              onClick={() => { insertPillIntoEditor(pill); setIsPillListVisible(false); }}
                              title={pill.title}
                            >
                              <div className={`p-1 rounded-md bg-white/5 mr-2 ${getPillStyleClass(pill.type)}`}>
                                <PillIcon type={pill.type} />
                              </div>
                              <span className="truncate">{pill.title}</span>
                            </div>
                            
                            {/* 이미지 호버 미리보기 (pill 목록용) */}
                            {pill.type === 'image' && (
                              <div className="absolute left-full top-0 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                                <div className="bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg p-2 shadow-2xl">
                                  <img 
                                    src={pill.content.startsWith('file://') ? pill.content : (pill.metadata?.url || pill.content)}
                                    alt={pill.title}
                                    className="max-w-[200px] max-h-[150px] object-contain rounded"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      target.nextElementSibling?.setAttribute('style', 'display: block');
                                    }}
                                  />
                                  <div className="hidden text-xs text-white/60 text-center mt-1">
                                    Image not available
                                  </div>
                                  <div className="text-xs text-white/80 text-center mt-1 truncate max-w-[200px]">
                                    {pill.title}
                                  </div>
                                </div>
                              </div>
                            )}
                            
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-1.5 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-all text-white/60 hover:bg-red-900/50 hover:text-white"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setContentPills(pills => pills.filter(p => p.id !== pill.id));
                                }}
                            >
                                <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </motion.li>
                                ))}
                              </div>
                            </ScrollArea>
                  </motion.div>
                      )}
              </AnimatePresence>
                    </div>
                  </div>
                )}

      {/* Footer */}
      {mode !== 'ai' && (
        <div className="flex-shrink-0 flex items-center justify-between p-2 border-t border-white/10 h-12">
                        <div className="flex items-center gap-1">
            <Button variant="link" className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10 rounded-md" onClick={() => setShowMemoList(!showMemoList)}>
              <List className="h-5 w-5" />
            </Button>
            <Button variant="link" className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10 rounded-md" onClick={createNewMemo}>
              <Plus className="h-5 w-5" />
            </Button>
            <Button variant="link" className="h-8 w-8 p-0 text-white/80 hover:text-white hover:bg-white/10 rounded-md" onClick={() => saveMemo()}>
              <Save className="h-5 w-5" />
                        </Button>
                      </div>
          <div className="flex items-center gap-2 pr-2">
            {renderSaveStatus()}
            <Separator orientation="vertical" className="h-5" />
            <span className="text-xs font-mono">
              # MD
            </span>
                              </div>
                              </div>
      )}
                          </div>
  );
}