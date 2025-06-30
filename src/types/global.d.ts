import 'react';

export {};

declare global {
    interface Window {
        electronAPI?: {
            initDataStructure: () => Promise<{ success: boolean; path?: string; error?: string }>;
            openFolderDialog: () => Promise<LocalFolderData | undefined>;
            getClipboardContent: () => Promise<string>;
            setClipboardContent: (content: string) => Promise<void>;
            captureScreenshot: () => Promise<string | null>;
            showStickyNote: () => Promise<void>;
            hideStickyNote: () => Promise<void>;
            onClipboardContent: (callback: (content: string) => void) => void;
            onNewCollection: (callback: () => void) => void;
            onImportContent: (callback: () => void) => void;
            removeAllListeners: (channel: string) => void;

            // Window Controls
            minimizeWindow: () => Promise<void>;
            maximizeWindow: () => Promise<boolean>;
            closeWindow: () => Promise<void>;

            // File System API
            readFile: (
                filePath: string
            ) => Promise<{ success: boolean; data?: FileData; error?: string }>;
            createFolder: (args: {
                parentDir: string;
                folderName: string;
            }) => Promise<{ success: boolean; newItem?: FileNode; error?: string }>;
            createFile: (args: {
                parentDir: string;
                fileName: string;
            }) => Promise<{ success: boolean; newItem?: FileNode; error?: string }>;
            moveItem: (args: {
                sourcePath: string;
                destinationPath: string;
            }) => Promise<{ success: boolean; error?: string }>;
            renameItem: (args: {
                itemPath: string;
                newName: string;
            }) => Promise<{ success: boolean; path?: string; error?: string }>;
            deleteItem: (itemPath: string) => Promise<{ success: boolean; error?: string }>;
            getDirectoryTree: (rootPath: string) => Promise<FileNode | null>;

            // 기존 merge에 있던 fs, path API도 유지
            fs: {
                existsSync: (path: string) => boolean;
            };
            path: {
                extname: (path: string) => string;
                basename: (path: string) => string;
            };
        };
        electron?: {
            setZoomFactor: (factor: number) => void;
            getZoomFactor: () => number;
            openStickyNote: () => void;
            togglePin: () => void;
            closeWindow: () => void;
            setOpacity: (opacity: number) => void;
        };
        stickyNoteAPI?: {
            close: () => Promise<void>;
            minimize: () => Promise<void>;
            saveNote: (content: string) => Promise<void>;
            loadNote: () => Promise<string>;
            addToCollection: (content: string) => Promise<void>;
            quickCapture: () => Promise<void>;
        };
    }

    interface FileNode {
        id: string; // full path
        path: string; // The real, absolute path in the file system
        name: string;
        children?: FileNode[]; // Optional for files
        type?: 'markdown' | 'text' | 'image' | 'unsupported' | 'pdf' | 'html';
        icon?: string;
        count?: number;
        isExpanded?: boolean;
        depth?: number;
        isVirtual?: boolean; // 가상 파일(목데이터)인지 구분
        contentItem?: any; // ContentItem 정보 (가상 파일용)
    }

    interface LocalFolderData {
        id: string;
        name: string;
        children: LocalFolderData[];
    }

    interface FileData {
        content: string;
        type: string;
    }
}
