#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

/**
 * Flux Collector 크로스 플랫폼 빌드 시스템
 * Windows와 macOS용 Native Host 설정을 자동 생성합니다.
 */

const HOST_NAME = 'com.flux.collector';
const EXTENSION_ID = 'demkgcpdpbnlbcggbolilpkdknpcabhg';

class FluxBuildSystem {
  constructor() {
    this.projectRoot = path.resolve(__dirname, '..');
    this.buildDir = path.join(this.projectRoot, 'build');
    this.nativeHostScript = path.join(this.projectRoot, 'native-host', 'flux-collector-host.js');
  }

  /**
   * 플랫폼별 Native Host 경로를 반환합니다.
   */
  getNativeHostPaths() {
    return {
      windows: {
        hostDir: '%LOCALAPPDATA%\\Google\\Chrome\\User Data\\NativeMessagingHosts',
        manifestPath: `%LOCALAPPDATA%\\Google\\Chrome\\User Data\\NativeMessagingHosts\\${HOST_NAME}.json`,
        scriptPath: 'C:\\Program Files\\nodejs\\node.exe'
      },
      macos: {
        hostDir: '~/Library/Application Support/Google/Chrome/NativeMessagingHosts',
        manifestPath: `~/Library/Application Support/Google/Chrome/NativeMessagingHosts/${HOST_NAME}.json`,
        scriptPath: '/usr/local/bin/node'
      }
    };
  }

  /**
   * Windows용 빌드를 생성합니다.
   */
  buildWindows() {
    console.log('🔧 Building Windows version...');
    
    const windowsDir = path.join(this.buildDir, 'windows');
    const paths = this.getNativeHostPaths().windows;

    // 디렉토리 생성
    if (!fs.existsSync(windowsDir)) {
      fs.mkdirSync(windowsDir, { recursive: true });
    }

    // Windows용 Native Host 스크립트 복사
    const windowsHostScript = path.join(windowsDir, 'flux-collector-host.js');
    fs.copyFileSync(this.nativeHostScript, windowsHostScript);

    // Windows용 manifest 생성
    const manifest = {
      name: HOST_NAME,
      description: 'Flux Collector Native Messaging Host',
      path: windowsHostScript,
      type: 'stdio',
      allowed_origins: [`chrome-extension://${EXTENSION_ID}/`]
    };

    const manifestPath = path.join(windowsDir, `${HOST_NAME}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    // Windows 설치 배치 파일 생성
    this.createWindowsInstaller(windowsDir, paths);

    console.log('✅ Windows build complete');
    console.log(`📁 Output: ${windowsDir}`);
  }

  /**
   * macOS용 빌드를 생성합니다.
   */
  buildMacOS() {
    console.log('🔧 Building macOS version...');
    
    const macosDir = path.join(this.buildDir, 'macos');
    const paths = this.getNativeHostPaths().macos;

    // 디렉토리 생성
    if (!fs.existsSync(macosDir)) {
      fs.mkdirSync(macosDir, { recursive: true });
    }

    // macOS용 Native Host 스크립트 복사
    const macosHostScript = path.join(macosDir, 'flux-collector-host.js');
    fs.copyFileSync(this.nativeHostScript, macosHostScript);

    // macOS용 manifest 생성
    const manifest = {
      name: HOST_NAME,
      description: 'Flux Collector Native Messaging Host',
      path: macosHostScript,
      type: 'stdio',
      allowed_origins: [`chrome-extension://${EXTENSION_ID}/`]
    };

    const manifestPath = path.join(macosDir, `${HOST_NAME}.json`);
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    // macOS 설치 쉘 스크립트 생성
    this.createMacOSInstaller(macosDir, paths);

    console.log('✅ macOS build complete');
    console.log(`📁 Output: ${macosDir}`);
  }

