import {
    app,
    BrowserWindow,
    Menu,
    ipcMain,
    globalShortcut,
    clipboard,
    screen,
    dialog,
} from 'electron';
import * as path from 'path';
import * as fs from 'fs';
import * as http from 'http';
import started from 'electron-squirrel-startup';

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
    app.quit();
}

app.disableHardwareAcceleration();

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | null;
let stickyNoteWindow: BrowserWindow | null;
let httpServer: http.Server | null = null;

function createWindow() {
    // 1. 메인 디스플레이의 정보를 가져와.
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;

    // Eagle과 유사한 시네마틱 비율 (1.85:1)을 목표로 설정
    const targetAspectRatio = 1.85;

    let newWidth: number;
    let newHeight: number;

    // 화면 비율에 따라 창 크기 계산 방식을 결정
    if (width / height > targetAspectRatio) {
        // 화면이 목표 비율보다 넓으면, 높이를 기준으로 너비를 계산
        newHeight = Math.round(height * 0.85);
        newWidth = Math.round(newHeight * targetAspectRatio);
    } else {
        // 화면이 목표 비율보다 좁으면, 너비를 기준으로 높이를 계산
        newWidth = Math.round(width * 0.85);
        newHeight = Math.round(newWidth / targetAspectRatio);
    }

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: newWidth,
        height: newHeight,
        minWidth: 1200,
        minHeight: 700,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        titleBarStyle: 'hiddenInset',
        vibrancy: 'ultra-dark',
        transparent: true,
        frame: false,
        show: false,
    });

    // and load the index.html of the app.
    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
        mainWindow.webContents.openDevTools();
    } else {
        mainWindow.loadFile(
            path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
        );
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    // Handle window closed
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

function createStickyNote() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    stickyNoteWindow = new BrowserWindow({
        width: 300,
        height: 400,
        x: width - 320,
        y: 20,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
        frame: false,
        transparent: true,
        alwaysOnTop: true,
        skipTaskbar: true,
        resizable: true,
        minimizable: false,
        maximizable: false,
        show: false,
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        stickyNoteWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/sticky-note`);
    } else {
        stickyNoteWindow.loadFile(path.join(__dirname, '../renderer/sticky-note.html'));
    }

    stickyNoteWindow.once('ready-to-show', () => {
        stickyNoteWindow?.show();
    });

    stickyNoteWindow.on('closed', () => {
        stickyNoteWindow = null;
    });
}

function showOrCreateStickyNote() {
    if (stickyNoteWindow) {
        stickyNoteWindow.focus();
    } else {
        createStickyNote();
    }
}

function quickCapture() {
    const clipboardContent = clipboard.readText();
    if (mainWindow) {
        mainWindow.webContents.send('clipboard-content', clipboardContent);
    }
}

/**
 * Chrome Extension과 통신하기 위한 HTTP API 서버를 시작합니다.
 */
function startChromeExtensionServer() {
    const port = 3737;
    
    httpServer = http.createServer((req, res) => {
        // CORS 헤더 설정
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // Preflight 요청 처리
        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }
        
        // POST /collect - 데이터 수집 엔드포인트
        if (req.method === 'POST' && req.url === '/collect') {
            let body = '';
            
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            
            req.on('end', () => {
                try {
                    const message = JSON.parse(body);
                    console.log(`Received from Chrome Extension: ${message.type} (${message.source})`);
                    
                    // 메인 윈도우로 데이터 전송
                    if (mainWindow && message.data) {
                        mainWindow.webContents.send('chrome-extension-data', message);
                    }
                    
                    // 성공 응답
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: true, 
                        message: 'Data received successfully',
                        timestamp: new Date().toISOString()
                    }));
                    
            } catch (error) {
                    console.error('Error parsing Chrome Extension data:', error);
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ 
                        success: false, 
                        error: 'Invalid JSON data' 
                    }));
            }
        });
        
            return;
        }
        
        // GET /status - 연결 상태 확인 엔드포인트
        if (req.method === 'GET' && req.url === '/status') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
                status: 'connected',
                app: 'Flux Collector',
                version: '1.0.0',
                timestamp: new Date().toISOString()
            }));
            return;
        }
        
        // 404 응답
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
    });
    
    httpServer.listen(port, 'localhost', () => {
        console.log(`Chrome Extension HTTP API server listening on port ${port}`);
        console.log(`API endpoints: http://localhost:${port}/collect, http://localhost:${port}/status`);
    });
    
    httpServer.on('error', (error) => {
        console.error('HTTP server error:', error);
    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    createWindow();
    
    // Start HTTP API server for Chrome Extension communication
    startChromeExtensionServer();

    // Register global shortcuts
    globalShortcut.register('Alt+CommandOrControl+C', showOrCreateStickyNote);
    globalShortcut.register('Alt+CommandOrControl+V', quickCapture);

    app.on('activate', () => {
        // On OS X it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

// IPC handlers
ipcMain.handle('get-clipboard-content', () => {
    return clipboard.readText();
});

ipcMain.handle('set-clipboard-content', (event, content: string) => {
    clipboard.writeText(content);
});

ipcMain.handle('capture-screenshot', async () => {
    const { desktopCapturer } = require('electron');

    try {
        const sources = await desktopCapturer.getSources({
            types: ['screen'],
            thumbnailSize: { width: 1920, height: 1080 },
        });

        if (sources.length > 0) {
            return sources[0].thumbnail.toDataURL();
        }
    } catch (error) {
        console.error('Screenshot capture failed:', error);
        return null;
    }
    return null;
});

ipcMain.handle('show-sticky-note', showOrCreateStickyNote);

ipcMain.handle('hide-sticky-note', () => {
    if (stickyNoteWindow) {
        stickyNoteWindow.hide();
    }
});

// --- File System IPC Handlers ---

const itemExists = async (itemPath: string): Promise<boolean> => {
    try {
        await fs.promises.access(itemPath);
        return true;
    } catch {
        return false;
    }
};

ipcMain.handle(
    'fs:create-folder',
    async (event, { parentDir, folderName }: { parentDir: string; folderName: string }) => {
        const newFolderPath = path.join(parentDir, folderName);
        try {
            if (await itemExists(newFolderPath)) {
                return { success: false, error: 'An item with the same name already exists.' };
            }
            await fs.promises.mkdir(newFolderPath);
            return {
                success: true,
                newItem: {
                    id: newFolderPath,
                    name: folderName,
                    children: [],
                },
            };
        } catch (creationError: any) {
            console.error(
                `[fs:create-folder] Failed to create folder '${folderName}' in '${parentDir}':`,
                creationError
            );
            return { success: false, error: creationError.message };
        }
    }
);

ipcMain.handle(
    'fs:create-file',
    async (event, { parentDir, fileName }: { parentDir: string; fileName: string }) => {
        const newFilePath = path.join(parentDir, fileName);
        try {
            if (await itemExists(newFilePath)) {
                return { success: false, error: 'An item with the same name already exists.' };
            }
            await fs.promises.writeFile(newFilePath, ''); // Create empty file
            return {
                success: true,
                newItem: {
                    id: newFilePath,
                    name: fileName,
                },
            };
        } catch (creationError: any) {
            console.error(
                `[fs:create-file] Failed to create file '${fileName}' in '${parentDir}':`,
                creationError
            );
            return { success: false, error: creationError.message };
        }
    }
);

const SUPPORTED_TEXT_EXTENSIONS = [
    '.md',
    '.txt',
    '.json',
    '.js',
    '.ts',
    '.tsx',
    '.css',
    '.html',
    '.htm',
    '.log',
];
const SUPPORTED_IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

// 파일 확장자에 따라 파일 유형을 결정하는 함수
const getFileType = (filePath: string) => {
    const extension = path.extname(filePath).toLowerCase();

    // 필수 (핵심 기능)
    if (['.md'].includes(extension)) return 'markdown';
    if (['.txt'].includes(extension)) return 'text';
    if (['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'].includes(extension)) return 'image';

    // 권장 (활용성 증대)
    if (['.pdf'].includes(extension)) return 'pdf';
    if (['.html', '.htm'].includes(extension)) return 'html';

    return 'unsupported';
};

ipcMain.handle('fs:read-file', async (event, filePath: string) => {
    try {
        const stats = await fs.promises.stat(filePath);
        if (!stats.isFile()) {
            return { success: false, error: 'Path is not a file.' };
        }

        const type = getFileType(filePath);

        if (type === 'unsupported') {
            return { success: true, data: { type: 'unsupported' } };
        }

        // Handle binary files like images and PDFs
        if (type === 'image' || type === 'pdf') {
            const content = await fs.promises.readFile(filePath, 'base64');
            let mimeType;
            if (type === 'image') {
                const extension = path.extname(filePath).toLowerCase().slice(1);
                mimeType = `image/${extension}`;
            } else {
                // pdf
                mimeType = 'application/pdf';
            }
            return {
                success: true,
                data: {
                    content: `data:${mimeType};base64,${content}`,
                    type,
                },
            };
        }

        // Handle text-based files
        const content = await fs.promises.readFile(filePath, 'utf-8');
        return {
            success: true,
            data: {
                content,
                type,
            },
        };
    } catch (error: any) {
        console.error(`[fs:read-file] Error reading file '${filePath}':`, error);
        return { success: false, error: `Failed to read file: ${error.message}` };
    }
});

ipcMain.handle(
    'fs:move-item',
    async (
        event,
        { sourcePath, destinationPath }: { sourcePath: string; destinationPath: string }
    ) => {
        try {
            if (!sourcePath || !destinationPath) {
                return { success: false, error: 'Invalid arguments for moving.' };
            }
            const sourceName = path.basename(sourcePath);
            const newPath = path.join(destinationPath, sourceName);

            if (await itemExists(newPath)) {
                return {
                    success: false,
                    error: 'A file with the same name already exists in the destination.',
                };
            }

            await fs.promises.rename(sourcePath, newPath);
            return { success: true };
        } catch (error: any) {
            console.error(`Failed to move item from ${sourcePath} to ${destinationPath}:`, error);
            return { success: false, error: error.message };
        }
    }
);

ipcMain.handle(
    'fs:rename-item',
    async (event, { itemPath, newName }: { itemPath: string; newName: string }) => {
        try {
            if (!itemPath || !newName) {
                return { success: false, error: 'Invalid arguments for renaming.' };
            }
            const parentDir = path.dirname(itemPath);
            const newPath = path.join(parentDir, newName);

            if (await itemExists(newPath)) {
                return { success: false, error: 'A file with the same name already exists.' };
            }

            await fs.promises.rename(itemPath, newPath);
            return { success: true, path: newPath };
        } catch (error: any) {
            console.error(`[fs:rename-item] Error:`, error);
            return { success: false, error: 'Failed to rename item.' };
        }
    }
);

ipcMain.handle('fs:delete-item', async (event, itemPath: string) => {
    try {
        await fs.promises.rm(itemPath, { recursive: true, force: true });
        return { success: true };
    } catch (error: any) {
        console.error(`[fs:delete-item] Failed to delete '${itemPath}':`, error);
        return { success: false, error: error.message };
    }
});

// Helper function to recursively read directory contents
const readDirectory = async (dirPath: string): Promise<any[]> => {
    const dirents = await fs.promises.readdir(dirPath, { withFileTypes: true });
    const children = await Promise.all(
        dirents
            .filter((dirent) => !dirent.name.startsWith('.')) // Filter out hidden files/folders
            .map(async (dirent) => {
                const fullPath = path.join(dirPath, dirent.name);
                if (dirent.isDirectory()) {
                    return {
                        id: fullPath,
                        name: dirent.name,
                        children: await readDirectory(fullPath),
                    };
                }
                return { id: fullPath, name: dirent.name };
            })
    );
    return children.sort((a, b) => {
        const aIsFolder = !!a.children;
        const bIsFolder = !!b.children;
        if (aIsFolder !== bIsFolder) {
            return aIsFolder ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
    });
};

ipcMain.handle('fs:get-directory-tree', async (event, rootPath: string) => {
    if (!rootPath) return null;
    return {
        id: rootPath,
        name: path.basename(rootPath),
        children: await readDirectory(rootPath),
    };
});

ipcMain.handle('dialog:open-folder', async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow!, {
        properties: ['openDirectory'],
    });

    if (canceled || filePaths.length === 0) {
        return null;
    }

    const folderPath = filePaths[0];
    return {
        id: folderPath,
        name: path.basename(folderPath),
        children: await readDirectory(folderPath),
    };
});

ipcMain.handle('app:init-data-structure', async () => {
    const dataDirName = '.cortex-data';
    const homePath = app.getPath('home');
    const dataDirPath = path.join(homePath, dataDirName);
    const contentSubDirs = ['notes', 'screenshots', 'clippings'];
    const metadataSubDirs = ['files'];

    try {
        // Ensure root .cortex-data directory
        if (!fs.existsSync(dataDirPath)) {
            await fs.promises.mkdir(dataDirPath, { recursive: true });
        }

        // Ensure content directories
        const contentPath = path.join(dataDirPath, 'content');
        if (!fs.existsSync(contentPath)) {
            await fs.promises.mkdir(contentPath, { recursive: true });
        }
        for (const subDir of contentSubDirs) {
            const fullSubDirPath = path.join(contentPath, subDir);
            if (!fs.existsSync(fullSubDirPath)) {
                await fs.promises.mkdir(fullSubDirPath, { recursive: true });
            }
        }

        // Ensure metadata directories
        const metadataPath = path.join(dataDirPath, 'metadata');
        if (!fs.existsSync(metadataPath)) {
            await fs.promises.mkdir(metadataPath, { recursive: true });
        }
        for (const subDir of metadataSubDirs) {
            const fullSubDirPath = path.join(metadataPath, subDir);
            if (!fs.existsSync(fullSubDirPath)) {
                await fs.promises.mkdir(fullSubDirPath, { recursive: true });
            }
        }

        // Ensure workspace.json
        const workspaceFilePath = path.join(dataDirPath, 'workspace.json');
        if (!fs.existsSync(workspaceFilePath)) {
            await fs.promises.writeFile(
                workspaceFilePath,
                JSON.stringify({ linkedFolders: [] }, null, 2)
            );
        }

        return { success: true, path: dataDirPath };
    } catch (error: any) {
        console.error(`Failed to ensure data structure at ${dataDirPath}:`, error);
        return { success: false, error: error.message };
    }
});

// Menu setup
const template: Electron.MenuItemConstructorOptions[] = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Collection',
                accelerator: 'CmdOrCtrl+N',
                click: () => {
                    mainWindow?.webContents.send('new-collection');
                },
            },
            {
                label: 'Import',
                accelerator: 'CmdOrCtrl+I',
                click: () => {
                    mainWindow?.webContents.send('import-content');
                },
            },
            { type: 'separator' },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
                click: () => {
                    app.quit();
                },
            },
        ],
    },
    {
        label: 'Edit',
        submenu: [
            { role: 'undo' },
            { role: 'redo' },
            { type: 'separator' },
            { role: 'cut' },
            { role: 'copy' },
            { role: 'paste' },
        ],
    },
    {
        label: 'View',
        submenu: [
            { role: 'reload' },
            { role: 'forceReload' },
            { role: 'toggleDevTools' },
            { type: 'separator' },
            { role: 'resetZoom' },
            { role: 'zoomIn' },
            { role: 'zoomOut' },
            { type: 'separator' },
            { role: 'togglefullscreen' },
        ],
    },
    {
        label: 'Tools',
        submenu: [
            {
                label: 'Sticky Note',
                accelerator: 'Alt+CmdOrCtrl+C',
                click: showOrCreateStickyNote,
            },
            {
                label: 'Quick Capture',
                accelerator: 'Alt+CmdOrCtrl+V',
                click: quickCapture,
            },
        ],
    },
    {
        label: 'Window',
        submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
];

