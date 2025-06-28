export interface IElectronAPI {
  setZoomFactor: (factor: number) => void;
  getZoomFactor: () => number;
}
 
declare global {
  interface Window {
    electron: IElectronAPI;
  }
} 