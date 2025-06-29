import { create } from 'zustand';

export type FileDataType = 'markdown' | 'text' | 'image' | 'unsupported' | 'pdf' | 'html';

interface FileStoreState {
    content: string | null;
    type: FileDataType | null;
    isLoading: boolean;
    error: string | null;
    loadFile: (path: string) => Promise<void>;
    clearContent: () => void;
}

export const useFileStore = create<FileStoreState>((set) => ({
    content: null,
    type: null,
    isLoading: false,
    error: null,
    loadFile: async (path: string) => {
        set({ isLoading: true, error: null });
        if (!window.electronAPI) {
            set({
                error: 'Electron API is not available.',
                isLoading: false,
            });
            return;
        }
        try {
            const result = await window.electronAPI.readFile(path);
            if (result.success) {
                set({
                    content: result.data.content,
                    type: result.data.type,
                    isLoading: false,
                });
            } else {
                set({ error: result.error, isLoading: false });
            }
        } catch (e) {
            set({
                error: e instanceof Error ? e.message : 'An unknown error occurred.',
                isLoading: false,
            });
        }
    },
    clearContent: () => set({ content: null, type: null, error: null }),
}));
