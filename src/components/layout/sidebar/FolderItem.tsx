import { memo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDrag, useDrop, DragSourceMonitor } from 'react-dnd';
import {
    ChevronRight,
    FileText,
    Folder,
    FilePlus,
    FolderPlus,
    Pencil,
    Trash,
    Unlink,
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
} from '../../ui/context-menu';
import { cn } from '../../../lib/utils';
import type { FolderItemComponentProps } from './types';
import { ItemTypes } from './types';

function RenamingInput({
    item,
    level,
    scale,
    onRenameItem,
}: {
    item: FolderItemComponentProps['item'];
    level: number;
    scale: (val: number) => number;
    onRenameItem: (id: string, newName: string) => void;
}) {
    const [editText, setEditText] = useState(item.name);

    const handleRenameSubmit = () => {
        onRenameItem(item.id, editText);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRenameSubmit();
        }
        if (e.key === 'Escape') {
            e.preventDefault();
            onRenameItem(item.id, item.name); // Cancel rename
        }
    };

    return (
        <div
            className="flex items-center w-full h-full"
            style={{ paddingLeft: `${scale(8) + level * scale(12)}px` }}
        >
            <div
                style={{
                    width: `${scale(12)}px`,
                    visibility: item.children ? 'visible' : 'hidden',
                }}
                className="flex-shrink-0"
            />
            <div style={{ width: `${scale(12)}px` }} className="mr-1.5 flex-shrink-0" />
            <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={handleKeyDown}
                autoFocus
                onFocus={(e) => e.target.select()}
                className="w-full h-full bg-transparent text-foreground border border-primary rounded-md px-1 outline-none focus:ring-1 focus:ring-primary"
                style={{ fontSize: `${scale(13)}px` }}
            />
        </div>
    );
}

