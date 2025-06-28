export {};

declare global {
  interface Window {
    electronAPI: {
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
      onClipboardContent: (callback: (content: string) => void) => void;
      onNewCollection: (callback: () => void) => void;
      onImportContent: (callback: () => void) => void;
      removeAllListeners: (channel: string) => void;
    };
    stickyNoteAPI: {
      // ... existing stickyNoteAPI types
    }
  }
} 