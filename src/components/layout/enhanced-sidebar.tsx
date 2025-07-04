import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, MotionValue, useMotionValue, animate, AnimatePresence, PanInfo } from 'framer-motion';
import {
    Folder,
    FileText,
    FolderPlus,
    FolderDown,
    Link,
    Image,
    Video,
    Clipboard,
    Camera,
} from 'lucide-react';
import { toast } from 'sonner';

import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '../ui/context-menu';
import { cn } from '../../lib/utils';
import { generateUniqueName, getAllExpandableIds } from './sidebar/helpers';
import type {
    EnhancedSidebarProps,
    FileNode,
    LocalFolderData,
    SidebarTreeProps,
} from './sidebar/types';
import { FolderItemComponent } from './sidebar/FolderItem';
import { SidebarHeader } from './sidebar/SidebarHeader';
import { SidebarFooter } from './sidebar/SidebarFooter';
import { useTabStore } from '../../hooks/useTabStore';

function findItemById(items: FileNode[], id: string): FileNode | null {
    for (const item of items) {
        if (item.id === id) return item;
        if (item.children) {
            const found = findItemById(item.children, id);
            if (found) return found;
        }
    }
    return null;
}

function findItemByPath(items: FileNode[], path: string): FileNode | null {
    for (const item of items) {
        if (item.path === path) return item;
        if (item.children) {
            const found = findItemByPath(item.children, path);
            if (found) return found;
        }
    }
    return null;
}

function getParentPath(p: string): string {
    const lastSlashIndex = p.lastIndexOf('/');
    if (lastSlashIndex === -1) return ''; // Should not happen with absolute paths
    if (lastSlashIndex === 0) return '/'; // Root path
    return p.substring(0, lastSlashIndex);
}

const SidebarTree = ({
    isCategoriesExpanded,
    isCollapsed,
    userFolders,
    categoriesFolder,
    expandedFolders,
    selectedFolder,
    renamingItemId,
    onToggleFolder,
    onFileSelect,
    onFolderSelect,
    onNewFileInFolder,
    onNewFolderInFolder,
    onDeleteFolder,
    onInitiateRename,
    onRenameItem,
    handleMoveItem,
    handleNewFolder,
    handleOpenFolder,
    onRemoveFromWorkspace,
    onFileDrop,
}: SidebarTreeProps) => {
    return (
        <>
            <div
                className="overflow-y-auto"
                style={{
                    position: 'absolute',
                    top: `41px`,
                    bottom: isCategoriesExpanded ? `235px` : `55px`,
                    left: 0,
                    right: 0,
                }}
            >
                <ContextMenu>
                    <ContextMenuTrigger asChild>
                        <div className={cn('block w-full min-h-full')}>
                            <div
                                className="space-y-0.5"
                                style={{ padding: `4px 4px 40px` }}
                            >
                                {userFolders.map((folder) => (
                                    <FolderItemComponent
                                        key={folder.id}
                                        item={folder}
                                        isCollapsed={isCollapsed}
                                        onToggleFolder={onToggleFolder}
                                        onFileSelect={onFileSelect}
                                        onNewFileInFolder={(id) => onNewFileInFolder(id)}
                                        onNewFolderInFolder={(id) => onNewFolderInFolder(id)}
                                        onDeleteFolder={(id) => onDeleteFolder(id)}
                                        onInitiateRename={(id) => onInitiateRename(id)}
                                        moveItem={handleMoveItem}
                                        renamingItemId={renamingItemId}
                                        onRenameItem={onRenameItem}
                                        expandedFolders={expandedFolders}
                                        selectedFolder={selectedFolder}
                                        onRemoveFromWorkspace={onRemoveFromWorkspace}
                                        onFileDrop={onFileDrop}
                                    />
                                ))}
                            </div>
                        </div>
                    </ContextMenuTrigger>
                    <ContextMenuContent className="w-48">
                        <ContextMenuItem onClick={handleOpenFolder}>
                            <FolderDown className="w-4 h-4 mr-2" />
                            <span>Open Local Folder</span>
                        </ContextMenuItem>
                        <ContextMenuItem onClick={handleNewFolder}>
                            <FolderPlus className="w-4 h-4 mr-2" />
                            <span>Add New Folder</span>
                        </ContextMenuItem>
                    </ContextMenuContent>
                </ContextMenu>
            </div>

            <div
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: `0 4px 4px`,
                }}
            >
                <div
                    className="mx-auto bg-white/10"
                    style={{
                        height: '1px',
                        width: isCollapsed ? `24px` : '80%',
                        margin: `8px auto`,
                    }}
                />
                <FolderItemComponent
                    item={categoriesFolder}
                    isCollapsed={isCollapsed}
                    onToggleFolder={onToggleFolder}
                    onFileSelect={onFileSelect}
                    onFolderSelect={onFolderSelect}
                    onNewFileInFolder={(id) => onNewFileInFolder(id)}
                    onNewFolderInFolder={(id) => onNewFolderInFolder(id)}
                    onDeleteFolder={(id) => onDeleteFolder(id)}
                    onInitiateRename={(id) => onInitiateRename(id)}
                    moveItem={handleMoveItem}
                    onRemoveFromWorkspace={onRemoveFromWorkspace}
                    renamingItemId={null}
                    onRenameItem={onRenameItem}
                    expandedFolders={expandedFolders}
                    selectedFolder={selectedFolder}
                    onFileDrop={onFileDrop}
                />
            </div>
        </>
    );
};

