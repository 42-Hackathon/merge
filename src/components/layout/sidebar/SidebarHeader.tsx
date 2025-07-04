import { memo } from 'react';
import {
    PanelLeftClose,
    PanelLeftOpen,
    FolderDown,
    FilePlus,
    FolderPlus,
    ChevronsUpDown,
    ChevronsDownUp,
} from 'lucide-react';

import { Button } from '../../ui/button';
import type { SidebarHeaderProps } from './types';

export const SidebarHeader = memo(
    ({
        isCollapsed,
        handleOpenFolder,
        handleNewFile,
        handleNewFolder,
        handleToggleAllFolders,
        onToggleCollapse,
        allFoldersExpanded,
    }: SidebarHeaderProps) => (
        <div
            className="flex items-center justify-between border-b border-white/[0.15]"
            style={{ padding: `6px 8px` }}
        >
            <div className="flex items-center gap-x-1">
                {!isCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleOpenFolder}
                        className="text-white/80 hover:text-white hover:bg-white/[0.15]"
                        style={{ height: `28px`, width: `28px` }}
                        title="Open Local Folder"
                    >
                        <FolderDown style={{ width: `16px`, height: `16px` }} />
                    </Button>
                )}
            </div>
            <div className="flex items-center">
                {!isCollapsed && (
                    <>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNewFile}
                            className="text-white/80 hover:text-white hover:bg-white/[0.15]"
                            style={{ height: `28px`, width: `28px` }}
                            title="새 파일"
                        >
                            <FilePlus
                                style={{ width: `16px`, height: `16px` }}
                            />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNewFolder}
                            className="text-white/80 hover:text-white hover:bg-white/[0.15]"
                            style={{ height: `28px`, width: `28px` }}
                            title="New Folder"
                        >
                            <FolderPlus
                                style={{ width: `16px`, height: `16px` }}
                            />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleToggleAllFolders}
                            className="text-white/80 hover:text-white hover:bg-white/[0.15]"
                            style={{ height: `28px`, width: `28px` }}
                            title={allFoldersExpanded ? '모두 접기' : '모두 펼치기'}
                        >
                            {allFoldersExpanded ? (
                                <ChevronsDownUp
                                    style={{ width: `16px`, height: `16px` }}
                                />
                            ) : (
                                <ChevronsUpDown
                                    style={{ width: `16px`, height: `16px` }}
                                />
                            )}
                        </Button>
                    </>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onToggleCollapse}
                    className="text-white/80 hover:text-white hover:bg-white/[0.15] transition-all duration-200 flex items-center justify-center"
                    style={{ height: `24px`, width: `24px` }}
                >
                    {isCollapsed ? (
                        <PanelLeftOpen
                            style={{ width: `14px`, height: `14px` }}
                        />
                    ) : (
                        <PanelLeftClose
                            style={{ width: `14px`, height: `14px` }}
                        />
                    )}
                </Button>
            </div>
        </div>
    )
);
