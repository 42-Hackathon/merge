import { useState } from "react";
import { motion, AnimatePresence, MotionValue } from "framer-motion";
import { 
  Folder, 
  FolderOpen, 
  Archive, 
  FileText,
  Image,
  Link,
  Video,
  Clipboard,
  Camera,
  ChevronRight,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface EnhancedSidebarProps {
  width: MotionValue<number>;
  onResizeMouseDown: (e: React.MouseEvent) => void;
  onResetWidth: () => void;
  selectedFolder?: string;
  onFolderSelect: (folderId: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  isCollabActive: boolean;
  onCollabToggle: () => void;
  zoomLevel: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  cursorPosition: { lineNumber: number; column: number };
}

interface FolderItem {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  children?: FolderItem[];
  isExpanded?: boolean;
}

export function EnhancedSidebar({ 
  width,
  onResizeMouseDown,
  onResetWidth,
  selectedFolder, 
  onFolderSelect, 
  isCollapsed = false, 
  onToggleCollapse,
  isCollabActive,
  onCollabToggle,
  zoomLevel,
  onZoomIn,
  onZoomOut,
  cursorPosition,
}: EnhancedSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['categories']));

  const scale = (base: number) => base * (zoomLevel / 100);

  const allContentFolder = {
      id: 'all',
      name: '모든 콘텐츠',
      icon: Archive,
      count: 1247
  };

  const categoriesFolder = {
      id: 'categories',
      name: '카테고리',
      icon: Folder,
      count: 0,
      children: [
      { id: 'text', name: '텍스트 하이라이팅', icon: FileText, count: 456 },
      { id: 'links', name: '링크', icon: Link, count: 234 },
      { id: 'images', name: '이미지', icon: Image, count: 189 },
      { id: 'videos', name: '동영상', icon: Video, count: 67 },
      { id: 'clipboard', name: '클립보드', icon: Clipboard, count: 123 },
      { id: 'screenshots', name: '스크린샷', icon: Camera, count: 178 }
      ]
  };

  const userFolders: FolderItem[] = [
    {
      id: 'local-placeholder',
      name: '로컬 폴더를 여기에 추가',
      icon: FolderOpen,
      count: 0,
    }
    // 여기에 실제 로컬 폴더가 동적으로 추가될 예정
  ];

  const toggleFolder = (folderId: string) => {
    if (isCollapsed) return;
    
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderFolderItem = (item: FolderItem, level: number = 0) => {
    const Icon = item.icon;
    const isExpanded = expandedFolders.has(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const isSelected = selectedFolder === item.id;

    if (isCollapsed) {
      return (
        <div key={item.id} className="mb-1">
          <Button
            variant={isSelected ? "secondary" : "ghost"}
            size="icon"
            className={`text-white/90 hover:text-white hover:bg-white/[0.15] transition-all duration-200 flex items-center justify-center ${
              isSelected ? 'bg-white/[0.25] text-white shadow-lg backdrop-blur-xl' : ''
            }`}
            style={{
              width: `${scale(32)}px`,
              height: `${scale(32)}px`,
            }}
            onClick={() => !hasChildren && onFolderSelect(item.id)}
            title={item.name}
          >
            <Icon style={{ width: `${scale(16)}px`, height: `${scale(16)}px` }} />
          </Button>
        </div>
      );
    }

    return (
      <div key={item.id}>
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className={`w-full justify-start text-white/80 hover:text-white hover:bg-white/[0.12] transition-all duration-200 ${
            isSelected ? 'bg-white/[0.2] text-white shadow-md backdrop-blur-xl border border-white/[0.15]' : ''
          } ${item.id === 'local-placeholder' ? 'opacity-50 cursor-default' : ''}`}
          style={{ 
            height: `${scale(28)}px`,
            paddingLeft: `${scale(8) + level * scale(12)}px`,
            paddingRight: `${scale(8)}px`,
            fontSize: `${scale(12)}px`,
          }}
          onClick={() => {
            if (hasChildren) {
              toggleFolder(item.id);
            } else {
              onFolderSelect(item.id);
            }
          }}
        >
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.15 }}
              className="mr-0"
            >
              <ChevronRight style={{ width: `${scale(10)}px`, height: `${scale(10)}px` }}/>
            </motion.div>
          )}
          <Icon style={{ width: `${scale(12)}px`, height: `${scale(12)}px` }} className="mr-0.5 flex-shrink-0" />
          <span className="flex-1 text-left truncate">{item.name}</span>
          {item.id !== 'local-placeholder' && item.count > 0 && (
            <Badge 
              variant="secondary" 
              className="bg-white/[0.25] text-white/90 px-1.5 py-0 ml-0.5 border border-white/[0.2] backdrop-blur-xl"
              style={{
                fontSize: `${scale(10)}px`,
                height: `${scale(14)}px`,
              }}
            >
              {item.count}
            </Badge>
          )}
        </Button>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="space-y-0.5">
                {item.id === 'local-placeholder' ? null : item.children?.map(child => renderFolderItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <motion.div
      className={`h-full flex flex-col relative`}
      style={isCollapsed ? { width: 48 } : { width }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex-1 flex flex-col relative overflow-hidden border-r border-white/[0.15]">
        {/* Apple Liquid Glass Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.15] via-cyan-300/[0.08] to-blue-600/[0.12]" />
        <div className="absolute inset-0 backdrop-blur-3xl" />
        <div className="absolute inset-0 bg-white/[0.03]" />
        
        {/* Subtle Glass Reflections */}
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/[0.08] to-transparent" />
        <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-blue-300/[0.05] to-transparent" />
        
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <div 
            className="flex items-center justify-between border-b border-white/[0.15]"
            style={{
              padding: `${scale(6)}px ${scale(12)}px`,
            }}
          >
            {!isCollapsed && (
              <h2 
                className="font-semibold text-white/90"
                style={{ fontSize: `${scale(14)}px`}}
              >
                폴더
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="text-white/80 hover:text-white hover:bg-white/[0.15] transition-all duration-200 flex items-center justify-center"
              style={{
                height: `${scale(24)}px`,
                width: `${scale(24)}px`,
              }}
            >
              {isCollapsed ? 
                <PanelLeftOpen style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }} /> : 
                <PanelLeftClose style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }} />}
            </Button>
          </div>

          {/* Folder Tree */}
          <ScrollArea className="flex-1">
            <div 
              className="flex flex-col h-full"
              style={{
                padding: isCollapsed ? `${scale(4)}px` : `${scale(8)}px`,
              }}
            >
              <div className="flex-1 space-y-0.5">
                {renderFolderItem(allContentFolder)}
                
                <div 
                  className="mx-auto bg-white/10"
                  style={{
                    height: '1px',
                    width: isCollapsed ? `${scale(24)}px` : '80%',
                    margin: `${scale(8)}px auto`,
                  }}
                />
                
                {userFolders.map(folder => renderFolderItem(folder))}
              </div>

              <div className="flex-shrink-0">
                <div 
                  className="mx-auto bg-white/10"
                  style={{
                    height: '1px',
                    width: isCollapsed ? `${scale(24)}px` : '80%',
                    margin: `${scale(8)}px auto`,
                  }}
                />
                {renderFolderItem(categoriesFolder)}
              </div>
            </div>
          </ScrollArea>

          {/* Footer section */}
          <div 
            className="flex-shrink-0 border-t border-white/[0.15]"
            style={{
              padding: `${scale(8)}px`,
              rowGap: `${scale(8)}px`,
            }}
          >
            {/* Cloud Storage */}
            <div className="space-y-1 text-white/70" style={{ fontSize: `${scale(12)}px` }}>
              <div className="flex justify-between">
                <span>클라우드 용량</span>
                <span>15.7 / 50 GB</span>
              </div>
              <div className="w-full bg-white/10 rounded-full" style={{ height: `${scale(4)}px` }}>
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full" 
                  style={{ 
                    width: `${(15.7/50)*100}%`,
                    height: `${scale(4)}px`
                  }}
                />
              </div>
                </div>
                
            {/* Controls */}
            <div className="flex items-center justify-between text-white/70" style={{ fontSize: `${scale(12)}px` }}>
              {/* Collab Button */}
              <Button 
                variant={isCollabActive ? "secondary" : "ghost"}
                size="icon" 
                className={`transition-all duration-200 flex items-center justify-center ${
                  isCollabActive ? 'bg-blue-500/50 text-white' : 'text-white/70 hover:bg-white/10'
                }`}
                style={{
                  width: `${scale(28)}px`,
                  height: `${scale(28)}px`,
                }}
                onClick={onCollabToggle}
                title="협업 모드"
              >
                <Users style={{ width: `${scale(16)}px`, height: `${scale(16)}px` }} />
              </Button>

              {/* Zoom Controls */}
              <div className="flex items-center" style={{ columnGap: `${scale(4)}px` }}>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center rounded-md"
                  style={{ width: `${scale(24)}px`, height: `${scale(24)}px` }}
                  onClick={onZoomOut}
                  >
                  <ZoomOut style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }} />
                </Button>
                <div
                  className="text-center tabular-nums"
                  style={{ fontSize: `${scale(11)}px`, width: `${scale(35)}px` }}
                >
                  {Math.round(zoomLevel)}%
                </div>
                <Button
                  variant="ghost"
                  className="flex items-center justify-center rounded-md"
                  style={{ width: `${scale(24)}px`, height: `${scale(24)}px` }}
                  onClick={onZoomIn}
                >
                  <ZoomIn style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }} />
                </Button>
                </div>
                
              {/* Cursor Position */}
              <div className="text-right">
                <span>Ln {cursorPosition.lineNumber}, Col {cursorPosition.column}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Resizer Handle */}
      {!isCollapsed && (
        <div
          onMouseDown={onResizeMouseDown}
          onDoubleClick={onResetWidth}
          className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-20 group"
          title="Drag to resize, double-click to reset"
        >
          <div className="w-full h-full transition-colors duration-200 group-hover:bg-blue-500/50" />
        </div>
      )}
    </motion.div>
  );
}