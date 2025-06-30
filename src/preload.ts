// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // --- System Dialogs ---
    openFolderDialog: () => ipcRenderer.invoke('dialog:open-folder'),

    // --- File System Operations ---
    getDirectoryTree: (rootPath: string) => ipcRenderer.invoke('fs:get-directory-tree', rootPath),
    createFolder: (parentDir: string, folderName: string) =>
        ipcRenderer.invoke('fs:create-folder', { parentDir, folderName }),
    createFile: (parentDir: string, fileName: string) =>
        ipcRenderer.invoke('fs:create-file', { parentDir, fileName }),
    readFile: (filePath: string) => ipcRenderer.invoke('fs:read-file', filePath),
    renameItem: (itemPath: string, newName: string) =>
        ipcRenderer.invoke('fs:rename-item', { itemPath, newName }),
    deleteItem: (itemPath: string) => ipcRenderer.invoke('fs:delete-item', itemPath),
    moveItem: (sourcePath: string, destinationPath: string) =>
        ipcRenderer.invoke('fs:move-item', { sourcePath, destinationPath }),
    initDataStructure: () => ipcRenderer.invoke('app:init-data-structure'),

    // --- Clipboard ---
    getClipboardContent: () => ipcRenderer.invoke('get-clipboard-content'),
    setClipboardContent: (content: string) => ipcRenderer.invoke('set-clipboard-content', content),

    // --- Other Features ---
    captureScreenshot: () => ipcRenderer.invoke('capture-screenshot'),
    showStickyNote: () => ipcRenderer.invoke('show-sticky-note'),
    hideStickyNote: () => ipcRenderer.invoke('hide-sticky-note'),

    // --- Zoom Features ---
    zoomIn: () => ipcRenderer.invoke('zoom:in'),
    zoomOut: () => ipcRenderer.invoke('zoom:out'),
    zoomReset: () => ipcRenderer.invoke('zoom:reset'),
    getZoomLevel: () => ipcRenderer.invoke('zoom:get-level'),

    // --- Event Listeners ---
    on: (channel: string, callback: (...args: any[]) => void) => {
        const validChannels = ['clipboard-content', 'new-collection', 'import-content', 'chrome-extension-data'];
        if (validChannels.includes(channel)) {
            // Deliberately strip event as it includes `sender`
            const subscription = (event: any, ...args: any[]) => callback(...args);
            ipcRenderer.on(channel, subscription);
            // Return a cleanup function
            return () => {
                ipcRenderer.removeListener(channel, subscription);
            };
        }
    },
    removeAllListeners: (channel: string) => ipcRenderer.removeAllListeners(channel),
});

// feat/stickymemo에서 추가된 electron API
const { webFrame } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    setZoomFactor: (factor: number) => {
        webFrame.setZoomFactor(factor);
    },
    getZoomFactor: () => {
        return webFrame.getZoomFactor();
    },
    openStickyNote: () => {
        ipcRenderer.send('open-sticky-note');
    },
    togglePin: () => {
        ipcRenderer.send('pin-toggle');
    },
    closeWindow: () => {
        ipcRenderer.send('close-window');
    },
    setOpacity: (opacity: number) => {
        ipcRenderer.send('set-opacity', opacity);
    },
});

// Expose a limited API for the sticky note window
contextBridge.exposeInMainWorld('stickyNoteAPI', {
    close: () => ipcRenderer.invoke('hide-sticky-note'),
    minimize: () => ipcRenderer.invoke('hide-sticky-note'),

    // Content operations
    saveNote: (content: string) => ipcRenderer.invoke('save-sticky-note', content),
    loadNote: () => ipcRenderer.invoke('load-sticky-note'),

    // Collection operations
    addToCollection: (content: string) => ipcRenderer.invoke('add-to-collection', content),
    quickCapture: () => ipcRenderer.invoke('quick-capture'),
});