if (process.platform === 'darwin') {
    template.unshift({
        label: app.getName(),
        submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideOthers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
        ],
    });
}

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

// feat/stickymemo에서 추가된 IPC 핸들러들
const createStickyNoteWindow = () => {
    const stickyNoteWindow = new BrowserWindow({
        width: 300,
        height: 300,
        frame: false,
        alwaysOnTop: true,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
        // liquid glass effect
        transparent: true,
        vibrancy: 'sidebar',
    });

    if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
        stickyNoteWindow.loadURL(`${MAIN_WINDOW_VITE_DEV_SERVER_URL}/sticky-note.html`);
    } else {
        stickyNoteWindow.loadFile(
            path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/sticky-note.html`)
        );
    }

    // Open the DevTools.
    stickyNoteWindow.webContents.openDevTools();
};

ipcMain.on('open-sticky-note', createStickyNoteWindow);

ipcMain.on('pin-toggle', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
        const isAlwaysOnTop = win.isAlwaysOnTop();
        win.setAlwaysOnTop(!isAlwaysOnTop);
    }
});

ipcMain.on('close-window', (event) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
        win.close();
    }
});

ipcMain.on('set-opacity', (event, opacity: number) => {
    const win = BrowserWindow.fromWebContents(event.sender);
    if (win) {
        win.setOpacity(opacity);
    }
});
