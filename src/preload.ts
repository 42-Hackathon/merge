// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, webFrame } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  setZoomFactor: (factor: number) => {
    webFrame.setZoomFactor(factor);
  },
  getZoomFactor: () => {
    return webFrame.getZoomFactor();
  }
});
