import { MotionValue } from 'framer-motion';
import { LucideProps } from 'lucide-react';
import * as React from 'react';
import type { ComponentProps, RefAttributes } from 'react';
import type { ContentItem } from '../../../types/content';

// react-dnd item type
export const ItemTypes = {
    FOLDER_ITEM: 'folderItem',
};

export interface FileNode {
    id: string; // Unique identifier for UI state (e.g., expansion, selection)
    path: string; // The real, absolute path in the file system
    name: string;
    icon: React.ForwardRefExoticComponent<Omit<LucideProps, 'ref'> & RefAttributes<SVGSVGElement>>;
    count: number;
    children?: FileNode[];
    isExpanded?: boolean;
    depth?: number;
}

export interface LocalFolderData {
    id: string;
    name: string;
    children: LocalFolderData[];
}

export interface FolderItemComponentProps {
    item: FileNode;
    level?: number;
    isDeletable?: boolean;
    isCollapsed: boolean;
    scale: (base: number) => number;
    onToggleFolder: (id: string) => void;
    onFileSelect: (file: FileNode) => void;
    onFolderSelect?: (folderId: string) => void;
    onNewFileInFolder: (id: string) => void;
    onNewFolderInFolder: (id: string) => void;
    onDeleteFolder: (id: string) => void;
    onInitiateRename: (id: string) => void;
    moveItem: (dragId: string, dropId: string | null) => void;
    renamingItemId: string | null;
    onRenameItem: (id: string, newName: string) => void;
    onRemoveFromWorkspace?: (id: string) => void;
    expandedFolders: Set<string>;
    selectedFolder: string | undefined;
    onFileDrop?: (files: FileList) => void;
}

export interface SidebarHeaderProps {
    isCollapsed: boolean;
    scale: (base: number) => number;
    handleOpenFolder: () => void;
    handleNewFile: () => void;
    handleNewFolder: () => void;
    handleToggleAllFolders: () => void;
    onToggleCollapse: () => void;
    allFoldersExpanded: boolean;
}

export interface SidebarFooterProps {
    isCollapsed: boolean;
    isCollabActive: boolean;
    onCollabToggle: () => void;
    scale: (base: number) => number;
    zoomLevel: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    cursorPosition: { lineNumber: number; column: number };
}

export interface EnhancedSidebarProps extends Omit<ComponentProps<'div'>, 'onSelect'> {
    width: number | MotionValue<number>;
    onResetWidth: () => void;
    selectedFolder: string;
    onFolderSelect: (folderId: string) => void;
    isCollapsed: boolean;
    onToggleCollapse: () => void;
    isCollabActive: boolean;
    onCollabToggle: () => void;
    zoomLevel: number;
    onZoomIn: () => void;
    onZoomOut: () => void;
    cursorPosition: { lineNumber: number; column: number };
    onFileDrop?: (files: FileList) => void;
    items?: ContentItem[]; // 실제 콘텐츠 아이템들
}

export interface SidebarTreeProps {
    scale: (base: number) => number;
    isCategoriesExpanded: boolean;
    isCollapsed: boolean;
    userFolders: FileNode[];
    categoriesFolder: FileNode;
    expandedFolders: Set<string>;
    selectedFolder: string | undefined;
    renamingItemId: string | null;
    onToggleFolder: (id: string) => void;
    onFileSelect: (file: FileNode) => void;
    onFolderSelect: (folderId: string) => void;
    onNewFileInFolder: (id: string) => void;
    onNewFolderInFolder: (id: string) => void;
    onDeleteFolder: (id: string) => void;
    onInitiateRename: (id: string) => void;
    onRenameItem: (id: string, newName: string) => void;
    handleMoveItem: (dragId: string, dropId: string | null) => void;
    handleNewFolder: () => void;
    handleOpenFolder: () => void;
    onRemoveFromWorkspace: (id: string) => void;
    onFileDrop?: (files: FileList) => void;
}
