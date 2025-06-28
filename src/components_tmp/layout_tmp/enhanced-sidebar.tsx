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
            className={`h-8 w-8 text-white/90 hover:text-white hover:bg-white/[0.15] transition-all duration-200 flex items-center justify-center ${
              isSelected ? 'bg-white/[0.25] text-white shadow-lg backdrop-blur-xl' : ''
            }`}
            onClick={() => !hasChildren && onFolderSelect(item.id)}
            title={item.name}
          >
            <Icon className="h-4 w-4" />
          </Button>
        </div>
      );
    }

    return (
      <div key={item.id}>
        <Button
          variant={isSelected ? "secondary" : "ghost"}
          className={`w-full h-7 justify-start text-xs text-white/80 hover:text-white hover:bg-white/[0.12] transition-all duration-200 ${
            isSelected ? 'bg-white/[0.2] text-white shadow-md backdrop-blur-xl border border-white/[0.15]' : ''
          } ${item.id === 'local-placeholder' ? 'opacity-50 cursor-default' : ''}`}
          style={{ 
            paddingLeft: `${8 + level * 12}px`,
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
              className="mr-1"
            >
              <ChevronRight className="h-2.5 w-2.5" />
            </motion.div>
          )}
          <Icon className="w-3 h-3 mr-1.5 flex-shrink-0" />
          <span className="flex-1 text-left truncate">{item.name}</span>
          {item.id !== 'local-placeholder' && item.count > 0 && (
            <Badge 
              variant="secondary" 
              className="bg-white/[0.25] text-white/90 px-1.5 py-0 ml-1 h-3.5 text-[10px] border border-white/[0.2] backdrop-blur-xl"
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
            className="flex items-center justify-between border-b border-white/[0.15] px-3 py-1.5"
          >
            {!isCollapsed && (
              <h2 
                className="font-semibold text-white/90 text-sm"
              >
                폴더
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="text-white/80 hover:text-white hover:bg-white/[0.15] transition-all duration-200 flex items-center justify-center h-6 w-6"
            >
              {isCollapsed ? 
                <PanelLeftOpen className="h-3.5 w-3.5" /> : 
                <PanelLeftClose className="h-3.5 w-3.5" />}
            </Button>
          </div>

          {/* Folder Tree */}
          <ScrollArea className="flex-1">
            <div className={`p-2 ${isCollapsed ? 'space-y-2' : 'space-y-1'}`}>
              <div className="flex-1 space-y-0.5">
                {renderFolderItem(allContentFolder)}
                
                <div className="h-px bg-white/10 w-4/5 my-2 mx-auto" />
                
                {renderFolderItem(categoriesFolder)}

                <div className="h-px bg-white/10 w-4/5 my-2 mx-auto" />
                
                {userFolders.map(folder => renderFolderItem(folder))}
              </div>
            </div>
          </ScrollArea>

          {/* Footer with Controls */}
          <div 
            className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-between border-t border-white/[0.15] bg-black/10 backdrop-blur-md px-3 py-1"
          >
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={onCollabToggle} className={`text-white/60 hover:text-white hover:bg-white/10 h-6 w-6 ${isCollabActive ? 'text-blue-400' : ''}`} title="Collaboration Mode">
                <Users className="h-4 w-4" />
              </Button>
                </div>
                
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={onZoomOut} className="text-white/60 hover:text-white hover:bg-white/10 h-6 w-6" title="Zoom Out">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span 
                className="text-xs text-white/60 w-10 text-center cursor-pointer tabular-nums"
                onClick={onResetWidth}
                title="Reset Zoom"
              >
                {zoomLevel}%
              </span>
              <Button variant="ghost" size="icon" onClick={onZoomIn} className="text-white/60 hover:text-white hover:bg-white/10 h-6 w-6" title="Zoom In">
                <ZoomIn className="h-4 w-4" />
              </Button>
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