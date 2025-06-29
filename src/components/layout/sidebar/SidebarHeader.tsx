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

import { Button } from '@/components/ui/button';
import type { SidebarHeaderProps } from './types';

export const SidebarHeader = memo(
    ({
        isCollapsed,
        scale,
        handleOpenFolder,
        handleNewFile,
        handleNewFolder,
        handleToggleAllFolders,
        onToggleCollapse,
        allFoldersExpanded,
    }: SidebarHeaderProps) => (
        <div
            className="flex items-center justify-between border-b border-white/[0.15]"
            style={{ padding: `${scale(6)}px ${scale(8)}px` }}
        >
            <div className="flex items-center gap-x-1">
                {!isCollapsed && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleOpenFolder}
                        className="text-white/80 hover:text-white hover:bg-white/[0.15]"
                        style={{ height: `${scale(28)}px`, width: `${scale(28)}px` }}
                        title="로컬 폴더 불러오기"
                    >
                        <FolderDown style={{ width: `${scale(16)}px`, height: `${scale(16)}px` }} />
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
                            style={{ height: `${scale(28)}px`, width: `${scale(28)}px` }}
                            title="새 파일"
                        >
                            <FilePlus
                                style={{ width: `${scale(16)}px`, height: `${scale(16)}px` }}
                            />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleNewFolder}
                            className="text-white/80 hover:text-white hover:bg-white/[0.15]"
                            style={{ height: `${scale(28)}px`, width: `${scale(28)}px` }}
                            title="새 폴더"
                        >
                            <FolderPlus
                                style={{ width: `${scale(16)}px`, height: `${scale(16)}px` }}
                            />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={handleToggleAllFolders}
                            className="text-white/80 hover:text-white hover:bg-white/[0.15]"
                            style={{ height: `${scale(28)}px`, width: `${scale(28)}px` }}
                            title={allFoldersExpanded ? '모두 접기' : '모두 펼치기'}
                        >
                            {allFoldersExpanded ? (
                                <ChevronsDownUp
                                    style={{ width: `${scale(16)}px`, height: `${scale(16)}px` }}
                                />
                            ) : (
                                <ChevronsUpDown
                                    style={{ width: `${scale(16)}px`, height: `${scale(16)}px` }}
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
                    style={{ height: `${scale(24)}px`, width: `${scale(24)}px` }}
                >
                    {isCollapsed ? (
                        <PanelLeftOpen
                            style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }}
                        />
                    ) : (
                        <PanelLeftClose
                            style={{ width: `${scale(14)}px`, height: `${scale(14)}px` }}
                        />
                    )}
                </Button>
            </div>
        </div>
    )
);
