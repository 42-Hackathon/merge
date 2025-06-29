export {};

declare global {
  interface Window {
    electronAPI: {
      // --- System Dialogs ---
      openFolderDialog: () => Promise<any>;

      // --- File System Operations ---
      getDirectoryTree: (rootPath: string) => Promise<any>;
      createFolder: (parentDir: string, folderName: string) => Promise<{
        success: boolean;
        error?: string;
        newItem?: {
          id: string;
          name: string;
          children: any[];
        };
      }>;
      createFile: (parentDir: string, fileName: string) => Promise<{
        success: boolean;
        error?: string;
        newItem?: {
          id: string;
          name: string;
        };
      }>;
      readFile: (filePath: string) => Promise<any>;
      renameItem: (itemPath: string, newName: string) => Promise<{
        success: boolean;
        error?: string;
        path?: string;
      }>;
      deleteItem: (itemPath: string) => Promise<{
        success: boolean;
        error?: string;
      }>;
      moveItem: (sourcePath: string, destinationPath: string) => Promise<{
        success: boolean;
        error?: string;
      }>;
      initDataStructure: () => Promise<{
        success: boolean;
        error?: string;
        path?: string;
      }>;

      // --- Existing APIs ---
      fs: {
        existsSync: (path: string) => boolean;
      };
      path: {
        extname: (path: string) => string;
        basename: (path: string) => string;
      };
      getClipboardContent: () => Promise<string>;
      setClipboardContent: (content: string) => Promise<void>;
      captureScreenshot: () => Promise<string | null>;
      showStickyNote: () => Promise<void>;
      hideStickyNote: () => Promise<void>;
      on: (channel: string, callback: (...args: any[]) => void) => (() => void) | undefined;
      removeAllListeners: (channel: string) => void;
    };
    stickyNoteAPI: {
      close: () => Promise<void>;
      minimize: () => Promise<void>;
      saveNote: (content: string) => Promise<void>;
      loadNote: () => Promise<any>;
      addToCollection: (content: string) => Promise<void>;
      quickCapture: () => Promise<void>;
    };
  }
} 