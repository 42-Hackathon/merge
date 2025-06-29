import { useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Header } from '@/components/layout/header';
import { EnhancedSidebar } from '@/components/layout/enhanced-sidebar';
import { DraggableContentGrid } from '@/components/content/draggable-content-grid';
import { EnhancedMemoSidebar } from '@/components/memo/enhanced-memo-sidebar';
import { SearchModal } from '@/components/search/search-modal';
import { MonacoWorkspace } from '@/components/editor/monaco-workspace';
import { StatusBar } from '@/components/ui/status-bar';
import { Button } from '@/components/ui/button';
import { PanelRightOpen } from 'lucide-react';
import { mockContentItems } from '@/data/mock-data';
import { ContentItem } from '@/types/content';
import { AnimatePresence } from 'framer-motion';
import { useTabStore } from '@/hooks/useTabStore';
import { FileViewer } from '@/components/content/file-viewer';
import { TabBar } from '@/components/layout/TabBar';

export default function Index() {
    const [items] = useState<ContentItem[]>(mockContentItems);
    const [viewMode, setViewMode] = useState<'masonry' | 'grid' | 'list' | 'justified'>('masonry');
    const [selectedFolder, setSelectedFolder] = useState('all');

    const { tabs, activeTabId, openTab, closeTab, setActiveTab } = useTabStore();
    const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
    const [rightSidebarWidth, setRightSidebarWidth] = useState(288);
    const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
    const [isCollabActive, setIsCollabActive] = useState(false);

    const sidebarWidth = useMotionValue(288);
    const [isResizing, setIsResizing] = useState(false);

    // Modal states
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [rightSidebarMode, setRightSidebarMode] = useState<'memo' | 'chat' | 'view'>('memo');

    const handleResizeMouseDown = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            setIsResizing(true);

            const startX = e.clientX;
            const startWidth = sidebarWidth.get();

            const handleMouseMove = (e: MouseEvent) => {
                const deltaX = e.clientX - startX;
                const newWidth = startWidth + deltaX;
                const minWidth = 240;
                const maxWidth = 500;

                if (newWidth >= minWidth && newWidth <= maxWidth) {
                    sidebarWidth.set(newWidth);
                }
            };

            const handleMouseUp = () => {
                setIsResizing(false);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';
        },
        [sidebarWidth]
    );

    const handleResetWidth = useCallback(() => {
        animate(sidebarWidth, 288, {
            type: 'spring',
            stiffness: 400,
            damping: 30,
        });
    }, [sidebarWidth]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
        };
    }, []);

    const handleItemSelect = useCallback(
        (item: ContentItem) => {
            // Convert ContentItem to FileNode format for useTabStore
            const fileNode: FileNode = {
                id: item.id,
                name: item.title,
                path: item.path || item.id, // Use path if available, otherwise fallback to id
                icon: undefined as any, // Will be set by the store
                count: 0, // Default value
            };
            openTab(fileNode);
        },
        [openTab]
    );

    useEffect(() => {
        const handleOpenFromPill = (event: Event) => {
            const customEvent = event as CustomEvent;
            const pillData = customEvent.detail;
            if (pillData && pillData.id) {
                const itemToOpen = items.find((item) => item.id === pillData.id);
                if (itemToOpen) {
                    handleItemSelect(itemToOpen);
                } else {
                    // If not found in current items, we can still open it as a new tab
                    // assuming the pill data is a valid ContentItem structure.
                    const tempItem: ContentItem = {
                        id: pillData.id,
                        title: pillData.title,
                        content: pillData.content,
                        type: pillData.type,
                        stage: 'review', // Or some default
                        tags: [],
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                    };
                    handleItemSelect(tempItem);
                }
            }
        };

        window.addEventListener('openContentFromPill', handleOpenFromPill);

        return () => {
            window.removeEventListener('openContentFromPill', handleOpenFromPill);
        };
    }, [items, handleItemSelect]);

    const handleFolderSelect = (folderId: string) => {
        setSelectedFolder(folderId);
    };

    const getFolderName = (folderId: string) => {
        switch (folderId) {
            case 'all':
                return '모든 콘텐츠';
            case 'text':
                return '텍스트 하이라이팅';
            case 'images':
                return '이미지';
            case 'links':
                return '링크';
            case 'videos':
                return '동영상';
            case 'memo':
                return '메모';
            case 'clipboard':
                return '클립보드';
            case 'screenshots':
                return '스크린샷';
            default: {
                const folder = items.find((item) => item.folderId === folderId);
                return folder?.title ?? '콘텐츠';
            }
        }
    };

    const handleZoomIn = () => {
        setZoomLevel((prev) => Math.min(prev + 5, 200));
    };

    const handleZoomOut = () => {
        setZoomLevel((prev) => Math.max(prev - 5, 50));
    };

    const handleCollabToggle = () => {
        setIsCollabActive((prev) => !prev);
    };

    const filteredItems = items.filter((item) => {
        if (selectedFolder === 'all') return true;
        if (selectedFolder === 'text') return item.type === 'text' && item.folderId !== 'memo';
        if (selectedFolder === 'images') return item.type === 'image';
        if (selectedFolder === 'links') return item.type === 'link';
        if (selectedFolder === 'videos') return item.type === 'video';
        if (selectedFolder === 'memo') return item.folderId === 'memo';
        if (selectedFolder === 'clipboard') return item.folderId === 'clipboard';
        if (selectedFolder === 'screenshots') return item.folderId === 'screenshots';
        return item.folderId === selectedFolder;
    });

    // 왼쪽 사이드바 너비 계산
    const leftSidebarWidth = isLeftSidebarCollapsed ? 48 : sidebarWidth.get();

    // 오른쪽 사이드바 최대 너비 계산 (전체 화면 - 왼쪽 사이드바 - 최소 콘텐츠 영역)
    const maxRightSidebarWidth = window.innerWidth - leftSidebarWidth - 300; // 최소 300px 콘텐츠 영역 보장

    // 좌측 사이드바 가시성 제어 - 70px 이하로 좁아지면 숨김
    const isLeftSidebarOpen = sidebarWidth.get() > 70;

    return (
        <div
            className="h-screen w-screen overflow-hidden relative bg-cover bg-center"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1620121692029-d088224ddc74')",
            }}
        >
            {/* Main Layout */}
            <div className="relative z-10 h-full flex flex-col">
                {/* Header */}
                <Header
                    onSearchToggle={() => setIsSearchOpen(true)}
                    onStickyNoteToggle={() => {
                        if (window.electronAPI) {
                            window.electronAPI.showStickyNote();
                        }
                    }}
                    zoomLevel={zoomLevel}
                />

                <div className="flex-1 flex overflow-hidden">
                    {isLeftSidebarOpen && (
                        <EnhancedSidebar
                            className="flex-shrink-0"
                            width={sidebarWidth}
                            onResizeMouseDown={handleResizeMouseDown}
                            onResetWidth={handleResetWidth}
                            selectedFolder={selectedFolder}
                            onFolderSelect={handleFolderSelect}
                            isCollapsed={isLeftSidebarCollapsed}
                            onToggleCollapse={() =>
                                setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)
                            }
                            isCollabActive={isCollabActive}
                            onCollabToggle={handleCollabToggle}
                            zoomLevel={zoomLevel}
                            onZoomIn={handleZoomIn}
                            onZoomOut={handleZoomOut}
                            cursorPosition={cursorPosition}
                        />
                    )}

                    <div className="flex-1 min-w-0 flex flex-col">
                        <TabBar
                            openTabs={tabs}
                            activeTabId={activeTabId}
                            onTabChange={setActiveTab}
                            onTabClose={closeTab}
                        />
                        {tabs.length > 0 ? (
                            <div className="flex-1 p-4 overflow-y-auto">
                                <FileViewer />
                            </div>
                        ) : (
                            <DraggableContentGrid
                                items={filteredItems}
                                viewMode={viewMode}
                                onViewModeChange={setViewMode}
                                onItemSelect={handleItemSelect}
                                selectedItems={[]}
                                folderName={getFolderName(selectedFolder)}
                                zoomLevel={zoomLevel}
                            />
                        )}
                    </div>

                    {/* Right Sidebar - Fixed Position */}
                    {isRightSidebarOpen ? (
                        <div
                            className="fixed right-0 top-0 h-full z-30 transition-all duration-200"
                            style={{
                                width: rightSidebarWidth,
                                top: '40px', // 헤더 높이만큼 아래로
                                height: 'calc(100vh - 40px)', // 헤더 높이 제외
                            }}
                        >
                            <EnhancedMemoSidebar
                                isOpen={isRightSidebarOpen}
                                onClose={() => setIsRightSidebarOpen(false)}
                                mode={rightSidebarMode}
                                onModeChange={setRightSidebarMode}
                                width={rightSidebarWidth}
                                onWidthChange={(newWidth) => {
                                    // 최대 너비 제한 적용
                                    const constrainedWidth = Math.min(
                                        newWidth,
                                        maxRightSidebarWidth
                                    );
                                    setRightSidebarWidth(constrainedWidth);
                                }}
                                maxWidth={maxRightSidebarWidth}
                            />
                        </div>
                    ) : (
                        <motion.div
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className="fixed right-4 top-20 z-30"
                        >
                            <Button
                                onClick={() => setIsRightSidebarOpen(true)}
                                variant="glass"
                                size="icon"
                                className="text-white hover:bg-white/15 h-10 w-10 backdrop-blur-xl bg-white/10 border border-white/20 rounded-full relative overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                                title="사이드바 열기"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent rounded-full" />
                                <div className="relative z-10">
                                    <PanelRightOpen className="h-4 w-4" />
                                </div>
                            </Button>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* Status Bar */}
            <StatusBar />

            {/* Floating Components */}
            <AnimatePresence>
                {isSearchOpen && (
                    <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
                )}
            </AnimatePresence>

            <MonacoWorkspace isOpen={isEditorOpen} onClose={() => setIsEditorOpen(false)} />
        </div>
    );
}
