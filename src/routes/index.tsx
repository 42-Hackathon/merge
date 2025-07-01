import { useState, useCallback, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { Header } from '../components/layout/header';
import { EnhancedSidebar } from '../components/layout/enhanced-sidebar';
import { DraggableContentGrid } from '../components/content/draggable-content-grid';
import { EnhancedMemoSidebar } from '../components/memo/enhanced-memo-sidebar';
import { SearchModal } from '../components/search/search-modal';
import { MonacoWorkspace } from '../components/editor/monaco-workspace';
import { StatusBar } from '../components/ui/status-bar';
import { Button } from '../components/ui/button';
import { PanelRightOpen } from 'lucide-react';
import { mockContentItems } from '../data/mock-data';
import { ContentItem } from '../types/content';
import { AnimatePresence } from 'framer-motion';
import { useTabStore } from '../hooks/useTabStore';
import { FileViewer } from '../components/content/file-viewer';
import { TabBar } from '../components/layout/TabBar';
export default function Index() {
  const [items, setItems] = useState<ContentItem[]>(mockContentItems);
  const [viewMode, setViewMode] = useState<'masonry' | 'grid' | 'list' | 'justified'>('masonry');
  const [selectedFolder, setSelectedFolder] = useState('all');
  
  const { tabs, activeTabId, openTab, closeTab, setActiveTab } = useTabStore();
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(288);
  const [isLeftSidebarCollapsed, setIsLeftSidebarCollapsed] = useState(false);

    const [cursorPosition] = useState({ lineNumber: 1, column: 1 });
  const [isCollabActive, setIsCollabActive] = useState(false);

  const sidebarWidth = useMotionValue(288);

  // Modal states
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [rightSidebarMode, setRightSidebarMode] = useState<'memo' | 'chat' | 'view' | 'ai'>('memo');

  const handleResetWidth = useCallback(() => {
    animate(sidebarWidth, 288, { 
      type: 'spring',
      stiffness: 400, 
      damping: 30,
    });
  }, [sidebarWidth]);

  // Chrome Extension data reception
  useEffect(() => {
    console.log('🔧 Setting up Chrome Extension data listener...');
    if (window.electronAPI) {
      console.log('✅ ElectronAPI available');
      const cleanup = (window.electronAPI as any).on('chrome-extension-data', (data: any) => {
        console.log('📨 Received Chrome Extension data:', data);
        
        // Function to remove www. from domain
        const cleanDomain = (url: string): string => {
          try {
            const hostname = new URL(url).hostname;
            return hostname.replace(/^www\./, '');
          } catch {
            return url.replace(/^www\./, '');
          }
        };

        // Convert Chrome Extension data to ContentItem
        const newItem: ContentItem = {
          id: `ext-${Date.now()}-${Math.random()}`,
          title: data.data.title || data.data.page_title || `${data.data.type} from ${data.source}`,
          content: data.data.type === 'image' ? 
                  (data.data.alt_text || data.data.title || '') : 
                  (data.data.text || data.data.link_url || data.data.video_url || ''),
          type: data.data.type as ContentItem['type'],
          stage: 'review',
          tags: [data.source, data.data.type, cleanDomain(data.data.source_url || '')],
          folderId: data.data.type === 'image' ? 'images' : 
                   data.data.type === 'link' ? 'links' : 
                   data.data.type === 'video' ? 'videos' : 'text',
          createdAt: data.timestamp,
          updatedAt: data.timestamp,
          metadata: {
            url: data.data.image_url || data.data.link_url || data.data.video_url || data.data.source_url,
            dimensions: data.data.width && data.data.height ? 
                       { width: data.data.width, height: data.data.height } : undefined,
            ...data.data
          }
        };
        
        // Add new item to the front of the list
        setItems(prevItems => [newItem, ...prevItems]);
        
        // Visual feedback
        console.log('✨ New item added to collection:', newItem.title);
      });
      
      return cleanup;
    } else {
      console.warn('❌ ElectronAPI not available');
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, []);

    const handleItemSelect = useCallback(
        (item: ContentItem) => {
            // Handle appropriately by file type
            if (item.type === 'link') {
                // Open links in external browser
                if (item.path && (item.path.startsWith('http') || item.path.startsWith('https'))) {
                    window.open(item.path, '_blank');
                } else {
                    alert('Invalid link.');
                }
                return;
            }

            // Open all content (including mock data) in file viewer
    const fileNode: FileNode = {
      id: item.id,
      name: item.title,
                path: item.metadata?.originalPath || item.path || item.id,
                type:
                    item.type === 'text'
                        ? 'text'
                        : item.type === 'image'
                        ? 'image'
                        : item.type === 'video'
                        ? 'unsupported'
                        : 'unsupported',
                // Distinguish between mock data and actual files
                isVirtual: !item.metadata?.originalPath,
                contentItem: item, // Include mock data information
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
        // Set activeTabId to null when selecting category to display content grid
        setActiveTab(''); // Set to empty string to deactivate tab
  };

  const getFolderName = (folderId: string) => {
    switch (folderId) {
            case 'all':
                return 'All Content';
            case 'text':
                return 'Texts';
            case 'images':
                return 'Images';
            case 'links':
                return 'Links';
            case 'videos':
                return 'Videos';
            case 'memo':
                return 'Memos';
            case 'clipboard':
                return 'Clipboard';
            case 'screenshots':
                return 'Screenshots';
      default: {
                const folder = items.find((item) => item.folderId === folderId);
        return folder?.title ?? 'Content';
      }
    }
  };



  const handleCollabToggle = () => {
        setIsCollabActive((prev) => !prev);
  };

    // File type detection function
    const getFileType = (fileName: string): ContentItem['type'] => {
        const ext = fileName.split('.').pop()?.toLowerCase() || '';

        const imageExts = ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'bmp', 'ico'];
        const videoExts = ['mp4', 'avi', 'mov', 'mkv', 'webm', 'flv', 'wmv'];
        const textExts = [
            'txt',
            'md',
            'json',
            'js',
            'ts',
            'jsx',
            'tsx',
            'css',
            'html',
            'xml',
            'yaml',
            'yml',
        ];

        if (imageExts.includes(ext)) return 'image';
        if (videoExts.includes(ext)) return 'video';
        if (textExts.includes(ext)) return 'text';
        return 'file';
    };

    // Convert file to ContentItem (path reference method)
    const convertFileToContentItem = async (
        file: File & { path?: string }
    ): Promise<ContentItem> => {
        const fileType = getFileType(file.name);
        let content = '';

        // Read partial content as preview for small text files
        if (fileType === 'text' && file.size < 50 * 1024) {
            // Preview only files under 50KB
            try {
                const fullContent = await file.text();
                content =
                    fullContent.length > 200 ? fullContent.substring(0, 200) + '...' : fullContent;
            } catch {
                content = `Unable to read text file preview.`;
            }
        } else {
            content = `${fileType} file - Size: ${(file.size / 1024).toFixed(1)}KB`;
        }

        return {
            id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: file.name,
            content,
            type: fileType,
            stage: 'review',
            tags: [fileType, 'imported'],
            folderId:
                fileType === 'image'
                    ? 'images'
                    : fileType === 'video'
                    ? 'videos'
                    : fileType === 'text'
                    ? 'text'
                    : 'files',
            path: file.path || file.name, // Store actual file path
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            metadata: {
                fileSize: file.size,
                originalPath: file.path || file.webkitRelativePath || file.name,
                ...(fileType === 'image' && { dimensions: { width: 0, height: 0 } }),
            },
        };
    };

    // File drop handler
    const handleFileDrop = useCallback(async (files: FileList) => {
        const newItems: ContentItem[] = [];

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            try {
                const contentItem = await convertFileToContentItem(file);
                newItems.push(contentItem);
            } catch (error) {
                console.error('File conversion failed:', file.name, error);
            }
        }

        if (newItems.length > 0) {
            setItems((prev) => [...prev, ...newItems]);
            alert(`${newItems.length} files have been added!`);
        }
    }, []);

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

  // Calculate left sidebar width
  const leftSidebarWidth = isLeftSidebarCollapsed ? 48 : sidebarWidth.get();
  
  // Calculate right sidebar maximum width (full screen - left sidebar - minimum content area)
  const maxRightSidebarWidth = window.innerWidth - leftSidebarWidth - 300; // Ensure minimum 300px content area
  
  // Left sidebar visibility control - hide when narrower than 70px
  const isLeftSidebarOpen = sidebarWidth.get() > 70;

  return (
    <div 
      className="h-screen w-screen overflow-auto relative bg-cover bg-center main-scrollbar smooth-scroll optimize-text"
      style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1620121692029-d088224ddc74')",
      }}
    >
      {/* Main Layout */}
      <div className="relative z-10 h-full flex flex-col gpu-accelerated">
        {/* Header */}
        <Header
          onSearchToggle={() => setIsSearchOpen(true)}
          onStickyNoteToggle={() => {
            if (window.electronAPI) {
              window.electronAPI.showStickyNote();
            }
          }}
        />
        
        <div className="flex-1 flex overflow-hidden">
          {isLeftSidebarOpen && (
            <EnhancedSidebar 
              className="flex-shrink-0 gpu-accelerated"
              width={sidebarWidth}
              onResetWidth={handleResetWidth}
              selectedFolder={selectedFolder}
              onFolderSelect={handleFolderSelect}
              isCollapsed={isLeftSidebarCollapsed}
                            onToggleCollapse={() =>
                                setIsLeftSidebarCollapsed(!isLeftSidebarCollapsed)
                            }
              isCollabActive={isCollabActive}
              onCollabToggle={handleCollabToggle}
              cursorPosition={cursorPosition}
                            onFileDrop={handleFileDrop}
                            items={items}
            />
          )}
          
          <div className="flex-1 min-w-0 flex flex-col gpu-accelerated">
            <TabBar
              openTabs={tabs}
              activeTabId={activeTabId}
              onTabChange={setActiveTab}
              onTabClose={closeTab}
            />
                        <div className="flex-1 overflow-hidden">
                            {/* Simple logic: if activeTabId exists, show file viewer, otherwise show content grid */}
                            {activeTabId ? (
                                <div className="h-full p-4 overflow-y-auto content-scrollbar smooth-scroll">
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
                onFileDrop={handleFileDrop}
              />
            )}
          </div>
          </div>

          {/* Right Sidebar - Changed to decalcomania form */}
          {isRightSidebarOpen ? (
              <EnhancedMemoSidebar 
                isOpen={isRightSidebarOpen}
                onClose={() => setIsRightSidebarOpen(false)}
                mode={rightSidebarMode}
                onModeChange={setRightSidebarMode}
                width={rightSidebarWidth}
                onWidthChange={(newWidth) => {
                // Apply maximum width restriction
                                const constrainedWidth = Math.min(
                                    newWidth,
                                    maxRightSidebarWidth
                                );
                  setRightSidebarWidth(constrainedWidth);
                }}
                maxWidth={maxRightSidebarWidth}
              />
          ) : (
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="fixed right-4 top-20 z-30 optimize-animation"
            >
              <Button
                onClick={() => setIsRightSidebarOpen(true)}
                variant="glass"
                size="icon"
                className="text-white hover:bg-white/15 h-10 w-10 bg-white/10 border border-white/20 rounded-full relative overflow-hidden shadow-lg hover:shadow-xl hover-lift glass-transition"
                title="Open Sidebar"
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
