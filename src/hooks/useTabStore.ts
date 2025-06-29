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

        if (!window.electronAPI) {
            toast.error('Electron API not available.');
            return;
        }

        try {
            const result = await window.electronAPI.readFile(file.path);
            if (result.success && result.data?.type !== 'unsupported') {
                const newTab: FileNode = {
                    ...file,
                    type: result.data.type,
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
