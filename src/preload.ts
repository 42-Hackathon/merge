// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
const { contextBridge, webFrame, ipcRenderer } = require('electron');

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
