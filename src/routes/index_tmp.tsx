import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/layout/header";
import { EnhancedSidebar } from "@/components/layout/enhanced-sidebar";
import { DraggableContentGrid } from "@/components/content/draggable-content-grid";
import { EnhancedMemoSidebar } from "@/components/memo/enhanced-memo-sidebar";
import { SearchModal } from "@/components/search/search-modal";
import { MonacoWorkspace } from "@/components/editor/monaco-workspace";
import { StatusBar } from "@/components/ui/status-bar";
import { Button } from "@/components/ui/button";
import { PanelRightOpen } from "lucide-react";
import { ContentItem } from "@/types/content";
import { mockContentItems } from "@/data/mock-data"; // Mock data is now copied
import { useSidebarResize } from "@/hooks/useSidebarResize";
import { useTabManager } from "@/hooks/useTabManager";
import { useViewManager } from "@/hooks/useViewManager";

export default function Index() {
  const {
    openTabs,
    activeTabId,
    handleItemSelect,
    handleCloseTab,
    handleTabChange
  } = useTabManager();
  const {
    filteredItems,
    viewMode,
    selectedFolder,
    setViewMode,
    handleFolderSelect,
    getFolderName
  } = useViewManager(mockContentItems);

  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);
  const [zoomLevelForDisplay, setZoomLevelForDisplay] = useState(100);
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [isCollabActive, setIsCollabActive] = useState(false);

  const { sidebarWidth, isLeftSidebarOpen, handleResizeMouseDown, handleResetWidth } = useSidebarResize();

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [memoMode, setMemoMode] = useState<'memo' | 'chat'>('memo');

  useEffect(() => {
    // webFrame zoom factor is 1 for 100%, 1.5 for 150% etc.
    const currentZoom = window.electron.getZoomFactor() * 100;
    setZoomLevelForDisplay(Math.round(currentZoom));
  }, []);

  const handleZoomIn = () => {
    const newZoomFactor = Math.min(window.electron.getZoomFactor() + 0.05, 2);
    window.electron.setZoomFactor(newZoomFactor);
    setZoomLevelForDisplay(Math.round(newZoomFactor * 100));
  };

  const handleZoomOut = () => {
    const newZoomFactor = Math.max(window.electron.getZoomFactor() - 0.05, 0.5);
    window.electron.setZoomFactor(newZoomFactor);
    setZoomLevelForDisplay(Math.round(newZoomFactor * 100));
  };

  const handleCollabToggle = () => {
    setIsCollabActive(prev => !prev);
  };

  // Temporary fix for electronAPI, will need proper setup later
  const electronAPI = (window as any).electronAPI;

  return (
      <div
      className="h-screen w-screen overflow-hidden relative bg-cover bg-center"
        style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1620121692029-d088224ddc74')",
      }}
    >
      {/* Main Layout */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header */}
        <Header
          onSearchToggle={() => setIsSearchOpen(true)}
          onStickyNoteToggle={() => {
            if (electronAPI) {
                electronAPI.showStickyNote();
            }
          }}
          zoomLevel={zoomLevelForDisplay}
          openTabs={openTabs}
          activeTabId={activeTabId}
          onTabChange={handleTabChange}
          onTabClose={handleCloseTab}
        />

        <div className="flex-1 flex">
          {isLeftSidebarOpen && (
          <EnhancedSidebar
              width={sidebarWidth}
              onResizeMouseDown={handleResizeMouseDown}
              onResetWidth={handleResetWidth}
            selectedFolder={selectedFolder}
              onFolderSelect={handleFolderSelect}
            isCollapsed={isLeftSidebarCollapsed}
            onToggleCollapse={() => setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)}
              isCollabActive={isCollabActive}
              onCollabToggle={handleCollabToggle}
              zoomLevel={zoomLevelForDisplay}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              cursorPosition={cursorPosition}
            />
          )}

          {activeTabId ? (
            <div className="flex-1 p-4">
              <h1 className="text-2xl font-bold">{openTabs.find(t => t.id === activeTabId)?.name}</h1>
              <p className="mt-4 whitespace-pre-wrap">{openTabs.find(t => t.id === activeTabId)?.content}</p>
            </div>
          ) : (
          <DraggableContentGrid
            items={filteredItems}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onItemSelect={handleItemSelect}
              selectedItems={[]}
            folderName={getFolderName(selectedFolder)}
              zoomLevel={zoomLevelForDisplay}
          />
          )}

          {isRightSidebarOpen ? (
            <EnhancedMemoSidebar
              isOpen={isRightSidebarOpen}
              onClose={() => setIsRightSidebarOpen(false)}
              mode={memoMode}
              onModeChange={setMemoMode}
              onCursorChange={(p) => setCursorPosition({lineNumber: p.line, column: p.column})}
            />
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
        {isSearchOpen && <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />}
      </AnimatePresence>

      <MonacoWorkspace
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
}