  /**
   * Windows 설치 배치 파일을 생성합니다.
   */
  createWindowsInstaller(buildDir, paths) {
    const batchContent = `@echo off
echo Installing Flux Collector Native Messaging Host for Windows...

:: Create directory if it doesn't exist
if not exist "${paths.hostDir}" mkdir "${paths.hostDir}"

:: Copy files
copy "${HOST_NAME}.json" "${paths.manifestPath}"
copy "flux-collector-host.js" "%LOCALAPPDATA%\\flux-collector-host.js"

:: Update manifest with correct script path
powershell -Command "(Get-Content '${paths.manifestPath}') -replace 'flux-collector-host.js', '%LOCALAPPDATA%\\flux-collector-host.js' | Set-Content '${paths.manifestPath}'"

echo ✅ Installation complete!
echo 📋 Next steps:
echo 1. Load Chrome Extension in Chrome
echo 2. Test the connection
pause
`;

    fs.writeFileSync(path.join(buildDir, 'install.bat'), batchContent);
  }

  /**
   * macOS 설치 쉘 스크립트를 생성합니다.
   */
  createMacOSInstaller(buildDir, paths) {
    const shellContent = `#!/bin/bash
echo "Installing Flux Collector Native Messaging Host for macOS..."

# Create directory if it doesn't exist
mkdir -p "${paths.hostDir}"

# Copy files
cp "${HOST_NAME}.json" "${paths.manifestPath}"
cp "flux-collector-host.js" ~/flux-collector-host.js

# Update manifest with correct script path
sed -i '' 's|flux-collector-host.js|'$HOME'/flux-collector-host.js|g' "${paths.manifestPath}"

# Make script executable
chmod +x ~/flux-collector-host.js

echo "✅ Installation complete!"
echo "📋 Next steps:"
echo "1. Load Chrome Extension in Chrome"
echo "2. Test the connection"
`;

    const installerPath = path.join(buildDir, 'install.sh');
    fs.writeFileSync(installerPath, shellContent);
    
    // Make installer executable
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { execSync } = require('child_process');
      execSync(`chmod +x "${installerPath}"`);
    } catch {
      console.warn('⚠️ Could not set execute permissions on macOS installer');
    }
  }

  /**
   * Chrome Extension 파일들을 빌드 디렉토리에 복사합니다.
   */
  copyExtensionFiles() {
    console.log('📦 Copying Chrome Extension files...');
    
    const extensionFiles = [
      'manifest.json',
      'background.js', 
      'content.js',
      'content.css'
    ];

    ['windows', 'macos'].forEach(platform => {
      const platformDir = path.join(this.buildDir, platform);
      
      extensionFiles.forEach(file => {
        const srcPath = path.join(this.projectRoot, file);
        const destPath = path.join(platformDir, file);
        
        if (fs.existsSync(srcPath)) {
          fs.copyFileSync(srcPath, destPath);
        }
      });

      // assets 폴더도 복사
      const assetsDir = path.join(this.projectRoot, 'assets');
      if (fs.existsSync(assetsDir)) {
        const destAssetsDir = path.join(platformDir, 'assets');
        this.copyDirectory(assetsDir, destAssetsDir);
      }
    });

    console.log('✅ Extension files copied');
  }

  /**
   * 디렉토리를 재귀적으로 복사합니다.
   */
  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(src);
    files.forEach(file => {
      const srcPath = path.join(src, file);
      const destPath = path.join(dest, file);
      
      if (fs.statSync(srcPath).isDirectory()) {
        this.copyDirectory(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    });
  }

  /**
   * 전체 빌드를 실행합니다.
   */
  buildAll() {
    console.log('🚀 Starting cross-platform build...\n');
    
    // 빌드 디렉토리 초기화
    if (fs.existsSync(this.buildDir)) {
      fs.rmSync(this.buildDir, { recursive: true, force: true });
    }
    fs.mkdirSync(this.buildDir, { recursive: true });

    // 플랫폼별 빌드
    this.buildWindows();
    this.buildMacOS();
    this.copyExtensionFiles();

    console.log('\n🎉 Cross-platform build complete!');
    console.log('\n📋 Distribution packages:');
    console.log(`Windows: ${path.join(this.buildDir, 'windows')}`);
    console.log(`macOS: ${path.join(this.buildDir, 'macos')}`);
  }
}

// CLI 처리
const args = process.argv.slice(2);
const command = args[0];

const buildSystem = new FluxBuildSystem();

switch (command) {
  case 'windows':
    buildSystem.buildWindows();
    break;
  case 'macos':
    buildSystem.buildMacOS();
    break;
  case 'all':
  default:
    buildSystem.buildAll();
    break;
} 