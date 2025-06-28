import { useState, useRef } from "react";
import { OnMount } from "@monaco-editor/react";
import Editor from "@monaco-editor/react"; // Re-enable editor
import { 
  FileText,
  PanelRightClose,
  MessageCircle,
  Image,
  Link as LinkIcon,
  X,
  Plus,
  GripVertical
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContentItem } from "@/types/content";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem
} from "@/components/ui/select";

interface EnhancedMemoSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'memo' | 'chat';
  onModeChange: (mode: 'memo' | 'chat') => void;
  zoomLevel: number;
  onCursorChange: (position: { line: number; column: number }) => void;
}

interface ContentPill {
  id: string;
  type: 'text' | 'image' | 'link';
  title: string;
  content: string;
  metadata?: {
    url?: string;
    domain?: string;
    favicon?: string;
  };
}

export function EnhancedMemoSidebar({ 
  isOpen, 
  onClose, 
  mode, 
  onModeChange,
  zoomLevel,
  onCursorChange
}: EnhancedMemoSidebarProps) {
  const [editorContent, setEditorContent] = useState("# 새 메모\n\n여기에 내용을 작성하세요...");
  const [editorLanguage, setEditorLanguage] = useState("markdown");
  const [isDragging, setIsDragging] = useState(false);
  const [contentPills, setContentPills] = useState<ContentPill[]>([]);
  
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    editor.onDidChangeCursorPosition((e) => {
      onCursorChange({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    const editorDomNode = editor.getDomNode();
    if (editorDomNode) {
      editorDomNode.addEventListener('dragover', (e) => {
        e.preventDefault(); // Allow drop
      });

      editorDomNode.addEventListener('drop', (e) => {
        e.preventDefault();
        
        const data = e.dataTransfer?.getData('application/content-item');
        if (!data) return;

        try {
          const item: ContentItem = JSON.parse(data);
          const target = editor.getTargetAtClientPoint(e.clientX, e.clientY);
          
          if (target?.position) {
            const position = target.position;
            const pillText = `[[${item.title}]]`;
            
            editor.executeEdits('dnd-insert', [{
              range: new monaco.Range(
                position.lineNumber,
                position.column,
                position.lineNumber,
                position.column
              ),
              text: pillText,
              forceMoveMarkers: true,
            }]);
          }
        } catch (error) {
          console.error("Failed to parse dropped item:", error);
        }
      });
    }
  };

  // Monaco Editor 설정
  const editorOptions = {
    minimap: { enabled: false },
    fontSize: 13 * (zoomLevel / 100),
    lineHeight: 20 * (zoomLevel / 100),
    padding: { top: 16, bottom: 16 },
    scrollBeyondLastLine: false,
    wordWrap: 'on' as const,
    automaticLayout: true,
    scrollbar: {
      vertical: 'hidden' as const,
      horizontal: 'auto' as const
    },
    overviewRulerLanes: 0,
    hideCursorInOverviewRuler: true,
    overviewRulerBorder: false,
    renderLineHighlight: 'none' as const,
    selectionHighlight: false,
    occurrencesHighlight: 'off' as const,
  };

  // 드래그 앤 드롭 처리
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dropZoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    try {
      // ContentItem 드래그 처리
      const contentItemData = e.dataTransfer.getData('application/content-item');
      if (contentItemData) {
        const contentItem: ContentItem = JSON.parse(contentItemData);
        await handleContentItemDrop(contentItem);
        return;
      }

      // 텍스트 데이터 처리
      const textData = e.dataTransfer.getData('text/plain');
      
      // URL 처리
      if (textData && (textData.startsWith('http://') || textData.startsWith('https://'))) {
        await handleUrlDrop(textData);
        return;
      }

      // 일반 텍스트 처리
      if (textData) {
        addContentPill({
          id: Date.now().toString(),
          type: 'text',
          title: textData.slice(0, 30) + (textData.length > 30 ? '...' : ''),
          content: textData
        });
      }

      // 파일 처리
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        await handleFilesDrop(files);
      }
    } catch {
      console.error('Drop handling failed');
    }
  };

  // ContentItem 드롭 처리
  const handleContentItemDrop = async (item: ContentItem) => {
    const pill: ContentPill = {
      id: Date.now().toString(),
      type: item.type === 'link' ? 'link' : item.type === 'image' ? 'image' : 'text',
      title: item.title,
      content: item.content,
      metadata: item.type === 'link' ? {
        url: item.metadata?.url || item.content,
        domain: item.metadata?.url ? new URL(item.metadata.url).hostname : undefined
      } : undefined
    };

    addContentPill(pill);
  };

  // URL 드롭 처리
  const handleUrlDrop = async (url: string) => {
    try {
      const domain = new URL(url).hostname;
      const pill: ContentPill = {
        id: Date.now().toString(),
        type: 'link',
        title: `Link from ${domain}`,
        content: url,
        metadata: {
          url,
          domain,
          favicon: `https://www.google.com/s2/favicons?domain=${domain}&sz=16`
        }
      };
      
      addContentPill(pill);
    } catch {
      // URL 파싱 실패시 일반 텍스트로 처리
      addContentPill({
        id: Date.now().toString(),
        type: 'text',
        title: url.slice(0, 30) + '...',
        content: url
      });
    }
  };

  // 파일 드롭 처리
  const handleFilesDrop = async (files: File[]) => {
    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const imageUrl = URL.createObjectURL(file);
        addContentPill({
          id: Date.now().toString(),
          type: 'image',
          title: file.name,
          content: imageUrl
        });
      } else {
        addContentPill({
          id: Date.now().toString(),
          type: 'text',
          title: file.name,
          content: `File: ${file.name} (${file.type})`
        });
      }
    }
  };

  // 콘텐츠 pill 추가
  const addContentPill = (pill: ContentPill) => {
    setContentPills(prev => [...prev, pill]);
  };

  // 콘텐츠 pill 제거
  const removeContentPill = (id: string) => {
    setContentPills(prev => prev.filter(pill => pill.id !== id));
  };

  // pill을 에디터에 삽입
  const insertPillIntoEditor = (pill: ContentPill) => {
    let insertText = "";

    switch (pill.type) {
      case 'text':
        insertText = `${pill.content}\n\n`;
        break;
      case 'link':
        insertText = `[${pill.title}](${pill.content})\n\n`;
        break;
      case 'image':
        insertText = `![${pill.title}](${pill.content})\n\n`;
        break;
    }

    if (editorRef.current) {
      const editor = editorRef.current;
      const position = editor.getPosition();
      if (!position) return;

      const range = {
        startLineNumber: position.lineNumber,
        startColumn: position.column,
        endLineNumber: position.lineNumber,
        endColumn: position.column
      };
      
      editor.executeEdits('insert-content', [{
        range,
        text: insertText
      }]);
      
      editor.focus();
    } else {
      setEditorContent(prev => prev + insertText);
    }
  };

  // pill 아이콘 가져오기
  const PillIcon = ({ type }: { type: string }) => {
    switch (type) {
      case 'text':
        return <FileText className="h-3.5 w-3.5" />;
      case 'image':
        return <Image className="h-3.5 w-3.5" />;
      case 'link':
        return <LinkIcon className="h-3.5 w-3.5" />;
      default:
        return <FileText className="h-3.5 w-3.5" />;
    }
  };

  // A simple helper to avoid type errors on possibly undefined strings
  const ensureString = (value: string | undefined): string => value || "";

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="h-full flex flex-col border-l border-white/[0.15] w-72 outline-none shadow-none"
    >
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Apple Liquid Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.15] via-cyan-300/[0.08] to-blue-600/[0.12]" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-white/[0.03]" />
          
        {/* Subtle Glass Reflections */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/[0.08] to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-blue-300/[0.05] to-transparent" />
          
        <div className="relative z-10 flex-1 flex flex-col">
            {/* Header */}
          <div className="relative flex items-center justify-between px-3 py-1.5 border-b border-white/[0.15]">
            {/* Collapse button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/[0.15] h-6 w-6"
              title="사이드바 닫기"
            >
              <PanelRightClose className="h-4 w-4" />
            </Button>
            
            {/* Mode Switch */}
            <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
                <Button
                variant={mode === 'memo' ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onModeChange('memo')}
                className="h-7 px-3 text-xs"
                >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                  메모
                </Button>
                <Button
                variant={mode === 'chat' ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => onModeChange('chat')}
                className="h-7 px-3 text-xs"
                >
                <MessageCircle className="h-3.5 w-3.5 mr-1.5" />
                  AI
                </Button>
            </div>
          </div>

          {mode === 'memo' && (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Editor Area - 박스 제거 */}
              <div className="flex-1 overflow-hidden relative p-3">
                <Editor
                  height="calc(100% - 200px)"
                  language="markdown"
                  theme="vs-dark"
                  defaultValue="// 여기에 메모를 작성하세요..."
                  onMount={handleEditorDidMount}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    wordWrap: 'on',
                    lineNumbers: 'off',
                    glyphMargin: false,
                    folding: false,
                    lineDecorationsWidth: 0,
                    lineNumbersMinChars: 0,
                  }}
                />
              </div>
              
              {/* 구분선과 파일 형식 버튼 */}
              <div className="flex-shrink-0 border-t border-white/[0.15] px-3 py-2">
                <div className="flex items-center justify-end">
                  {/* 파일 형식 전환 버튼 */}
                  <div className="flex items-center bg-black/30 border border-white/20 rounded-md backdrop-blur-lg p-0.5">
                    <Button
                      onClick={() => setEditorLanguage('markdown')}
                      variant={editorLanguage === 'markdown' ? "secondary" : "ghost"}
                      className={`h-5 px-2 text-xs transition-all duration-200 ${
                        editorLanguage === 'markdown' ? 'bg-white/[0.2] text-white shadow-md' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      .md
                    </Button>
                    <Button
                      onClick={() => setEditorLanguage('plaintext')}
                      variant={editorLanguage === 'plaintext' ? "secondary" : "ghost"}
                      className={`h-5 px-2 text-xs transition-all duration-200 ${
                        editorLanguage === 'plaintext' ? 'bg-white/[0.2] text-white shadow-md' : 'text-white/70 hover:text-white'
                      }`}
                    >
                      .txt
                    </Button>
                  </div>
                </div>
              </div>

              {/* Content Pills Drop Zone */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`flex-shrink-0 p-3 transition-colors duration-200 relative ${
                  isDragging ? "bg-white/10" : ""
                }`}
              >
                    <div className="flex flex-wrap gap-2">
                  {contentPills.map(pill => (
                    <div key={pill.id} className="group relative">
                      <div
                        className="flex items-center bg-white/10 text-white/90 text-xs rounded-full pl-2 pr-2 py-1 backdrop-blur-xl border border-white/20 cursor-pointer hover:bg-white/20"
                            onClick={() => insertPillIntoEditor(pill)}
                          >
                        <PillIcon type={pill.type} />
                        <span className="truncate max-w-[120px] mx-1">{pill.title}</span>
                      </div>
                      <button 
                        onClick={() => removeContentPill(pill.id)}
                        className="absolute -top-1 -right-1 bg-red-500 rounded-full h-4 w-4 flex items-center justify-center text-white text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-2.5 w-2.5" />
                      </button>
                                  </div>
                  ))}
                  {contentPills.length === 0 && (
                     <p className="text-white/50 text-xs text-center w-full py-2">
                      콘텐츠를 이곳으로 드래그 앤 드롭하세요.
                    </p>
                                )}
                                </div>
                              </div>
                            </div>
          )}
          
          {mode === 'chat' && (
            <div className="flex-1 flex flex-col p-3 space-y-3 overflow-hidden">
               {/* AI Chat UI */}
               <div className="flex-1 rounded-lg text-white/80 text-center flex items-center justify-center">
                AI 채팅 기능이 여기에 표시됩니다.
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}