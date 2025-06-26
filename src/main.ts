import { app, BrowserWindow, screen } from 'electron';
import path from 'node:path';
import started from 'electron-squirrel-startup';

app.disableHardwareAcceleration();

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // 1. 메인 디스플레이의 정보를 가져와.
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;

  // Eagle과 유사한 시네마틱 비율 (1.85:1)을 목표로 설정
  const targetAspectRatio = 1.85;

  let newWidth: number;
  let newHeight: number;

  // 화면 비율에 따라 창 크기 계산 방식을 결정
  if ((width / height) > targetAspectRatio) {
    // 화면이 목표 비율보다 넓으면, 높이를 기준으로 너비를 계산
    newHeight = Math.round(height * 0.85);
    newWidth = Math.round(newHeight * targetAspectRatio);
  } else {
    // 화면이 목표 비율보다 좁으면, 너비를 기준으로 높이를 계산
    newWidth = Math.round(width * 0.85);
    newHeight = Math.round(newWidth / targetAspectRatio);
  }

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: newWidth,
    height: newHeight,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
