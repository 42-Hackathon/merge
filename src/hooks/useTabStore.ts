import { create } from 'zustand';
import { toast } from 'sonner';

interface TabState {
    tabs: FileNode[];
    activeTabId: string | null;
    openTab: (file: FileNode) => Promise<void>;
    closeTab: (tabId: string) => void;
    setActiveTab: (tabId: string) => void;
}

export const useTabStore = create<TabState>((set, get) => ({
    tabs: [],
    activeTabId: null,
    openTab: async (file: FileNode) => {
        const { tabs } = get();
        const isAlreadyOpen = tabs.some((tab) => tab.id === file.id);

        if (isAlreadyOpen) {
            set({ activeTabId: file.id });
            return;
        }

        // 가상 파일(목데이터)인 경우 바로 탭 열기
        if (file.isVirtual && file.contentItem) {
            const newTab: FileNode = {
                ...file,
                type: (file.contentItem.type === 'text'
                    ? 'text'
                    : file.contentItem.type === 'image'
                    ? 'image'
                    : 'unsupported') as
                    | 'markdown'
                    | 'text'
                    | 'image'
                    | 'unsupported'
                    | 'pdf'
                    | 'html',
            };
            set((state) => ({
                tabs: [...state.tabs, newTab],
                activeTabId: newTab.id,
            }));
            return;
        }

        // 실제 파일인 경우 기존 로직 사용
        if (!window.electronAPI) {
            toast.error('Electron API not available.');
            return;
        }

        try {
            const result = await window.electronAPI.readFile(file.path);
            if (result.success && result.data?.type !== 'unsupported') {
                const newTab: FileNode = {
                    ...file,
                    type: result.data?.type as any,
                };
                set((state) => ({
                    tabs: [...state.tabs, newTab],
                    activeTabId: newTab.id,
                }));
            } else {
                toast.error('Unsupported file type', {
                    description: `Cannot open ${file.name}.`,
                });
            }
        } catch (error) {
            toast.error('Error opening file', {
                description: error instanceof Error ? error.message : String(error),
            });
        }
    },
    closeTab: (tabId) =>
        set((state) => {
            const tabIndex = state.tabs.findIndex((tab) => tab.id === tabId);
            if (tabIndex === -1) return state;

            const newTabs = state.tabs.filter((tab) => tab.id !== tabId);
            let newActiveTabId = state.activeTabId;

            if (state.activeTabId === tabId) {
                if (newTabs.length > 0) {
                    const newIndex = Math.max(0, tabIndex - 1);
                    newActiveTabId = newTabs[newIndex].id;
                } else {
                    newActiveTabId = null;
                }
            }

            return {
                tabs: newTabs,
                activeTabId: newActiveTabId,
            };
        }),
    setActiveTab: (tabId) => set({ activeTabId: tabId }),
}));