export const FolderItemComponent = memo(
    ({
        item,
        level = 0,
        scale,
        isCollapsed,
        onToggleFolder,
        onNewFileInFolder,
        onNewFolderInFolder,
        onDeleteFolder,
        onInitiateRename,
        moveItem,
        renamingItemId,
        onRenameItem,
        expandedFolders,
        selectedFolder,
        onRemoveFromWorkspace,
        onFileSelect,
        onFolderSelect,
        onFileDrop,
    }: FolderItemComponentProps) => {
        const ref = useRef<HTMLDivElement>(null);
        const [isFileDropping, setIsFileDropping] = useState(false);

        const isFolder = !!item.children;
        const isExpanded = expandedFolders.has(item.id);
        const isSelected = selectedFolder === item.id;
        const Icon = item.icon || (isFolder ? Folder : FileText);
        const isRenaming = renamingItemId === item.id;

        // 카테고리 폴더인지 확인
        const isCategoryFolder = [
            'categories',
            'text',
            'links',
            'images',
            'videos',
            'memo',
            'clipboard',
            'screenshots',
        ].includes(item.id);

        // 카테고리 폴더는 파일 드롭만 지원, 폴더 드래그는 비활성화
        const enableFolderDrag = !isCategoryFolder;

        const [{ isDragging }, drag] = useDrag({
            type: ItemTypes.FOLDER_ITEM,
            item: { id: item.id, path: item.path },
            collect: (monitor: DragSourceMonitor) => ({ isDragging: !!monitor.isDragging() }),
            canDrag: enableFolderDrag, // 카테고리 폴더는 드래그 비활성화
        });

        const [{ isOver, canDrop }, drop] = useDrop<
            { id: string; path: string },
            void,
            { isOver: boolean; canDrop: boolean }
        >(() => ({
            accept: ItemTypes.FOLDER_ITEM,
            canDrop: (draggedItem) => enableFolderDrag && draggedItem.id !== item.id,
            drop: (draggedItem) => {
                if (enableFolderDrag) {
                    moveItem(draggedItem.id, item.id);
                }
            },
            collect: (monitor) => ({
                isOver: monitor.isOver(),
                canDrop: monitor.canDrop(),
            }),
        }));

        // 카테고리 폴더가 아닐 때만 react-dnd 적용
        if (enableFolderDrag) {
            drag(drop(ref));
        }
        const isCategoryParent = item.id === 'categories';

        // 파일 드롭 핸들러 (카테고리 폴더에만 적용)
        const handleFileDragOver = (e: React.DragEvent) => {
            if (!isCategoryFolder || !onFileDrop) return;

            e.preventDefault();
            e.stopPropagation();

            // 파일 드롭 허용 명시
            e.dataTransfer.dropEffect = 'copy';

            const hasFiles = e.dataTransfer.types.includes('Files');
            const hasContentItem = e.dataTransfer.types.includes('application/content-item');

            console.log(
                '📂 사이드바 드래그 오버:',
                item.name,
                hasFiles,
                hasContentItem,
                e.dataTransfer.types
            );

            if (hasFiles && !isFileDropping) {
                console.log('✅ 사이드바 드롭 존 활성화:', item.name);
                setIsFileDropping(true);
            }
        };

        const handleFileDragLeave = (e: React.DragEvent) => {
            if (!isCategoryFolder || !onFileDrop) return;

            e.preventDefault();
            e.stopPropagation();
            setIsFileDropping(false);
        };

        const handleFileDrop = (e: React.DragEvent) => {
            if (!isCategoryFolder || !onFileDrop) return;

            e.preventDefault();
            e.stopPropagation();
            setIsFileDropping(false);

            console.log('💧 사이드바에 파일 드롭됨!', item.name);

            const hasFiles = e.dataTransfer.types.includes('Files');
            const hasContentItem = e.dataTransfer.types.includes('application/content-item');

            console.log(
                '📋 사이드바 드롭 이벤트:',
                hasFiles,
                hasContentItem,
                e.dataTransfer.files.length,
                e.dataTransfer.types
            );

            if (e.dataTransfer.files.length > 0) {
                console.log('🎯 사이드바에서 파일 처리:', e.dataTransfer.files.length, '개');
                onFileDrop(e.dataTransfer.files);
            }
        };

        const handleClick = () => {
            if (isCategoryParent) {
                // 카테고리 부모 폴더는 필터링만 (토글 X)
                if (onFolderSelect) {
                    onFolderSelect('all'); // '모든 콘텐츠' 필터링
                }
            } else if (isCategoryFolder && onFolderSelect) {
                // 카테고리 하위 폴더는 필터링
                onFolderSelect(item.id);
            } else if (isFolder) {
                // 일반 폴더는 토글
                onToggleFolder(item.id);
            } else {
                // 파일은 선택
                onFileSelect(item);
            }
        };

        const itemContent = (
            <div className="flex items-center w-full pr-2">
                <div
                    className="flex-shrink-0 flex items-center justify-center"
                    style={{
                        width: `${scale(12)}px`,
                        visibility: isFolder && !isCategoryParent ? 'visible' : 'hidden',
                    }}
                >
                    <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.15 }}
                    >
                        <ChevronRight
                            style={{ width: `${scale(10)}px`, height: `${scale(10)}px` }}
                        />
                    </motion.div>
                </div>
                <Icon
                    style={{ width: `${scale(12)}px`, height: `${scale(12)}px` }}
                    className="mx-1.5 flex-shrink-0"
                />
                <span className="flex-1 text-left truncate">{item.name}</span>
                {item.count > 0 && <Badge variant="secondary">{item.count}</Badge>}
            </div>
        );

        return (
            <div className="w-full">
                <div
                    ref={ref}
                    className="relative w-full"
                    style={{ height: `${scale(28)}px`, opacity: isDragging ? 0.5 : 1 }}
                >
                    {isRenaming ? (
                        <RenamingInput
                            item={item}
                            level={level}
                            scale={scale}
                            onRenameItem={onRenameItem}
                        />
                    ) : (
                        <ContextMenu>
                            <ContextMenuTrigger asChild>
                                <Button
                                    variant={isSelected ? 'secondary' : 'ghost'}
                                    className={cn(
                                        'w-full h-full justify-start text-white/80 hover:text-white hover:bg-white/[0.12]',
                                        isSelected && 'bg-white/[0.2] text-white',
                                        isOver && canDrop && 'bg-blue-500/30',
                                        isFileDropping &&
                                            isCategoryFolder &&
                                            'bg-green-500/30 ring-2 ring-green-400/50'
                                    )}
                                    style={{ paddingLeft: `${scale(8) + level * scale(12)}px` }}
                                    onClick={handleClick}
                                    onDragOver={handleFileDragOver}
                                    onDragLeave={handleFileDragLeave}
                                    onDrop={handleFileDrop}
                                >
                                    {itemContent}
                                </Button>
                            </ContextMenuTrigger>
                            <ContextMenuContent className="w-48">
                                {isFolder && (
                                    <>
                                        <ContextMenuItem onClick={() => onNewFileInFolder(item.id)}>
                                            <FilePlus className="w-4 h-4 mr-2" />
                                            <span>New File</span>
                                        </ContextMenuItem>
                                        <ContextMenuItem
                                            onClick={() => onNewFolderInFolder(item.id)}
                                        >
                                            <FolderPlus className="w-4 h-4 mr-2" />
                                            <span>New Folder</span>
                                        </ContextMenuItem>
                                    </>
                                )}
                                <ContextMenuItem onClick={() => onInitiateRename(item.id)}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    <span>Rename</span>
                                </ContextMenuItem>
                                {level === 0 && onRemoveFromWorkspace && (
                                    <ContextMenuItem onClick={() => onRemoveFromWorkspace(item.id)}>
                                        <Unlink className="w-4 h-4 mr-2" />
                                        <span>Remove from Workspace</span>
                                    </ContextMenuItem>
                                )}
                                <ContextMenuItem
                                    className="text-red-400 focus:text-red-400"
                                    onClick={() => onDeleteFolder(item.id)}
                                >
                                    <Trash className="w-4 h-4 mr-2" />
                                    <span>Delete from Disk</span>
                                </ContextMenuItem>
                            </ContextMenuContent>
                        </ContextMenu>
                    )}
                </div>

                {isFolder && isExpanded && !isRenaming && (
                    <AnimatePresence>
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-0.5 space-y-0.5">
                                {item.children?.map((child) => (
                                    <FolderItemComponent
                                        key={child.id}
                                        item={child}
                                        level={level + 1}
                                        scale={scale}
                                        isCollapsed={isCollapsed}
                                        onToggleFolder={onToggleFolder}
                                        onFileSelect={onFileSelect}
                                        onFolderSelect={onFolderSelect}
                                        onNewFileInFolder={onNewFileInFolder}
                                        onNewFolderInFolder={onNewFolderInFolder}
                                        onDeleteFolder={onDeleteFolder}
                                        onInitiateRename={onInitiateRename}
                                        moveItem={moveItem}
                                        renamingItemId={renamingItemId}
                                        onRenameItem={onRenameItem}
                                        expandedFolders={expandedFolders}
                                        selectedFolder={selectedFolder}
                                        onRemoveFromWorkspace={onRemoveFromWorkspace}
                                        onFileDrop={onFileDrop}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    </AnimatePresence>
                )}
            </div>
        );
    }
);