export function EnhancedSidebar({
    className,
    width: widthProp,
    onResetWidth,
    selectedFolder,
    onFolderSelect,
    isCollapsed,
    onToggleCollapse,
    isCollabActive,
    onCollabToggle,
    cursorPosition,
    onFileDrop,
    items = [],
}: EnhancedSidebarProps) {
    const { openTab } = useTabStore();
    const [linkedFolders, setLinkedFolders] = useState<FileNode[]>([]);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['categories']));
    const [renamingItemId, setRenamingItemId] = useState<string | null>(null);

    const isCategoriesExpanded = useMemo(
        () => expandedFolders.has('categories'),
        [expandedFolders]
    );


    const convertDataToFolderItem = useCallback(
        (data: LocalFolderData, prefix: string): FileNode => ({
            id: `${prefix}:${data.id}`,
            path: data.id,
            name: data.name,
            icon: data.children ? Folder : FileText,
            children: data.children
                ? data.children.map((child) => convertDataToFolderItem(child, prefix))
                : undefined,
            count: data.children ? data.children.length : 0,
        }),
        []
    );

    const refreshAllFolders = useCallback(
        async (folders: FileNode[]) => {
            if (!window.electronAPI) return folders;
            return Promise.all(
                folders.map(async (folder) => {
                    const folderData = await window.electronAPI.getDirectoryTree(folder.path);
                    if (folderData) {
                        const prefix = folder.id.split(':')[0];
                        return convertDataToFolderItem(folderData, prefix);
                    }
                    return folder; // Fallback to old folder state on failure
                })
            );
        },
        [convertDataToFolderItem]
    );

    const handleNewItem = useCallback(
        async (type: 'file' | 'folder', parentId?: string) => {
            let targetId = parentId;
            if (!targetId) {
                if (linkedFolders.length > 0) {
                    targetId = linkedFolders[0].id;
                } else {
                    toast.error('Please open a local folder first.');
                    return;
                }
            }
            const targetItem = findItemById(linkedFolders, targetId);
            if (!targetItem) {
                toast.error('Could not find the target folder.');
                return;
            }

            const siblings = targetItem.children ?? [];

            const name =
                type === 'file'
                    ? generateUniqueName('New File.md', siblings)
                    : generateUniqueName('New Folder', siblings);

            if (window.electronAPI) {
                const result =
                    type === 'file'
                        ? await window.electronAPI.createFile(targetItem.path, name)
                        : await window.electronAPI.createFolder(targetItem.path, name);

                if (result.success && result.newItem) {
                    toast.success(`Successfully created ${type}.`);
                    setLinkedFolders(await refreshAllFolders(linkedFolders));

                    const prefix = targetItem.id.split(':')[0];
                    setRenamingItemId(`${prefix}:${result.newItem.id}`);
                } else {
                    toast.error(`Failed to create ${type}: ${result.error}`);
                }
            }
        },
        [linkedFolders, refreshAllFolders]
    );

    const handleInitiateRename = useCallback((itemId: string) => setRenamingItemId(itemId), []);

    const handleRenameItem = useCallback(
        async (itemId: string, newName: string) => {
            setRenamingItemId(null);
            const trimmedName = newName.trim();

            const folders = await new Promise<FileNode[]>((resolve) => {
                setLinkedFolders((prev) => {
                    resolve(prev);
                    return prev;
                });
            });

            const item = findItemById(folders, itemId);
            if (!trimmedName || !item || item.name === trimmedName) return;

            if (window.electronAPI) {
                const result = await window.electronAPI.renameItem(item.path, trimmedName);
                if (result.success) {
                    toast.success(`'${item.name}' renamed to '${trimmedName}'`);
                    const isRoot = folders.some((f) => f.id === itemId);
                    const postRenameFolders = isRoot
                        ? folders.map((f) =>
                              f.id === itemId && result.path ? { ...f, path: result.path } : f
                          )
                        : folders;
                    setLinkedFolders(await refreshAllFolders(postRenameFolders));
                } else {
                    toast.error(`Rename failed: ${result.error}`);
                }
            }
        },
        [refreshAllFolders]
    );

    const handleDeleteFolder = useCallback(
        async (itemId: string) => {
            const folders = await new Promise<FileNode[]>((resolve) => {
                setLinkedFolders((prev) => {
                    resolve(prev);
                    return prev;
                });
            });

            const item = findItemById(folders, itemId);
            if (!item) return;

            if (window.electronAPI) {
                const result = await window.electronAPI.deleteItem(item.path);
                if (result.success) {
                    toast.success('Item deleted successfully.');
                    const isRoot = folders.some((f) => f.id === itemId);
                    const postDeleteFolders = isRoot
                        ? folders.filter((f) => f.id !== itemId)
                        : folders;
                    setLinkedFolders(await refreshAllFolders(postDeleteFolders));
                } else {
                    toast.error(`Delete failed: ${result.error}`);
                }
            }
        },
        [refreshAllFolders]
    );

    const handleRemoveFromWorkspace = useCallback((itemId: string) => {
        setLinkedFolders((prev) => prev.filter((f) => f.id !== itemId));
        toast.success('Folder removed from workspace.');
    }, []);

    const handleMoveItem = useCallback(
        async (dragId: string, dropId: string | null) => {
            if (!dropId) return;

            const folders = await new Promise<FileNode[]>((resolve) => {
                setLinkedFolders((prev) => {
                    resolve(prev);
                    return prev;
                });
            });

            const dragItem = findItemById(folders, dragId);
            let dropItem = findItemById(folders, dropId);

            if (!dragItem || !dropItem) {
                toast.error('Could not move item. Source or destination not found.');
                return;
            }
            if (dragItem.children && dropItem.path.startsWith(dragItem.path + '/')) {
                toast.error('Cannot move a folder into its own subfolder.');
                return;
            }
            const isDropTargetFile = !dropItem.children;
            if (isDropTargetFile) {
                const parentPath = getParentPath(dropItem.path);
                const parentItem = findItemByPath(folders, parentPath);
                if (parentItem) {
                    dropItem = parentItem;
                } else {
                    toast.error('Could not find parent folder to drop into.');
                    return;
                }
            }
            if (getParentPath(dragItem.path) === dropItem.path) {
                return;
            }

            if (window.electronAPI) {
                const result = await window.electronAPI.moveItem(dragItem.path, dropItem.path);
                if (result.success) {
                    toast.success('Item moved successfully');
                    setLinkedFolders(await refreshAllFolders(folders));
                } else {
                    toast.error(`Move failed: ${result.error}`);
                }
            }
        },
        [refreshAllFolders]
    );

    const handleOpenFolder = useCallback(async () => {
        if (window.electronAPI) {
            const folderData = await window.electronAPI.openFolderDialog();
            if (folderData && !linkedFolders.some((f) => f.path === folderData.id)) {
                const uniquePrefix = `ws-${Date.now()}`;
                const convertedData = convertDataToFolderItem(folderData, uniquePrefix);
                setLinkedFolders((prev) => [...prev, convertedData]);
                setExpandedFolders((prev) => new Set([...prev, convertedData.id]));
            }
        }
    }, [linkedFolders, convertDataToFolderItem]);

    const categoriesFolder = useMemo((): FileNode => {
        // items가 이미 mockContentItems를 포함하고 있으므로 items만 사용
        const textCount = items.filter(
            (item) => item.type === 'text' && item.folderId !== 'memo'
        ).length;
        const linksCount = items.filter((item) => item.type === 'link').length;
        const imagesCount = items.filter((item) => item.type === 'image').length;
        const videosCount = items.filter((item) => item.type === 'video').length;
        const clipboardCount = items.filter((item) => item.folderId === 'clipboard').length;
        const screenshotsCount = items.filter((item) => item.folderId === 'screenshots').length;
        const memoCount = items.filter((item) => item.folderId === 'memo').length;

        return {
            id: 'categories',
            path: 'categories',
            name: 'All Content',
            icon: Folder,
            count: items.length,
            children: [
                {
                    id: 'text',
                    path: 'text',
                    name: 'Texts',
                    icon: FileText,
                    count: textCount,
                },
                { id: 'links', path: 'links', name: 'Links', icon: Link, count: linksCount },
                { id: 'images', path: 'images', name: 'Images', icon: Image, count: imagesCount },
                { id: 'videos', path: 'videos', name: 'Videos', icon: Video, count: videosCount },
                { id: 'memo', path: 'memo', name: 'Memos', icon: FileText, count: memoCount },
                {
                    id: 'clipboard',
                    path: 'clipboard',
                    name: 'Clipboard',
                    icon: Clipboard,
                    count: clipboardCount,
                },
                {
                    id: 'screenshots',
                    path: 'screenshots',
                    name: 'Screenshots',
                    icon: Camera,
                    count: screenshotsCount,
                },
            ],
        };
    }, [items]);

    const expandableUserFolderIds = useMemo(
        () => getAllExpandableIds(linkedFolders),
        [linkedFolders]
    );

    const isAnyUserFolderExpanded = useMemo(
        () => expandableUserFolderIds.some((id) => expandedFolders.has(id)),
        [expandableUserFolderIds, expandedFolders]
    );

    const handleToggleAllFolders = useCallback(() => {
        setExpandedFolders((prev) => {
            const newSet = new Set(prev);
            if (isAnyUserFolderExpanded) {
                // Collapse all user folders
                expandableUserFolderIds.forEach((id) => newSet.delete(id));
            } else {
                // Expand all user folders
                expandableUserFolderIds.forEach((id) => newSet.add(id));
            }
            return newSet;
        });
    }, [isAnyUserFolderExpanded, expandableUserFolderIds]);

    const handleToggleFolder = useCallback(
        (folderId: string) => {
            if (isCollapsed) return;
            setExpandedFolders((prev) => {
                const newSet = new Set(prev);
                if (newSet.has(folderId)) newSet.delete(folderId);
                else newSet.add(folderId);
                return newSet;
            });
        },
        [isCollapsed]
    );

    const handleResizePan = (event: MouseEvent, info: PanInfo) => {
        const width = widthProp as MotionValue<number>;
        const newWidth = width.get() + info.delta.x;
        const minWidth = 240;
        const maxWidth = 500;
        if (newWidth >= minWidth && newWidth <= maxWidth) {
            width.set(newWidth);
        }
    };

    return (
        <motion.div
            className={cn('h-full flex flex-col relative', className)}
            style={{ width: widthProp }}
            animate={{ width: isCollapsed ? 48 : (widthProp as MotionValue<number>).get() }}
            transition={{ type: 'spring', stiffness: 400, damping: 40, mass: 0.5 }}
        >
            <div className="flex-1 flex flex-col relative overflow-hidden border-r border-white/[0.15]">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.15] via-cyan-300/[0.08] to-blue-600/[0.12]" />
                                        <div className="absolute inset-0" />
                <div className="absolute inset-0 bg-white/[0.03]" />
                <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/[0.08] to-transparent" />
                <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-blue-300/[0.05] to-transparent" />

                <div className="relative z-10 flex flex-col flex-1">
                    <SidebarHeader
                        isCollapsed={isCollapsed}
                        handleOpenFolder={handleOpenFolder}
                        handleNewFile={() => handleNewItem('file')}
                        handleNewFolder={() => handleNewItem('folder')}
                        handleToggleAllFolders={handleToggleAllFolders}
                        onToggleCollapse={onToggleCollapse}
                        allFoldersExpanded={isAnyUserFolderExpanded}
                    />

                    <SidebarTree
                        isCategoriesExpanded={isCategoriesExpanded}
                        isCollapsed={isCollapsed}
                        userFolders={linkedFolders}
                        categoriesFolder={categoriesFolder}
                        expandedFolders={expandedFolders}
                        selectedFolder={selectedFolder}
                        renamingItemId={renamingItemId}
                        onToggleFolder={handleToggleFolder}
                        onFileSelect={openTab}
                        onFolderSelect={onFolderSelect}
                        onNewFileInFolder={(id) => handleNewItem('file', id)}
                        onNewFolderInFolder={(id) => handleNewItem('folder', id)}
                        onDeleteFolder={handleDeleteFolder}
                        onInitiateRename={handleInitiateRename}
                        onRenameItem={handleRenameItem}
                        handleMoveItem={handleMoveItem}
                        handleNewFolder={() => handleNewItem('folder')}
                        handleOpenFolder={handleOpenFolder}
                        onRemoveFromWorkspace={handleRemoveFromWorkspace}
                        onFileDrop={onFileDrop}
                    />
                </div>
            </div>

            <SidebarFooter
                isCollapsed={isCollapsed}
                isCollabActive={isCollabActive}
                onCollabToggle={onCollabToggle}
                cursorPosition={cursorPosition}
            />

            <motion.div
                onPan={handleResizePan}
                onDoubleClick={onResetWidth}
                className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-20 group"
                style={{ display: isCollapsed ? 'none' : 'block' }}
            >
                <div className="w-full h-full transition-colors duration-200 group-hover:bg-blue-500/50" />
            </motion.div>
        </motion.div>
    );
}
