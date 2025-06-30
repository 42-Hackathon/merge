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
  Users,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BaseSidebar } from "./base-sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

interface RefactoredEnhancedSidebarProps {
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
}

interface FolderItem {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  children?: FolderItem[];
}

export function RefactoredEnhancedSidebar({ 
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
}: RefactoredEnhancedSidebarProps) {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['categories']));

  const allContentFolder: FolderItem = {
      id: 'all', name: 'All Content', icon: Archive, count: 1247
  };
  const categoriesFolder: FolderItem = {
      id: 'categories', name: 'Categories', icon: Folder, count: 0,
      children: [
        { id: 'text', name: 'Texts', icon: FileText, count: 456 },
        { id: 'links', name: 'Links', icon: Link, count: 234 },
        { id: 'images', name: 'Images', icon: Image, count: 189 },
        { id: 'videos', name: 'Videos', icon: Video, count: 67 },
        { id: 'clipboard', name: 'Clipboard', icon: Clipboard, count: 123 },
        { id: 'screenshots', name: 'Screenshots', icon: Camera, count: 178 }
      ]
  };
  const userFolders: FolderItem[] = [
    { id: 'local-placeholder', name: 'Add local folders here', icon: FolderOpen, count: 0 }
  ];

  const toggleFolder = (folderId: string) => {
    if (isCollapsed) return;
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) newExpanded.delete(folderId);
    else newExpanded.add(folderId);
    setExpandedFolders(newExpanded);
  };

  const renderFolderItem = (item: FolderItem, level = 0): React.ReactElement => {
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
            className={`h-8 w-8 text-white/90 hover:text-white hover:bg-white/[0.15] flex items-center justify-center ${isSelected ? 'bg-white/[0.25]' : ''}`}
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
          className={`w-full h-7 justify-start text-xs text-white/80 hover:text-white hover:bg-white/[0.12] ${isSelected ? 'bg-white/[0.2]' : ''}`}
          style={{ paddingLeft: `${8 + level * 12}px`}}
          onClick={() => hasChildren ? toggleFolder(item.id) : onFolderSelect(item.id)}
        >
          {hasChildren && (
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }} transition={{ duration: 0.15 }} className="mr-1">
              <ChevronRight className="h-2.5 w-2.5" />
            </motion.div>
          )}
          <Icon className="w-3 h-3 mr-1.5 flex-shrink-0" />
          <span className="flex-1 text-left truncate">{item.name}</span>
          {item.count > 0 && (
            <Badge variant="secondary" className="bg-white/[0.25] text-white/90 px-1.5 py-0 ml-1 h-3.5 text-[10px]">
              {item.count}
            </Badge>
          )}
        </Button>
        <AnimatePresence>
          {isExpanded && hasChildren && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="overflow-hidden"
            >
              <div className="space-y-0.5">
                {item.children?.map(child => renderFolderItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <BaseSidebar
      isOpen={!isCollapsed}
      onClose={onToggleCollapse || (() => {})}
      title="Folders"
      icon={Folder}
      position="left"
      width={width}
      onResizeMouseDown={onResizeMouseDown}
    >
      {/* Scrollable folder list */}
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

      {/* Footer with Controls, appears at the bottom */}
      <div className="mt-auto border-t border-white/[0.15] p-2">
        {!isCollapsed && (
          <div className="space-y-2">
            <Button variant="ghost" size="sm" onClick={onCollabToggle} className={`w-full justify-start text-white/60 hover:text-white ${isCollabActive ? 'text-blue-400' : ''}`}>
              <Users className="h-4 w-4 mr-2" />
              <span className="text-xs">Collaboration</span>
            </Button>
            <div className="flex items-center justify-center space-x-2">
              <Button variant="ghost" size="icon" onClick={onZoomOut} className="text-white/60 hover:text-white h-6 w-6">
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs text-white/60 w-10 text-center cursor-pointer" onClick={onResetWidth}>
                {zoomLevel}%
              </span>
              <Button variant="ghost" size="icon" onClick={onZoomIn} className="text-white/60 hover:text-white h-6 w-6">
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </BaseSidebar>
  );
}